import { test, expect } from 'vitest';
import * as fs from 'fs';
import path from 'path';

import { Graph } from '../../../../src/model/Graph';
import { AdjacencyGraph } from '../../../../src/model/graph/AdjacencyGraph';
import { Betweenness } from '../../../../src/model/centrality/Betweenness';
import { Vertex } from '../../../../src/model/Vertex';
import { Centrality } from '../../../../src/model/Centrality';

// --------------------------------------
// Test Configuration
// --------------------------------------

const CASES_WORKPLACE = path.join(__dirname, '../../../cases');
const DEGREE_CENTRALITY = path.join(CASES_WORKPLACE, 'betweenness/');

// Mockup graph to have access to protected methods
class MockupBetweenness extends Centrality {
    static HSVtoRGB(h: number, s: number, v: number): [r: number, g: number, b: number] {
        return Centrality.HSVtoRGB(h, s, v);
    }

    static normalize(x: number, max: number, min: number): number {
        return Centrality.normalize(x, max, min);
    }

    apply(graph: Graph): void {
        new Betweenness().apply(graph);
    }
}

// Load the graph to be tested
function load_test_graph(filePath: string): Graph {
    const content = fs.readFileSync(filePath, 'utf-8').trim();
    return new AdjacencyGraph(content);
}

// Check whether the vertices are as expected
function test_vertices(graph: Graph, expected: Vertex[]): void {
    expect(graph.getVertices().length).toBe(expected.length);

    graph.getVertices().forEach((v, i) => {
        expect(v.equals(expected[i])).toBe(true);
    });
}

// Attach the point to the first vertex
function attach_point(v0: Vertex, v1: Vertex): void {
    v0.attachPoint(v1);
    v0.updateDegree();
    v1.updateDegree();
}

// Set the expected colour of the vertex
function set_colour(expected: Vertex[], i: number, h: number, s: number, v: number): void {
    const [r, g, b] = MockupBetweenness.HSVtoRGB(h, s, v);
    expected[i].setColour(r, g, b);
}

// --------------------------------------
// apply
// --------------------------------------

test('Betweenness::apply() : Empty graph', () => {
    const filePath = path.join(DEGREE_CENTRALITY, 'test_betweenness_empty.txt');
    fs.writeFileSync(filePath, '');

    const centrality = new MockupBetweenness();

    const graph = load_test_graph(filePath);
    centrality.apply(graph);

    // Expected Vertices
    const expectedVertices: Vertex[] = [];

    test_vertices(graph, expectedVertices);
});

test('Betweenness::apply() : 1x1 graph', () => {
    const filePath = path.join(DEGREE_CENTRALITY, 'test_betweenness_1x1.txt');

    const centrality = new MockupBetweenness();

    const graph = load_test_graph(filePath);
    let lastVertexNumber = Vertex.getLastVertexNumber();

    centrality.apply(graph);

    // Expected Vertices
    const expectedVertices: Vertex[] = [new Vertex(0, 0, 0)];

    for (let k = expectedVertices.length - 1; k >= 0; k--) {
        expectedVertices[k].setVertexNumber(lastVertexNumber--);
    }

    set_colour(expectedVertices, 0, 240, 1, 1);

    test_vertices(graph, expectedVertices);
});

test('Betweenness::apply() : 3x3 graph', () => {
    const filePath = path.join(DEGREE_CENTRALITY, 'test_betweenness_3x3.txt');

    const centrality = new MockupBetweenness();

    const graph = load_test_graph(filePath);
    let lastVertexNumber = Vertex.getLastVertexNumber();

    centrality.apply(graph);

    // Expected Vertices
    const expectedVertices: Vertex[] = [
        new Vertex(0, 0, 0), new Vertex(0, 0, 0), new Vertex(0, 0, 0)
    ];

    for (let k = expectedVertices.length - 1; k >= 0; k--) {
        expectedVertices[k].setVertexNumber(lastVertexNumber--);
    }

    attach_point(expectedVertices[0], expectedVertices[1]);
    attach_point(expectedVertices[0], expectedVertices[2]);

    set_colour(expectedVertices, 0, 0, 1, 1);
    set_colour(expectedVertices, 1, 240, 1, 1);
    set_colour(expectedVertices, 2, 240, 1, 1);

    test_vertices(graph, expectedVertices);
});
