let Generator = require('../WaterBaseGenerator.js');
let chalk = require('chalk');

module.exports = class extends Generator {

    constructor(args, opts) {
        super(args, opts);
        this.projectName = "";
        this.projectSuffix = "";
        this.projectSuffixUpperCase = "";
        this.projectSuffixLowerCase = "";
        this.projectConf = {};
        this.projectGroupId = "";
        this.projectVersion = "";
        this.hasRestServices = true;
        this.hasActions = true;
        this.hasModel = true;
        this.applicationTypeEntity = true;
        this.projectTechnology = "water";
        this.springRepository = false;
        // Packages paths
        this.apiPackagePath = "";
        this.modelPackagePath = "";
        this.actionsPackagePath = "";
        this.repositoryPackagePath = "";
        this.servicePackagePath = "";
        this.serviceRestPackagePath = "";
        this.basePackage = "";
        this.testPackagePath = "";
        //references to api project and concrete default project
        let parentProjectPath = "";
        let projectApiPath = "";
        let projectPath = "";
    }

    initializing() {
        this.composeWith(require.resolve('../app'), this.options);
    }

    prompting() {
        let done = this.async();
        let self = this;
        this.prompt([{
            type: 'input',
            name: 'projectName',
            message: 'Project Name',
            default: "my-awesome-project"
        }, {
            type: 'input',
            name: 'projectGroupId',
            message: 'Group ID',
            default: function (answers) {
                let packageStr = "";
                if (answers.projectName.toLowerCase().startsWith(self.getGlobalProjectName().toLowerCase())) {
                    packageStr = 'it.' + answers.projectName.replace(/-/g, '.').toLowerCase()
                } else {
                    packageStr = 'it.' + self.getGlobalProjectName().toLowerCase() + '.' + answers.projectName.replace(/-/g, '.').toLowerCase()
                }
                return packageStr;
            }
        }, {
            type: 'input',
            name: 'projectVersion',
            message: 'Version',
            default: "1.0.0"
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
        }, {
            type: 'list',
            name: 'projectTechnology',
            message: 'Which technology should be used?',
            default: "water",
            choices: [
                {
                    name: "Water",
                    value: "water"
                }, {
                    name: "Spring",
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
            type: 'confirm',
            name: 'hasModel',
            message: 'Does Your service project has model to be defined?',
            default: false,
            when: function (answer) {
                return answer.applicationType === 'service';
            }
        },
        {
            type: 'confirm',
            name: 'isProtectedEntity',
            message: 'Is your aggregate model a "protected entity" so its access should be controlled by the Permission System?',
            default: false,
            when: function (answer) {
                return answer.applicationType === 'service';
            }
        },
        {
            type: 'confirm',
            name: 'isOwnedEntity',
            message: 'Is your aggregate model an "owned entity" ?',
            default: false,
            when: function (answer) {
                return answer.applicationType === 'service';
            }
        },
        {
            type: 'list',
            name: 'persistenceLib',
            message: 'Which persistence api does your application support?',
            default: false,
            when: function (answer) {
                return answer.applicationType === 'entity';
            },
            default: function(){
                return "javax";
            },
            choices: [
                {
                    name: "javax ",
                    value: "javax"
                }, {
                    name: "jakarta",
                    value: "jakarta"
                }]
        },
        {
            type: 'list',
            name: 'validationLib',
            message: 'Which validation api does your application support?',
            default: false,
            default: function(){
                return "jakarta";
            },
            choices: [
                {
                    name: "javax",
                    value: "javax"
                }, {
                    name: "jakarta",
                    value: "jakarta"
                }]
        },
        /*{
            type: 'confirm',
            name: 'automaticRepositories',
            message: 'Would you like to use default implementation for CRUD repositories (only interfaces will be generated)?',
            default: false,
            when: function (answer) {
                return answer.applicationType === 'entity';
            },
            default: function(){
                return true;
            }
        },*/
        {
            type: 'confirm',
            name: 'springRepository',
            message: 'Would you like to use water repository instead of spring classic repositories?',
            default: false,
            when: function (answer) {
                return answer.projectTechnology === 'spring' && answer.applicationType === 'entity';
            }
        },
        {
            type: 'confirm',
            name: 'hasActions',
            message: 'Project has actions or permissions which must to be defined?',
            default: true
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
            default: function(answers){
                return "/"+answers.projectName+"s";
            }
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

        }
        ]).then((answers) => {
            let initialName = answers.projectName;
            this.projectTechnology = answers.projectTechnology;
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
            this.hasActions = answers.hasActions;
            if (answers.hasModel) {
                this.hasModel = answers.hasModel;
            } else if (answers.applicationType === 'entity') {
                this.hasModel = true;
            } else {
                this.hasModel = false;
            }

            this.projectVersion = answers.projectVersion;
            this.applicationTypeEntity = answers.applicationType === 'entity';
            let basePackageArr = this.projectGroupId.split(".");

            let sourceFolderBasicPath = "/src/main/java/";
            let testFolderBasicPath = "/src/test/java/"
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
            }

            this.projectConf = {
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
                hasActions: this.hasActions,
                hasModel: this.hasModel,
                isProtectedEntity: answers.isProtectedEntity,
                isOwnedEntity:answers.isOwnedEntity,
                persistenceLib:answers.persistenceLib,
                validationLib:answers.validationLib,
                projectPath: this.projectName,
                projectApiPath: this.projectApiPath,
                projectModelPath: this.projectModelPath,
                projectServicePath: this.projectServicePath,
                projectParentPath: this.parentProjectPath,
                projectTestPath: baseTestPackage,
                apiPackagePath: this.apiPackagePath,
                apiPackage: this.apiPackagePath.replace(sourceFolderBasicPath, "").split("/").join("."),
                actionsPackagePath: this.actionsPackagePath,
                actionsPackage: this.actionsPackagePath.replace(sourceFolderBasicPath, "").split("/").join("."),
                modelPackagePath: this.modelPackagePath,
                modelPackage: this.modelPackagePath.replace(sourceFolderBasicPath, "").split("/").join("."),
                repositoryPackagePath: this.repositoryPackagePath,
                repositoryPackage: this.repositoryPackagePath.replace(sourceFolderBasicPath, "").split("/").join("."),
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
            super.setProjectConfiguration(this.projectName, this.projectConf);
            done();
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
        let parentProjectConf = this.projectConf;
        parentProjectConf["parent-project"] = true;
        this.fs.copyTpl(templatePath + "/.yo-rc.json", this.destinationPath(this.parentProjectPath + "/.yo-rc.json"), {
            projectConf: JSON.stringify(parentProjectConf, null, "\t\t\t")
        });
        this.log.ok("Parent Project created succesfully!");
    }

    generateModelProject(){
        super.generateModelProject(this.destinationPath(this.projectModelPath), this.projectConf); 
    }

    generateApiProject() {
        super.generateApiProject(this.destinationPath(this.projectApiPath), this.projectConf);
    }

    generateServiceProject() {
        super.generateServiceProject(this.destinationPath(this.projectServicePath), this.projectConf);
    }

    end() {
        this.log.ok("Project " + this.projectName + " created succesfully!");
    }
};
