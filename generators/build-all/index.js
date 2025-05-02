import Generator from '../WaterBaseGenerator.js';

export default class extends Generator {

    constructor(args, opts) {
        super(args, opts);
        this.projectsName = [];
        this.results = {};
    }

    async initializing() {
        await this.composeWith(this.resolveInsideGeneratorPath('generators/app'), this.options);
    }

    async prompting() {
        this.projectsName = await super.getAllProjectsInWorkspace();
    }

    async install() {
        this.results = await this.launchProjectsBuild(this.projectsName);
    }

    async end() {
        let exitWithError = false;
        let resultsKeys = Object.keys(this.results);
        resultsKeys.map(currProject => {
            if (this.results[currProject] === true)
                this.log.ok(currProject + " OK! ");
            else {
                exitWithError = true;
                this.log.error(currProject + " NOK! ");
            }
        })

        if(exitWithError)
            process.exit(-1);
    }
};
