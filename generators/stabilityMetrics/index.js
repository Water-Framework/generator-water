let Generator = require('../WaterBaseGenerator.js');
const WaterStabilityMetricsCalculator = require('../WaterStabilityMetricsCalculator.js');

let projectsName = [];
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
            this.orderProjects(projectsName);
            done();
        });
    }

    calculateStabilityMetrics(){
        let waterStabilityMetricsCalculator = new WaterStabilityMetricsCalculator();
        let stabilityJson = waterStabilityMetricsCalculator.stabilityMetrics(projectsName);
        this.log(stabilityJson);
        waterStabilityMetricsCalculator.stabilityMetricsInfo();
    }
    
};
