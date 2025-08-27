import Generator from '../WaterBaseGenerator.js';

export default class extends Generator {

    constructor(args, opts) {
        super(args, opts);
    }

    async initializing() {
        await this.composeWith(this.resolveInsideGeneratorPath('generators/app'), this.options);
    }

    end() {
        this.log("------------------------------------------------------------------------------------------------------------------------------------------------");
        this.log("Available Water Generator Tasks:");
        this.log("------------------------------------------------------------------------------------------------------------------------------------------------");
        this.log("yo water:add-entity                                                               \tAdds new entity on existing project");
        this.log("yo water:add-rest-services                                                        \tAdds rest service modules on an exisiting project");
        this.log("yo water:app                                                                      \tPrint info about the water generator");
        this.log("yo water:build                                                                    \tLaunch build on workspace projects");
        this.log("yo water:build-all                                                                \tLaunch build on all workspace projects");
        this.log("yo water:help                                                                     \tShow help");
        this.log("yo water:new-empty-module                                                         \tCreates a new empty module into an existing project");
        this.log("yo water:new-entity-extension                                                     \tScaffolds classes to create an entity extension inside a new or existing project");
        this.log("yo water:new-project                                                              \tScaffolds a new project");
        this.log("yo water:projects-order                                                           \tDefine projects precedence for build and deploy");
        this.log("yo water:projects-order-show                                                      \tGenerates karaf runtime with Dockerfile");
        this.log("yo water:publish                                                                  \tPublish project to Maven repository");
        this.log("yo water:publish-all                                                              \tPublish ALL workspace projects to Maven repository");
        this.log("yo water:stabilityMetrics                                                         \tPrints stability metrics about the software quality of the modules inside this workspace");
        this.log("------------------------------------------------------------------------------------------------------------------------------------------------");
        this.log();
        this.log("💡 TIP: For detailed help on any specific task, add --taskHelp to the command:");
        this.log("   Example: yo water:new-project --taskHelp");
        this.log("   This will display comprehensive documentation including usage examples,");
        this.log("   available options, and detailed explanations for that specific task.");
        this.log();
    }

}
