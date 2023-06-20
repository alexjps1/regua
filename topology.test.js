/* Topology Unit Tests for Régua
 * by Alex JPS
 * 2023-05-27
 */

import {defaultProjName, Project} from "./topology.js"

// Tests for classes and their methods

function testProject() {
    /* Test that properties are correctly set when creating a project.
     */

    // Project object attributes correctly set
    let noNameProj = new Project();
    if (noNameProj.name !== defaultProjName) {
        throw new Error("Nameless project did not take on defaultProjName");
    }
    let myProj = new Project("My Project");
    if (myProj.name !== "My Project") {
        throw new Error("Project does not take given name");
    }
    if (myProj.source) {
        throw new Error("Project source is not undefined");
    }
    if (myProj.systems.length !== 0) {
        throw new Error("Project systems array not properly set");
    }
    if (myProj.id !== 0) {
        throw new Error("Project id is not 0");
    }

    // nextId starts at 0 and increments 1
    if (myProj.idCount !== 1) {
        throw new Error("Project idCount is not 1");
    }
    if (myProj.nextId !== 1) {
        throw new Error("Project nextId did not increment properly");
    }
    if (myProj.nextId !== 2) {
        throw new Error("Project nextId did not increment properly");
    }

    // Success
    console.debug("testProject() successful");
}

function testSystem() {
    /* Test that properties are correctly set when creating a system.
     */

    // System object attributes correctly set
    let myProj = new Project();
    let noNameSystem = myProj.newSystem();
    if (noNameSystem.name !== "System 1") {
        throw new Error("Nameless system did not take on a generated name");
    }
    let mySystem = myProj.newSystem("My System");
    if (mySystem.name !== "My System") {
        throw new Error("System does not take given name");
    }
    if (mySystem.source !== myProj) {
        throw new Error("System source is not properly set");
    }
    if (mySystem.sourceProj !== myProj) {
        throw new Error("System sourceProj is not properly set");
    }
    if (mySystem.lines.length !== 0) {
        throw new Error("System lines array not properly set");
    }
    if (noNameSystem.id !== 1 || mySystem.id !== 2) {
        throw new Error("System id not properly set");
    }

    // Success
    console.debug("testSystem() successful");
}

function testLine() {
    /* Test that properties are correctly set when creating a line.
     */

    // Line object attributes correctly set
    let myProj = new Project();
    let mySystem = myProj.newSystem();
    let noNameLine = mySystem.newLine()
    if (noNameLine.name !== "Line 1") {
        throw new Error("Nameless line did not take on a generated name");
    }
    let myLine = mySystem.newLine("My Line");
    if (myLine.name !== "My Line") {
        throw new Error("Line does not take given name");
    }
    if (myLine.source !== mySystem) {
        throw new Error("Line source is not properly set");
    }
    if (myLine.sourceProj !== myProj) {
        throw new Error("Line sourceProj is not properly set");
    }
    if (myLine.nodes.length !== 0) {
        throw new Error("Line nodes array not properly set");
    }
    if (myLine.edges.length !== 0) {
        throw new Error("Line edges array not properly set");
    }
    if (noNameLine.id !== 2 || myLine.id !== 3) {
        throw new Error("Line id not properly set");
    }

    // Success
    console.debug("testLine() successful");
}

function testNode() {
    /* Test that properties are correctly set when creating a node.
     */

    // Node object attributes correctly set
    let myProj = new Project();
    let myLine = myProj.newSystem().newLine();
    let noNameNode = myLine.newNode();
    if (noNameNode.name) {
        throw new Error("Nameless node did not omit name");
    }
    let myNode = myLine.newNode("My Node");
    if (myNode.name !== "My Node") {
        throw new Error("Node does not take given name");
    }
    if (myNode.source !== myProj) {
        throw new Error("Node source is not properly set");
    }
    if (myNode.sourceProj !== myProj) {
        throw new Error("Node sourceProj is not properly set");
    }
    if (myNode.edges.length !== 0) {
        throw new Error("Node edges array not properly set");
    }
    if (noNameNode.id !== 3 || myNode.id !== 4) {
        throw new Error("Node id not properly set");
    }

    // Success
    console.debug("testNode() successful");
}

