import Generator from '../WaterBaseGenerator.js';
import WaterStabilityMetricsCalculator from '../WaterStabilityMetricsCalculator.js';

export default class extends Generator {

    constructor(args, opts) {
        super(args, opts);
        this.projectsNames = [];
    }

    async initializing() {
        await this.composeWith(this.resolveInsideGeneratorPath('generators/app'), this.options);
    }

    async prompting() {
        await this.showSelectProject().then((answers) => {
            this.projectsNames = answers.projectsToInstall;
            this.orderProjects(this.projectsNames);
        });
    }

    async calculateStabilityMetrics(){
        this.log.info("Starting stability metrics calculation...")
        let waterStabilityMetricsCalculator = new WaterStabilityMetricsCalculator();
        await waterStabilityMetricsCalculator.stabilityMetrics(this.projectsNames,this);
        await waterStabilityMetricsCalculator.stabilityMetricsInfo(this);
    }
    
};
