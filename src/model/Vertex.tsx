import type { JSX } from 'react';
import * as THREE from 'three';
import { Billboard, Text } from '@react-three/drei';

import { Edge } from './Edge';

/**
 * Vertex :: Representation of a vertex
 *
 * @author losedavidpb <losedavidpb@gmail.com>
 */
export class Vertex {

    // --------------------------------
    // Properties
    // --------------------------------

    private selected: boolean;

    private pos: THREE.Vector3;
    private force: THREE.Vector3;
    private velocity: THREE.Vector3;
    private colour: THREE.Color;

    private text: string;

    private level: number;
    private degree: number;
    private vertexNumber: number;

    private edges: Edge[];
    private attachedPoints: Vertex[];

    private vertices: number[];
    private colours: number[];
    private indices: number[];

    // --------------------------------
    // Static
    // --------------------------------

    // The following properties have been thoroughly tested and are
    // considered to be the best configuration for vertices. Do not
    // modify them unless you know what you are doing.

    // Radius of the vertex.
    static radius = 0.05;

    // Number of horizontal divisions (latitude)
    // for the vertex sphere geometry
    static rings = 12;

    // Number of vertical divisions (longitude)
    // for the vertex sphere geometry
    static sectors = 12;

    // ----------------------
    // TODO: TEMP
    //
    // These properties should be located in a public component as
    // they will likely be used by other components.
    //
    // ----------------------

    // Scene in which all objects are rendered
    static scene: THREE.Scene;

    // Camera used to view the scene
    static camera: THREE.Camera;

    // WebGL renderer used to draw the scene
    static renderer: THREE.WebGLRenderer;

    /**
     * Constructor for Vertex
     *
     * @param offsetX offset for X-coord
     * @param offsetY offset for Y-coord
     * @param offsetZ offset for Z-coord
     */
    constructor(offsetX: number, offsetY: number, offsetZ: number) {
        // ----------------------
        // TODO: TEMP
        //
        // These conditions would not be necessary if the scene, camera,
        // and renderer are defined externally.
        //
        // ----------------------

        if (Vertex.scene == null || Vertex.camera == null || Vertex.renderer == null) {
            throw new Error('NullError :: THREE.js has not been initialised yet');
        }

        this.selected = false;

        this.pos = new THREE.Vector3();
        this.setPos({ x: offsetX, y: offsetY, z: offsetZ });

        this.force = new THREE.Vector3();
        this.velocity = new THREE.Vector3();
        this.colour = new THREE.Color();

        this.edges = [];
        this.attachedPoints = [];

        this.text = "";

        this.level = 0;
        this.degree = 0;
        this.vertexNumber = 0;

        let size = Vertex.rings * Vertex.sectors;
        this.vertices = new Array(size * 3).fill(0);
        this.colours = new Array(size * 3).fill(0);
        this.indices = new Array(size * 4).fill(0);

        // Update the vertex
        this.update();
    }

    /**
     * Update the vertex
     */
    update(): void {
        // Open mutex

        const RINGS = 1.0 / (Vertex.rings - 1);
        const SECTORS = 1.0 / (Vertex.sectors - 1);

        let vertIndex = 0;
        let indIndex = 0;
        let colIndex = 0;

        for (let r = 0; r < Vertex.rings; r++) {
            for (let s = 0; s < Vertex.sectors; s++) {
                const x = Math.cos(2 * Math.PI * s * SECTORS) * Math.sin(Math.PI * r * RINGS);
                const y = Math.sin(-(Math.PI / 2) + Math.PI * r * RINGS);
                const z = Math.sin(2 * Math.PI * s * SECTORS) * Math.sin(Math.PI * r * RINGS);

                this.vertices[vertIndex++] = this.getPos().x + x * Vertex.radius;
                this.vertices[vertIndex++] = this.getPos().y + y * Vertex.radius;
                this.vertices[vertIndex++] = this.getPos().z + z * Vertex.radius;

                this.colours[colIndex++] = this.getColour().r;
                this.colours[colIndex++] = this.getColour().g;
                this.colours[colIndex++] = this.getColour().b;
            }
        }

        for (let r = 0; r < Vertex.rings - 1; r++) {
            for (let s = 0; s < Vertex.sectors - 1; s++) {
                this.indices[indIndex++] = r * Vertex.sectors + s;
                this.indices[indIndex++] = r * Vertex.sectors * (s + 1);
                this.indices[indIndex++] = (r + 1) * Vertex.sectors + (s + 1);
                this.indices[indIndex++] = (r + 1) * Vertex.sectors + s;
            }
        }

        // Update edges if any
        if (this.edges.length > 0) {
            for (let i = 0; i < this.edges.length; ++i) {
                this.edges[i].update();
            }
        }

        // Close mutex
    }

