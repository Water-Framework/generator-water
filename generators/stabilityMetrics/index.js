let Generator = require('../WaterBaseGenerator.js');
const WaterStabilityMetricsCalculator = require('../WaterStabilityMetricsCalculator.js');

module.exports = class extends Generator {

    constructor(args, opts) {
        super(args, opts);
        this.projectsNames = [];
    }


    initializing() {
        this.composeWith(require.resolve('../app'), this.options);
    }

    prompting() {
        let done = this.async();
        this.showSelectProject().then((answers) => {
            this.projectsNames = answers.projectsToInstall;
            this.orderProjects(this.projectsNames);
            done();
        });
    }

    calculateStabilityMetrics(){
        this.log.info("Starting stability metrics calculation...")
        let waterStabilityMetricsCalculator = new WaterStabilityMetricsCalculator();
        waterStabilityMetricsCalculator.stabilityMetrics(this.projectsNames,this);
        waterStabilityMetricsCalculator.stabilityMetricsInfo(this);
    }
    
};
