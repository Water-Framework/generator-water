import { JavaClassVisitor } from 'acs-java-visitor';
import {
    deserializeGraph,
    indegree,
    outdegree
  } from 'graph-data-structure';
import { glob } from 'glob'
import DepCycleChecker from './WaterDepCycleChecker.js';
import { parse } from 'java-parser';
import chalk from 'chalk';

export default class WaterStabilityMetricsCalculator {

    constructor() {

    }

    async stabilityMetrics(projects, generator) {
        let depCycleChecker = new DepCycleChecker();
        let stabilityJson = {};
        for (let projectIdx in projects) {
            let currentDir = process.cwd();
            generator.destinationRoot(currentDir+"/"+projects[projectIdx]);
            let projectsJson = await depCycleChecker.checkDepCycles(true, generator);
            let graph = deserializeGraph(projectsJson.dependenciesGraph);
            let project = projects[projectIdx];
            for (const node of graph.nodes) {
                //package:project:version, taking the middle part
                let projectName = node.substring(node.indexOf(":") + 1, node.lastIndexOf(":"));
                let skip = projectName.endsWith("-test") || projectName.endsWith("-features") || projectName === project;
                if (node.indexOf(":" + project) > 0 && !skip) {
                    let projectPath = projectsJson[node].path;
                    await this.stabilityMetricsI(generator,node, indegree(graph,node), outdegree(graph,node), stabilityJson);
                    await this.stabilityMetricsA(generator,node, projectPath, stabilityJson);
                    let metricI = stabilityJson[node].I;
                    let metricA = stabilityJson[node].A;
                    if (metricI <= 0.5) {
                        if (metricA >= 0.5) {
                            stabilityJson[node].quality = "GOOD";
                        } else {
                            stabilityJson[node].quality = "Zone of PAIN";
                        }
                    } else {
                        if (metricA > 0.5) {
                            stabilityJson[node].quality = "Zone of uselessness";
                        } else {
                            stabilityJson[node].quality = "GOOD";
                        }
                    }
                }
            }  
            generator.destinationRoot("../");
        }
        //avoid linter problems
        let consoleTmp = console;
        consoleTmp.table(stabilityJson);
        return stabilityJson;
    }

    async stabilityMetricsInfo(generator) {
        generator.log("***************************** STABILITY METRICS INFO *****************************\n");
        generator.log(chalk.italic(" It gives some insights about how component has been designed: model, util projects should not be considered in this metrics: \n"));
        generator.log("- "+chalk.bold.green("GOOD")+": The component is well designed and may not have problems\n");
        generator.log("- "+chalk.bold.yellow("Zone of pain")+": The component is higly stable (I) it means it is imported from many projects but it do not depends on other compoents BUT has few degree of abstraciton (A) it means that has few abstract classes respect of total number of classes\n");
        generator.log("- "+chalk.bold.red("Zone of uselessnes")+": The component is not stable (I) it means it is not used from other modules BUT has an high degree of abstraction, so it is useless. This value means that the component is useless inside this current workspace, but it may be imported outside. So this value should not be considered always in a negative way.\n");
        generator.log("***********************************************************************************");
    }

    async stabilityMetricsA(generator,project, projectPath, stabilityJson) {
        let abstractCounter = 0;
        let interfaceCounter = 0;
        let childrenClassesCounter = 0;
        glob.sync("**/*.java", {
            cwd: projectPath
        }).forEach(file => {
            try {
                let filePath = projectPath + "/" + file;
                let javaClassContent = new String(generator.readFile(filePath));
                javaClassContent = generator.formatJavaCode(javaClassContent);
                let cstLocalServiceTree = parse(javaClassContent);
                let visitor = new JavaClassVisitor();
                let result = {};
                visitor.visit(cstLocalServiceTree, result);
                if (result.class) {
                    if (result.class.isAbstract)
                        abstractCounter++;
                    else if (result.class.isInterface)
                        interfaceCounter++
                    else
                        childrenClassesCounter++;
                }
            } catch (err) {
                generator.log.error(err);
            }
        });
        
        if (!stabilityJson[project])
            stabilityJson[project] = {};
        stabilityJson[project].abstractClasses = (abstractCounter + interfaceCounter);
        stabilityJson[project].totalClasses = (abstractCounter + interfaceCounter + childrenClassesCounter);
        if (stabilityJson[project].totalClasses === 0)
            stabilityJson[project].A = 0;
        else
            stabilityJson[project].A = parseFloat((stabilityJson[project].abstractClasses / stabilityJson[project].totalClasses).toFixed(2));

    }

    async stabilityMetricsI(generator,project, fanIn, fanOut, stabilityJson) {
        if (!stabilityJson[project])
            stabilityJson[project] = {};
        stabilityJson[project].fanIn = fanIn;
        stabilityJson[project].fanOut = fanOut;
        if (fanOut === fanIn && fanIn === 0)
            stabilityJson[project].I = null;
        else
            stabilityJson[project].I = parseFloat((fanOut / (fanIn + fanOut)).toFixed(2));
    }
};
