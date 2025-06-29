import { test, expect } from 'vitest';

import { Vertex } from '../../../src/model/Vertex';

// --------------------------------------
// Test Configuration
// --------------------------------------

function test_points(vertex: Vertex, points: Vertex[]): void {
    const attachedPoints = vertex.getAttachedPoints();
    const edges = vertex.getEdges();

    expect(attachedPoints.length).toBe(points.length);
    expect(edges.length).toBe(points.length);

    for (let k = 0; k < points.length; k++) {
        const other = points[k];

        expect(attachedPoints[k].equals(other)).toBe(true);
        expect(edges[k].getBase().equals(vertex)).toBe(true);
        expect(edges[k].getConnect().equals(other)).toBe(true);
    }
}

function test_point_does_not_exist(vertex: Vertex, points: Vertex[]): void {
    const attachedPoints = vertex.getAttachedPoints();
    const edges = vertex.getEdges();

    for (const point of points) {
        expect(attachedPoints.includes(point)).toBe(false);

        for (const edge of edges) {
            expect(edge.getConnect().equals(point)).toBe(false);
        }
    }
}

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
    vertex.setColour(1, 0.5, 0.2);

    const colour = vertex.getColour();
    expect(colour.r).toBe(1);
    expect(colour.g).toBe(0.5);
    expect(colour.b).toBe(0.2);
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
    expect(vertexNumber).toBe(Vertex.getLastVertexNumber());
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

test('Vertex::attachPoint() : Valid Vertex', () => {
    const vertex = new Vertex(0, 0, 0);
    const other = new Vertex(10, 20, 30);

    vertex.attachPoint(other);

    test_points(vertex, [other]);
});

// --------------------------------------
// Detach Point
// --------------------------------------

test('Vertex::detachPoint() : Valid Vertex', () => {
    const vertex = new Vertex(0, 0, 0);
    const other_1 = new Vertex(10, 20, 30);
    const other_2 = new Vertex(30, 50, 20);

    vertex.attachPoint(other_1);
    vertex.attachPoint(other_2);

    test_points(vertex, [other_1, other_2]);

    vertex.detachPoint(other_1);
    test_points(vertex, [other_2]);
    test_point_does_not_exist(vertex, [other_1]);
});

// --------------------------------------
// Equals
// --------------------------------------

test('Vertex::equals() : Unkown type', () => {
    const vertex = new Vertex(0, 0, 0);
    const other = -1;

    expect(vertex.equals(other)).toBe(false);
});

test('Vertex::equals() : Different vertices', () => {
    const vertex = new Vertex(0, 0, 0);
    const other = new Vertex(10, 20, 30);

    expect(vertex.equals(other)).toBe(false);
});

test('Vertex::equals() : Same vertex', () => {
    const vertex = new Vertex(0, 0, 0);
    const other_1 = vertex;
    const other_2 = vertex.clone();

    expect(vertex.equals(other_1)).toBe(true);
    expect(vertex.equals(other_2)).toBe(true);
});

// --------------------------------------
// Clone
// --------------------------------------

test('Vertex::clone() : Valid Vertex', () => {
    const vertex = new Vertex(10, 20, 50);

    expect(vertex.clone()).toStrictEqual(vertex);
});

// --------------------------------------
// toJSON
// --------------------------------------

test('Vertex::toJSON(): Valid Vertex', () => {
    const vertex = new Vertex(10, 20, 50);
    const other_1 = new Vertex(0, 0, 0);
    const other_2 = new Vertex(0, 0, 0);
    const points = [other_1, other_2];

    vertex.attachPoint(other_1);
    vertex.attachPoint(other_2);

    const object = vertex.toJSON() as any;

    expect(object.selected).toBe(vertex.isSelected());

    expect(object.pos.x).toBe(vertex.getPos().x);
    expect(object.pos.y).toBe(vertex.getPos().y);
    expect(object.pos.z).toBe(vertex.getPos().z);

    expect(object.force.x).toBe(vertex.getForce().x);
    expect(object.force.y).toBe(vertex.getForce().y);
    expect(object.force.z).toBe(vertex.getForce().z);

    expect(object.velocity.x).toBe(vertex.getVelocity().x);
    expect(object.velocity.y).toBe(vertex.getVelocity().y);
    expect(object.velocity.z).toBe(vertex.getVelocity().z);

    expect(object.colour.r).toBe(vertex.getColour().r);
    expect(object.colour.g).toBe(vertex.getColour().g);
    expect(object.colour.b).toBe(vertex.getColour().b);

    expect(object.text).toBe(vertex.getText());
    expect(object.level).toBe(vertex.getLevel());
    expect(object.degree).toBe(vertex.getDegree());
    expect(object.vertexNumber).toBe(vertex.getVertexNumber());

    for (let i = 0; i < object.attachedPoints.length; i++) {
        expect(object.attachedPoints[i]).toBe(points[i].getVertexNumber());
        expect(object.edges[i].from).toBe(vertex.getVertexNumber());
        expect(object.edges[i].to).toBe(points[i].getVertexNumber());
    }
});

// --------------------------------------
// fromJSON
// --------------------------------------

test('Vertex::fromJSON(): Valid Vertex', () => {
    const vertex = new Vertex(10, 20, 50);
    const other_1 = new Vertex(0, 0, 0);
    const other_2 = new Vertex(0, 0, 0);

    vertex.attachPoint(other_1);
    vertex.attachPoint(other_2);

    const object = vertex.toJSON() as any;
    const vertex_obj = Vertex.fromJSON(object);

    expect(vertex_obj.isSelected()).toBe(vertex.isSelected());

    expect(vertex_obj.getPos().x).toBe(vertex.getPos().x);
    expect(vertex_obj.getPos().y).toBe(vertex.getPos().y);
    expect(vertex_obj.getPos().z).toBe(vertex.getPos().z);

    expect(vertex_obj.getForce().x).toBe(vertex.getForce().x);
    expect(vertex_obj.getForce().y).toBe(vertex.getForce().y);
    expect(vertex_obj.getForce().z).toBe(vertex.getForce().z);

    expect(vertex_obj.getVelocity().x).toBe(vertex.getVelocity().x);
    expect(vertex_obj.getVelocity().y).toBe(vertex.getVelocity().y);
    expect(vertex_obj.getVelocity().z).toBe(vertex.getVelocity().z);

    expect(vertex_obj.getColour().r).toBe(vertex.getColour().r);
    expect(vertex_obj.getColour().g).toBe(vertex.getColour().g);
    expect(vertex_obj.getColour().b).toBe(vertex.getColour().b);

    expect(vertex_obj.getText()).toBe(vertex.getText());
    expect(vertex_obj.getLevel()).toBe(vertex.getLevel());
    expect(vertex_obj.getDegree()).toBe(vertex.getDegree());
    expect(vertex_obj.getVertexNumber()).toBe(vertex.getVertexNumber());
});