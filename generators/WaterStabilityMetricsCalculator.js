let { AcsBaseGenerator } = require('acs-abstract-generator');
const { JavaClassVisitor } = require('acs-java-visitor');
let fs = require('fs');
let Graph = require("graph-data-structure");
const { parse } = require("java-parser");
let chalk = require('chalk');
let glob = require("glob")


module.exports = class WaterStabilityMetricsCalculator {

    constructor(args, opts) {
        super(args, opts);
    }

    stabilityMetrics(projects,generator) {
        let projectsJson = generator.checkDepCycles(true);
        let graph = projectsJson.dependenciesGraph;
        let modulesFilter = (generator.options.filterModules) ? generator.options.filterModules.split(",") : null;
        if (modulesFilter) {
            generator.log.info("FILTERING only following modules:", generator.options.filterModules);
        }
        let stabilityJson = {};
        for (let projectIdx in projects) {
            let project = projects[projectIdx];
            for (let nodeIdx in graph.nodes()) {
                let node = graph.nodes()[nodeIdx];
                //package:project:version, taking the middle part
                let projectName = node.substring(node.indexOf(":") + 1, node.lastIndexOf(":"));
                let skip = projectName.endsWith("-test") || projectName.endsWith("-features") || projectName === project;
                skip = skip || (modulesFilter && !modulesFilter.includes(projectName));
                if (node.indexOf(":" + project) > 0 && !skip) {
                    let projectPath = projectsJson[node].path;
                    this.stabilityMetricsI(node, graph.indegree(node), graph.outdegree(node), stabilityJson);
                    this.stabilityMetricsA(node, projectPath, stabilityJson);
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
        }
        return stabilityJson;
    }

    stabilityMetricsInfo(generator) {
        generator.log.info("*************** STABILITY METRICS INFO **************************");
        generator.log.info(" It gives some insights about how component has been designed: model, util projects should not be considered in this metrics");
        generator.log.info("- GOOD: The component is well designed and may not have problems");
        generator.log.info("- Zone of pain: The component is higly stable (I) it means it is imported from many projects but it do not depends on other compoents BUT has few degree of abstraciton (A) it means that has few abstract classes respect of total number of classes");
        generator.log.info("- Zone of uselessnes: The component is not stable (I) it means it is not used from other modules BUT has an high degree of abstraction, so it is useless. This value menas that the component is useless inside this current workspace, but it may be imported outside. So this value should not be considered always in a negative way.");
        generator.log.info("*****************************************************************");
    }

    stabilityMetricsA(project, projectPath, stabilityJson) {
        let self = this;
        let abstractCounter = 0;
        let interfaceCounter = 0;
        let childrenClassesCounter = 0;
        glob.sync("**/*.java", {
            cwd: projectPath
        }).forEach(file => {
            try {
                let filePath = projectPath + "/" + file;
                let javaClassContent = new String(self.readFile(filePath));
                javaClassContent = self.formatJavaCode(javaClassContent);
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
            stabilityJson[project].A = null;
        else
            stabilityJson[project].A = parseFloat((stabilityJson[project].abstractClasses / stabilityJson[project].totalClasses).toFixed(2));

    }

    stabilityMetricsI(project, fanIn, fanOut, stabilityJson) {
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
