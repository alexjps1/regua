/* Topology for Régua
 * by Alex JPS
 * 2023-04-23
 */

const idLength = 8;
const defaultProjName = "New Project";

class Topology {
    /* Overarching class for graphs, subgraphs, nodes, & edges.
     * Contains code for name, id, properties shared by all subclasses.
     *
     * How Topology objects are conceptually organized in a transit project
     * (not the same as class inheritance organization)
     *
     * Project (Graph)
     * ⤷ System (Graph)
     *   ⤷ can nest System
     *   ⤷ Line (Graph)
     *     ⤷ Edges (GraphElement)
     *     ⤷ Nodes (GraphElement)
     *     ⤷ Stations (Node)
     */

    constructor(source, name) {
        this.source = source;
        // any Topology object may be provided a name
        if (name) {
            if (typeof(name) != "string") {
                throw new Error(`Cannot pass name of type ${typeof(name)}`);
            }
            this.name = name;
        }
        this.id = this.sourceProj.nextId();
    }

    get sourceProj() {
        /* Return project to which Topology object belongs.
         */
        throw new Error("Cannot call sourceProj getter from Topography class");
    }

    genName() {
        /* Return generic, unique name for a Topology object.
         * Name will not conflict with other Topology objects in project.
         */
        let sourceProj = this.sourceProj;
        if (this.constructor.name === "Project") {
            // no conflicts to check when naming a project
            return defaultProjName;
        } else if (!(sourceProj instanceof Graph)) {
            // need a sourceProj to check for name conflicts
            throw new Error(`Cannot call genName() with sourceProj of class ${sourceProj.constructor.name}."`);
        }
        let nameTemplate = this.constructor.name;
        for (let i = 0; true; i++) {
            let tryName = `${nameTemplate} ${i}`;
            if (!(sourceProj.matchName(tryName))) {
                return tryName;
            }
        }
    }
}

class Graph extends Topology {
    /* A collection of nodes & edges, conceptually.
     * Only Lines directly refer to their nodes & edges.
     *
     * Organization of graphs:
     *
     * Line ⊆ System ⊆ Project
     * where ⊆ means "subgraph of" or "has source"
     */

    constructor(source, name) {
        // name and id from parent class
        super(source, name);
        if (this instanceof Project) {
            // Projects do not have a source
            this.source = null;
        } else if (!(source instanceof Graph)) {
            // ensure source is a graph
            throw new Error(`Cannot create Graph with source of class ${source.constructor.name}`);
        }
        // Graph objects must have a name
        if (!this.name) {
            this.name = this.genName();
        }
    }

    get sourceProj() {
        /* Return project to which Topology object belongs.
         */
        let tryProj = this;
        while (true) {
            if (tryProj instanceof Project) {
                return tryProj;
            } else {
                tryProj = tryProj.source;
            }
        }
    }
}

class Project extends Graph {
    /* All-encompassing graph for a transit project.
     * e.g. all transit in a city.
     * Refer to hierarchy in Topology class comment.
     */
    constructor(name) {
        super(null, name);
        this.systems = [];
        this.id = 0;
        this.idCount = 1;
    }

    nextId() {
        return (this.idCount)++;
    }

    matchName(name) {
        /* Return Topology objects that match given name.
         * Return object if one result.
         * Return array of objects if multiple results.
         * Return false if no matches.
        */
        let matches = [];
        if (this.name === name) {
            matches.push(this);
        }
        for (let i = 0; i < this.systems.length; i++) {
            let iMatches = this.systems[i].matchName(name);
            if (iMatches) {
                matches = matches.concat(iMatches);
            }
        }
        switch (matches.length) {
            case 0: return false;
            case 1: return matches[0];
            default: return matches;
        }
    }

    matchId(id) {
        /* Return Topology object that matches id.
         * Return false if no match.
         */
        if (this.id === id) {
            return this;
        }
        for (let i = 0; i < this.systems.length; i++) {
            let tryMatch = this.systems[i].matchId(id);
            if (tryMatch) {
                return tryMatch;
            }
        }
        return false;
    }

    newSystem(name) {
        /* Create a new system for the project using optional name.
         * Return the System object.
         */
        let system = new System(this, name);
        this.systems.push(system);
        return system;
    }

