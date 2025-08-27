import Generator from '../WaterBaseGenerator.js';
import chalk from 'chalk';

export default class extends Generator {

    constructor(args, opts) {
        super(args, opts);
        
        // Add command-line options for all prompt fields
        this.option('inlineArgs', {
            type: Boolean,
            desc: 'Skip interactive prompts and use only command line arguments',
            default: false
        });
        
        this.option('projectTechnology', {
            type: String,
            desc: 'Technology to use (water, spring, osgi, quarkus)',
            default: 'water'
        });
        
        this.option('projectName', {
            type: String,
            desc: 'Project name',
            default: 'my-awesome-project'
        });
        
        this.option('projectGroupId', {
            type: String,
            desc: 'Group ID for the project'
        });
        
        this.option('projectVersion', {
            type: String,
            desc: 'Project version',
            default: '1.0.0'
        });
        
        this.option('applicationType', {
            type: String,
            desc: 'Application type (entity, service)',
            default: 'entity'
        });
        
        this.option('hasModel', {
            type: Boolean,
            desc: 'Whether the service project has a model to be defined',
            default: false
        });
        
        this.option('modelName', {
            type: String,
            desc: 'Model name',
            default: 'MyEntityName'
        });
        
        this.option('isProtectedEntity', {
            type: Boolean,
            desc: 'Whether the entity is protected by the permission system',
            default: false
        });
        
        this.option('isOwnedEntity', {
            type: Boolean,
            desc: 'Whether the entity is an owned entity',
            default: false
        });
        
        this.option('springRepository', {
            type: Boolean,
            desc: 'Use Spring repository instead of Water default repositories',
            default: true
        });
        
        this.option('hasRestServices', {
            type: Boolean,
            desc: 'Whether the project has REST services',
            default: true
        });
        
        this.option('restContextRoot', {
            type: String,
            desc: 'REST context root path'
        });
        
        this.option('hasAuthentication', {
            type: Boolean,
            desc: 'Add automatic login management to REST services',
            default: true
        });
        
        this.option('moreModules', {
            type: Boolean,
            desc: 'Add additional modules for out-of-the-box features',
            default: false
        });
        
        this.option('modules', {
            type: String,
            desc: 'Comma-separated list of modules to add (user-integration, role-integration, permission, shared-entity-integration)'
        });
        
        this.option('publishModule', {
            type: Boolean,
            desc: 'Deploy project to remote maven repository',
            default: false
        });
        
        this.option('publishRepoName', {
            type: String,
            desc: 'Publish repository symbolic name',
            default: 'My Repository'
        });
        
        this.option('publishRepoUrl', {
            type: String,
            desc: 'Publish repository URL',
            default: 'https://myrepo/m2'
        });
        
        this.option('publishRepoHasCredentials', {
            type: Boolean,
            desc: 'Whether the repository requires authentication',
            default: false
        });
        
        this.option('hasSonarqubeIntegration', {
            type: Boolean,
            desc: 'Add Sonarqube properties for Sonarqube integration',
            default: false
        });

        this.projectName = "";
        this.projectSuffix = "";
        this.projectSuffixUpperCase = "";
        this.projectSuffixLowerCase = "";
        this.projectConf = {};
        this.projectGroupId = "";
        this.projectVersion = "project.waterVersion";
        this.hasRestServices = true;
        this.hasModel = true;
        this.applicationTypeEntity = true;
        this.projectTechnology = "water";
        this.springRepository = true;
        this.modelName = "";
        this.modelNameLowerCase = "";
        // Packages paths
        this.apiPackagePath = "";
        this.modelPackagePath = "";
        this.actionsPackagePath = "";
        this.repositoryPackagePath = "";
        this.servicePackagePath = "";
        this.serviceRestPackagePath = "";
        this.basePackage = "";
        this.testPackagePath = "";
    }

    async initializing() {
        await this.composeWith(this.resolveInsideGeneratorPath('generators/app'), this.options);
    }

