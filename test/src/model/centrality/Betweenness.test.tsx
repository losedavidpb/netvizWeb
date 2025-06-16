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

// Enable testing to avoid WebGL checks
Graph.testMode = true;

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

function load_test_graph(filePath: string): Graph {
    const content = fs.readFileSync(filePath, 'utf-8').trim();
    return new AdjacencyGraph(content);
}

// --------------------------------------
// apply
// --------------------------------------

function attach_point(v0: Vertex, v1: Vertex): void {
    v0.attachPoint(v1);
    v0.updateDegree();
    v1.updateDegree();
}

function set_colour(expectedVertices: Vertex[], i: number, h: number, s: number, v: number): void {
    const [r, g, b] = MockupBetweenness.HSVtoRGB(h, s, v);
    expectedVertices[i].setColour(r, g, b);
}

test('Betweenness::apply() : Empty graph', () => {
    const filePath = path.join(DEGREE_CENTRALITY, 'test_betweenness_empty.txt');
    fs.writeFileSync(filePath, '');

    const centrality = new MockupBetweenness();

    const graph = load_test_graph(filePath);
    centrality.apply(graph);

    // Expected Vertices
    const expectedVertices: Vertex[] = [];

    expect(graph.getVertices()).toStrictEqual(expectedVertices);
});

test('Betweenness::apply() : 1x1 graph', () => {
    const filePath = path.join(DEGREE_CENTRALITY, 'test_betweenness_1x1.txt');

    const centrality = new MockupBetweenness();

    const graph = load_test_graph(filePath);
    centrality.apply(graph);

    // Expected Vertices
    const expectedVertices: Vertex[] = [new Vertex(0, 0, 0)];
    set_colour(expectedVertices, 0, 240, 1, 1);

    expect(graph.getVertices().length).toBe(expectedVertices.length);
    expect(graph.getVertices()).toStrictEqual(expectedVertices);
});

test('Betweenness::apply() : 3x3 graph', () => {
    const filePath = path.join(DEGREE_CENTRALITY, 'test_betweenness_3x3.txt');

    const centrality = new MockupBetweenness();

    const graph = load_test_graph(filePath);
    centrality.apply(graph);

    // Expected Vertices
    const expectedVertices: Vertex[] = [
        new Vertex(0, 0, 0), new Vertex(0, 0, 0), new Vertex(0, 0, 0)
    ];

    attach_point(expectedVertices[0], expectedVertices[1]);
    attach_point(expectedVertices[0], expectedVertices[2]);

    set_colour(expectedVertices, 0, 0, 1, 1);
    set_colour(expectedVertices, 1, 240, 1, 1);
    set_colour(expectedVertices, 2, 240, 1, 1);

    expect(graph.getVertices().length).toBe(expectedVertices.length);
    expect(graph.getVertices()).toStrictEqual(expectedVertices);
});
