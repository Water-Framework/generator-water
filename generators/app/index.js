import Generator from '../WaterBaseGenerator.js';


export default class extends Generator {
    constructor(args, opts) {
        super(args, opts);
        this.startDate = Date.now();
    }

    async initializing() {
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
