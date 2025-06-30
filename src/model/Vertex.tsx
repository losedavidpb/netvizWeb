import type { JSX } from 'react';
import React from 'react';
import { Billboard, Text } from '@react-three/drei';
import * as THREE from 'three';

import { Edge } from './Edge';
import { Config } from '../Config';

/**
 * Vertex :: Representation of a vertex
 *
 * @author losedavidpb <losedavidpb@gmail.com>
 */
export class Vertex {

    // --------------------------------
    // Properties
    // --------------------------------

    private selected: boolean = false;

    private static vertexCounter = 0;
    private vertexNumber: number = Vertex.vertexCounter;

    private pos: THREE.Vector3 = new THREE.Vector3();
    private force: THREE.Vector3 = new THREE.Vector3();
    private velocity: THREE.Vector3 = new THREE.Vector3();
    private colour: THREE.Color = new THREE.Color();

    private text: string = "";

    private level: number = 0;
    private degree: number = 0;

    private edges: Edge[] = [];
    private attachedPoints: Vertex[] = [];

    private positions: number[] = new Array(Config.size).fill(0);
    private colours: number[] = new Array(Config.size).fill(0);
    private indices: number[] = new Array(Config.size).fill(0);
    private geometry: THREE.BufferGeometry = new THREE.BufferGeometry();

    /**
     * Creates a new Vertex instance.
     *
     * @param offsetX offset for X-coord
     * @param offsetY offset for Y-coord
     * @param offsetZ offset for Z-coord
     */
    constructor(offsetX: number, offsetY: number, offsetZ: number) {
        this.setPos({ x: offsetX, y: offsetY, z: offsetZ });
        this.vertexNumber = Vertex.vertexCounter++;
        this.update();
    }

    /**
     * Gets the most recently assigned vertex number.
     *
     * @returns last used vertex identifier.
     */
    static getLastVertexNumber(): number {
        return Vertex.vertexCounter - 1;
    }

    /**
     * Updates the vertex for rendering.
     */
    update(): void {
        let [vIndx, colIndx, indIndx] = [0, 0, 0];

        for (let r = 0; r < Config.rings; r++) {
            const polarAngle = Math.PI * r * Config.ringStep;
            const y = Math.sin(-(Math.PI / 2) + polarAngle);

            for (let s = 0; s < Config.sectors; s++) {
                const azimuthalAngle = 2 * Math.PI * s * Config.sectorStep;
                const sinAzimuthalAngle = Math.sin(polarAngle);

                const x = Math.cos(azimuthalAngle) * sinAzimuthalAngle;
                const z = Math.sin(azimuthalAngle) * sinAzimuthalAngle;

                this.positions[vIndx++] = this.pos.x + x * Config.radius;
                this.positions[vIndx++] = this.pos.y + y * Config.radius;
                this.positions[vIndx++] = this.pos.z + z * Config.radius;

                this.colours[colIndx++] = this.colour.r;
                this.colours[colIndx++] = this.colour.g;
                this.colours[colIndx++] = this.colour.b;

                if (r < Config.rings - 1 && s < Config.sectors - 1) {
                    this.indices[indIndx++] = r * Config.sectors + s;
                    this.indices[indIndx++] = r * Config.sectors * (s + 1);
                    this.indices[indIndx++] = (r + 1) * Config.sectors + (s + 1);
                    this.indices[indIndx++] = (r + 1) * Config.sectors + s;
                }
            }
        }

        this.geometry = new THREE.BufferGeometry();
        this.geometry.setAttribute('position', new THREE.Float32BufferAttribute(this.positions, 3));
        this.geometry.setAttribute('color', new THREE.Float32BufferAttribute(this.colours, 3));
        this.geometry.setIndex(this.indices);
    }

