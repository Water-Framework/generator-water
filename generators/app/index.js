let Generator = require('../WaterBaseGenerator.js');
let startDate = null;
module.exports = class extends Generator {

    constructor(args, opts) {
        super(args, opts);
        startDate = Date.now();
    }

    initializing() {
        super.printSplash();
        if(!this.options.skipUpdate)
            this.checkUpdates();
        this._private_getWorkspaceVersion();
        this._private_checkRequirements();
        this.automaticallyLinkProjects();
        this.config.save();
    }

    /**
     * Upgrade .yo-rc file automatically with the current workspace version of WaterFramework
     */
    _private_getWorkspaceVersion(){
        if(this.options.skipWorkspaceCheck){
            return;
        }
        
        this.log.info("Checking workspace version...");
        let waterVersionLabel = "waterVersion: ";
        let result = this.spawnCommandSync("gradle", ["properties","-DprojectsToBuild="], {
            stdio: ['pipe', 'pipe', 'pipe']
        });
        let gradleOutput = new String(result.stdout).toString();
        let waterVersionRegex = /waterVersion\: ([0-9]+\.[0-9]+\.[0-9]+)/g;
        let waterCorrectVersion = waterVersionRegex.exec(gradleOutput);
        if(waterCorrectVersion && waterCorrectVersion.length > 0){
            let currentWorkspaceVersion = waterCorrectVersion[0].replace(waterVersionLabel,"");
            let defaultWorkspaceVersion = this.getWaterFrameworkVersion();
            this.log.info("Current Workspace Version is: "+currentWorkspaceVersion);
            if(currentWorkspaceVersion !== defaultWorkspaceVersion){
                this.log.info("Default workspace version is: "+defaultWorkspaceVersion);
                this.log.info("Upgrading default workspace version to: "+currentWorkspaceVersion);
                this.config.set("waterVersion",currentWorkspaceVersion);
                this.config.save();
            }
        }
    }

    _private_checkRequirements() {
        this.log.info("Checking requirements...");
        let result = this.spawnCommandSync("gradle", ["-v"], {
            stdio: ['pipe', 'pipe', 'pipe']
        });
        let gradleOutput = new String(result.stdout).toString();
        let gradleVersionRegex = /Gradle ([0-9]+\.[0-9]+)/g;
        let gradleCorrectVersion = gradleVersionRegex.exec(gradleOutput);
        let gradleVersion = (gradleCorrectVersion !== null && gradleCorrectVersion.length > 1) ? parseFloat(gradleCorrectVersion[1]) : 0;
        if (result.status === 0 && gradleVersion >= parseFloat("5.1")) {
            this.log.ok("Gradle " + gradleVersion + " Found!");
            result = this.spawnCommandSync("java", ["-version"], {
                stdio: ['pipe', 'pipe', 'pipe']
            });
            let javaOutput = new String(result.output).toString();
            let javaVersionRegex = /(java|openjdk) version "([0-9]+\.[0-9])+\.[0-9]+((_|\.)[0-9]+)*"/g;
            let javaCorrectVersion = javaVersionRegex.exec(javaOutput);
            this.log.info("Current Java version found: "+javaCorrectVersion[2]);
            let javaVersion = (javaCorrectVersion !== null && javaCorrectVersion.length > 1) ? parseFloat(javaCorrectVersion[2]) : 0
            if (javaVersion >= parseFloat("1.8")) {
                this.log.ok("Java " + javaVersion + " Found!");
            } else {
                this.log.error("Java is not the correct version (>1.8_X) or is not installed generator will exit...");
                process.exit(-1);
            }

        } else {
            this.log.error("Gradle Version, is not the correct version (>= 5.1.x) found " + gradleVersion + " or is not installed, generator will exit...");
            process.exit(-1);
        }
    }

    end() {
        let endDate = Date.now();
        this.log.info("Task duration: " + (endDate - startDate) + " ms");
    }
};
