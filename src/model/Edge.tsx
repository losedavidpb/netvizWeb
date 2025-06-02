import * as THREE from 'three';
import type { JSX } from 'react';
import { Billboard, Line, Text } from '@react-three/drei';

import { Vertex } from "./Vertex";

export class Edge {

    // --------------------------------
    // Properties
    // --------------------------------

    private base: Vertex;
    private connect: Vertex;

    private text: string;
    private colour: THREE.Color;

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
     * Constructor for Edge
     *
     * @param base first vertex of the edge
     * @param connect second vertex of the edge
     */
    constructor(base: Vertex, connect: Vertex) {
        // ----------------------
        // TODO: TEMP
        //
        // These conditions would not be necessary if the scene, camera,
        // and renderer are defined externally.
        //
        // ----------------------

        if (Edge.scene == null || Edge.camera == null || Edge.renderer == null) {
            throw new Error('NullError :: THREE.js has not been initialised yet');
        }

        if (base == null || connect == null) {
            throw new Error('NullError :: Vertices of the edge must be defined');
        }

        this.base = base;
        this.connect = connect;

        this.text = "";
        this.colour = new THREE.Color();
    }

    /**
     * Draw the edge
     *
     * @returns edge component
     */
    draw(): JSX.Element {
        return (
            <>
                {this.base.draw()}
                {this.connect.draw()}

                {/* Render the solid edge */}
                <Line
                    points={[
                        this.getBase().getPos(),
                        this.getConnect().getPos()
                    ]}
                    vertexColors={[
                        this.getBase().getColour(),
                        this.getConnect().getColour()
                    ]}
                    color={
                        this.getColour().getHex()
                    }
                />

                {/* Render the text label */}
                {this.text != "" && this.drawText()}
            </>
        );
    }

    /**
     * Draws the text of the edge
     *
     * @returns text component
     */
    drawText(): JSX.Element {
        // Open mutex

        let position = this.getBase().getPos();
        position.add(this.getConnect().getPos());
        position.divideScalar(2);

        return (
            <>
                {/* Render the text based on the radius */}
                <Billboard position={position}>
                    <Text
                        color="black"
                        anchorX="center"
                        anchorY="top"
                        fontSize={0.1}
                    >
                        {this.text}
                    </Text>
                </Billboard>
            </>
        );

        // Close mutex
    }

    /**
     * Get the base vertex
     *
     * @returns base vertex
     */
    getBase(): Vertex {
        return this.base;
    }

    /**
     * Set the base vertex
     *
     * @param base new base
     */
    setBase(base: Vertex): void {
        this.base = base;
    }

    /**
     * Get the connect vertex
     *
     * @returns connect vertex
     */
    getConnect(): Vertex {
        return this.connect;
    }

    /**
     * Set the connect vertex
     *
     * @param connect new connect
     */
    setConnect(connect: Vertex): void {
        this.connect = connect;
    }

    /**
     * Get the edge's text
     *
     * @returns text of the edge
     */
    getText(): string {
        return this.text;
    }

    /**
     * Set the text of the edge
     *
     * @param t new text
     */
    setText(t: string): void {
        this.text = t;
    }

    /**
     * Get the colour of the edge
     *
     * @returns colour of the edge
     */
    getColour(): THREE.Color {
        return new THREE.Color(
            this.colour.r, this.colour.g, this.colour.b
        );
    }

    /**
     * Set the colours for the edge
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
    }
}