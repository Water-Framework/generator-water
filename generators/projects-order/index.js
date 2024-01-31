let Generator = require('../WaterBaseGenerator.js');

module.exports = class extends Generator {

    constructor(args, opts) {
        super(args, opts);
    }


    initializing() {
        this.composeWith(require.resolve('../app'), this.options);
    }

    prompting() {
        let done = this.async();
        let projects = this.getAllProjectsName();
        let prompts = [];
        let self = this;
        projects.map((projectName, index) => {
            prompts.push({
                type: 'input',
                name: projectName,
                message: projectName + ' precedence (lowest has more priority):',
                default: function () {
                    if (self.getProjectConfiguration(projectName).order)
                        return self.getProjectConfiguration(projectName).order;
                    return "new-" + index;
                },
                validate: function (answer) {
                    let order = parseInt(answer);
                    if (isNaN(order)) {
                        self.log("");
                        self.log.error("Please insert a number!");
                    }
                    return !isNaN(order);

                }
            })
        })

        return this.prompt(prompts).then((answers) => {
            let orders = Object.keys(answers);
            orders.map(projectName => {
                this.addProjectConfigurationField(projectName, "order", answers[projectName]);
            });
            this.saveProjectsConfiguration();
            done();
        });
    }
}
