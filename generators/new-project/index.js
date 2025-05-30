import Generator from '../WaterBaseGenerator.js';
import chalk from 'chalk';

export default class extends Generator {

    constructor(args, opts) {
        super(args, opts);
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
        await this.prompt([
            {
                type: 'list',
                name: 'projectTechnology',
                message: 'Which technology should be used?',
                default: "water",
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
            default: "my-awesome-project"
        }, {
            type: 'input',
            name: 'projectGroupId',
            message: 'Group ID',
            default: function (answers) {
                let packageStr = "";
                packageStr = 'com.' + answers.projectName.replace(/-/g, '.').toLowerCase()
                return packageStr;
            }
        }, {
            type: 'input',
            name: 'projectVersion',
            message: 'Version',
            default: "1.0.0",
            when: function(answers){
                return answers.projectTechnology !== "water"
            }
        }, {
            type: 'list',
            name: "applicationType",
            message: "Select application type:",
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
            default: false,
            when: function (answer) {
                return answer.applicationType === 'service';
            }
        },
        {
            type: 'input',
            name: 'modelName',
            message: 'Please insert model name?',
            default: "MyEntityName",
            when: function (answers) {
                return (answers.applicationType === 'service' && answers.hasModel) || answers.applicationType === 'entity';
            }
        },
        {
            type: 'confirm',
            name: 'isProtectedEntity',
            message: 'Is your aggregate model a "protected entity" so its access should be controlled by the Permission System?',
            default: false,
            when: function (answer) {
                return answer.applicationType === 'entity';
            }
        },
        {
            type: 'confirm',
            name: 'isOwnedEntity',
            message: 'Is your aggregate model an "owned entity" ?',
            default: false,
            when: function (answer) {
                return answer.applicationType === 'entity';
            }
        },
        {
            type: 'confirm',
            name: 'springRepository',
            message: 'Would you like to use Spring repository instead of spring Water default repositories?',
            default: true,
            when: function (answer) {
                return (answer.projectTechnology === 'spring') && answer.applicationType === 'entity';
            }
        },
        {
            type: 'confirm',
            name: 'hasRestServices',
            message: 'Project has rest services?',
            default: true
        },
        {
            type: 'input',
            name: 'restContextRoot',
            message: 'Please insert your rest context root ex. /myEntity ?',
            when: function (answer) {
                return answer.hasRestServices === true;
            },
            default: function(answers){
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
                return true;
            }
        },
        {
            type: 'confirm',
            name: 'moreModules',
            message: 'do you want to add other modules to have out of the box features?',
            default: function(){
                return false;
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
            default: false
        },
        {
            type: 'input',
            name: 'publishRepoName',
            message: 'Please insert publish repo symbolic name ?',
            default: "My Repository",
            when: function (answers) {
                return answers.publishModule === true;
            }
        },
        {
            type: 'input',
            name: 'publishRepoUrl',
            message: 'Please insert publish repo URL ?',
            default: "https://myrepo/m2",
            when: function (answers) {
                return answers.publishModule === true;
            }

        },
        {
            type: 'confirm',
            name: 'publishRepoHasCredentials',
            message: 'Repository requires authentication?',
            default: false,
            when: function (answers) {
                return answers.publishModule === true;
            }

        },
        {
            type: 'confirm',
            name: 'hasSonarqubeIntegration',
            message: 'Do you want to add Sonarqube properties for Sonarqube integration?',
            default: false
        }
        ]).then((answers) => {
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
        });
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
