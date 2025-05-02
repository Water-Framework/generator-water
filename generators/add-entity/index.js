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

    configuring() {
        let currentConf = this.getProjectConfiguration(this.projectSelected);
        currentConf.applicationTypeEntity = true
        currentConf.hasModel = true
        currentConf.isProtectedEntity = this.isProtectedEntity
        currentConf.isOwnedEntity = this.isOwnedEntity
        this.addEntityModel(currentConf,this.entityName);
        this.addEntityServices(currentConf,this.entityName,false);
        this.createServiceLayerApi(currentConf,this.entityName,false)
        this.log.info("Upgrading project ",this.projectSelected,currentConf)
        this.setProjectConfiguration(this.projectSelected,currentConf);
        this.saveProjectsConfiguration();
    }   


    end() {
        this.log.ok("Extension for " + this.projectName + " created succesfully!");
    }
};
