import { test, expect } from 'vitest';
import * as fs from 'fs';
import path from 'path';

import { AdjacencyGraph } from '../../../../src/model/graph/AdjacencyGraph';
import { Vertex } from '../../../../src/model/Vertex';
import { Graph } from '../../../../src/model/Graph';

// --------------------------------------
// Test Configuration
// --------------------------------------

const CASES_WORKPLACE = path.join(__dirname, '../../../cases');
const ADJACENCY_PATH = path.join(CASES_WORKPLACE, 'adjacency/');

// Get the content of the file
function get_content(filePath: string): string {
    return fs.readFileSync(filePath, 'utf-8').trim();
}

// Load the graph to be tested
function load_test_graph(content: string): AdjacencyGraph {
    return new AdjacencyGraph(content);
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

// --------------------------------------
// toString
// --------------------------------------

test('AdjacencyGraph::toString(): 1x1 Graph', () => {
    const filePath = path.join(ADJACENCY_PATH, 'test_adj_1x1.txt');
    const content = get_content(filePath);
    const graph = load_test_graph(content);

    expect(graph.toString()).toBe(content);
});

test('AdjacencyGraph::toString(): 3x3 Graph', () => {
    const filePath = path.join(ADJACENCY_PATH, 'test_adj_3x3.txt');
    const content = get_content(filePath);
    const graph = load_test_graph(content);

    expect(graph.toString()).toBe(content);
});

test('AdjacencyGraph::toString(): 6x6 Graph', () => {
    const filePath = path.join(ADJACENCY_PATH, 'test_adj_6x6.txt');
    const content = get_content(filePath);
    const graph = load_test_graph(content);

    expect(graph.toString()).toBe(content);
});

// --------------------------------------
// Read
// --------------------------------------

test('AdjacencyGraph::read() : Empty graph', () => {
    const filePath = path.join(ADJACENCY_PATH, 'test_adj_empty.txt');
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

test('AdjacencyGraph::read() : Matrix 1x1', () => {
    const filePath = path.join(ADJACENCY_PATH, 'test_adj_1x1.txt');
    const graph = load_test_graph(get_content(filePath));
    let lastVertexNumber = Vertex.getLastVertexNumber();

    // Expected Adjacency Matrix
    const expectedAdjacencyMatrix: number[][] = [[0]];

    // Expected Vertices
    const expectedVertices = [new Vertex(0, 0, 0)];

    for (let k = expectedVertices.length - 1; k >= 0; k--) {
        expectedVertices[k].setVertexNumber(lastVertexNumber--);
    }

    // Expected Edges
    const expectedEdges: [number, number][] = [];

    test_graph(graph, expectedAdjacencyMatrix, expectedVertices, expectedEdges);
});

test('AdjacencyGraph::read() : Non-simetric Matrix with invalid ncols', () => {
    const filePath = path.join(ADJACENCY_PATH, 'test_adj_invalid_ncol.txt');
    const content = fs.readFileSync(filePath, 'utf-8').trim();

    expect(() => { new AdjacencyGraph(content) }).toThrow(
        "InvalidAdjacencyMatrix :: Adjacency Matrix must be simetric"
    );
});

test('AdjacencyGraph::read() : Non-simetric Matrix with invalid nrows', () => {
    const filePath = path.join(ADJACENCY_PATH, 'test_adj_invalid_nrow.txt');
    const content = fs.readFileSync(filePath, 'utf-8').trim();

    expect(() => { new AdjacencyGraph(content) }).toThrow(
        "InvalidAdjacencyMatrix :: Adjacency Matrix must be simetric"
    );
});

test('AdjacencyGraph::read() : Matrix with invalid values', () => {
    const filePath = path.join(ADJACENCY_PATH, 'test_adj_invalid_values.txt');
    const content = fs.readFileSync(filePath, 'utf-8').trim();

    expect(() => { new AdjacencyGraph(content) }).toThrow(
        "InvalidAdjacencyMatrix :: Adjacency Matrix must have binary values"
    );
});

test('AdjacencyGraph::read() : Matrix 3x3', () => {
    const filePath = path.join(ADJACENCY_PATH, 'test_adj_3x3.txt');
    const graph = load_test_graph(get_content(filePath));
    let lastVertexNumber = Vertex.getLastVertexNumber();

    // Expected Adjacency Matrix
    const expectedAdjacencyMatrix = [
        [0, 1, 1], [1, 0, 0], [1, 0, 0],
    ];

    // Expected Vertices
    const expectedVertices = [
        new Vertex(0, 0, 0), new Vertex(0, 0, 0), new Vertex(0, 0, 0),
    ];

    for (let k = expectedVertices.length - 1; k >= 0; k--) {
        expectedVertices[k].setVertexNumber(lastVertexNumber--);
    }

    attach_point(expectedVertices[0], expectedVertices[1]);
    attach_point(expectedVertices[0], expectedVertices[2]);

    // Expected Edges
    const expectedEdges = [
        [0, 1], [0, 2],
    ];

    test_graph(graph, expectedAdjacencyMatrix, expectedVertices, expectedEdges);
});

test('AdjacencyGraph::read() : Matrix 6x6', () => {
    const filePath = path.join(ADJACENCY_PATH, 'test_adj_6x6.txt');
    const graph = load_test_graph(get_content(filePath));
    let lastVertexNumber = Vertex.getLastVertexNumber();

    // Expected Adjacency Matrix
    const expectedAdjacencyMatrix = [
        [0, 1, 1, 0, 0, 0], [1, 0, 0, 1, 0, 0],
        [1, 0, 0, 1, 1, 0], [0, 1, 1, 0, 0, 1],
        [0, 0, 1, 0, 0, 1], [0, 0, 0, 1, 1, 0],
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

    attach_point(expectedVertices[0], expectedVertices[1]);
    attach_point(expectedVertices[0], expectedVertices[2]);
    attach_point(expectedVertices[1], expectedVertices[3]);
    attach_point(expectedVertices[2], expectedVertices[3]);
    attach_point(expectedVertices[2], expectedVertices[4]);
    attach_point(expectedVertices[3], expectedVertices[5]);
    attach_point(expectedVertices[4], expectedVertices[5]);

    // Expected edges
    const expectedEdges = [
        [0, 1], [0, 2], [1, 3], [2, 3],
        [2, 4], [3, 5], [4, 5]
    ];

    test_graph(graph, expectedAdjacencyMatrix, expectedVertices, expectedEdges);
});

// --------------------------------------
// fromJSON
// --------------------------------------

test('AdjacencyGraph::fromJSON(): Valid Graph', async () => {
    const filePath = path.join(ADJACENCY_PATH, 'test_adj_6x6.txt');
    const graph = load_test_graph(get_content(filePath));
    const object = graph.toJSON() as any;

    const graph_obj = await Graph.fromJSON(object);

    expect(graph_obj instanceof AdjacencyGraph).toBe(true);
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