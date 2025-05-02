import Generator from '../WaterBaseGenerator.js';

export default class extends Generator {

    constructor(args, opts) {
        super(args, opts);
        this.projectName = "";
    }

    async initializing() {
        await this.composeWith(this.resolveInsideGeneratorPath('generators/app'), this.options);
        this.projectSelected = null;
        this.entityName = "";
        this.newProject = false;
        this.groupId = "";
        this.artifactId = "";
        this.entityClassToExtend = "";
    }

    async prompting() {
    
        let self = this;
        let projects = await this.getAllProjectsName();

        await this.prompt([{
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
        },{
            type: 'input',
            name: 'entityName',
            message: 'Please insert entity name:',
            default: "MyEntity"
        },
         {
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
            self.entityName = answers.entityName;
            self.newProject = !answers.existingProject;
            self.groupId = answers.entityGradleModelGroupId;
            self.artifactId = answers.entityGradleModelArtifactId;
            self.entityClassToExtend = answers.entityToExtend;
        });
    }

    async configuring() {
        this.log.ok("Starting creating extension....\n");
        //creating 
        await this.addEntityStack(this.projectSelected,this.entityName,false,false);
        //add extension class
    }


    end() {
        this.log.ok("Extension for " + this.projectName + " created succesfully!");
    }
};