    async prompting() {
        let self = this;
        
        // If inlineArgs is enabled, skip prompting and use provided arguments
        if (this.options.inlineArgs) {
            return this._processAnswersFromOptions();
        }
        
        // Helper function to get default value from options if available
        const getDefaultFromOptions = (optionName, fallbackDefault) => {
            return this.options[optionName] !== undefined ? this.options[optionName] : fallbackDefault;
        };
        
        await this.prompt([
            {
                type: 'list',
                name: 'projectTechnology',
                message: 'Which technology should be used?',
                default: getDefaultFromOptions('projectTechnology', "water"),
                choices: [
                    {
                        name: "Water",
                        value: "water"
                    }, {
                        name: "Spring 3.X",
                        value: "spring"
                    }, {
                        name: "OSGi",
                        value: "osgi"
                    }, {
                        name: "Quarkus",
                        value: "quarkus"
                    }]
            },
            {
            type: 'input',
            name: 'projectName',
            message: 'Project-Name',
            default: getDefaultFromOptions('projectName', "my-awesome-project")
        }, {
            type: 'input',
            name: 'projectGroupId',
            message: 'Group ID',
            default: function (answers) {
                if (self.options.projectGroupId !== undefined) {
                    return self.options.projectGroupId;
                }
                let packageStr = "";
                packageStr = 'com.' + answers.projectName.replace(/-/g, '.').toLowerCase()
                return packageStr;
            }
        }, {
            type: 'input',
            name: 'projectVersion',
            message: 'Version',
            default: getDefaultFromOptions('projectVersion', "1.0.0"),
            when: function(answers){
                return answers.projectTechnology !== "water"
            }
        }, {
            type: 'list',
            name: "applicationType",
            message: "Select application type:",
            default: getDefaultFromOptions('applicationType', "entity"),
            choices: [{
                name: "Application with persistence",
                value: "entity"
            }, {
                name: "Integration application",
                value: "service"
            }]
        }, 
        {
            type: 'confirm',
            name: 'hasModel',
            message: 'Does Your service project has model to be defined?',
            default: function(answers) {
                return getDefaultFromOptions('hasModel', false);
            },
            when: function (answer) {
                return answer.applicationType === 'service';
            }
        },
        {
            type: 'input',
            name: 'modelName',
            message: 'Please insert model name?',
            default: getDefaultFromOptions('modelName', "MyEntityName"),
            when: function (answers) {
                return (answers.applicationType === 'service' && answers.hasModel) || answers.applicationType === 'entity';
            }
        },
        {
            type: 'confirm',
            name: 'isProtectedEntity',
            message: 'Is your aggregate model a "protected entity" so its access should be controlled by the Permission System?',
            default: getDefaultFromOptions('isProtectedEntity', false),
            when: function (answer) {
                return answer.applicationType === 'entity';
            }
        },
        {
            type: 'confirm',
            name: 'isOwnedEntity',
            message: 'Is your aggregate model an "owned entity" ?',
            default: getDefaultFromOptions('isOwnedEntity', false),
            when: function (answer) {
                return answer.applicationType === 'entity';
            }
        },
        {
            type: 'confirm',
            name: 'springRepository',
            message: 'Would you like to use Spring repository instead of spring Water default repositories?',
            default: getDefaultFromOptions('springRepository', true),
            when: function (answer) {
                return (answer.projectTechnology === 'spring') && answer.applicationType === 'entity';
            }
        },
        {
            type: 'confirm',
            name: 'hasRestServices',
            message: 'Project has rest services?',
            default: getDefaultFromOptions('hasRestServices', true)
        },
        {
            type: 'input',
            name: 'restContextRoot',
            message: 'Please insert your rest context root ex. /myEntity ?',
            when: function (answer) {
                return answer.hasRestServices === true;
            },
            default: function(answers){
                if (self.options.restContextRoot !== undefined) {
                    return self.options.restContextRoot;
                }
                return "/"+self.camelize(answers.projectName)+"s";
            }
        },
        {
            type: 'confirm',
            name: 'hasAuthentication',
            message: 'do you want to add automatic login management to your rest services (@Login annotation) ?',
            when: function (answer) {
                return answer.hasRestServices === true;
            },
            default: function(){
                return getDefaultFromOptions('hasAuthentication', true);
            }
        },
        {
            type: 'confirm',
            name: 'moreModules',
            message: 'do you want to add other modules to have out of the box features?',
            default: function(){
                return getDefaultFromOptions('moreModules', false);
            },
        },
        {
            type: 'checkbox',
            name: 'modules',
            message: 'Please select modules you want to add yo your microservice ?',
            when: function (answer) {
                return answer.moreModules === true;
            },
            choices: [
                {
                    name: "User Integration - for querying user's services remotely",
                    value: "group: 'it.water.user', name:'User-integration', version:project.waterVersion"
                }, {
                    name: "Role Integration - for querying role's services remotely",
                    value: "group: 'it.water.role', name:'Role-integration', version:project.waterVersion"
                }, {
                    name: "Permission - to integrate permission management locally",
                    value: "group: 'it.water.permission', name:'Permission-service', version:project.waterVersion"
                }, {
                    name: "Shared Entity Integration - for querying shared entity's services remotely",
                    value: "group: 'it.water.shared.entity', name:'SharedEntity-service', version:project.waterVersion"
                }]
        },
        {
            type: 'confirm',
            name: 'publishModule',
            message: 'Project should be deployed to remote maven repository ?',
            default: getDefaultFromOptions('publishModule', false)
        },
        {
            type: 'input',
            name: 'publishRepoName',
            message: 'Please insert publish repo symbolic name ?',
            default: getDefaultFromOptions('publishRepoName', "My Repository"),
            when: function (answers) {
                return answers.publishModule === true;
            }
        },
        {
            type: 'input',
            name: 'publishRepoUrl',
            message: 'Please insert publish repo URL ?',
            default: getDefaultFromOptions('publishRepoUrl', "https://myrepo/m2"),
            when: function (answers) {
                return answers.publishModule === true;
            }

        },
        {
            type: 'confirm',
            name: 'publishRepoHasCredentials',
            message: 'Repository requires authentication?',
            default: getDefaultFromOptions('publishRepoHasCredentials', false),
            when: function (answers) {
                return answers.publishModule === true;
            }

        },
        {
            type: 'confirm',
            name: 'hasSonarqubeIntegration',
            message: 'Do you want to add Sonarqube properties for Sonarqube integration?',
            default: getDefaultFromOptions('hasSonarqubeIntegration', false)
        }
        ]).then((answers) => {
            this._processAnswers(answers);
        });
    }
    
