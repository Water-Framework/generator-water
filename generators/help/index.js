import Generator from '../WaterBaseGenerator.js';
import fs from 'fs';
import path from 'path';

export default class extends Generator {

    constructor(args, opts) {
        super(args, opts);
        
        // Add --fulltext option
        this.option('fulltext', {
            type: Boolean,
            desc: 'Display full documentation for all generator tasks',
            default: false
        });
    }

    async initializing() {
        await this.composeWith(this.resolveInsideGeneratorPath('generators/app'), this.options);
    }

    end() {
        if (this.options.fulltext) {
            this._displayFullDocumentation();
        } else {
            this._displayTaskList();
        }
    }
    
    _displayTaskList() {
        this.log("------------------------------------------------------------------------------------------------------------------------------------------------");
        this.log("Available Water Generator Tasks:");
        this.log("------------------------------------------------------------------------------------------------------------------------------------------------");
        this.log("yo water:add-entity                                                               \tAdds new entity on existing project");
        this.log("yo water:add-rest-services                                                        \tAdds rest service modules on an exisiting project");
        this.log("yo water:app                                                                      \tPrint info about the water generator");
        this.log("yo water:build                                                                    \tLaunch build on workspace projects");
        this.log("yo water:build-all                                                                \tLaunch build on all workspace projects");
        this.log("yo water:help                                                                     \tShow help");
        this.log("yo water:new-empty-module                                                         \tCreates a new empty module into an existing project");
        this.log("yo water:new-entity-extension                                                     \tScaffolds classes to create an entity extension inside a new or existing project");
        this.log("yo water:new-project                                                              \tScaffolds a new project");
        this.log("yo water:projects-order                                                           \tDefine projects precedence for build and deploy");
        this.log("yo water:projects-order-show                                                      \tGenerates karaf runtime with Dockerfile");
        this.log("yo water:publish                                                                  \tPublish project to Maven repository");
        this.log("yo water:publish-all                                                              \tPublish ALL workspace projects to Maven repository");
        this.log("yo water:stabilityMetrics                                                         \tPrints stability metrics about the software quality of the modules inside this workspace");
        this.log("------------------------------------------------------------------------------------------------------------------------------------------------");
        this.log();
        this.log("💡 TIP: For detailed help on any specific task, add --taskHelp to the command:");
        this.log("   Example: yo water:new-project --taskHelp");
        this.log("   This will display comprehensive documentation including usage examples,");
        this.log("   available options, and detailed explanations for that specific task.");
        this.log();
        this.log("💡 TIP: Use --fulltext to display complete documentation for all tasks:");
        this.log("   Example: yo water:help --fulltext");
        this.log();
    }
    
    _displayFullDocumentation() {
        this.log("================================================================================");
        this.log("Water Generator - Complete Documentation");
        this.log("================================================================================");
        this.log();
        
        const tasks = this._getAllGeneratorTasks();
        let totalTasks = 0;
        let tasksWithDocs = 0;
        
        tasks.forEach(taskName => {
            const content = this._loadTaskDocumentation(taskName);
            if (content) {
                totalTasks++;
                tasksWithDocs++;
                this.log("=".repeat(80));
                this.log(`TASK: ${taskName.toUpperCase()}`);
                this.log("=".repeat(80));
                this.log(content);
                this.log();
            } else {
                totalTasks++;
                this.log("=".repeat(80));
                this.log(`TASK: ${taskName.toUpperCase()}`);
                this.log("=".repeat(80));
                this.log(`No documentation available for task: ${taskName}`);
                this.log();
            }
        });
        
        this.log("=".repeat(80));
        this.log(`Documentation Summary: ${tasksWithDocs}/${totalTasks} tasks documented`);
        this.log("=".repeat(80));
    }
    
    _getAllGeneratorTasks() {
        try {
            const currentDir = path.dirname(new URL(import.meta.url).pathname);
            const generatorsDir = path.join(currentDir, '..');
            
            // Get all directories in generators folder
            const items = fs.readdirSync(generatorsDir, { withFileTypes: true });
            return items
                .filter(item => item.isDirectory())
                .map(dir => dir.name)
                .filter(name => !name.endsWith('.js')) // Exclude .js files
                .sort();
        } catch (error) {
            this.log.error('Error reading generators directory:', error.message);
            return [];
        }
    }
    
    _loadTaskDocumentation(taskName) {
        try {
            const currentDir = path.dirname(new URL(import.meta.url).pathname);
            const docPath = path.join(currentDir, '..', taskName, `${taskName}.md`);
            
            if (fs.existsSync(docPath)) {
                return fs.readFileSync(docPath, 'utf8');
            }
            return null;
        } catch (error) {
            this.log.error(`Error loading documentation for ${taskName}:`, error.message);
            return null;
        }
    }

}