    /**
     * Starts the rendering of the vertex component.
     *
     * @returns JSX element representing the vertex
     */
    /* v8 ignore next 52 */
    draw(): JSX.Element {
        return (
            <>
                {/* Additional wireframe if vertex is selected */}
                {this.selected && (
                    <mesh position={this.getPos()}>
                        <sphereGeometry args={[1.5 * Config.radius, 16, 16]} />
                        <meshBasicMaterial
                            color="yellow"
                            wireframe
                            transparent
                            opacity={0.5}
                            depthWrite={false}
                        />
                    </mesh>
                )}

                {/* Render the solid vertex */}
                <points geometry={this.geometry}>
                    <pointsMaterial
                        vertexColors
                        size={0.1 * Config.radius}
                        polygonOffset
                        polygonOffsetFactor={-2.5}
                        polygonOffsetUnits={-2.5}
                    />
                </points>

                {/* Render the text label */}
                {this.text !== "" && this.drawText()}

                {/* Render all connected edges, if any */}
                {this.edges.map((edge) => (
                    <React.Fragment key={edge.getEdgeNumber()}>
                        {edge.draw()}
                    </React.Fragment>
                ))}
            </>
        );
    }

    /**
     * Renders the text associated with the vertex.
     *
     * @returns JSX element representing the vertex text
     */
    /* v8 ignore next 20 */
    drawText(): JSX.Element {
        return (
            <Billboard position={[
                this.pos.x,
                this.pos.y - Config.radius,
                this.pos.z
            ]}>
                <Text
                    color="white"
                    anchorX="center"
                    anchorY="top"
                    fontSize={2}
                >
                    {this.text}
                </Text>
            </Billboard>
        );
    }

    /**
     * Checks if vertex has been selected.
     *
     * @returns selected state
     */
    isSelected(): boolean {
        return this.selected;
    }

    /**
     * Updates the selected state of the vertex.
     *
     * @param selected new selected state
     */
    setSelected(selected: boolean): void {
        this.selected = selected;
    }

    /**
     * Gets a copy of the vertex position.
     *
     * @returns position of the vertex
     */
    getPos(): THREE.Vector3 {
        return new THREE.Vector3(
            this.pos.x, this.pos.y, this.pos.z
        );
    }

    /**
     * Updates the position of the vertex.
     *
     * @param param0 [x, y, z] position-coords
     */
    setPos({ x, y, z }: { x?: number; y?: number; z?: number }): void {
        if (x !== undefined) this.pos.x = x;
        if (y !== undefined) this.pos.y = y;
        if (z !== undefined) this.pos.z = z;

        this.update();
    }

    /**
     * Gets a copy of the vertex force.
     *
     * @returns force of the vertex
     */
    getForce(): THREE.Vector3 {
        return new THREE.Vector3(
            this.force.x, this.force.y, this.force.z
        );
    }

    /**
     * Updates the force of the vertex.
     *
     * @param param0 [x, y, z] force-coords
     */
    setForce({ x, y, z }: { x?: number; y?: number; z?: number }): void {
        if (x !== undefined) this.force.x = x;
        if (y !== undefined) this.force.y = y;
        if (z !== undefined) this.force.z = z;
    }

    /**
     * Gets a copy of the vertex velocity.
     *
     * @returns velocity of the vertex
     */
    getVelocity(): THREE.Vector3 {
        return new THREE.Vector3(
            this.velocity.x, this.velocity.y, this.velocity.z
        );
    }

    /**
     * Updates the velocity of the vertex.
     *
     * @param param0 [x, y, z] velocity-coords
     */
    setVelocity({ x, y, z }: { x?: number; y?: number; z?: number }): void {
        if (x !== undefined) this.velocity.x = x;
        if (y !== undefined) this.velocity.y = y;
        if (z !== undefined) this.velocity.z = z;
    }

    /**
     * Gets a copy of the vertex colour.
     *
     * @returns colour of the vertex
     */
    getColour(): THREE.Color {
        return new THREE.Color(
            this.colour.r, this.colour.g, this.colour.b
        );
    }

