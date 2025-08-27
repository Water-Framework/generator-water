import Generator from '../WaterBaseGenerator.js';
import DepCycleChecker from '../WaterDepCycleChecker.js';
import chalk from 'chalk';

export default class extends Generator {

    constructor(args, opts) {
        super(args, opts);
        this.depCycleChecker = new DepCycleChecker();
        this.projectsName = [];
        this.results = {};
    }


    async initializing() {
        await this.composeWith(this.resolveInsideGeneratorPath('generators/app'), this.options);
    }

    async prompting() {
        await this.showSelectProject().then((answers) => {
            this.projectsName = answers.projectsToInstall;
        });
    }

    async checkDepCycles(){
       await this.depCycleChecker.checkDepCycles(true,this);
    }

    async install() {
        let repoUsername = this.options.username;
        let repoPassword  = this.options.password;
        if(!repoUsername || !repoPassword)
            this.log.info(chalk.bold.yellow("WARN: NO CREDENTIALS SPECIFIED, PUBLISH COULD FAIL, please add --username <user> --passowrd <password>"));
        this.results = this.launchProjectsPublish(this.projectsName,repoUsername,repoPassword);
    }

    end() {
        let resultsKeys = Object.keys(this.results);
        let exitWithError = false;
        resultsKeys.map(currProject => {
            if (this.results[currProject] === true) {
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
