import { test, expect } from 'vitest';
import * as THREE from 'three';

import { Graph } from '../../../src/model/Graph';
import { Config } from '../../../src/Config';
import { Vertex } from '../../../src/model/Vertex';

// --------------------------------------
// Test Configuration
// --------------------------------------

// Enable testing to avoid WebGL checks
Config.testMode = true;

// Mockup graph to test non-abstract methods
class MockGraph extends Graph {

    constructor(filePath?: string, vertices?: Vertex[]) {
        super(filePath);

        if (vertices !== undefined) {
            this.vertices = vertices;
        }
    }

    toString(): string { return ''; }

    protected read(_: string): void {
        // ...
    }
}

// --------------------------------------
// Split
// --------------------------------------

test('Graph::split() : Empty String', () => {
    const tokens = Graph.split('');
    expect(tokens.length).toBe(0);
});

test('Graph::split() : One Number', () => {
    const tokens = Graph.split(' 1 ');
    expect(tokens.length).toBe(1);
    expect(tokens[0]).toBe(1);
});

test('Graph::split() : Several Numbers', () => {
    const tokens = Graph.split(' 1 2 3 4 5 6');
    const expected = [1, 2, 3, 4, 5, 6];

    expect(tokens.length).toBe(6);

    for (let i = 0; i < tokens.length; i++) {
        expect(tokens[i]).toBe(expected[i]);
    }
});

test('Graph::split() : Invalid Numbers', () => {
    expect(() => {
        Graph.split(' 1 2 a 4 5 6');
    }).toThrow(
        "InvalidToken: 'a' is not a number"
    );
});

// --------------------------------------
// Hash
// --------------------------------------

test('Graph::hash() : Valid Hash', () => {
    const [h1, h2, h3] = [1, 2, 3];
    const expected = ((h1 * 2654435789) + h2) * 2654435789 + h3;

    expect(Graph.hash(h1, h2, h3)).toBe(expected);
});

test('Graph::hash() : Two Different Hash Codes', () => {
    expect(Graph.hash(1, 2, 3)).not.toBe(Graph.hash(3, 2, 1));
});

// --------------------------------------
// Get Bounding Box
// --------------------------------------

test('Graph::getBoundingBox(): Valid Position', () => {
    const vertices = [
        new Vertex(1, 2, 3),
        new Vertex(-1, -2, -3),
        new Vertex(5, 0, 1),
    ];

    const graph = new MockGraph(undefined, vertices);
    const box = graph.getBoundingBox();

    expect(box.min).toEqual(new THREE.Vector3(-1, -2, -3));
    expect(box.max).toEqual(new THREE.Vector3(5, 2, 3));
});

// --------------------------------------
// Vertices
// --------------------------------------

test('Graph::getVertices() : Default Vertices', () => {
    let graph = new MockGraph();

    const vertices = graph.getVertices();
    expect(vertices.length).toBe(0);
});

// --------------------------------------
// Edges
// --------------------------------------

test('Graph::getEdges() : Default Edges', () => {
    let graph = new MockGraph();

    const edges = graph.getEdges();
    expect(edges.length).toBe(0);
});

// --------------------------------------
// AdjacencyMatrix
// --------------------------------------

test('Graph::getAdjacencyMatrix() : Default Adjaceny Matrix', () => {
    let graph = new MockGraph();

    const adjacencyMatrix = graph.getAdjacencyMatrix();
    expect(adjacencyMatrix.length).toBe(0);
});

// --------------------------------------
// toJSON
// --------------------------------------

test('Graph::toJSON(): Valid Graph', () => {
    const graph = new MockGraph();
    const object = graph.toJSON() as any;

    expect(object.type).toBe('MockGraph');
    expect(object.edges).toStrictEqual(graph.getEdges());
    expect(object.adjacencyMatrix).toStrictEqual(graph.getAdjacencyMatrix());

    for (let i = 0; i < graph.getNumVertices(); i++) {
        const vertex = graph.getVertices()[i];
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