    _processAnswersFromOptions() {
        // Create answers object from command-line options
        const answers = {
            projectTechnology: this.options.projectTechnology || 'water',
            projectName: this.options.projectName || 'my-awesome-project',
            projectGroupId: this.options.projectGroupId || ('com.' + (this.options.projectName || 'my-awesome-project').replace(/-/g, '.').toLowerCase()),
            projectVersion: this.options.projectVersion || '1.0.0',
            applicationType: this.options.applicationType || 'entity',
            hasModel: this.options.hasModel !== undefined ? this.options.hasModel : false,
            modelName: this.options.modelName || 'MyEntityName',
            isProtectedEntity: this.options.isProtectedEntity !== undefined ? this.options.isProtectedEntity : false,
            isOwnedEntity: this.options.isOwnedEntity !== undefined ? this.options.isOwnedEntity : false,
            springRepository: this.options.springRepository !== undefined ? this.options.springRepository : true,
            hasRestServices: this.options.hasRestServices !== undefined ? this.options.hasRestServices : true,
            restContextRoot: this.options.restContextRoot || ("/" + this.camelize(this.options.projectName || 'my-awesome-project') + "s"),
            hasAuthentication: this.options.hasAuthentication !== undefined ? this.options.hasAuthentication : true,
            moreModules: this.options.moreModules !== undefined ? this.options.moreModules : false,
            modules: this.options.modules ? this._parseModulesString(this.options.modules) : undefined,
            publishModule: this.options.publishModule !== undefined ? this.options.publishModule : false,
            publishRepoName: this.options.publishRepoName || 'My Repository',
            publishRepoUrl: this.options.publishRepoUrl || 'https://myrepo/m2',
            publishRepoHasCredentials: this.options.publishRepoHasCredentials !== undefined ? this.options.publishRepoHasCredentials : false,
            hasSonarqubeIntegration: this.options.hasSonarqubeIntegration !== undefined ? this.options.hasSonarqubeIntegration : false
        };
        
        // Apply conditional logic for dependent fields
        if (answers.applicationType === 'service') {
            if (answers.hasModel === undefined) {
                answers.hasModel = false;
            }
        } else if (answers.applicationType === 'entity') {
            answers.hasModel = true;
        }
        
        if (answers.projectTechnology === "water") {
            // Keep default version for water projects
            delete answers.projectVersion;
        }
        
        // Process the answers the same way as the interactive prompt
        this._processAnswers(answers);
    }
    
