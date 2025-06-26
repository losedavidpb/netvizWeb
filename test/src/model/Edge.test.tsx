import { test, expect } from 'vitest';

import { Edge } from "../../../src/model/Edge";
import { Vertex } from "../../../src/model/Vertex";

// --------------------------------------
// Base
// --------------------------------------

test('Vertex::getBase() : Default Base', () => {
    let base = new Vertex(0, 0, 0);
    let connect = new Vertex(0, 0, 0);

    const edge = new Edge(
        base, connect
    );

    expect(edge.getBase()).toBe(base);
});

test('Vertex::setBase() : Valid Base', () => {
    let base = new Vertex(10, 20, 30);
    let connect = new Vertex(0, 0, 0);

    const edge = new Edge(
        new Vertex(0, 0, 0), connect
    );

    edge.setBase(base);
    expect(edge.getBase()).toBe(base);
});

// --------------------------------------
// Connect
// --------------------------------------

test('Vertex::getConnect() : Default Connect', () => {
    let base = new Vertex(0, 0, 0);
    let connect = new Vertex(0, 0, 0);

    const edge = new Edge(
        base, connect
    );

    expect(edge.getConnect()).toBe(connect);
});

test('Vertex::setConnect() : Valid Connect', () => {
    let base = new Vertex(0, 0, 0);
    let connect = new Vertex(10, 20, 30);

    const edge = new Edge(
        base, new Vertex(0, 0, 0)
    );

    edge.setConnect(connect);
    expect(edge.getConnect()).toBe(connect);
});

// --------------------------------------
// Text
// --------------------------------------

test('Edge::getText() : Default Text', () => {
    const edge = new Edge(
        new Vertex(0, 0, 0),
        new Vertex(0, 0, 0)
    );

    const text = edge.getText();
    expect(text).toBe('');
});

test('Edge::getText() : Valid Text', () => {
    const edge = new Edge(
        new Vertex(0, 0, 0),
        new Vertex(0, 0, 0)
    );

    edge.setText('Text to be tested')

    const text = edge.getText();
    expect(text).toBe('Text to be tested');
});

// --------------------------------------
// Colour
// --------------------------------------

test('Edge::getColour() : Default Colour', () => {
    const edge = new Edge(
        new Vertex(0, 0, 0),
        new Vertex(0, 0, 0)
    );

    const colour = edge.getColour();
    expect(colour.r).toBe(1);
    expect(colour.g).toBe(1);
    expect(colour.b).toBe(1);
});

test('Edge::setColour() : Valid RGB', () => {
    const edge = new Edge(
        new Vertex(0, 0, 0),
        new Vertex(0, 0, 0)
    );

    edge.setColour(1, 0.5, 0);

    const colour = edge.getColour();
    expect(colour.r).toBe(1);
    expect(colour.g).toBe(0.5);
    expect(colour.b).toBe(0);
});

test('Edge::setColour() : InvalidR', () => {
    const edge = new Edge(
        new Vertex(0, 0, 0),
        new Vertex(0, 0, 0)
    );

    expect(() => edge.setColour(-1, 1, 1)).toThrow(
        'InvalidRGB :: Passed colour is invalid'
    );

    expect(() => edge.setColour(2, 1, 1)).toThrow(
        'InvalidRGB :: Passed colour is invalid'
    );
});

test('Edge::setColour() : InvalidG', () => {
    const edge = new Edge(
        new Vertex(0, 0, 0),
        new Vertex(0, 0, 0)
    );

    expect(() => edge.setColour(10, -1, 30)).toThrow(
        'InvalidRGB :: Passed colour is invalid'
    );

    expect(() => edge.setColour(10, 2, 30)).toThrow(
        'InvalidRGB :: Passed colour is invalid'
    );
});

test('Edge::setColour() : InvalidG', () => {
    const edge = new Edge(
        new Vertex(0, 0, 0),
        new Vertex(0, 0, 0)
    );

    expect(() => edge.setColour(10, 20, -1)).toThrow(
        'InvalidRGB :: Passed colour is invalid'
    );

    expect(() => edge.setColour(10, 20, 2)).toThrow(
        'InvalidRGB :: Passed colour is invalid'
    );
});

// --------------------------------------
// Clone
// --------------------------------------

test('Edge::clone() : Valid Edge', () => {
    const vertex_1 = new Vertex(10, 20, 50);
    const vertex_2 = new Vertex(20, 50, 30);
    const edge = new Edge(vertex_1, vertex_2);

    expect(edge.clone()).toStrictEqual(edge);
});
