import * as THREE from 'three';
import type { JSX } from 'react';
import { Billboard, Line, Text } from '@react-three/drei';

import { Vertex } from "./Vertex";

/**
 * Edge :: Representation of an edge
 *
 * @author losedavidpb <losedavidpb@gmail.com>
 */
export class Edge {

    // --------------------------------
    // Properties
    // --------------------------------

    private base: Vertex;
    private connect: Vertex;

    private text: string = "";
    private colour: THREE.Color = new THREE.Color();

    /**
     * Creates new Edge instance.
     *
     * @param base base component of the edge
     * @param connect connect component of the edge
     */
    constructor(base: Vertex, connect: Vertex) {
        this.base = base;
        this.connect = connect;

        // Set colour edge based on the browser
        this.set_default_colour();
    }

    /* v8 ignore next 16 */
    private set_default_colour(): void {
        if (typeof window !== "undefined" && typeof window.matchMedia === "function") {
            if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
                this.setColour(1, 1, 1);
            } else {
                this.setColour(0, 0, 0);
            }

            window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", e => {
                if (e.matches) {
                    this.setColour(1, 1, 1);
                } else {
                    this.setColour(0, 0, 0);
                }
            });
        }
    }

    /**
     * Starts the rendering of the edge.
     *
     * @returns JSX element representing the edge
     */
    /* v8 ignore next 26 */
    draw(): JSX.Element {
        return (
            <>
                {/* Render the solid edge */}
                <Line
                    points={[
                        this.getBase().getPos(),
                        this.getConnect().getPos()
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
     * Renders the text associated with the edge.
     *
     * @returns JSX element representing the edge text
     */
    /* v8 ignore next 25 */
    drawText(): JSX.Element {
        const position = this.getBase().getPos();
        position.add(this.getConnect().getPos());
        position.divideScalar(2);

        return (
            <Billboard position={position}>
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
     * Gets the ID of the edge.
     *
     * @returns identifier of the edge
     */
    getEdgeNumber(): number {
        const baseID = this.base.getVertexNumber();
        const connectID = this.connect.getVertexNumber();

        return 0.5 * (baseID + connectID) * (baseID + connectID + 1) + connectID;
    }

    /**
     * Gets the base component of the edge.
     *
     * @returns base component
     */
    getBase(): Vertex {
        return this.base;
    }

    /**
     * Updates the base component.
     *
     * @param base new base component
     */
    setBase(base: Vertex): void {
        this.base = base;
    }

    /**
     * Gets the connect component of the edge.
     *
     * @returns connect component
     */
    getConnect(): Vertex {
        return this.connect;
    }

    /**
     * Updates the connect component.
     *
     * @param connect new connect component
     */
    setConnect(connect: Vertex): void {
        this.connect = connect;
    }

    /**
     * Gets the text of the edge.
     *
     * @returns text of the edge
     */
    getText(): string {
        return this.text;
    }

    /**
     * Updates the text of the edge.
     *
     * @param t new text
     */
    setText(t: string): void {
        this.text = t;
    }

    /**
     * Gets a copy of the colour of the edge.
     *
     * @returns colour of the edge
     */
    getColour(): THREE.Color {
        return new THREE.Color(
            this.colour.r, this.colour.g, this.colour.b
        );
    }

    /**
     * Updates the colour of the edge.
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
    }

    /**
     * Gets the hashcode of the edge.
     *
     * @returns edge hashcode
     */
    hashCode(): number {
        const baseHash = this.base.hashCode();
        const connectHash = this.connect.hashCode();

        return 0.5 * (baseHash + connectHash) * (baseHash + connectHash + 1) + connectHash;
    }

    /**
     * Checks whether the current and the passed edge are equal.
     *
     * @param other edge to be compared
     * @returns if edges are equal
     */
    equals(other: unknown): boolean {
        if (!(other instanceof Edge)) return false;
        return this.hashCode() === other.hashCode();
    }

    /**
     * Retrieves a copy of the current vertex.
     *
     * @returns clone of the vertex
     */
    clone(): Edge {
        const clone_obj = new Edge(this.base.clone(), this.connect.clone());
        clone_obj.colour = this.getColour();
        clone_obj.text = this.getText();

        return clone_obj;
    }
}