function testStation() {
    /* Test that properties are correctly set when creating a station.
     */

    // Station object attributes correctly set
    let myProj = new Project();
    let myLine = myProj.newSystem().newLine();
    let noNameStn = myLine.newStation();
    if (noNameStn.name !== "Station 1") {
        throw new Error("Nameless station did not take on a generated name");
    }
    let myStn = myLine.newStation("My Station");
    if (myStn.name !== "My Station") {
        throw new Error("Station does not take given name");
    }
    if (myStn.source !== myProj) {
        throw new Error("Station source is not properly set");
    }
    if (myStn.sourceProj !== myProj) {
        throw new Error("Station sourceProj is not properly set");
    }
    if (myStn.edges.length !== 0) {
        throw new Error("Station edges array not properly set");
    }
    if (noNameStn.id !== 3 || myStn.id !== 4) {
        throw new Error("Station id not properly set");
    }

    // Success
    console.debug("testStation() successful");
}

function testEdge() {
    /* Test that properties are correctly set when creating an edge.
     */

    // Station object attributes correctly set
    let myProj = new Project();
    let myLine = myProj.newSystem().newLine();
    let myStn1 = myLine.newStation();
    let myStn2 = myLine.newStation();
    let noNameEdge = myLine.newEdge(myStn1, myStn2)
    if (noNameEdge.name) {
        throw new Error("Nameless edge did not omit name");
    }
    let myStn3 = myLine.newStation();
    let myEdge = myLine.newEdge(myStn1, myStn3, "My Edge");
    if (myEdge.name !== "My Edge") {
        throw new Error("Edge does not take given name");
    }
    if (myEdge.source !== myProj) {
        throw new Error("Edge source is not properly set");
    }
    if (myEdge.sourceProj !== myProj) {
        throw new Error("Edge sourceProj is not properly set");
    }
    if (myEdge.headNode !== myStn1) {
        throw new Error("Edge head node not properly set");
    }
    if (myEdge.tailNode !== myStn3) {
        throw new Error("Edge tail node not properly set");
    }
    if (noNameEdge.id !== 5 || myEdge.id !== 7) {
        throw new Error("Edge id not properly set");
    }

    // traverse() returns counterpart node
    if (myEdge.traverse(myStn1) !== myStn3) {
        throw new Error("Edge traverse() does not return node counterpart");
    }
    if (myEdge.traverse(myStn3) !== myStn1) {
        throw new Error("Edge traverse() does not return node counterpart");
    }

    // traverse() throws error for bad nodes
    let dummyNode = myLine.newNode();
    let tryError;
    try {
        if (myEdge.traverse(dummyNode)) {
            // error was not thrown
            tryError = false;
        }
    } catch {
        // error thrown as expected
        tryError = true;
    }
    if (!tryError) {
        throw new Error("Edge traverse() does not throw error for bad node");
    }

    // Success
    console.debug("testEdge() successful");
}

// Tests for interaction among similar methods or attributes

function testNewMethods() {
    /* Test methods for creating new Graph or GraphElement objects.
     * Errors would come from calling the methods or accessing created objects.
     * Other tests ensure that the objects' properties are correctly set.
     *
     * Trivia:
     * U-Bahn stations in former East Berlin were closed to West Berlin.
     * A node which is not a station can model these "ghost stations".
     */

    // Created objects are returned
    let berlin = new Project("Berlin");
    let ubahn = berlin.newSystem("Berlin U-Bahn");
    if (!ubahn) {
        throw new Error("newSystem() does not return created system");
    }
    let u8 = ubahn.newLine("U8");
    if (!u8) {
        throw new Error("newLine() does not return created line");
    }
    let gesund = u8.newStation("Gesundbrunnen");
    if (!gesund) {
        throw new Error("newStation() does not return created station");
    }
    let volta = u8.newStation("Voltastraße");
    let westTrack = u8.newEdge(gesund, volta, "Grenze");
    if (!westTrack) {
        throw new Error("newEdge() does not return created edge");
    }
    let bernauer = u8.newNode("Bernauer Straße");
    if (!bernauer) {
        throw new Error("newNode() does not return created node");
    }
    let borderTrack = u8.newEdge(volta, bernauer, "Grenze");

    // One liner
    let hbf = berlin.newSystem("Berlin S-Bahn").newLine("S5").newStation("Hauptbahnhof");
    if (!hbf) {
        throw Error("One liner usage of new methods not working");
    }

    // Arrays are correctly set for each class
    if (!berlin.systems.includes(ubahn)) {
        throw new Error("newSystem() did not push system to project.systems");
    }
    if (!ubahn.lines.includes(u8)) {
        throw new Error("newLine() did not push line to system.lines")
    }
    if (!(u8.nodes.includes(gesund) && u8.nodes.includes(volta) && u8.nodes.includes(bernauer))) {
        throw new Error("newStation() or newNode() did not push nodes to line.nodes");
    }
    if (!(u8.edges.includes(westTrack) && u8.edges.includes(borderTrack))) {
        throw new Error("newEdge() did not push edges to line.edges");
    }

    // Success
    console.debug("testNewMethods() successful");
}

