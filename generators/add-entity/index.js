import Generator from '../WaterBaseGenerator.js';

export default class extends Generator {

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
        this.isProtectedEntity = false;
        this.isOwnedEntity = false;
    }

    async initializing() {
        await this.composeWith(this.resolveInsideGeneratorPath('generators/app'), this.options);
    }

    async prompting() {
        let self = this;
        let projects = this.getAllProjectsName();
        await this.prompt([ {
            type: 'checkbox',
            name: 'project',
            message: 'Please select a project',
            choices: projects
        },
        {
            type: 'input',
            name: 'entityName',
            message: 'Please insert entity name',
        },{
            type: 'confirm',
            name: 'isProtectedEntity',
            message: 'Is your aggregate model a "protected entity" so its access should be controlled by the Permission System?',
            default: false
        },
        {
            type: 'confirm',
            name: 'isOwnedEntity',
            message: 'Is your aggregate model an "owned entity" ?',
            default: false
        },
        ]).then((answers) => {
            self.projectSelected = answers.project;
            self.entityName = answers.entityName;
            self.isProtectedEntity = answers.isProtectedEntity;
            self.isOwnedEntity = answers.isOwnedEntity;
        });
    }

    async configuring() {
        await this.addEntityStack(this.projectSelected,this.entityName,this.isProtectedEntity,this.isOwnedEntity);
    }   


    end() {
        this.log.ok("Extension for " + this.projectName + " created succesfully!");
    }
};
