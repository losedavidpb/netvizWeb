import { test, expect } from 'vitest';
import * as fs from 'fs';
import path from 'path';

import { Graph } from '../../../../src/model/Graph';
import { AdjacencyGraph } from '../../../../src/model/graph/AdjacencyGraph';
import { DistanceCentrality } from '../../../../src/model/centrality/DistanceCentrality';
import { Vertex } from '../../../../src/model/Vertex';
import { Centrality } from '../../../../src/model/Centrality';


// --------------------------------------
// Test Configuration
// --------------------------------------

// Enable testing to avoid WebGL checks
Graph.testMode = true;

const CASES_WORKPLACE = path.join(__dirname, '../../../cases');
const DEGREE_CENTRALITY = path.join(CASES_WORKPLACE, 'distance_centrality/');

// Mockup graph to have access to protected methods
class MockupDistanceCentrality extends Centrality {
    static HSVtoRGB(h: number, s: number, v: number): [r: number, g: number, b: number] {
        return Centrality.HSVtoRGB(h, s, v);
    }

    static normalize(x: number, max: number, min: number): number {
        return Centrality.normalize(x, max, min);
    }

    apply(graph: Graph): void {
        new DistanceCentrality().apply(graph);
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

function update_pos(expectedVertices: Vertex[], graph: Graph): void {
    let vertices = graph.getVertices();

    for (let i = 0; i < expectedVertices.length; i++) {
        let pos = expectedVertices[i].getPos();
        vertices[i].setPos({ x: pos.x, y: pos.y, z: pos.z });
    }
}

function set_colour(expectedVertices: Vertex[], i: number, h: number, s: number, v: number): void {
    const [r, g, b] = MockupDistanceCentrality.HSVtoRGB(h, s, v);
    expectedVertices[i].setColour(r, g, b);
}

test('DistanceCentrality::apply() : Empty graph', () => {
    const filePath = path.join(DEGREE_CENTRALITY, 'test_distance_empty.txt');
    fs.writeFileSync(filePath, '');

    const centrality = new MockupDistanceCentrality();
    const graph = load_test_graph(filePath);

    // Expected Vertices
    const expectedVertices: Vertex[] = [];

    centrality.apply(graph);

    expect(graph.getVertices()).toStrictEqual(expectedVertices);
});

test('DistanceCentrality::apply() : 1x1 graph', () => {
    const filePath = path.join(DEGREE_CENTRALITY, 'test_distance_1x1.txt');

    const centrality = new MockupDistanceCentrality();
    const graph = load_test_graph(filePath);

    // Expected Vertices
    const expectedVertices: Vertex[] = [
        new Vertex(3, 2, 10)
    ];

    update_pos(expectedVertices, graph);

    centrality.apply(graph);

    set_colour(expectedVertices, 0, 240, 1, 1);
    expect(graph.getVertices()).toStrictEqual(expectedVertices);
});

test('DistanceCentrality::apply() : 3x3 graph', () => {
    const filePath = path.join(DEGREE_CENTRALITY, 'test_distance_3x3.txt');

    const centrality = new MockupDistanceCentrality();
    const graph = load_test_graph(filePath);

    // Expected Vertices
    const expectedVertices: Vertex[] = [
        new Vertex(3, 4, 5), new Vertex(20, 10, 1), new Vertex(1, 1, 1)
    ];

    attach_point(expectedVertices[0], expectedVertices[1]);
    attach_point(expectedVertices[0], expectedVertices[2]);

    update_pos(expectedVertices, graph);

    centrality.apply(graph);

    set_colour(expectedVertices, 0, 107.04769682475197, 1, 1);
    set_colour(expectedVertices, 1, 0, 1, 1);
    set_colour(expectedVertices, 2, 88.63486878349875, 1, 1);

    expect(graph.getVertices()).toStrictEqual(expectedVertices);
    expect(graph.getVertices().length).toBe(3);
});