function testAddMethods() {
    /* Test methods for adding existing Graph or GraphElement objects.
     * Errors would come from calling the methods or accessing added objects.
     * Other tests ensure that the objects' properties are correctly set.
     *
     * Trivia:
     * San Francisco's Market Street Subway is very heavily interlined.
     * Its 4 stations serve the same 4 MUNI and 4 BART lines.
     */

    // Create objects assuming successful testNewMethods()
    let sf = new Project("San Francisco");
    let muni = sf.newSystem("MUNI");
    let nLine = muni.newLine("N Judah");
    let embarcadero = nLine.newStation("Embarcadero");
    let montgomery = nLine.newStation("Montgomery Street");
    let mktStSubway = nLine.newEdge(embarcadero, montgomery, "Market Street Subway");

    // Arrays are correctly set
    let anotherMuni= sf.newSystem("Another MUNI");
    anotherMuni.addLine(nLine);
    if (!anotherMuni.lines.includes(nLine)) {
        throw new Error("addLine() did not push line to system.lines");
    }
    let bart = sf.newSystem("BART");
    let blue = bart.newLine("Blue Line");
    blue.addNode(embarcadero);
    blue.addNode(montgomery);
    if (!(blue.nodes.includes(embarcadero) && blue.nodes.includes(montgomery))) {
        throw new Error("addNode() did not push node to line.nodes");
    }
    blue.addEdge(mktStSubway);
    if (!blue.nodes.includes(mktStSubway)) {
        throw new Error("addEdge() did not push node to line.nodes");
    }

    // Success
    console.debug("testAddMethods() successful");
}

function testNameGen() {
    /* Test that names are generated (or omitted) if not provided.
     * When generated, test that they increment project-wide.
     */

    // Nameless graphs & stations get a generated name
    let noNameProj = new Project();
    let noNameSystem = noNameProj.newSystem();
    let noNameLine = noNameSystem.newLine();
    let noNameStn = noNameLine.newStation();
    if (noNameProj.name !== defaultProjName) {
        throw new Error("Nameless project did not take defaultProjName");
    }
    if (noNameSystem.name !== "System 1") {
        throw new Error("Nameless system did not take on generated name");
    }
    if (noNameLine.name !== "Line 1") {
        throw new Error("Nameless line did not take on generated name");
    }
    if (noNameStn.name !== "Station 1") {
        throw new Error("Nameless station did not take on generated name");
    }

    // Generated names increment project-wide
    let anotherSystem = noNameProj.newSystem();
    let anotherLine = anotherSystem.newLine();
    let anotherStn = anotherLine.newStation();
    if (anotherSystem.name !== "System 2") {
        throw new Error("Generated system names do not increment");
    }
    if (anotherLine.name !== "Line 2") {
        throw new Error("Generated line names do not increment");
    }
    if (anotherStn.name !== "Station 2") {
        throw new Error("Generated station names do not increment");
    }

    // Nameless nodes & edges don't get a name
    let noNameNode = noNameLine.newNode();
    let noNameEdge = noNameLine.newEdge(noNameStn, noNameNode);
    if (noNameNode.name) {
        throw new Error("Nameless node did not omit name");
    }
    if (noNameEdge.name) {
        throw new Error("Nameless edge did not omit name");
    }

    // Generated names become available on object removal
    noNameLine.removeNode(noNameStn);
    let replaceStn = noNameLine.newStation();
    if (replaceStn.name !== "Station 1") {
        throw new Error("Generated names do not become available on object removal");
    }
    let yetAnotherStn = noNameLine.newStation();
    if (yetAnotherStn.name !== "Station 3") {
        throw new Error("Generated names do not skip existing names");
    }

    // Success
    console.debug("testGivenNames() successful");
}