    /**
     * Draw the vertex
     *
     * @returns vertex component
     */
    draw(): JSX.Element {
        // Open mutex

        // Set up the geometry of the vertex
        const geometry = new THREE.BufferGeometry();

        // Position and colour of the vertex
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(this.vertices, 3));
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(this.colours, 3));

        // Index buffer to specify the order in which vertices
        // are connected to form faces
        geometry.setIndex(this.indices);

        return (
            <>
                {/* Additional wireframe if vertex is selected */}
                {this.selected && (
                    <points geometry={geometry}>
                        <pointsMaterial
                            vertexColors
                            size={0.1 * Vertex.radius}
                            polygonOffset
                            polygonOffsetFactor={-1.0}
                            polygonOffsetUnits={-1.0}
                        />
                    </points>
                )}

                {/* Render the solid vertex */}
                <points geometry={geometry}>
                    <pointsMaterial
                        vertexColors
                        size={0.1 * Vertex.radius}
                        polygonOffset
                        polygonOffsetFactor={-2.5}
                        polygonOffsetUnits={-2.5}
                    />
                </points>

                {/* Render all connected edges, if any */}
                {this.edges?.map((edge) => (
                    edge.draw?.() ?? null
                ))}

                {/* Render the text label */}
                {this.text != "" && this.drawText()}
            </>
        );

        // Close mutex
    }

    /**
     * Draw the text of the vertex
     *
     * @returns text component
     */
    drawText(): JSX.Element {
        // Open mutex

        return (
            <>
                {/* Render the text based on the radius */}
                <Billboard position={[this.getPos().x, this.getPos().y - Vertex.radius, this.getPos().z]}>
                    <Text
                        color="black"
                        anchorX="center"
                        anchorY="top"
                        fontSize={0.1}
                    >
                        {this.text}
                    </Text>
                </Billboard>

                {/* Render the text of all connected edges, if any */}
                {this.edges?.map((edge) => (
                    edge.drawText?.() ?? null
                ))}
            </>
        );

        // Close mutex
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
        // Check that passed RGB is valid
        if (!(R >= 0 && R <= 255 && G >= 0 && G <= 255 && B >= 0 && B <= 255)) {
            throw new Error('InvalidRGB :: Passed colour is invalid');
        }

        this.colour = new THREE.Color('rgb(' + R + ',' + G + ',' + B + ')');
        let colIndex = 0;

        for (let r = 0; r < Vertex.rings; r++) {
            for (let s = 0; s < Vertex.sectors; s++) {
                this.colours[colIndex++] = this.getColour().r;
                this.colours[colIndex++] = this.getColour().g;
                this.colours[colIndex++] = this.getColour().b;
            }
        }
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
    setLevel(level: number) {
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
    setDegree(degree: number) {
        if (degree < 0) {
            throw new Error('InvalidDegree: degree must be an integer');
        }

        this.degree = degree;
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
    setVertexNumber(vertexNumber: number) {
        if (vertexNumber < 0) {
            throw new Error('InvalidNumber: number must be an integer');
        }

        this.vertexNumber = vertexNumber;
    }

    /**
     * Attach passed vertex to the current one
     *
     * @param vertex vertex to attach
     */
    attachPoint(vertex: Vertex): void {
        if (vertex == this || this.attachedPoints.find(v => v === vertex)) {
            throw new Error('InvalidVertex :: Vertex cannot be attached');
        }

        this.attachedPoints.push(vertex);

        const edge = new Edge(this, vertex);
        this.edges.push(edge);
    }
}