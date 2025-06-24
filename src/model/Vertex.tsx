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

    private pos: THREE.Vector3 = new THREE.Vector3();
    private force: THREE.Vector3 = new THREE.Vector3();
    private velocity: THREE.Vector3 = new THREE.Vector3();
    private colour: THREE.Color = new THREE.Color();

    private text: string = "";

    private level: number = 0;
    private degree: number = 0;
    private vertexNumber: number = 0;

    private edges: Edge[] = [];
    private attachedPoints: Vertex[] = [];

    // Spherical rendering
    private positions: number[] = new Array(Config.size).fill(0);
    private colours: number[] = new Array(Config.size).fill(0);
    private indices: number[] = new Array(Config.size).fill(0);
    private geometry: THREE.BufferGeometry = new THREE.BufferGeometry();

    /**
     * Constructor for Vertex
     *
     * @param offsetX offset for X-coord
     * @param offsetY offset for Y-coord
     * @param offsetZ offset for Z-coord
     */
    constructor(offsetX: number, offsetY: number, offsetZ: number) {
        this.setPos({ x: offsetX, y: offsetY, z: offsetZ });
        this.update();
    }

    /**
     * Update the vertex
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
     * Draw the vertex
     *
     * @returns vertex component
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
                {this.edges.map((edge, i) => (
                    <React.Fragment key={i}>
                        {edge.draw()}
                    </React.Fragment>
                ))}
            </>
        );
    }

    /**
     * Draw the text of the vertex
     *
     * @returns text component
     */
    /* v8 ignore next 18 */
    drawText(): JSX.Element {
        return (
            <>
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
            </>
        );
    }

    /**
     * Check if vertex is selected
     *
     * @returns selected
     */
    isSelected(): boolean {
        return this.selected;
    }

    /**
     * Set selected option
     *
     * @param selected new selected value
     */
    setSelected(selected: boolean): void {
        this.selected = selected;
    }

    /**
     * Get the position of the vertex
     *
     * @returns position of the vertex
     */
    getPos(): THREE.Vector3 {
        return new THREE.Vector3(
            this.pos.x, this.pos.y, this.pos.z
        );
    }

    /**
     * Set the position of the vertex [x, y, z]
     *
     * @param param0 x, y, z position-coords
     */
    setPos({ x, y, z }: { x?: number; y?: number; z?: number }): void {
        if (x !== undefined) this.pos.x = x;
        if (y !== undefined) this.pos.y = y;
        if (z !== undefined) this.pos.z = z;

        this.update();
    }

    /**
     * Get the force of the vertex
     *
     * @returns force of the vertex
     */
    getForce(): THREE.Vector3 {
        return new THREE.Vector3(
            this.force.x, this.force.y, this.force.z
        );
    }

    /**
     * Set the force of the vertex [x, y, z]
     *
     * @param param0 x, y, z force-coords
     */
    setForce({ x, y, z }: { x?: number; y?: number; z?: number }): void {
        if (x !== undefined) this.force.x = x;
        if (y !== undefined) this.force.y = y;
        if (z !== undefined) this.force.z = z;
    }

    /**
     * Get the velocity of the vertex
     *
     * @returns velocity of the vertex
     */
    getVelocity(): THREE.Vector3 {
        return new THREE.Vector3(
            this.velocity.x, this.velocity.y, this.velocity.z
        );
    }

    /**
     * Set the velocity of the vertex [x, y, z]
     *
     * @param param0 x, y, z velocity-coords
     */
    setVelocity({ x, y, z }: { x?: number; y?: number; z?: number }): void {
        if (x !== undefined) this.velocity.x = x;
        if (y !== undefined) this.velocity.y = y;
        if (z !== undefined) this.velocity.z = z;
    }

    /**
     * Get the colour of the vertex
     *
     * @returns colour of the vertex
     */
    getColour(): THREE.Color {
        return new THREE.Color(
            this.colour.r, this.colour.g, this.colour.b
        );
    }

    /**
     * Set the colours for the vertex
     *
     * @param R R-component (red)
     * @param G G-component (green)
     * @param B B-component (blue)
     */
    setColour(R: number, G: number, B: number): void {
        if (!(R >= 0 && R <= 1 && G >= 0 && G <= 1 && B >= 0 && B <= 1)) {
            throw new Error('InvalidRGB :: Passed colour is invalid');
        }

        this.colour = new THREE.Color().setRGB(R, G, B);
        this.update();
    }

    /**
     * Get the vertex's text
     *
     * @returns text of the vertex
     */
    getText(): string {
        return this.text;
    }

    /**
     * Set the text of the vertex
     *
     * @param t new text
     */
    setText(t: string): void {
        this.text = t;
    }

    /**
     * Get the level of the vertex
     *
     * @returns level of the vertex
     */
    getLevel(): number {
        return this.level;
    }

    /**
     * Set a new level
     *
     * @param level new level
     */
    setLevel(level: number): void {
        if (level < 0) {
            throw new Error('InvalidLevel: level must be an integer');
        }

        this.level = level;
    }

    /**
     * Get the degree of the vertex
     *
     * @returns degree of the vertex
     */
    getDegree(): number {
        return this.degree;
    }

    /**
     * Set a new degree
     *
     * @param degree new degree
     */
    setDegree(degree: number): void {
        if (degree < 0) {
            throw new Error('InvalidDegree: degree must be an integer');
        }

        this.degree = degree;
    }

    /**
     * Increment the current degree
     */
    updateDegree(): void {
        this.degree += 1;
    }

    /**
     * Get the vertex number
     *
     * @returns number of the vertex
     */
    getVertexNumber(): number {
        return this.vertexNumber;
    }

    /**
     * Set a new vertex number
     *
     * @param vertexNumber new vertex number
     */
    setVertexNumber(vertexNumber: number): void {
        if (vertexNumber < 0) {
            throw new Error('InvalidNumber: number must be an integer');
        }

        this.vertexNumber = vertexNumber;
    }

    /**
     * Get the edges of the vertex
     *
     * @returns edges
     */
    getEdges(): Edge[] {
        return [...this.edges];
    }

    /**
     * Get the attached points of the vertex
     *
     * @returns attached points
     */
    getAttachedPoints(): Vertex[] {
        return [...this.attachedPoints];
    }

    /**
     * Attach passed vertex to the current one
     *
     * @param vertex vertex to attach
     */
    attachPoint(vertex: Vertex): void {
        if (vertex === this) {
            throw new Error('InvalidVertex :: Vertex cannot be attached');
        }

        this.attachedPoints.push(vertex);
        this.edges.push(new Edge(this, vertex));
    }

    detachPoint(vertex: Vertex): void {
        if (vertex === this) {
            throw new Error('InvalidVertex :: Vertex cannot be detached');
        }

        this.attachedPoints = this.attachedPoints.filter(item => item !== vertex);
        this.edges = this.edges.filter(item => item.getConnect() !== vertex);
    }

    /**
     * Check if the mouse pointer is over the vertex
     *
     * @param mousePos position of the mouse
     * @returns if the mouse is over the vertex
     */
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
     * Get the depth of the vertex
     *
     * @returns depth of the vertex
     */
    getDepth(): number {
        return (this.getPos().project(Config.camera).z + 1) / 2;
    }

    /**
     * Clone the current vertex
     *
     * @returns clone of the vertex
     */
    clone(): Vertex {
        const clone_obj = new Vertex(0, 0, 0);

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
        return clone_obj;
    }
}