    removeSystem(system) {
        /* Remove an existing system from the project.
         */
        if (!(system instanceof System)) {
            throw new Error(`Cannot pass object of class ${system.constructor.name}`);
        }
        let index = this.systems.indexOf(system);
        if (index === false) {
            throw new Error(`System ${system.name} not found in the project.`);
        }
        this.systems.splice(index, 1);
    }
}

class System extends Graph {
    /* Subgraph of a project to represent a single transit system.
     * e.g. transit from a particular operator in a city.
     * Refer to hierarchy in Topology class comment.
     */

    constructor(source, name) {
        super(source, name);
        this.lines = [];
    }

    matchName(name) {
        /* Return Topology objects that match given name.
         * Return object if one result.
         * Return array of objects if multiple results.
         * Return false if no matches.
        */
        let matches = [];
        if (this.name === name) {
            matches.push(this);
        }
        for (let i = 0; i < this.lines.length; i++) {
            let iMatches = this.lines[i].matchName(name);
            if (iMatches) {
                matches = matches.concat(iMatches);
            }
        }
        switch (matches.length) {
            case 0: return false;
            case 1: return matches[0];
            default: return matches;
        }
    }

    matchId(id) {
        /* Return Topology object that matches id.
         * Return false if no match.
         */
        if (this.id === id) {
            return this;
        }
        for (let i = 0; i < this.lines.length; i++) {
            let tryMatch = this.lines[i].matchId(id);
            if (tryMatch) {
                return tryMatch;
            }
        }
        return false;
    }

    newLine(name) {
        /* Create a new line for the system using optional name.
         * Return the Line object.
         */
        let line = new Line(this, name);
        this.lines.push(line);
        return line;
    }

    addLine(line) {
        /* Add an existing line to the system.
         * Remove it from its current system.
         */
        if (!(line instanceof Line)) {
            throw new Error(`Cannot pass object of type ${line.constructor.name}`);
        }
        if (this.lines.includes(line)) {
            throw new Error(`Line ${line.name} already exists in system ${this.name}`);
        }
        line.source.removeLine(line);
        line.source = this;
        this.lines.push(line);
    }

    removeLine(line) {
        /* Remove an existing line from the system.
         */
        if (!(line instanceof Line)) {
            throw new Error(`Cannot pass object of type ${line.constructor.name}`);
        }
        let index = this.lines.indexOf(line);
        if (index === false) {
            throw new Error(`Line ${line.name} not found in the system.`);
        }
        this.lines.splice(index, 1);
    }
}

class Line extends Graph {
    /* Subgraph of a system to represent a particular transit line.
     * e.g. one line of a subway system.
     * Refer to hierarchy in Topology class comment.
     */

    constructor(source, name) {
        super(source, name);
        this.nodes = [];
        this.edges = [];
    }

    matchName(name) {
        /* Return Topology objects that match given name.
         * Return object if one result.
         * Return array of objects if multiple results.
         * Return false if no matches.
        */
        let matches = [];
        if (this.name === name) {
            matches.push(this);
        }
        for (let i = 0; i < this.nodes.length; i++) {
            let iMatches = this.nodes[i].matchName(name);
            if (iMatches) {
                matches = matches.concat(iMatches);
            }
        }
        for (let i = 0; i < this.edges.length; i++) {
            let iMatches = this.edges[i].matchName(name);
            if (iMatches) {
                matches = matches.concat(iMatches);
            }
        }
        switch (matches.length) {
            case 0: return false;
            case 1: return matches[0];
            default: return matches;
        }
    }

    matchId(id) {
        /* Return Topology object that matches id.
         * Return false if no match.
         */
        if (this.id === id) {
            return this;
        }
        for (let i = 0; i < this.nodes.length; i++) {
            let tryMatch = this.nodes[i].matchId(id);
            if (tryMatch) {
                return tryMatch;
            }
        }
        for (let i = 0; i < this.edges.length; i++) {
            let tryMatch = this.edges[i].matchId(id);
            if (tryMatch) {
                return tryMatch;
            }
        }
        return false;
    }

    newNode(name) {
        /* Create a new Node for the line using optional name.
         * Return the Line object.
         */
        let node = new Node(this.sourceProj, name);
        this.nodes.push(node);
        return node;
    }