function testGivenNames() {
    /* Test that object names are kept when given.
     * Make sure duplicate given names are allowed.
     *
     * Trivia:
     * Many subway stations in Manhattan have the same street number.
     * We can use them to make sure duplicated names are allowed here.
     */

    // Given names are accepted
    let nyc = new Project("New York City");
    let subway = nyc.newSystem("NYC Subway");
    let broadway = subway.newLine("Broadway and 7th Avenue Avenue Line");
    let junction = broadway.newNode("96th Street Junction");
    let st96 = broadway.newStation("96th Street Station");
    let track = broadway.newEdge(junction, st96, "A Section of Track");
    if (nyc.name !== "New York City") {
        throw new Error("Project does not take on given name");
    }
    if (subway.name !== "NYC Subway") {
        throw new Error("System does not take on given name");
    }
    if (broadway.name !== "Broadway and 7th Avenue Avenue Line") {
        throw new Error("Line does not take on given name");
    }
    if (junction.name !== "96th Street Junction") {
        throw new Error("Node does not take on given name");
    }
    if (st96.name !== "96th Street Station") {
        throw new Error("Station does not take on given name");
    }
    if (track.name !== "A Section of Track") {
        throw new Error("Edge does not take on given name");
    }

    // Duplicate names are accepted
    let lexington = subway.newLine("Lexington Avenue Line");
    let anotherSt96;
    try {
        // Make a station with the same name as an existing station
        anotherSt96 = lexington.newStation("96th Street Station");
    } catch {
        // Error given when making the same-name station
        throw new Error("Duplicate station names are not accepted but should be");
    }
    if (anotherSt96.name !== st96.name) {
        // One of the station names changed
        throw new Error("Duplicate station names are not accepted but should be");
    }

    // Success
    console.debug("testGivenNames() successful");
}

function testIds() {
    /* Test that object IDs increment by 1 project-wide.
     * They also aren't made available on removal.
     */

    // IDs increment by 1 each time
    let myProj = new Project("My Project");
    let mySystem = myProj.newSystem("My System");
    let myLine = mySystem.newLine("My Line");
    let myNode = myLine.newNode("My Node");
    let myStn = myLine.newStation("My Station");
    let myEdge = myLine.newEdge(myNode, myStn, "My Edge");
    let arr = [myProj, mySystem, myLine, myNode, myStn, myEdge];
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].id !== i) {
            throw new Error("Object IDs do not increment by 1 each time");
        }
    }

    // IDs do not become available on removal
    let myStnId = myStn.id;
    myLine.removeNode(myStn);
    let anotherStn = myLine.newStation();
    if (anotherStn.id === myStnId) {
        throw new Error("Object IDs are made available on removal but should not");
    }

    // Success
    console.debug("testIds() successful")
}

// Test for enforcement of graph properties

function testSimpleGraph() {
    /* Ensure that simple graphs are enforced by new methods.
     *
     * Trivia:
     * London Underground's Kennington loop connects a station to itself.
     * Simple graphs are enforced here, so this is not possible for edges.
     */

    // Test for graph loops
    let london = new Project("London");
    let northern = london.newSystem("London Underground").newLine("Northern Line");
    let kennington = northern.newStation("Kennington");
    let tryError;
    try {
        let loop = northern.newEdge(kennington, kennington);
        tryError = false;
    } catch {
        tryError = true;
    }
    if (!tryError) {
        throw new Error(`Can create edge with headNode same as tailNode when this should not be possible`)
    }

    // Test duplicate edges
    let waterloo = northern.newStation("Waterloo");
    let someEdge = northern.newEdge(waterloo, kennington);
    try {
        let dupeEdge = northern.newEdge(kennington, waterloo);
        tryError = false;
    } catch {
        tryError = true;
    }
    if (!tryError) {
        throw new Error(`Can create duplicate edge when this should not be possible`);
    }

    // Success
    console.debug("testSimpleGraph() successful");
}

// Run the unit tests

testProject();
testSystem();
testLine();
testNode();
testStation();
testEdge();

testNewMethods();
testAddMethods();
testNameGen();
testGivenNames();
testIds();

testSimpleGraph();

// Finally...
console.log("Unit tests passed for topology.js");
