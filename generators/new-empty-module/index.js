import Generator from '../WaterBaseGenerator.js';
import fs from 'fs';

export default class extends Generator {

    constructor(args, opts) {
        super(args, opts);
        this.projectName = "";
        this.projectSelected = "";
        this.projectSelectedGroupId = "";
        this.projectSelectedVersion = "";
        this.projectSelectedRootPath = "";
        this.projectSelectedBasePackage = "";
        this.projectSelectedPublishModule = false;

        this.option('inlineArgs', {
            type: Boolean,
            desc: 'Skip interactive prompts and use only command line arguments',
            default: false
        });
        this.option('project', {
            type: String,
            desc: 'Target project name'
        });
        this.option('moduleName', {
            type: String,
            desc: 'Module name suffix (will be prefixed with {project}-)'
        });
    }

    async initializing() {
        await this.composeWith(this.resolveInsideGeneratorPath('generators/app'), this.options);
    }

    async prompting() {
        if (this.options.inlineArgs) {
            this.projectSelected = this.options.project;
            this.projectName = this.projectSelected + "-" + this.options.moduleName;
            this.projectSelectedGroupId = this.getProjectConfiguration(this.projectSelected)["projectGroupId"];
            this.projectSelectedVersion = this.getProjectConfiguration(this.projectSelected)["projectVersion"];
            this.projectSelectedRootPath = this.getProjectConfiguration(this.projectSelected)["projectPath"];
            this.projectSelectedPublishModule = this.getProjectConfiguration(this.projectSelected)["publishModule"];
            this.projectSelectedBasePackage = this.projectSelectedGroupId.split(".").join("/");
            return;
        }

        let self = this;
        let projects = this.getAllProjectsName();
        await this.prompt([{
            type: 'checkbox',
            name: 'project',
            message: 'Please select a project',
            choices: projects
        },
        {
            type: 'input',
            name: 'projectName',
            message: 'Module Name:',
            default: function(answers){
                return answers.project+"-"
            }
        }
        ]).then((answers) => {
            self.projectSelected = answers.project;
            self.projectName = self.projectSelected+"-"+answers.projectName;
            self.projectSelectedGroupId = this.getProjectConfiguration(self.projectSelected)["projectGroupId"];
            self.projectSelectedVersion = this.getProjectConfiguration(self.projectSelected)["projectVersion"];
            self.projectSelectedRootPath = this.getProjectConfiguration(self.projectSelected)["projectPath"];
            self.projectSelectedPublishModule = this.getProjectConfiguration(self.projectSelected)["publishModule"];
            self.projectSelectedBasePackage = self.projectSelectedGroupId.split(".").join("/");
        });
    }

    configuring() {
        this.log.ok("Starting creating new empty module....\n");
        let projectPath = this.projectSelectedRootPath+"/"+this.projectName;
        let conf = {
            "projectName": this.projectName,
            "projectGroupId": this.projectSelectedGroupId,
            "projectVersion": this.projectSelectedVersion,
            "publishModule" : this.projectSelectedPublish

        }
        this.createBasicProjectFiles(projectPath,conf)
        fs.mkdirSync(projectPath+"/src/main/java",{recursive:true});
        fs.mkdirSync(projectPath+"/src/main/resources",{recursive:true});
        fs.mkdirSync(projectPath+"/src/test/java",{recursive:true});
        fs.mkdirSync(projectPath+"/src/test/resources",{recursive:true});
        //create package folder
        fs.mkdirSync(projectPath+"/src/main/java/"+this.projectSelectedBasePackage,{recursive:true});
        fs.mkdirSync(projectPath+"/src/test/java/"+this.projectSelectedBasePackage,{recursive:true});
    }

    end() {
        this.log.ok("Extension for " + this.projectName + " created succesfully!");
    }
};
