let Graph = require("graph-data-structure");
let chalk = require('chalk');


class CycleError extends Error {
    constructor(message) {
        super(message);
        Object.setPrototypeOf(this, CycleError.prototype);
    }
}

class DependencyPathNode {
    constructor(parent, node) {
        this.node = node;
        this.parent = parent;
        this.following = []
    }

    getParent() {
        return this.parent;
    }

    getFollowing() {
        return this.following;
    }

    addFollowing(following) {
        this.following.push(following);
    }

    setPathNodeEndCycle(pathNodeEndCycle) {
        this.pathNodeEndCycle = pathNodeEndCycle;
    }

    getCycleString(parentNodeName) {
        if (this.parent === null || this.parent === undefined || this.parent.node === parentNodeName) {
            let parentNode = (this.parent !== null && this.parent !== undefined) ? this.parent.node + " -> " : "";
            return parentNode + this.node;
        }

        return this.parent.getCycleString(parentNodeName) + " -> " + this.node;
    }
}

module.exports = class DepCycleChecker {

    constructor(args, opts) {
     
    }

    checkDepCycles(exitOnCycle,generator) {
        let depGraph = Graph();
        let projectsGraph = Graph();
        let projectsJson = {};
        if (!generator.options.skipCycleCheck) {
            generator.log.info(chalk.bold.yellow("Check gradle depList for dependencies cycle, it may take a while, to skip please add --skipCycleCheck"));
            let result = generator.spawnCommandSync("gradle", ["depList"], { stdio: ['pipe', 'pipe', 'pipe'] });
            //retrocompatible for old workspaces
            if (result.status === 0) {
                generator.log.info("Analyzing dependencies cycles....");
                //parsing json between DEP LIST OUTPUT and END DEP LIST OUTPUT
                let projectsJsonStr = result.stdout.toString('utf8').split("-- DEP LIST OUTPUT --")[1].split("-- END DEP LIST OUTPUT --")[0];
                projectsJson = JSON.parse(projectsJsonStr);
                let keys = Object.keys(projectsJson);
                for (let keyIdx in keys) {
                    let project = keys[keyIdx];
                    this.addNodeToGraph(depGraph, project);
                    let deps = projectsJson[project].dependencies;
                    for (let depIdx in deps) {
                        let dep = deps[depIdx];
                        this.addNodeToGraph(depGraph, dep);
                        depGraph.addEdge(project, dep);
                        if (projectsJson[project].parent) {
                            let parentNode = projectsJson[project].parent;
                            this.addNodeToGraph(projectsGraph, parentNode);
                            //if dep is an interal project
                            if (projectsJson[dep] && projectsJson[dep].parent) {
                                let depParentNode = projectsJson[dep].parent;
                                if (parentNode !== depParentNode) {
                                    this.addNodeToGraph(projectsGraph, depParentNode);
                                    projectsGraph.addEdge(parentNode, depParentNode);
                                    if (generator.options.cycleCheckVerbose)
                                        generator.log.info(parentNode + " depends on:\n\t " + depParentNode + "\n\t on project: " + project + "\n\t with dependency :" + dep);
                                }
                            }
                        }
                    }
                }
                try {
                    this.findCycles(depGraph);
                    this.findCycles(projectsGraph);
                } catch (cycleError) {
                    generator.log.error("ERROR:Some Dependecy cycles has been detected in your workspace, please remove them: ");
                    generator.log.error(cycleError.message);
                    generator.log.error("For more details about which dependency has generated the cycle please add the option --cycleCheckVerbose");
                    if (exitOnCycle)
                        process.exit(-1);
                }

                generator.log.ok("No cycles found in your workspace depependencies, well done!");
            } else {
                generator.log.info(chalk.bold.yellow("WARNING: Gradle \"depList\" task gradle not found. Dependency list metrics not available, please upgrade your workspace settings!"));
            }
        }
        projectsJson.dependenciesGraph = depGraph;
        return projectsJson;
    }

    findCycles(graph) {
        let sourceNodes = graph.nodes();
        const visited = {};
        const visiting = {};
        const nodeList = [];

        function DFSVisit(pathNode) {
            let node = pathNode.node;
            if (visiting[node]) {
                throw new CycleError(pathNode.getCycleString(node));
            } else {
                visited[node] = true;
                visiting[node] = true; // temporary flag while visiting
                graph.adjacent(node).forEach(curr => {
                    let followingNode = new DependencyPathNode(pathNode, curr);
                    pathNode.addFollowing(followingNode);
                    DFSVisit(followingNode);
                });
                visiting[node] = false;
                nodeList.push(node);
            }
        }

        sourceNodes.forEach(node => {
            DFSVisit(new DependencyPathNode(null, node), 0);
        });
    }

    addNodeToGraph(graph, depName) {
        if (graph.nodes()[depName] === null || graph.nodes()[depName] === undefined) {
            graph.addNode(depName);
        }
    }
};
