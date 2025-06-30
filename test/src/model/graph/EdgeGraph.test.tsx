import { test, expect } from 'vitest';
import * as fs from 'fs';
import path from 'path';

import { EdgeGraph } from '../../../../src/model/graph/EdgeGraph';
import { Vertex } from '../../../../src/model/Vertex';
import { Graph } from '../../../../src/model/Graph';

// --------------------------------------
// Test Configuration
// --------------------------------------

const CASES_WORKPLACE = path.join(__dirname, '../../../cases');
const EDGE_PATH = path.join(CASES_WORKPLACE, 'edge_links/');

// Get the content of the file
function get_content(filePath: string): string {
    return fs.readFileSync(filePath, 'utf-8').trim();
}

// Load the graph to be tested
function load_test_graph(content: string): EdgeGraph {
    return new EdgeGraph(content);
}

// Check whether the vertices are as expected
function test_graph(graph: Graph, expected_adj: number[][], expected_v: Vertex[], expected_edg: number[][]): void {
    expect(graph.getAdjacencyMatrix()).toStrictEqual(expected_adj);

    expect(graph.getNumEdges()).toBe(expected_edg.length);
    expect(graph.getEdges()).toStrictEqual(expected_edg);

    expect(graph.getVertices().length).toBe(expected_v.length);

    graph.getVertices().forEach((v, i) => {
        expect(v.equals(expected_v[i])).toBe(true);
    });
}

// Attach the point to the first vertex
function attach_point(v0: Vertex, v1: Vertex): void {
    v0.attachPoint(v1);
    v0.updateDegree();
    v1.updateDegree();
}

// Prepare the edges so links are sorted
function parse_edges(content: string): string[] {
    return content
        .split(/\r?\n/)
        .filter(line => line.trim() !== '')
        .map(line => {
            const [a, b] = line.trim().split(/\s+/).map(Number);
            return a < b ? `${a} ${b}` : `${b} ${a}`;
        })
        .sort();
}

// --------------------------------------
// Constructor
// --------------------------------------

test('EdgeGraph::constructor() : Cannot define both parameters', () => {
    expect(() => { new EdgeGraph('', []) }).toThrow(
        "InvalidParams :: Cannot define both params"
    );
});

test('EdgeGraph::constructor() : Edges of more than two vertices', () => {
    const newEdgeList = [[0, 2], [1, 0, 3], [2, 1]];

    expect(() => { new EdgeGraph(undefined, newEdgeList) }).toThrow(
        "InvalidEdge :: Edges can only have two linked vertices"
    );
});

test('EdgeGraph::constructor() : Graph is defined with EdgeList', () => {
    const newEdgeList = [ [0, 2], [1, 0], [2, 1] ];
    const graph = new EdgeGraph(undefined, newEdgeList);
    let lastVertexNumber = Vertex.getLastVertexNumber();

    // Expected Adjacency Matrix
    const expectedAdjacencyMatrix = [
        [0, 1, 1], [1, 0, 1], [1, 1, 0],
    ];

    // Expected Vertices
    const expectedVertices = [
        new Vertex(0, 0, 0), new Vertex(0, 0, 0), new Vertex(0, 0, 0),
    ];

    for (let k = expectedVertices.length - 1; k >= 0; k--) {
        expectedVertices[k].setVertexNumber(lastVertexNumber--);
    }

    attach_point(expectedVertices[0], expectedVertices[2]);
    attach_point(expectedVertices[1], expectedVertices[0]);
    attach_point(expectedVertices[2], expectedVertices[1]);

    // Expected Edges
    const expectedEdges = [
        [0, 1], [0, 2], [1, 2]
    ];

    test_graph(graph, expectedAdjacencyMatrix, expectedVertices, expectedEdges);
});

// --------------------------------------
// toString
// --------------------------------------

test('EdgeGraph::toString(): 3 edges', () => {
    const filePath = path.join(EDGE_PATH, 'test_edg_3.txt');
    const content = get_content(filePath);
    const graph = load_test_graph(content);

    const expectedEdges = parse_edges(content);
    const actualEdges = parse_edges(graph.toString());

    expect(actualEdges).toEqual(expectedEdges);
});

test('EdgeGraph::toString(): 6 edges', () => {
    const filePath = path.join(EDGE_PATH, 'test_edg_6.txt');
    const content = get_content(filePath);
    const graph = load_test_graph(content);

    const expectedEdges = parse_edges(content);
    const actualEdges = parse_edges(graph.toString());

    expect(actualEdges).toEqual(expectedEdges);
});

// --------------------------------------
// Read
// --------------------------------------

test('EdgeGraph::read() : Empty graph', () => {
    const filePath = path.join(EDGE_PATH, 'test_edg_empty.txt');
    fs.writeFileSync(filePath, '');

    const graph = load_test_graph(get_content(filePath));

    // Expected Adjacency Matrix
    const expectedAdjacencyMatrix: number[][] = [];

    // Expected Vertices
    const expectedVertices: Vertex[] = [];

    // Expected Edges
    const expectedEdges: [number, number][] = [];

    test_graph(graph, expectedAdjacencyMatrix, expectedVertices, expectedEdges);
});

test('EdgeGraph::read() : Edges of more than two vertices', () => {
    const filePath = path.join(EDGE_PATH, 'test_edg_invalid_ncol.txt');
    const content = fs.readFileSync(filePath, 'utf-8').trim();

    expect(() => { new EdgeGraph(content) }).toThrow(
        "InvalidEdge :: Edges can only have two linked vertices"
    );
});

