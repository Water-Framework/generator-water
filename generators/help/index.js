let Generator = require('../WaterBaseGenerator.js');

module.exports = class extends Generator {

    constructor(args, opts) {
        super(args, opts);
    }


    initializing() {
        super.printSplash();
    }

    end() {
        this.log("------------------------------------------------------------------------------------------------------------------------------------------------");
        this.log("yo water:app                                                                                            \tPrint info about the water generator");
        this.log("yo water:build                                                                                          \tLaunch build on workspace projects");
        this.log("yo water:build-all                                                                                      \tLaunch build on all workspace projects");
        this.log("yo water:help                                                                                           \tShow help");
        this.log("yo water:projects-order                                                                                 \tDefine projects precedence for build and deploy");
        this.log("yo water:projects-order-show                                                                            \tGenerates karaf runtime with Dockerfile");
        this.log("yo water:publish                                                                                        \tPublish project to Maven repository");
        this.log("yo water:publish-all                                                                                    \tPublish ALL workspace projects to Maven repository");
        this.log("yo water:stabilityMetrics                                                                               \tPrints stability metrics about the software quality of the modules inside this workspace");
        this.log("------------------------------------------------------------------------------------------------------------------------------------------------");
        this.log();
    }

}