    /**
     * Updates the colour of the vertex.
     *
     * Each component must be within the range [0, 1].
     *
     * @param R red component (0 to 1)
     * @param G green component (0 to 1)
     * @param B blue component (0 to 1)
     */
    setColour(R: number, G: number, B: number): void {
        if (!(R >= 0 && R <= 1 && G >= 0 && G <= 1 && B >= 0 && B <= 1)) {
            throw new Error(
                'InvalidRGB :: Passed colour is invalid'
            );
        }

        this.colour = new THREE.Color().setRGB(R, G, B);
        this.update();
    }

    /**
     * Gets the text of the vertex.
     *
     * @returns text of the vertex
     */
    getText(): string {
        return this.text;
    }

    /**
     * Updates the text of the vertex.
     *
     * @param t new text
     */
    setText(t: string): void {
        this.text = t;
    }

    /**
     * Gets the level of the vertex.
     *
     * @returns level of the vertex
     */
    getLevel(): number {
        return this.level;
    }

    /**
     * Updates the level of the vertex.
     *
     * The level must be a positive number (zero or greater).
     *
     * @param level new level
     */
    setLevel(level: number): void {
        if (level < 0) {
            throw new Error(
                'InvalidLevel: level must be a positive number'
            );
        }

        this.level = level;
    }

    /**
     * Gets the degree of the vertex.
     *
     * @returns degree of the vertex
     */
    getDegree(): number {
        return this.degree;
    }

    /**
     * Updates the degree of the vertex.
     *
     * The degree must be a positive number (zero or greater).
     *
     * @param degree new degree
     */
    setDegree(degree: number): void {
        if (degree < 0) {
            throw new Error(
                'InvalidDegree: degree must be a positive number'
            );
        }

        this.degree = degree;
    }

    /**
     * Increments the degree of the vertex by one.
     */
    updateDegree(): void {
        this.degree += 1;
    }

    /**
     * Gets the vertex number.
     *
     * @returns number of the vertex
     */
    getVertexNumber(): number {
        return this.vertexNumber;
    }

    /**
     * Update the vertex number.
     *
     * The vertex number must be a positive number (zero or greater).
     *
     * @param vertexNumber new vertex number
     */
    setVertexNumber(vertexNumber: number): void {
        if (vertexNumber < 0) {
            throw new Error(
                'InvalidNumber: number must be a positive number'
            );
        }

        this.vertexNumber = vertexNumber;
    }

    /**
     * Gets a copy of the edges of the vertex.
     *
     * @returns edges
     */
    getEdges(): Edge[] {
        return [...this.edges];
    }

    /**
     * Gets a copy of the attached points of the vertex.
     *
     * @returns attached points
     */
    getAttachedPoints(): Vertex[] {
        return [...this.attachedPoints];
    }

    /**
     * Attaches the passed vertex to the current one.
     *
     * @param vertex vertex to be attached
     */
    attachPoint(vertex: Vertex): void {
        this.attachedPoints.push(vertex);
        this.edges.push(new Edge(this, vertex));
    }

    /**
     * Detaches the passed vertex from the current one.
     *
     * @param vertex vertex to be detached
     */
    detachPoint(vertex: Vertex): void {
        this.attachedPoints = this.attachedPoints.filter(item => item !== vertex);
        this.edges = this.edges.filter(item => item.getConnect() !== vertex);
    }

    /**
     * Checks if the mouse pointer is over the vertex.
     *
     * @param mousePos position of the mouse
     * @returns if the mouse is over the vertex
     */
    /* v8 ignore next 19 */
    isPointerOver(mousePos: THREE.Vector2): boolean {
        const canvas = Config.renderer.domElement;

        // Project centre
        const center = this.getPos().project(Config.camera);
        const centerX = (center.x + 1) / 2 * canvas.width;
        const centerY = (1 - center.y) / 2 * canvas.height;

        // Project edge point
        const edgeWorld = this.getPos().add(new THREE.Vector3(Config.radius, 0, 0));
        const screenEdge = edgeWorld.project(Config.camera);
        const edgeX = (screenEdge.x + 1) / 2 * canvas.width;
        const edgeY = (1 - screenEdge.y) / 2 * canvas.height;

        const maxMouseDistance = Math.hypot(centerX - edgeX, centerY - edgeY);
        const pointerDistance = Math.hypot(centerX - mousePos.x, centerY - mousePos.y);

        return pointerDistance < maxMouseDistance;
    }

