let Generator = require('../WaterBaseGenerator.js');

let projectsName = [];
module.exports = class extends Generator {

    constructor(args, opts) {
        super(args, opts);
    }


    initializing() {
        this.composeWith(require.resolve('../app'), this.options);
    
    }

    prompting() {
        projectsName = this.getAllProjectsName();
        this.orderProjects(projectsName);
        projectsName.map(projectName => {
            this.log.info(projectName + " - " + this.getProjectConfiguration(projectName).order);
        });
    }

}
