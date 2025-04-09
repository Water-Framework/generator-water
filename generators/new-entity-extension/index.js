let Generator = require('../WaterBaseGenerator.js');
let chalk = require('chalk');

module.exports = class extends Generator {

    constructor(args, opts) {
        super(args, opts);
        this.projectName = "";
    }

    initializing() {
        this.composeWith(require.resolve('../app'), this.options);
        this.projectSelected = null;
        this.newProject = false;
        this.groupId = "";
        this.artifactId = "";
        this.entityClassToExtend = "";
    }

    prompting() {
        let done = this.async();
        let self = this;
        let projects = this.getAllProjectsName();

        this.prompt([{
            type: 'confirm',
            name: 'existingProject',
            message: 'Create new Project or insert into existing one?',
            default: true
        }, {
            type: 'checkbox',
            name: 'project',
            message: 'Please select a project',
            choices: projects,
            when: function (answers) {
                return !answers.existingProject;
            }
        }, {
            type: 'input',
            name: 'entityToExtend',
            message: 'Please insert complete package and name of the entity you want to expand:',
            default: "es. it.water.user.model.WaterUser"
        }, {
            type: 'input',
            name: 'entityGradleModelGroupId',
            message: 'Please insert maven group id of the entity you want to expand:',
            default: "es. it.water.user"
        },{
            type: 'input',
            name: 'entityGradleModelArtifactId',
            message: 'Please insert maven artifact id of the entity MODEL you want to expand:',
            default: "es. User-model"
        } 
        ]).then((answers) => {
            self.projectSelected = answers.project;
            self.newProject = !answers.existingProject;
            self.groupId = answers.entityGradleModelGroupId;
            self.artifactId = answers.entityGradleModelArtifactId;
            self.entityClassToExtend = answers.entityToExtend;
            done();
        });
    }

    configuring() {
        this.log.ok("Starting creating extension....\n");
        this.log.error("This task is still working progress\n");
    }


    end() {
        this.log.ok("Extension for " + this.projectName + " created succesfully!");
    }
};
