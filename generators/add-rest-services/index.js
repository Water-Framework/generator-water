let Generator = require('../WaterBaseGenerator.js');
let chalk = require('chalk');
let fs = require('fs');

module.exports = class extends Generator {

    constructor(args, opts) {
        super(args, opts);
        this.projectName = "";
        this.projectSelected = "";
        this.projectSelectedGroupId = "";
        this.projectSelectedVersion = "";
        this.projectSelectedRootPath = "";
        this.projectSelectedBasePackage = "";
        this.projectSelectedPublishModule = false;
    }

    initializing() {
        this.composeWith(require.resolve('../app'), this.options);
    }

    prompting() {
        let done = this.async();
        let self = this;
        let projects = this.getAllProjectsName();

        this.prompt([ {
            type: 'checkbox',
            name: 'project',
            message: 'Please select a project',
            choices: projects
        }
        ]).then((answers) => {
            self.projectSelected = answers.project;
            done();
        });
    }

    configuring() {
        this.log.ok("Starting creating rest module....\n");
        let currentConf = this.getProjectConfiguration(this.projectSelected);
        this.log.info(currentConf);
        let modelName = "";
        let modelNameLowerCase = "";
        if(currentConf.applicationTypeEntity && currentConf.modelName){
            modelName = currentConf.modelName;
            modelName = currentConf.modelNameLowerCase;
        } else {
            modelName = currentConf.projectSuffixUpperCase;
            modelNameLowerCase = currentConf.projectSuffixLowerCase;
        }
        currentConf.hasRestServices = true
        currentConf.modelName = modelName
        currentConf.modelNameLowerCase = modelNameLowerCase
        this.generateRestClasses(currentConf,false);
        this.log.info("Upgrading project ",this.projectSelected,currentConf)
        this.setProjectConfiguration(this.projectSelected,currentConf);
        this.saveProjectsConfiguration();
    }   


    end() {
        this.log.ok("Extension for " + this.projectName + " created succesfully!");
    }
};
