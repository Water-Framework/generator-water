/**
 *    Author: Aristide Cittadino ACSoftware
 *
 */
import Generator from '../WaterBaseGenerator.js';
import fs from 'fs';

export default class extends Generator {

    constructor(args, opts) {
        super(args, opts);
    }

    initializing() {
        let generatorPathFile = process.cwd() + "/package.json";
        let packageJsonFile = fs.readFileSync(generatorPathFile);
        let packageJson = JSON.parse(packageJsonFile);
        if (!fs.existsSync(generatorPathFile) || packageJson.name !== super.getGeneratorName()) {
            this.log.error("Please be sure to be in generator folder");
            process.exit(-1);
        }
    }

    writing() {
        super.compileAndPublish([]);
    }
};
