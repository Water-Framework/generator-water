let Generator = require('../WaterBaseGenerator.js');
let chalk = require('chalk');
let fs = require('fs');

module.exports = class extends Generator {

    constructor(args, opts) {
        super(args, opts);
        this.entityName = "";
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
        },
        {
            type: 'input',
            name: 'entityName',
            message: 'Please insert entity name',
        }
        ]).then((answers) => {
            self.projectSelected = answers.project;
            self.entityName = answers.entityName;
            done();
        });
    }

    configuring() {
        //TODO ENTITY NAME
    }   


    end() {
        this.log.ok("Extension for " + this.projectName + " created succesfully!");
    }
};
