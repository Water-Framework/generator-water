import Generator from '../WaterBaseGenerator.js';

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
        }
        ]).then((answers) => {
            self.projectSelected = answers.project;
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
