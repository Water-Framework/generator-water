let { AcsBaseGenerator } = require('acs-abstract-generator');
const DepCycleChecker = require('./WaterDepCycleChecker.js');
let fs = require('fs');
let chalk = require('chalk');

let splash = '' +
    '@@@  @@@  @@@   @@@@@@   @@@@@@@  @@@@@@@@  @@@@@@@   \n'+
    '@@@  @@@  @@@  @@@@@@@@  @@@@@@@  @@@@@@@@  @@@@@@@@  \n'+
    '@@!  @@!  @@!  @@!  @@@    @@!    @@!       @@!  @@@  \n'+
    '!@!  !@!  !@!  !@!  @!@    !@!    !@!       !@!  @!@  \n'+
    '@!!  !!@  @!@  @!@!@!@!    @!!    @!!!:!    @!@!!@!   \n'+
    '!@!  !!!  !@!  !!!@!!!!    !!!    !!!!!:    !!@!@!    \n'+
    '!!:  !!:  !!:  !!:  !!!    !!:    !!:       !!: :!!   \n'+
    ':!:  :!:  :!:  :!:  !:!    :!:    :!:       :!:  !:!  \n'+
    ':::: :: :::   ::   :::     ::     :: ::::  ::   :::   \n'+
    ':: :  : :     :   : :     :     : :: ::    :   : :    \n'+
    '\n\t Version: <%- generatorVersion %>' +
    '\n';


