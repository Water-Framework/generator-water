let Generator = require('../WaterBaseGenerator.js');

let projectsName = [];
let results = {};
let chalk = require('chalk');

module.exports = class extends Generator {

    constructor(args, opts) {
        super(args, opts);
    }


    initializing() {
        this.composeWith(require.resolve('../app'), this.options);
        this.mustBeInWorkspaceFolder();
    }

    prompting() {
        let done = this.async();
        this.showSelectProject().then((answers) => {
            projectsName = answers.projectsToInstall;
            done();
        });
    }

    checkDepCycles(){
        super.checkDepCycles(true);
    }

    install() {
        let repoUsername = this.options.username;
        let repoPassword  = this.options.password;
        if(!repoUsername || !repoPassword)
            this.log.info(chalk.bold.yellow("WARN: NO CREDENTIALS SPECIFIED, PUBLISH COULD FAIL, please add --username <user> --passowrd <password>"));
        results = this.launchProjectsPublish(projectsName,repoUsername,repoPassword);
    }

    end() {
        let resultsKeys = Object.keys(results);
        let exitWithError = false;
        resultsKeys.map(currProject => {
            if (results[currProject] === true) {
                this.log.ok(currProject + " OK! ");
            } else {
                exitWithError = true;
                this.log.error(currProject + " NOK! ");
            }
        })

        if (exitWithError)
            process.exit(-1);

    }
};
