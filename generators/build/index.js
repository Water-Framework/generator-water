let Generator = require('../WaterBaseGenerator.js');

let projectsName = [];
let results = {};

module.exports = class extends Generator {

    constructor(args, opts) {
        super(args, opts);
    }


    initializing() {
        this.composeWith(require.resolve('../app'), this.options);
    }

    prompting() {
        let done = this.async();
        this.showSelectProject().then((answers) => {
            projectsName = answers.projectsToInstall;
            this.orderProjects(projectsName);
            done();
        });
    }

    install() {
        results = this.launchProjectsBuild(projectsName);
    }

    end() {
        let exitWithError = false;
        let resultsKeys = Object.keys(results);
        resultsKeys.map(currProject => {
            if (results[currProject] === true)
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