module.exports = class extends AcsBaseGenerator {

    constructor(args, opts) {
        super(args, opts);
    }


    getWaterFrameworkVersion() {
        if (this.config.get("WaterVersion") === undefined || this.config.get("WaterVersion") === null) {
            this.config.set("WaterVersion", "3.0.0");
            this.config.save();
        }
        return this.config.get("WaterVersion");
    }

    getWaterGenericFrameworkMajorkVersion(fullVersion) {
        let index = fullVersion.indexOf(".")
        return fullVersion.substring(0, index) + ".X.Y";
    }

    getWaterGenericFrameworkMinorkVersion(fullVersion) {
        let index = fullVersion.lastIndexOf(".")
        return fullVersion.substring(0, index) + ".X";
    }

    getWaterWorkspaceTechnology() {
        if (this.config.get("workspaceTechnology") === undefined || this.config.get("workspaceTechnology") === null) {
            this.config.set("workspaceTechnology", "water");
            this.config.save();
        }
        return this.config.get("workspaceTechnology");
    }

    getWaterTemplatePath(currentVersion) {
        if (!currentVersion)
            currentVersion = this.getWaterFrameworkVersion();
        let basePath = this.generatorPath + "templates/";

        let templatePathMinorVersion = basePath + this.getWaterGenericFrameworkMinorkVersion(currentVersion);
        let templatePathMajorVersion = basePath + this.getWaterGenericFrameworkMajorkVersion(currentVersion);
        let templatePathFullVersion = basePath + currentVersion;
        let templatePath = basePath + "basic";
        let found = false;
        if (fs.existsSync(templatePathFullVersion)){
            templatePath = templatePathFullVersion;
            found = true;
        } else if (fs.existsSync(templatePathMinorVersion)){
            templatePath = templatePathMinorVersion;
            found = true;
        } else if (fs.existsSync(templatePathMajorVersion)){
            templatePath = templatePathMajorVersion;
            found = true;
        }

        if(!found){
            this.log.info("No path found for: "+templatePathFullVersion);
            this.log.info("No path found for: "+templatePathMajorVersion);
            this.log.info("No path found for: "+templatePathMinorVersion);
        }
        
        return templatePath;
    }

    printSplash() {
        let generatorVersion = this.getGeneratorVersion();
        let splashCompiled = this.compileEjsContent(splash, {
            generatorVersion: generatorVersion
        });
        super.printSplash(splashCompiled);
    }

    getPublishRepoPrompts() {
        return [
            {
                type: 'confirm',
                name: 'publishRepo',
                message: 'Do you have a custom repository where modules must be deployed to?:',
                default: false
            },
            {
                type: 'input',
                name: 'publishRepoName',
                message: 'Please insert publish repository name:',
                default: "",
                when: function (answers) {
                    return answers.publishRepo;
                }

            },
            {
                type: 'input',
                name: 'publishRepoUrl',
                message: 'Please insert publish repository url:',
                default: "",
                when: function (answers) {
                    return answers.publishRepo;
                }

            },
            {
                type: 'confirm',
                name: 'publishHasCredentials',
                message: 'Is your repository secured by credentials?:',
                default: false,
                when: function (answers) {
                    return answers.publishRepo;
                }
            }
        ];
    }

    updateProjectConfOnGeneration(projectConf) {
        this.log.info("updating: " + this.destinationPath("modules/" + projectConf.projectName + "/.yo-rc.json"));
        let confUpdate = {
            "generator-Water": projectConf
        }
        this.writeToFile(JSON.stringify(confUpdate, null, '\t'), this.destinationPath("modules/" + projectConf.projectName + "/.yo-rc.json"));
    }

    createBasicProjectFiles(destFolder,conf){
        this.log.info("Creating basic project files...")
        let templatePath = this.getWaterTemplatePath(this.waterVersion)+"/scaffolding/common/empty-module";
        this.fs.copyTpl(templatePath, destFolder, conf);
        this.fs.copyTpl(templatePath + "/.yo-rc.json", destFolder + "/.yo-rc.json", conf);
        this.fs.copyTpl(templatePath + "/.gitignore", destFolder + "/.gitignore", conf);
    }

    generateModelProject(destFolder,projectConf) {
        this.log.info(chalk.bold.yellow("Creating Model module..."));
        this.createBasicProjectFiles(destFolder,projectConf);
        let modelTemplatePath = this.getWaterTemplatePath(this.waterVersion)+"/scaffolding/common/model-module";
        this.log.info("Model Common Template path is: "+modelTemplatePath)
        let technologyTemplatePath = this.getWaterTemplatePath(this.waterVersion)+"/scaffolding/"+projectConf.projectTechnology+"/model-module";
        this.log.info("Technology Template path is: "+technologyTemplatePath+" \n destination path: "+this.destinationPath(projectConf.projectModelPath))
        this.fs.copyTpl(modelTemplatePath, this.destinationPath(projectConf.projectModelPath), projectConf);
        this.fs.copyTpl(modelTemplatePath+"/.yo-rc.json", this.destinationPath(projectConf.projectModelPath)+"/.yo-rc.json", projectConf);
        if (projectConf.applicationTypeEntity) {
            this.log.info("Creating Entity ...")
            this.fs.copyTpl(modelTemplatePath + "/src/main/java/.package/Entity.java", this.destinationPath(projectConf.projectModelPath + "/" + projectConf.modelPackagePath + "/" + projectConf.projectSuffixUpperCase + ".java"), projectConf);
        }
        this.log.ok("Model Project created succesfully!");
    }

    generateApiProject(destFolder,projectConf) {
        this.log.info(chalk.bold.yellow("Creating Api module..."));
        this.createBasicProjectFiles(destFolder,projectConf);
        let apiTemplatePath = this.getWaterTemplatePath(this.waterVersion)+"/scaffolding/common/api-module";
        this.log.info("Api Common Template path is: "+apiTemplatePath)
        let technologyTemplatePath = this.getWaterTemplatePath(this.waterVersion)+"/scaffolding/"+projectConf.projectTechnology+"/api-module";
        this.log.info("Technology Template path is: "+technologyTemplatePath+" \n destination path: "+this.destinationPath(projectConf.projectApiPath))
        this.fs.copyTpl(apiTemplatePath, this.destinationPath(projectConf.projectApiPath), projectConf);
        this.fs.copyTpl(apiTemplatePath+"/.yo-rc.json", this.destinationPath(projectConf.projectApiPath)+"/.yo-rc.json", projectConf);
        if (projectConf.applicationTypeEntity) {
            this.log.info("Creating Entity Api...")
            this.fs.copyTpl(apiTemplatePath + "/src/main/java/.package/EntityApi.java", this.destinationPath(projectConf.projectApiPath + "/" + projectConf.apiPackagePath + "/" + projectConf.projectSuffixUpperCase + "Api.java"), projectConf);
            this.log.info("Creating Entity System Api...")
            this.fs.copyTpl(apiTemplatePath + "/src/main/java/.package/SystemEntityApi.java", this.destinationPath(projectConf.projectApiPath + "/" + projectConf.apiPackagePath + "/" + projectConf.projectSuffixUpperCase + "SystemApi.java"), projectConf);
            this.log.info("Creating Repository Interface...")
            this.fs.copyTpl(apiTemplatePath + "/src/main/java/.package/RepoInterface.java", this.destinationPath(projectConf.projectApiPath + "/" + projectConf.apiPackagePath + "/" + projectConf.projectSuffixUpperCase + "Repository.java"), projectConf);    
        } else {
            this.fs.copyTpl(apiTemplatePath + "/src/main/java/.package/ServiceApi.java", this.destinationPath(projectConf.projectApiPath + "/" + projectConf.apiPackagePath + "/" + projectConf.projectSuffixUpperCase + "Api.java"), projectConf);
            this.fs.copyTpl(apiTemplatePath + "/src/main/java/.package/SystemServiceApi.java", this.destinationPath(projectConf.projectApiPath + "/" + projectConf.apiPackagePath + "/" + projectConf.projectSuffixUpperCase + "SystemApi.java"), projectConf);
        }
        this.log.ok("Api Project created succesfully!");
    }

    generateServiceProject(destFolder,projectConf) {
        this.log.info(chalk.bold.yellow("Creating Service module..."));
        this.createBasicProjectFiles(destFolder,projectConf);
        let serviceTemplatePath = this.getWaterTemplatePath(this.waterVersion)+"/scaffolding/common/service-module";
        this.log.info("Service Common Template path is: "+serviceTemplatePath)
        let technologyTemplatePath = this.getWaterTemplatePath(this.waterVersion)+"/scaffolding/"+projectConf.projectTechnology+"/service-module";
        this.log.info("Technology Template path is: "+technologyTemplatePath+" \n destination path: "+this.destinationPath(projectConf.projectServicePath))
        this.fs.copyTpl(serviceTemplatePath, this.destinationPath(projectConf.projectServicePath), projectConf);
        this.fs.copyTpl(serviceTemplatePath+"/.yo-rc.json", this.destinationPath(projectConf.projectServicePath)+"/.yo-rc.json", projectConf);
        if (projectConf.applicationTypeEntity) {
            this.log.info("Creating Persistence Layer...")
            if(!projectConf.automaticRepositories){
                this.log.info("Creating repositories implementation...");
                this.fs.copyTpl(serviceTemplatePath+"/src/main/java/.repository_package/RepositoryImpl.java", this.destinationPath(projectConf.projectServicePath)+projectConf.repositoryPackagePath+"/"+projectConf.projectSuffixUpperCase+"RepositoryImpl.java", projectConf);
            } else {
                this.log.info("Skipping creation of repository implementation, using defaults...")
            }
        }

        this.log.info("Creating Api Layer...")
        this.fs.copyTpl(serviceTemplatePath+"/src/main/java/.service_package/ApiImpl.java", this.destinationPath(projectConf.projectServicePath)+projectConf.servicePackagePath+"/"+projectConf.projectSuffixUpperCase+"ServiceImpl.java", projectConf);
        this.fs.copyTpl(serviceTemplatePath+"/src/main/java/.service_package/SystemApiImpl.java", this.destinationPath(projectConf.projectServicePath)+projectConf.servicePackagePath+"/"+projectConf.projectSuffixUpperCase+"SystemServiceImpl.java", projectConf);

        if (projectConf.hasActions) {
            this.log.info("Creating Actions Layer...")
        }
        
        if (projectConf.hasRestServices) {
            this.log.info("Creating Rest Layer...")
            
        }

        this.log.ok("Service module created succesfully!");
    }

    launchProjectsBuild(projectsName) {
        let results = []
        for (let i = 0; i < projectsName.length; i++) {
            results[projectsName[i]] = this.launchSingleProjectBuild(projectsName[i]);
        }
        return results;
    }

    launchProjectsPublish(projectsName, repoUsername, repoPassword) {
        let results = [];
        let workspaceDir = process.cwd();
        for (let i = 0; i < projectsName.length; i++) {
            this.log.ok("processing: " + projectsName[i]);
            let buildOk = this.launchSingleProjectBuild(projectsName[i]);
            let testOk = true;
            if (buildOk) {
                if (!this.options.skipTest) {
                    testOk = this.launchSingleProjectTestSuite(projectsName[i]);
                }
                //test ok is true if test are not enabled
                if (testOk) {
                    results[projectsName[i]] = this.launchSingleProjectPublish(projectsName[i], repoUsername, repoPassword);
                } else {
                    results[projectsName[i]] = false;
                }
            } else {
                results[projectsName[i]] = false;
            }
        }
        process.chdir(workspaceDir);
        return results;
    }

    launchSingleProjectBuild(projectName) {
        this.log.ok("building: " + projectName);
        let buildResult = null;
        let workspaceDir = process.cwd();
        //if water is not inside the specific project folder it runs into it
        let restorePreviousFolder = false;
        if(!workspaceDir.endsWith(projectName)){
            restorePreviousFolder = true;
            process.chdir(projectName);
        }
        
        let depCycleChecker = new DepCycleChecker();
        depCycleChecker.checkDepCycles(true,this);

        let buildCommand = ["clean","build"] 
        buildResult = this.spawnCommandSync("gradle", [...buildCommand,"-x","test"]);
        
        let projectKarafFeaturesPath = this.config.get("projectsConfiguration")[projectName]["projectFeaturesPath"];
        let featureDir = workspaceDir+"/"+projectKarafFeaturesPath;
        if (fs.existsSync(featureDir)){
           if(buildResult.status === 0) {
                this.log.info("---------------> GENERATING FEATURES--------------------")
                this.log.info("Features path: "+featureDir)
                buildResult = this.spawnCommandSync("gradle", ["clean","generateFeatures"]);
            }
        }

        if (buildResult.status === 0) {
            if(this.config.get("projectsConfiguration")[projectName].publishModule == true){
                this.spawnCommandSync("gradle", ["publishToMavenLocal"]);
            }
            this.log.ok("Build of " + projectName + " completed succesfully");
        } else {
            this.log.error("Build of " + projectName + " completed with errors");
        }

        if(restorePreviousFolder)
            process.chdir("../");

        return buildResult.status === 0;
    }

    launchSingleProjectPublish(projectName, repoUsername, repoPassword) {
        let publishOk = false;
        let modules = super.getModuleNamesCommaSeparated(projectName);
        let publishCommand = "publish" 
        let publishHITArgs = [publishCommand, "-DprojectsToBuild=" + modules];
        let publishFeatureArgs = ["publishFeatures", "-DprojectsToBuild=" + modules];
        //populating credentials
        if (repoUsername && repoPassword) {
            publishHITArgs.push("-DpublishRepoUsername=" + repoUsername)
            publishHITArgs.push("-DpublishRepoPassword=" + repoPassword)
            publishFeatureArgs.push("-DpublishRepoUsername=" + repoUsername)
            publishFeatureArgs.push("-DpublishRepoPassword=" + repoPassword)
        }
        process.chdir(projectName);
        let publishResult = this.spawnCommandSync("gradle", publishHITArgs);
        process.chdir("../");
        publishOk = publishResult.status === 0;
        if (publishResult.status === 0) {
            this.log.ok("Publishing of " + projectName + " completed succesfully");
        } else {
            this.log.error("Publishing of " + projectName + " completed with errors");
        }
        return publishOk;
    }
};