    /**
     * Gets the depth of the vertex.
     *
     * @returns depth of the vertex
     */
    /* v8 ignore next 3 */
    getDepth(): number {
        return (this.getPos().project(Config.camera).z + 1) / 2;
    }

    /**
     * Gets the hashcode of the vertex.
     *
     * @returns vertex hashcode
     */
    hashCode(): number {
        const json = JSON.stringify(this.toJSON());
        let hash = 5381;

        for (let i = 0; i < json.length; i++) {
            hash = ((hash << 5) + hash) + json.charCodeAt(i);
            hash = hash & 0xffffffff;
        }

        return hash >>> 0;
    }

    /**
     * Checks whether the current and the passed vertex are equal.
     *
     * @param other vertex to be compared
     * @returns if vertices are equal
     */
    equals(other: unknown): boolean {
        if (!(other instanceof Vertex)) return false;
        return this.hashCode() === other.hashCode();
    }

    /**
     * Retrieves a copy of the current vertex.
     *
     * @returns clone of the vertex
     */
    clone(): Vertex {
        const clone_obj = new Vertex(0, 0, 0);
        Vertex.vertexCounter--; // Counter decrements since this is not a new vertex

        clone_obj.selected = this.isSelected();
        clone_obj.pos = this.getPos();
        clone_obj.velocity = this.getVelocity();
        clone_obj.force = this.getForce();
        clone_obj.colour = this.getColour();
        clone_obj.text = this.getText();
        clone_obj.level = this.getLevel();
        clone_obj.degree = this.getDegree();
        clone_obj.vertexNumber = this.getVertexNumber();
        clone_obj.attachedPoints = this.getAttachedPoints();
        clone_obj.edges = this.getEdges();

        clone_obj.update();
        clone_obj.geometry = this.geometry;

        return clone_obj;
    }

    /**
     * Serialises the vertex into a JSON-compatible object.
     *
     * Note: Attached points and edges are saved as vertex numbers, so
     * extra steps are needed to fully restore the graph.
     *
     * @returns JSON representation of the vertex
     */
    toJSON(): object {
        return {
            selected: this.selected,
            pos: { x: this.pos.x, y: this.pos.y, z: this.pos.z },
            force: { x: this.force.x, y: this.force.y, z: this.force.z },
            velocity: { x: this.velocity.x, y: this.velocity.y, z: this.velocity.z },
            colour: { r: this.colour.r, g: this.colour.g, b: this.colour.b },
            text: this.text,
            level: this.level,
            degree: this.degree,
            vertexNumber: this.vertexNumber,
            attachedPoints: this.attachedPoints.map(v => v.getVertexNumber()),
            edges: this.edges.map(e => ({
                from: e.getBase().getVertexNumber(),
                to: e.getConnect().getVertexNumber()
            }))
        };
    }

    /**
     * Creates a vertex instance from a JSON object.
     *
     * Note: This method only restores basic data and does not
     * rebuild attached points or edges. Full graph reconstruction
     * must be done separately.
     *
     * @param object JSON representation of the vertex
     * @returns restored vertex instance
     */
    static fromJSON(object: any): Vertex {
        const vertex = new Vertex(0, 0, 0);
        Vertex.vertexCounter--; // Counter decrements since this is not a new vertex

        vertex.pos = new THREE.Vector3(object.pos.x, object.pos.y, object.pos.z);
        vertex.selected = object.selected;
        vertex.force = new THREE.Vector3(object.force.x, object.force.y, object.force.z);
        vertex.velocity = new THREE.Vector3(object.velocity.x, object.velocity.y, object.velocity.z);
        vertex.colour = new THREE.Color(object.colour.r, object.colour.g, object.colour.b);
        vertex.level = object.level;
        vertex.degree = object.degree;
        vertex.vertexNumber = object.vertexNumber;

        vertex.update();
        return vertex;
    }
}