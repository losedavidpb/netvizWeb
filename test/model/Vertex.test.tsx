import { test, expect } from 'vitest';

import { Vertex } from '../../src/model/Vertex';

// --------------------------------------
// Selected
// --------------------------------------

test('Vertex::isSelected() : Default Selected', () => {
    const vertex = new Vertex(0, 0, 0);

    const isSelected = vertex.isSelected();
    expect(isSelected).toBe(false);
});

test('Vertex::setSelected() : Valid Selected True', () => {
    const vertex = new Vertex(0, 0, 0);
    vertex.setSelected(true);

    const isSelected = vertex.isSelected();
    expect(isSelected).toBe(true);
});

test('Vertex::setSelected() : Valid Selected False', () => {
    const vertex = new Vertex(0, 0, 0);
    vertex.setSelected(false);

    const isSelected = vertex.isSelected();
    expect(isSelected).toBe(false);
});

// --------------------------------------
// Position
// --------------------------------------

test('Vertex::getPos() : Default Position', () => {
    const vertex = new Vertex(0, 0, 0);

    const pos = vertex.getPos();
    expect(pos.x).toBe(0);
    expect(pos.y).toBe(0);
    expect(pos.z).toBe(0);
});

test('Vertex::setPos() : Adjust X', () => {
    const vertex = new Vertex(0, 0, 0);
    vertex.setPos({ x: 10 });

    const pos = vertex.getPos();
    expect(pos.x).toBe(10);
    expect(pos.y).toBe(0);
    expect(pos.z).toBe(0);
});

test('Vertex::setPos() : Adjust Y', () => {
    const vertex = new Vertex(0, 0, 0);
    vertex.setPos({ y: 10 });

    const pos = vertex.getPos();
    expect(pos.x).toBe(0);
    expect(pos.y).toBe(10);
    expect(pos.z).toBe(0);
});

test('Vertex::setPos() : Adjust Z', () => {
    const vertex = new Vertex(0, 0, 0);
    vertex.setPos({ z: 10 });

    const pos = vertex.getPos();
    expect(pos.x).toBe(0);
    expect(pos.y).toBe(0);
    expect(pos.z).toBe(10);
});

// --------------------------------------
// Force
// --------------------------------------

test('Vertex::getForce() : Default Force', () => {
    const vertex = new Vertex(0, 0, 0);

    const force = vertex.getForce();
    expect(force.x).toBe(0);
    expect(force.y).toBe(0);
    expect(force.z).toBe(0);
});

test('Vertex::setForce() : Adjust X', () => {
    const vertex = new Vertex(0, 0, 0);
    vertex.setForce({ x: 10 });

    const force = vertex.getForce();
    expect(force.x).toBe(10);
    expect(force.y).toBe(0);
    expect(force.z).toBe(0);
});

test('Vertex::setForce() : Adjust Y', () => {
    const vertex = new Vertex(0, 0, 0);
    vertex.setForce({ y: 10 });

    const force = vertex.getForce();
    expect(force.x).toBe(0);
    expect(force.y).toBe(10);
    expect(force.z).toBe(0);
});

test('Vertex::setForce() : Adjust Z', () => {
    const vertex = new Vertex(0, 0, 0);
    vertex.setForce({ z: 10 });

    const force = vertex.getForce();
    expect(force.x).toBe(0);
    expect(force.y).toBe(0);
    expect(force.z).toBe(10);
});

// --------------------------------------
// Velocity
// --------------------------------------

test('Vertex::getVelocity() : Default Velocity', () => {
    const vertex = new Vertex(0, 0, 0);

    const velocity = vertex.getVelocity();
    expect(velocity.x).toBe(0);
    expect(velocity.y).toBe(0);
    expect(velocity.z).toBe(0);
});

test('Vertex::setVelocity() : Adjust X', () => {
    const vertex = new Vertex(0, 0, 0);
    vertex.setVelocity({ x: 10 });

    const velocity = vertex.getVelocity();
    expect(velocity.x).toBe(10);
    expect(velocity.y).toBe(0);
    expect(velocity.z).toBe(0);
});

test('Vertex::setVelocity() : Adjust Y', () => {
    const vertex = new Vertex(0, 0, 0);
    vertex.setVelocity({ y: 10 });

    const velocity = vertex.getVelocity();
    expect(velocity.x).toBe(0);
    expect(velocity.y).toBe(10);
    expect(velocity.z).toBe(0);
});

test('Vertex::setVelocity() : Adjust Z', () => {
    const vertex = new Vertex(0, 0, 0);
    vertex.setVelocity({ z: 10 });

    const velocity = vertex.getVelocity();
    expect(velocity.x).toBe(0);
    expect(velocity.y).toBe(0);
    expect(velocity.z).toBe(10);
});

// --------------------------------------
// Text
// --------------------------------------

test('Vertex::getText() : Default Text', () => {
    const vertex = new Vertex(0, 0, 0);

    const text = vertex.getText();
    expect(text).toBe('');
});

test('Vertex::getText() : Valid Text', () => {
    const vertex = new Vertex(0, 0, 0);
    vertex.setText('Text to be tested')

    const text = vertex.getText();
    expect(text).toBe('Text to be tested');
});

// --------------------------------------
// Colour
// --------------------------------------

test('Vertex::getColour() : Default Colour', () => {
    const vertex = new Vertex(0, 0, 0);

    const colour = vertex.getColour();
    expect(colour.r).toBe(1);
    expect(colour.g).toBe(1);
    expect(colour.b).toBe(1);
});

