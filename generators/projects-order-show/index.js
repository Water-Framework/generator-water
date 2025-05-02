import Generator from '../WaterBaseGenerator.js';

export default class extends Generator {

    constructor(args, opts) {
        super(args, opts);
        this.projectsName = [];
    }

    async initializing() {
        await this.composeWith(this.resolveInsideGeneratorPath('generators/app'), this.options);
    }

    async prompting() {
        this.projectsName = this.getAllProjectsName();
        this.orderProjects(this.projectsName);
        this.projectsName.map(projectName => {
            this.log.info(projectName + " - " + this.getProjectConfiguration(projectName).order);
        });
    }

}