    newStation(name) {
        /* Create a new station for the line using optional name.
         * Return the Station object.
         */
        let station = new Station(this.sourceProj, name);
        this.nodes.push(station);
        return station;
    }

    addNode(node) {
        /* Add an existing node to the line.
         * This will not remove it from other lines.
         */
        if (!(node instanceof Node)) {
            throw new Error(`Cannot pass object of type ${node.constructor.name}`);
        }
        if (this.nodes.includes(node)) {
            throw new Error(`Node ${node.name} already exists in line ${this.name}`);
        }
        this.nodes.push(node);
    }

    removeNode(node) {
        /* Remove an existing node from the line.
         */
        if (!(node instanceof Node)) {
            throw new Error(`Cannot pass object of type ${node.constructor.name}`);
        }
        let index = this.nodes.indexOf(node);
        if (index === false) {
            throw new Error(`Node ${node.name} not found in the line.`);
        }
        this.nodes.splice(index, 1);
    }

    newEdge(headNode, tailNode, name) {
        /* Create a new edge for the line using optional name.
         * Return the Edge object.
         */
        let edge = new Edge(this.sourceProj, headNode, tailNode, name);
        this.edges.push(edge);
        return edge;
    }

    addEdge(edge) {
        /* Add an existing edge to the line.
         * This will not remove it from other lines.
         */
        if (!(edge instanceof Edge)) {
            throw new Error(`Cannot pass object of type ${edge.constructor.name}`);
        }
        if (this.nodes.includes(edge)) {
            throw new Error(`Edge ${edge.name} already exists in line ${this.name}`);
        }
        this.nodes.push(edge);
    }

    removeEdge(edge) {
        /* Remove an existing edge from the line.
         */
        if (!(edge instanceof Edge)) {
            throw new Error(`Cannot pass object of type ${edge.constructor.name}`);
        }
        let index = this.nodes.indexOf(edge);
        if (index === false) {
            throw new Error(`Edge ${edge.name} not found in the line.`);
        }
        this.edges.splice(index, 1);
    }
}

class GraphElement extends Topology {
    /* A basic element of a graph. Namely, a node or edge.
     * Can belong to multiple lines and/or systems.
     * Source will always be the project.
     */

    constructor(source, name) {
        super(source, name);
        if (!(source instanceof Project)) {
            // ensure source is a project
            throw new Error(`Cannot create ${this.constructor.name} object with source of class ${source.constructor.name}`);
        }
    }

    get sourceProj() {
        /* Return project to which Topology object belongs.
         * Source of a GraphElement is always a project.
         */
        return this.source;
    }

    matchName(name) {
        /* Return this object if it matches the given name.
         * Return false if no matches.
         */
        if (this.name === name) {
            return this;
        } else {
            return false;
        }
    }

    matchId(id) {
        /* Return Topology object that matches id.
         * Return false if no match.
         */
        if (this.id === id) {
            return this;
        } else {
            return false;
        }
    }
}

class Node extends GraphElement {
    /* A node in a graph.
     * Can connect to other nodes via edges.
     */

    constructor(source, name) {
        super(source, name);
        this.edges = [];
    }
}

class Station extends Node {
    /* A particular kind of node representing a station.
     */

    constructor(source, name) {
        super(source, name);
        // Station objects must have a name
        if (!this.name) {
            this.name = this.genName();
        }
    }
}

class Edge extends GraphElement {
    /* An edge in a graph.
     * Connects exactly two nodes.
     */

    constructor(source, headNode, tailNode, name) {
        super(source, name);
        if (!(headNode instanceof Node)) {
            throw new Error(`Cannot pass headNode of class ${headNode.constructor.name}`);
        } else if (!(tailNode instanceof Node)) {
            throw new Error(`Cannot pass tailNode of class ${tailNode.constructor.name}`);
        }
        this.headNode = headNode;
        this.tailNode = tailNode;
    }

    connect(fromNode) {
        /* Return the counterpart of a node via this edge.
         */
        switch (fromNode) {
            case this.headNode: return this.tailNode;
            case this.tailNode: return this.headNode;
            default: throw new Error (`Node ${fromNode} is not adjacent to edge`);
        }
    }
}

let openProj;
openProj = new Project();