test('Vertex::setColour() : Valid RGB', () => {
    const vertex = new Vertex(0, 0, 0);
    vertex.setColour(10, 20, 30);

    const colour = vertex.getColour();
    expect(colour.r).toBe(10);
    expect(colour.g).toBe(20);
    expect(colour.b).toBe(30);
});

test('Vertex::setColour() : InvalidR', () => {
    const vertex = new Vertex(0, 0, 0);

    expect(() => vertex.setColour(-1, 20, 30)).toThrow(
        'InvalidRGB :: Passed colour is invalid'
    );

    expect(() => vertex.setColour(256, 20, 30)).toThrow(
        'InvalidRGB :: Passed colour is invalid'
    );
});

test('Vertex::setColour() : InvalidG', () => {
    const vertex = new Vertex(0, 0, 0);

    expect(() => vertex.setColour(10, -1, 30)).toThrow(
        'InvalidRGB :: Passed colour is invalid'
    );

    expect(() => vertex.setColour(10, 256, 30)).toThrow(
        'InvalidRGB :: Passed colour is invalid'
    );
});

test('Vertex::setColour() : InvalidG', () => {
    const vertex = new Vertex(0, 0, 0);

    expect(() => vertex.setColour(10, 20, -1)).toThrow(
        'InvalidRGB :: Passed colour is invalid'
    );

    expect(() => vertex.setColour(10, 20, 256)).toThrow(
        'InvalidRGB :: Passed colour is invalid'
    );
});

// --------------------------------------
// Level
// --------------------------------------

test('Vertex::getLevel() : Default Level', () => {
    const vertex = new Vertex(0, 0, 0);

    const level = vertex.getLevel();
    expect(level).toBe(0);
});

test('Vertex::setLevel() : Valid Level', () => {
    const vertex = new Vertex(0, 0, 0);
    vertex.setLevel(1);

    const level = vertex.getLevel();
    expect(level).toBe(1);
});

test('Vertex::setLevel() : Invalid Level', () => {
    const vertex = new Vertex(0, 0, 0);

    expect(() => { vertex.setLevel(-1); }).toThrow(
        'InvalidLevel: level must be an integer'
    );
});

// --------------------------------------
// Degree
// --------------------------------------

test('Vertex::getDegree() : Default Degree', () => {
    const vertex = new Vertex(0, 0, 0);

    const degree = vertex.getDegree();
    expect(degree).toBe(0);
});

test('Vertex::setDegree() : Valid Degree', () => {
    const vertex = new Vertex(0, 0, 0);
    vertex.setDegree(1);

    const degree = vertex.getDegree();
    expect(degree).toBe(1);
});

test('Vertex::setDegree() : Invalid Degree', () => {
    const vertex = new Vertex(0, 0, 0);

    expect(() => { vertex.setDegree(-1); }).toThrow(
        'InvalidDegree: degree must be an integer'
    );
});

test('Vertex::updateDegree() : Update Degree', () => {
    const vertex = new Vertex(0, 0, 0);
    vertex.updateDegree();

    const degree = vertex.getDegree();
    expect(degree).toBe(1);
});

// --------------------------------------
// Vertex Number
// --------------------------------------

test('Vertex::getVertexNumber() : Default Vertex Number', () => {
    const vertex = new Vertex(0, 0, 0);

    const vertexNumber = vertex.getVertexNumber();
    expect(vertexNumber).toBe(0);
});

test('Vertex::setVertexNumber() : Valid Vertex Number', () => {
    const vertex = new Vertex(0, 0, 0);
    vertex.setVertexNumber(1);

    const vertexNumber = vertex.getVertexNumber();
    expect(vertexNumber).toBe(1);
});

test('Vertex::setVertexNumber() : Invalid Vertex Number', () => {
    const vertex = new Vertex(0, 0, 0);

    expect(() => { vertex.setVertexNumber(-1); }).toThrow(
        'InvalidNumber: number must be an integer'
    );
});

// --------------------------------------
// Edges
// --------------------------------------

test('Vertex::getEdges() : Default', () => {
    const vertex = new Vertex(0, 0, 0);

    expect(vertex.getEdges().length).toBe(0);
});

// --------------------------------------
// AttachPoint
// --------------------------------------

test('Vertex::getAttachedPoints() : Default', () => {
    const vertex = new Vertex(0, 0, 0);

    expect(vertex.getAttachedPoints().length).toBe(0);
});

test('Vertex::attachPoint() : Identical Vertex', () => {
    const vertex = new Vertex(0, 0, 0);
    const other = vertex;

    expect(() => { vertex.attachPoint(other); }).toThrow(
        'InvalidVertex :: Vertex cannot be attached'
    );
});

test('Vertex::attachPoint() : Repeated Vertex', () => {
    const vertex = new Vertex(0, 0, 0);
    const other = new Vertex(10, 20, 30);

    vertex.attachPoint(other);

    expect(() => { vertex.attachPoint(other); }).toThrow(
        'InvalidVertex :: Vertex cannot be attached'
    );
});

test('Vertex::attachPoint() : Valid Vertex', () => {
    const vertex = new Vertex(0, 0, 0);
    const other = new Vertex(10, 20, 30);

    vertex.attachPoint(other);

    const attachedPoints = vertex.getAttachedPoints();
    const edges = vertex.getEdges();

    expect(attachedPoints.length).toBe(1);
    expect(edges.length).toBe(1);

    expect(attachedPoints[0] === other).toBe(true);
    expect(edges[0].getBase() === vertex).toBe(true);
    expect(edges[0].getConnect() === other).toBe(true);
});