    _parseModulesString(modulesString) {
        if (!modulesString) return [];
        
        const moduleMap = {
            'user-integration': "group: 'it.water.user', name:'User-integration', version:project.waterVersion",
            'role-integration': "group: 'it.water.role', name:'Role-integration', version:project.waterVersion",
            'permission': "group: 'it.water.permission', name:'Permission-service', version:project.waterVersion",
            'shared-entity-integration': "group: 'it.water.shared.entity', name:'SharedEntity-service', version:project.waterVersion"
        };
        
        return modulesString.split(',').map(m => m.trim()).map(m => moduleMap[m]).filter(Boolean);
    }
    
    _processAnswers(answers) {
        let initialName = answers.projectName;
        this.projectTechnology = answers.projectTechnology;
        this.log.info("MODULES CHOSEN: ",answers.modules)
        //forcing on jakarta maybe in the future can be different
        let validationLib = "jakarta"
        let persistenceLib = "jakarta"; 

        if(answers.springRepository)
            this.springRepository = answers.springRepository;
        let projectNameSplits = initialName.split("-");
        let camelizedName = "";
        for (let i = 0; i < projectNameSplits.length; i++) {
            camelizedName = camelizedName + this.capitalizeFirstLetter(this.camelize(projectNameSplits[i]));
        }
        this.log.info("Project Name is: " + initialName + " camelized: " + camelizedName);
        this.projectName = this.capitalizeFirstLetter(this.camelize(this.capitalizeFirstLetter(camelizedName)));
        this.projectSuffix = this.lowerizeFirstLetter(camelizedName);
        this.projectSuffixUpperCase = this.capitalizeFirstLetter(this.camelize(camelizedName));
        this.projectSuffixLowerCase = this.projectSuffix.toLowerCase();
        this.projectGroupId = answers.projectGroupId;
        this.hasRestServices = answers.hasRestServices;
        if (answers.hasModel) {
            this.hasModel = answers.hasModel;
        } else if (answers.applicationType === 'entity') {
            this.hasModel = true;
        } else {
            this.hasModel = false;
        }
        

        //if not it remains the same as intialization project.waterVersion
        if(this.projectTechnology !== "water")
            this.projectVersion = answers.projectVersion;
        this.applicationTypeEntity = answers.applicationType === 'entity';
        let basePackageArr = this.projectGroupId.split(".");
        if(this.hasModel && this.applicationTypeEntity){
            this.modelName = this.capitalizeFirstLetter(this.camelize(answers.modelName));
        } else {
            this.modelName = this.projectSuffixUpperCase
        }
        this.modelNameLowerCase=this.lowerizeFirstLetter(this.modelName);

        let sourceFolderBasicPath = "/src/main/java/";
        let testFolderBasicPath = "/src/test/java/";

        let basePackage = sourceFolderBasicPath + basePackageArr.join("/");
        let baseTestPackage = testFolderBasicPath + basePackageArr.join("/");;

        this.apiPackagePath = basePackage + "/api";
        this.actionsPackagePath = basePackage + "/actions";
        this.modelPackagePath = basePackage + "/model";
        this.repositoryPackagePath = basePackage + "/repository";
        this.servicePackagePath = basePackage + "/service";
        this.serviceRestPackagePath = basePackage + "/service/rest";

        this.parentProjectPath = this.projectName;
        this.projectApiPath = this.parentProjectPath + "/" + this.projectName + "-api";
        this.projectModelPath = this.parentProjectPath + "/" + this.projectName + "-model";
        this.projectServicePath = this.parentProjectPath + "/" + this.projectName + "-service";
        
        let restContextRoot = "na"
        if(answers.hasRestServices){
            restContextRoot = answers.restContextRoot;
            if(!restContextRoot.trim().startsWith("/"))
                restContextRoot= "/"+restContextRoot
        }
        let hasAuthentication = (answers.hasAuthentication)?answers.hasAuthentication:false
        this.projectConf = {
            hasSonarqubeIntegration: answers.hasSonarqubeIntegration,
            hasAuthentication:hasAuthentication,
            featuresModules: answers.modules,
            applicationTypeEntity: this.applicationTypeEntity,
            applicationType: answers.applicationType,
            projectSuffix: this.projectSuffix,
            projectSuffixUpperCase: this.projectSuffixUpperCase,
            projectSuffixLowerCase: this.projectSuffixLowerCase,
            projectName: this.projectName,
            projectGroupId: this.projectGroupId,
            projectVersion: this.projectVersion,
            projectTechnology: this.projectTechnology,
            hasRestServices: this.hasRestServices,
            restContextRoot: restContextRoot,
            hasModel: this.hasModel,
            modelName: this.modelName,
            modelNameLowerCase:this.modelNameLowerCase,
            isProtectedEntity: answers.isProtectedEntity,
            isOwnedEntity:answers.isOwnedEntity,
            persistenceLib: persistenceLib,
            validationLib: validationLib,
            projectPath: this.projectName,
            projectApiPath: this.projectApiPath,
            projectModelPath: this.projectModelPath,
            projectServicePath: this.projectServicePath,
            projectParentPath: this.parentProjectPath,
            projectBasePath: basePackage,
            projectTestPath: baseTestPackage,
            apiPackagePath: this.apiPackagePath,
            apiPackage: this.apiPackagePath.replace(sourceFolderBasicPath, "").split("/").join("."),
            actionsPackagePath: this.actionsPackagePath,
            actionsPackage: this.actionsPackagePath.replace(sourceFolderBasicPath, "").split("/").join("."),
            modelPackagePath: this.modelPackagePath,
            modelPackage: this.modelPackagePath.replace(sourceFolderBasicPath, "").split("/").join("."),
            repositoryPackagePath: this.repositoryPackagePath,
            repositoryPackage: this.repositoryPackagePath.replace(sourceFolderBasicPath, "").split("/").join("."),
            springRepository: this.springRepository,
            servicePackagePath: this.servicePackagePath,
            servicePackage: this.servicePackagePath.replace(sourceFolderBasicPath, "").split("/").join("."),
            serviceRestPackagePath: this.serviceRestPackagePath,
            serviceRestPackage: this.serviceRestPackagePath.replace(sourceFolderBasicPath, "").split("/").join("."),
            testPackage: baseTestPackage.replace(testFolderBasicPath, "").split("/").join("."),
            publishModule: answers.publishModule,
            publishRepoName: answers.publishRepoName,
            publishRepoUrl: answers.publishRepoUrl,
            publishRepoHasCredentials: answers.publishRepoHasCredentials
        };
        
        if(this.projectTechnology === "osgi"){
            //adding features path in order to create features xml for karaf distribution
            this.projectConf.projectFeaturesPath = this.projectConf.projectServicePath;
        }

        super.setProjectConfiguration(this.projectName, this.projectConf);
    }

