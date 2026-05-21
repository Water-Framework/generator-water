import Generator from '../WaterBaseGenerator.js';

export default class extends Generator {

    constructor(args, opts) {
        super(args, opts);
        this.projectName = "";

        this.option('inlineArgs', {
            type: Boolean,
            desc: 'Skip interactive prompts and use only command line arguments',
            default: false
        });
        this.option('existingProject', {
            type: Boolean,
            desc: 'Insert extension into an existing project (true) or create a new one (false)',
            default: true
        });
        this.option('project', {
            type: String,
            desc: 'Target project name (required when existingProject=false)'
        });
        this.option('entityName', {
            type: String,
            desc: 'Extension entity class name in PascalCase',
            default: 'MyEntity'
        });
        this.option('entityToExtend', {
            type: String,
            desc: 'Fully qualified class name of the entity to extend (e.g. it.water.user.model.WaterUser)'
        });
        this.option('entityGradleModelGroupId', {
            type: String,
            desc: 'Maven Group ID of the model artifact containing the entity to extend (e.g. it.water.user)'
        });
        this.option('entityGradleModelArtifactId', {
            type: String,
            desc: 'Maven Artifact ID of the model artifact containing the entity to extend (e.g. User-model)'
        });
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
        if (this.options.inlineArgs) {
            this.newProject = this.options.existingProject === false;
            this.projectSelected = this.options.project || null;
            this.entityName = this.options.entityName || 'MyEntity';
            this.entityClassToExtend = this.options.entityToExtend || '';
            this.groupId = this.options.entityGradleModelGroupId || '';
            this.artifactId = this.options.entityGradleModelArtifactId || '';
            return;
        }

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
        }, {
            type: 'input',
            name: 'entityName',
            message: 'Please insert entity name:',
            default: "MyEntity"
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
        }, {
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
        await this.addEntityStack(this.projectSelected, this.entityName, false, false);
        //add extension class
    }

    end() {
        this.log.ok("Extension for " + this.projectName + " created succesfully!");
    }
};
