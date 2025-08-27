import Generator from '../WaterBaseGenerator.js';
import fs from 'fs';
import path from 'path';


export default class extends Generator {
    constructor(args, opts) {
        super(args, opts);
        
        // Add custom help option (since --help is handled by yeoman)
        this.option('taskHelp', {
            type: Boolean,
            desc: 'Show detailed help for the specific generator task',
            default: false
        });
        
        this.startDate = Date.now();
    }

    async initializing() {
        // Check if task help was requested - do this BEFORE workspace checks
        if (this.options.taskHelp) {
            this._showTaskHelp();
            return;
        }
        
        await this.mustBeInWorkspace();
        await super.printSplash();
        if(!this.options.skipUpdate)
           await this.checkUpdates();
        await this._private_getWorkspaceVersion();
        await this._private_checkRequirements();
        await this.automaticallyLinkProjects();
        await this.config.save();
    }

    /**
     * Shows task-specific help by loading the markdown file for the current generator
     */
    _showTaskHelp() {
        try {
            const taskName = this._getTaskName();
            const helpContent = this._loadTaskHelpFile(taskName);
            if (helpContent) {
                this.log("-".repeat(80)+"\n"+helpContent+"\n"+"-".repeat(80));
            } else {
                this.log(`No documentation has been found for task: ${taskName}`);
            }
        } catch (error) {
            this.log.error('Error loading help file:', error.message);
        }
        
        // Stop execution after showing help
        process.exit(0);
    }

    /**
     * Detects the current task name from the generator context
     */
    _getTaskName() {
        // Method 1: Try to get from process arguments (most reliable)
        const args = process.argv;
        for (let i = 0; i < args.length; i++) {
            if (args[i].includes('water:')) {
                const taskPart = args[i].split('water:')[1];
                if (taskPart) {
                    return taskPart;
                }
            }
        }
        
        // Method 2: Check options namespace
        if (this.options.namespace && typeof this.options.namespace === 'string') {
            const parts = this.options.namespace.split(':');
            return parts.length > 1 ? parts[1] : parts[0];
        }
        
        // Last fallback: return 'app'
        return 'app';
    }

    /**
     * Loads the help markdown file for the specified task
     */
    _loadTaskHelpFile(taskName) {
        try {
            // Get the current file path and find the generators directory
            const currentPath = import.meta.url;
            const currentDir = path.dirname(new URL(currentPath).pathname);
            
            // The help file should be in ../taskName/taskName.md relative to the app directory
            const helpFilePath = path.join(currentDir, '..', taskName, `${taskName}.md`);
            
            if (fs.existsSync(helpFilePath)) {
                return fs.readFileSync(helpFilePath, 'utf8');
            }
            
            return null;
        } catch (error) {
            this.log.error(`Error reading help file for ${taskName}:`, error.message);
            return null;
        }
    }

    /**
     * Upgrade .yo-rc file automatically with the current workspace version of WaterFramework
     */
    async _private_getWorkspaceVersion(){
        if(this.options.skipWorkspaceCheck){
            return;
        }
        this.log.info("Checking workspace version...");
        let waterVersionLabel = "waterVersion: ";
        let result = await this.spawn("gradle", ["--version"], {
            stdio: ['pipe', 'pipe', 'pipe']
        });
        let gradleOutput = new String(result.stdout).toString();
        let waterVersionRegex = /waterVersion\: ([0-9]+\.[0-9]+\.[0-9]+)/g;
        let waterCorrectVersion = waterVersionRegex.exec(gradleOutput);
        if(waterCorrectVersion && waterCorrectVersion.length > 0){
            let currentWorkspaceVersion = waterCorrectVersion[0].replace(waterVersionLabel,"");
            let defaultWorkspaceVersion = this.getWaterFrameworkVersion();
            this.log.info("Current Workspace Version is: "+currentWorkspaceVersion);
            if(currentWorkspaceVersion !== defaultWorkspaceVersion){
                this.log.info("Default workspace version is: "+defaultWorkspaceVersion);
                this.log.info("Upgrading default workspace version to: "+currentWorkspaceVersion);
                this.config.set("waterVersion",currentWorkspaceVersion);
                this.config.save();
            }
        }
    }

    async _private_checkRequirements() {
        this.log.info("Checking requirements...");
        let result = await this.spawn("gradle", ["-v"], {
            stdio: ['pipe', 'pipe', 'pipe']
        });
        let gradleOutput = new String(result.stdout).toString();
        let gradleVersionRegex = /Gradle ([0-9]+\.[0-9]+)/g;
        let gradleCorrectVersion = gradleVersionRegex.exec(gradleOutput);
        let gradleVersion = (gradleCorrectVersion !== null && gradleCorrectVersion.length > 1) ? parseFloat(gradleCorrectVersion[1]) : 0;
        if (result.exitCode === 0 && gradleVersion >= 7) {
            this.log.ok("Gradle " + gradleVersion + " Found!");
            result = await this.spawn("java", ["-version"], {
                stdio: ['pipe', 'pipe', 'pipe']
            });
            let javaOutput = new String(result.stdout+result.stderr).toString();
            let javaVersionRegex = /(java|openjdk) version "([0-9]+\.[0-9])+\.[0-9]+((_|\.)[0-9]+)*"/g;
            let javaCorrectVersion = javaVersionRegex.exec(javaOutput);
            this.log.info("Current Java version found: "+javaCorrectVersion[2]);
            let javaVersion = (javaCorrectVersion !== null && javaCorrectVersion.length > 1) ? parseFloat(javaCorrectVersion[2]) : 0
            if (javaVersion >= 1.8) {
                this.log.ok("Java " + javaVersion + " Found!");
            } else {
                this.log.error("Java is not the correct version (>1.8_X) or is not installed generator will exit...");
                process.exit(-1);
            }

        } else {
            this.log.error("Gradle Version, is not the correct version (>= 5.1.x) found " + gradleVersion + " or is not installed, generator will exit...");
            process.exit(-1);
        }
    }

};