    configuring() {
        this.log.ok("Project configuration:    \n", this.projectConf);
    }

    generatingParentProjectFiles() {
        let templatePath = this.getWaterTemplatePath() + "/scaffolding/common/new-project";
        this.log.info(chalk.bold.yellow("Creating Parent " + this.parentProjectPath + " Project"));
        this.fs.copyTpl(templatePath + "/gitignore", this.destinationPath(this.parentProjectPath + "/.gitignore"), this.projectConf);
        this.fs.copyTpl(templatePath + "/build.gradle", this.destinationPath(this.parentProjectPath + "/build.gradle"), this.projectConf);
        this.fs.copyTpl(templatePath + "/gradle.properties", this.destinationPath(this.parentProjectPath + "/gradle.properties"), this.projectConf);
        this.fs.copyTpl(templatePath + "/License.md", this.destinationPath(this.parentProjectPath + "/License.md"), this.projectConf);
        this.fs.copyTpl(templatePath + "/settings.gradle", this.destinationPath(this.parentProjectPath + "/settings.gradle"), this.projectConf);
        this.fs.copyTpl(templatePath + "/README.md", this.destinationPath(this.parentProjectPath + "/README.md"), this.projectConf);
        this.log.ok("Parent Project created succesfully!");
    }

    generateModelProject(){
        super.generateModelProject(this.projectConf); 
    }

    generateApiProject() {
        super.generateApiProject(this.projectConf);
    }

    generateServiceProject() {
        super.generateServiceProject(this.projectConf);
    }

    generateRestClasses(){
        super.generateRestClasses(this.projectConf,true)
    }

    end() {
        let templatePath = this.getWaterTemplatePath() + "/scaffolding/common/new-project";
        let parentProjectConf = this.projectConf;
        parentProjectConf["parent-project"] = true;
        this.fs.copyTpl(templatePath + "/.yo-rc.json", this.destinationPath(this.parentProjectPath + "/.yo-rc.json"), {
            projectConf: JSON.stringify(parentProjectConf, null, "\t\t\t")
        });
        this.log.ok("Project " + this.projectName + " created succesfully!");
    }
};
