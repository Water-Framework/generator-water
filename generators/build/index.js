import Generator from '../WaterBaseGenerator.js';


export default class extends Generator {

    constructor(args, opts) {
        super(args, opts);
        this.projectsName = [];
        this.results = {};
        this.startDate = Date.now();
    }

    async initializing() {
        await this.composeWith(this.resolveInsideGeneratorPath('generators/app'), this.options);
    }

    async prompting() {
        await this.showSelectProject().then((answers) => {
            this.projectsName = answers.projectsToInstall;
            this.orderProjects(this.projectsName);
        });
    }

    async install() {
        this.results = await this.launchProjectsBuild(this.projectsName);
    }

    async end() {
        this.calculateTaskDuration(this.startDate)
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
            process.exit(-1)
    }
};
