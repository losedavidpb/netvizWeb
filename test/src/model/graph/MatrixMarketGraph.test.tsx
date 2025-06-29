import { test, expect } from 'vitest';
import * as fs from 'fs';
import path from 'path';

import { MatrixMarketGraph } from '../../../../src/model/graph/MatrixMarketGraph';
import { Vertex } from '../../../../src/model/Vertex';
import { Config } from '../../../../src/Config';
import { Graph } from '../../../../src/model/Graph';

// --------------------------------------
// Test Configuration
// --------------------------------------

// Enable testing to avoid WebGL checks
Config.testMode = true;

const CASES_WORKPLACE = path.join(__dirname, '../../../cases');
const MATRIX_MARKET_PATH = path.join(CASES_WORKPLACE, 'matrix_market/');

// Get the content of the file
function get_content(filePath: string): string {
    return fs.readFileSync(filePath, 'utf-8').trim();
}

// Load the graph to be tested
function load_test_graph(content: string): MatrixMarketGraph {
    return new MatrixMarketGraph(content);
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

// Default error message
function error_message(): string {
    return (
        "MatrixMarket :: Sorry, this application only supports graphs that are:\n" +
        "\tMatrix Market type: [coordinate][pattern][symmetric]\n" +
        "\tand not: [integer]\n"
    );
}

// Prepare the edges so links are sorted
function parse_edges(content: string): string[] {
    return content
        .split(/\r?\n/)
        .slice(2)
        .filter(line => line.trim() !== '')
        .map(line => {
            const [a, b] = line.trim().split(/\s+/).map(Number);
            const u = Math.min(a, b);
            const v = Math.max(a, b);
            return `${u} ${v}`;
        })
        .sort();
}

// --------------------------------------
// toString
// --------------------------------------

test('MatrixMarketGraph::toString(): 6 edges', () => {
    const filePath = path.join(MATRIX_MARKET_PATH, 'test_mm_6.mtx');
    const content = get_content(filePath);
    const graph = load_test_graph(content);

    const expected = parse_edges(content);
    const actual = parse_edges(graph.toString());

    expect(actual).toEqual(expected);
});

test('MatrixMarketGraph::toString(): 10 edges', () => {
    const filePath = path.join(MATRIX_MARKET_PATH, 'test_mm_10.mtx');
    const content = get_content(filePath);
    const graph = load_test_graph(content);

    const expected = parse_edges(content);
    const actual = parse_edges(graph.toString());

    expect(actual).toEqual(expected);
});

// --------------------------------------
// Read
// --------------------------------------

test('MatrixMarketGraph::read() : Empty graph', () => {
    const filePath = path.join(MATRIX_MARKET_PATH, 'test_mm_empty.mtx');
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

test('MatrixMarketGraph::read() : No Coordinate', () => {
    const filePath = path.join(MATRIX_MARKET_PATH, 'test_mm_no_coordinate.mtx');
    const content = fs.readFileSync(filePath, 'utf-8').trim();

    expect(() => { new MatrixMarketGraph(content); }).toThrow(error_message());
});

test('MatrixMarketGraph::read() : No Pattern', () => {
    const filePath = path.join(MATRIX_MARKET_PATH, 'test_mm_no_pattern.mtx');
    const content = fs.readFileSync(filePath, 'utf-8').trim();

    expect(() => { new MatrixMarketGraph(content); }).toThrow(error_message());
});

test('MatrixMarketGraph::read() : No Symmetric', () => {
    const filePath = path.join(MATRIX_MARKET_PATH, 'test_mm_no_symmetric.mtx');
    const content = fs.readFileSync(filePath, 'utf-8').trim();

    expect(() => { new MatrixMarketGraph(content); }).toThrow(error_message());
});

test('MatrixMarketGraph::read() : 6 edges', () => {
    const filePath = path.join(MATRIX_MARKET_PATH, 'test_mm_6.mtx');
    const graph = load_test_graph(get_content(filePath));
    let lastVertexNumber = Vertex.getLastVertexNumber();

    // Expected Adjacency Matrix
    const expectedAdjacencyMatrix = [
        [0, 1, 1, 1], [1, 0, 1, 1],
        [1, 1, 0, 1], [1, 1, 1, 0]
    ];

    // Expected vertices
    const expectedVertices = [
        new Vertex(0, 0, 0), new Vertex(0, 0, 0),
        new Vertex(0, 0, 0), new Vertex(0, 0, 0)
    ];

    for (let k = expectedVertices.length - 1; k >= 0; k--) {
        expectedVertices[k].setVertexNumber(lastVertexNumber--);
    }

    attach_point(expectedVertices[0], expectedVertices[1]);
    attach_point(expectedVertices[0], expectedVertices[3]);
    attach_point(expectedVertices[2], expectedVertices[0]);
    attach_point(expectedVertices[2], expectedVertices[1]);
    attach_point(expectedVertices[2], expectedVertices[3]);
    attach_point(expectedVertices[3], expectedVertices[1]);

    // Expected edges
    const expectedEdges = [
        [0, 1], [0, 2], [0, 3],
        [1, 2], [1, 3], [2, 3]
    ];

    test_graph(graph, expectedAdjacencyMatrix, expectedVertices, expectedEdges);
});

test('MatrixMarketGraph::read() : 10 edges', () => {
    const filePath = path.join(MATRIX_MARKET_PATH, 'test_mm_10.mtx');

    const graph = load_test_graph(get_content(filePath));
    let lastVertexNumber = Vertex.getLastVertexNumber();

    // Expected Adjacency Matrix
    const expectedAdjacencyMatrix = [
        [0, 1, 1, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 1, 1, 0, 0, 0, 0, 0],
        [1, 0, 0, 0, 0, 1, 0, 0, 0, 0],
        [0, 1, 0, 0, 0, 0, 1, 0, 0, 0],
        [0, 1, 0, 0, 0, 0, 0, 1, 0, 0],
        [0, 0, 1, 0, 0, 0, 0, 0, 1, 0],
        [0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
        [0, 0, 0, 0, 1, 0, 0, 0, 1, 0],
        [0, 0, 0, 0, 0, 1, 0, 1, 0, 1],
        [1, 0, 0, 0, 0, 0, 1, 0, 1, 0],
    ];

    // Expected vertices
    const expectedVertices = [
        new Vertex(0, 0, 0), new Vertex(0, 0, 0),
        new Vertex(0, 0, 0), new Vertex(0, 0, 0),
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
    attach_point(expectedVertices[1], expectedVertices[4]);
    attach_point(expectedVertices[2], expectedVertices[5]);
    attach_point(expectedVertices[3], expectedVertices[6]);
    attach_point(expectedVertices[4], expectedVertices[7]);
    attach_point(expectedVertices[5], expectedVertices[8]);
    attach_point(expectedVertices[6], expectedVertices[9]);
    attach_point(expectedVertices[7], expectedVertices[8]);
    attach_point(expectedVertices[8], expectedVertices[9]);
    attach_point(expectedVertices[0], expectedVertices[9]);

    // Expected edges
    const expectedEdges = [
        [0, 1], [0, 2], [0, 9],
        [1, 3], [1, 4], [2, 5],
        [3, 6], [4, 7], [5, 8],
        [6, 9], [7, 8], [8, 9]
    ];

    test_graph(graph, expectedAdjacencyMatrix, expectedVertices, expectedEdges);
});

// --------------------------------------
// fromJSON
// --------------------------------------

test('MatrixMarketGraph::fromJSON(): Valid Graph', async () => {
    const filePath = path.join(MATRIX_MARKET_PATH, 'test_mm_6.mtx');
    const graph = load_test_graph(get_content(filePath));
    const object = graph.toJSON() as any;

    const graph_obj = await Graph.fromJSON(object);

    expect(graph_obj instanceof MatrixMarketGraph).toBe(true);
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