test('EdgeGraph::read() : Edges with invalid values', () => {
    const filePath = path.join(EDGE_PATH, 'test_edg_invalid_values.txt');
    const content = fs.readFileSync(filePath, 'utf-8').trim();

    expect(() => { new EdgeGraph(content) }).toThrow(
        "InvalidToken: 'a' is not a number"
    );
});

test('EdgeGraph::read() : 3 edges', () => {
    const filePath = path.join(EDGE_PATH, 'test_edg_3.txt');
    const graph = load_test_graph(get_content(filePath));
    let lastVertexNumber = Vertex.getLastVertexNumber();

    // Expected Adjacency Matrix
    const expectedAdjacencyMatrix = [
        [0, 1, 1], [1, 0, 1], [1, 1, 0],
    ];

    // Expected Vertices
    const expectedVertices = [
        new Vertex(0, 0, 0), new Vertex(0, 0, 0), new Vertex(0, 0, 0),
    ];

    for (let k = expectedVertices.length - 1; k >= 0; k--) {
        expectedVertices[k].setVertexNumber(lastVertexNumber--);
    }

    attach_point(expectedVertices[0], expectedVertices[2]);
    attach_point(expectedVertices[1], expectedVertices[0]);
    attach_point(expectedVertices[2], expectedVertices[1]);

    // Expected Edges
    const expectedEdges = [
        [0, 1], [0, 2], [1, 2]
    ];

    test_graph(graph, expectedAdjacencyMatrix, expectedVertices, expectedEdges);
});

test('EdgeGraph::read() : 6 edges', () => {
    const filePath = path.join(EDGE_PATH, 'test_edg_6.txt');
    const graph = load_test_graph(get_content(filePath));
    let lastVertexNumber = Vertex.getLastVertexNumber();

    // Expected Adjacency Matrix
    const expectedAdjacencyMatrix = [
        [0, 1, 1, 1, 1, 0], [1, 0, 1, 0, 0, 1],
        [1, 1, 0, 1, 0, 0], [1, 0, 1, 0, 0, 0],
        [1, 0, 0, 0, 0, 0], [0, 1, 0, 0, 0, 0],
    ];

    // Expected vertices
    const expectedVertices = [
        new Vertex(0, 0, 0), new Vertex(0, 0, 0),
        new Vertex(0, 0, 0), new Vertex(0, 0, 0),
        new Vertex(0, 0, 0), new Vertex(0, 0, 0)
    ];

    for (let k = expectedVertices.length - 1; k >= 0; k--) {
        expectedVertices[k].setVertexNumber(lastVertexNumber--);
    }

    attach_point(expectedVertices[0], expectedVertices[2]);
    attach_point(expectedVertices[1], expectedVertices[0]);
    attach_point(expectedVertices[2], expectedVertices[1]);
    attach_point(expectedVertices[0], expectedVertices[3]);
    attach_point(expectedVertices[3], expectedVertices[2]);
    attach_point(expectedVertices[4], expectedVertices[0]);
    attach_point(expectedVertices[5], expectedVertices[1]);

    // Expected edges
    const expectedEdges = [
        [0, 1], [0, 2], [0, 3], [0, 4],
        [1, 2], [1, 5], [2, 3]
    ];

    test_graph(graph, expectedAdjacencyMatrix, expectedVertices, expectedEdges);
});

// --------------------------------------
// fromJSON
// --------------------------------------

test('EdgeGraph::fromJSON(): Valid Graph', async () => {
    const filePath = path.join(EDGE_PATH, 'test_edg_6.txt');
    const graph = load_test_graph(get_content(filePath));
    const object = graph.toJSON() as any;

    const graph_obj = await Graph.fromJSON(object);

    expect(graph_obj instanceof EdgeGraph).toBe(true);
    expect(object.edges).toStrictEqual(graph_obj.getEdges());
    expect(object.adjacencyMatrix).toStrictEqual(graph_obj.getAdjacencyMatrix());

    for (let i = 0; i < graph_obj.getNumVertices(); i++) {
        const vertex = graph_obj.getVertices()[i];
        const points = vertex.getAttachedPoints();

        expect(object.vertices[i].selected).toBe(vertex.isSelected());

        expect(object.vertices[i].pos.x).toBe(vertex.getPos().x);
        expect(object.vertices[i].pos.y).toBe(vertex.getPos().y);
        expect(object.vertices[i].pos.z).toBe(vertex.getPos().z);

        expect(object.vertices[i].force.x).toBe(vertex.getForce().x);
        expect(object.vertices[i].force.y).toBe(vertex.getForce().y);
        expect(object.vertices[i].force.z).toBe(vertex.getForce().z);

        expect(object.vertices[i].velocity.x).toBe(vertex.getVelocity().x);
        expect(object.vertices[i].velocity.y).toBe(vertex.getVelocity().y);
        expect(object.vertices[i].velocity.z).toBe(vertex.getVelocity().z);

        expect(object.vertices[i].colour.r).toBe(vertex.getColour().r);
        expect(object.vertices[i].colour.g).toBe(vertex.getColour().g);
        expect(object.vertices[i].colour.b).toBe(vertex.getColour().b);

        expect(object.vertices[i].text).toBe(vertex.getText());
        expect(object.vertices[i].level).toBe(vertex.getLevel());
        expect(object.vertices[i].degree).toBe(vertex.getDegree());
        expect(object.vertices[i].vertexNumber).toBe(vertex.getVertexNumber());

        for (let j = 0; j < points.length; j++) {
            expect(object.vertices[i].attachedPoints[j]).toBe(points[j].getVertexNumber());
            expect(object.vertices[i].edges[j].from).toBe(vertex.getVertexNumber());
            expect(object.vertices[i].edges[j].to).toBe(points[j].getVertexNumber());
        }
    }
});