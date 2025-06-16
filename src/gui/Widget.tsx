import * as THREE from 'three';
import React, { Component, type JSX } from 'react';

import CollapsibleList from './CollapsibleList';

import { GLWindow } from './GLWindow';
import { Vertex } from '../model/Vertex';
import { CentralityFactoryMethod } from '../model/centrality/CentralityFactoryMethod';
import { AlgorithmFactoryMethod } from '../model/algorithm/AlgorithmFactoryMethod';
import { AlgorithmType } from '../model/Algorithm';
import { CentralityType } from '../model/Centrality';

/**
 * Widget :: Representation of a widget
 *
 * @author losedavidpb <losedavidpb@gmail.com>
 */
export class Widget extends Component<{}, {
    visible: boolean,
    algorithm: AlgorithmType,
    centrality: CentralityType,
    fileInputRef: React.RefObject<HTMLInputElement | null>,
    nodeText: string,
    nodeColour: THREE.Color,
    edgeText: string,
    edgeColour: THREE.Color
}> {
    /**
     * Constructor for Widget
     *
     * @param props properties  of the widget
     */
    constructor(props: {}) {
        super(props);

        this.state = {
            visible: true,
            algorithm: "FruchtermanReingold",
            centrality: "DegreeCentrality",
            fileInputRef: React.createRef(),
            nodeText: '',
            nodeColour: new THREE.Color(),
            edgeText: '',
            edgeColour: new THREE.Color(),
        };
    }

    /**
     * Set the visibility of the widget
     */
    toggleView(): void {
        const visible = this.state.visible;
        this.setState({ visible: !visible });
    }

    /**
     * Apply the algorithm to the graph
     */
    applyAlgorithm(): void {
        this.apply_algorithm(this.state.algorithm);
    }

    /**
     * Apply the coloration to the graph
     */
    applyColoration(): void {
        this.apply_centrality(this.state.centrality);
    }

    /**
     * Start the rendering of the widget
     *
     * @returns widget component
     */
    render(): JSX.Element | undefined {
        if (this.state.visible) {
            return (
                <div className="container bg-white shadow-sm rounded" id="toolbox">
                    <h1 className="mb-3">Toolbox</h1>
                    <hr></hr>

                    <div className="d-flex flex-column mb-3">
                        <input
                            ref={this.state.fileInputRef}
                            type="file"
                            style={{ display: 'none' }}
                            onChange={(event) => this.open_file(event)}
                        />

                        <button
                            className="btn btn-light btn-outline-primary mb-2"
                            onClick={() => this.state.fileInputRef.current?.click()}
                        >
                            Open File
                        </button>

                        <button
                            className="btn btn-light btn-outline-primary mb-2"
                            onClick={() => this.export_file()}
                        >
                            Export As
                        </button>
                    </div>
                    <hr></hr>

                    <h4>Graph Settings</h4>
                    <CollapsibleList
                        options={['Fruchterman Reingold', 'Simple Force Directed', 'Multi Force']}
                        defaultText="Fruchterman Reingold"
                        onOptionSelect={(e) => {
                            const opt = e.replace(/\s+/g, '') as AlgorithmType;
                            this.apply_algorithm(opt);
                            this.refresh_graph();
                        }}
                    />

                    <CollapsibleList
                        options={['Degree Centrality', 'Distance Centrality', 'Betweenness Centrality']}
                        defaultText="Degree Centrality"
                        onOptionSelect={(e) => {
                            const opt = e.replace(/\s+/g, '') as CentralityType;
                            this.apply_centrality(opt);
                            this.refresh_graph();
                        }}
                    />

                    <div className="d-flex flex-column mb-3">
                        <button
                            className="btn btn-light btn-outline-primary mb-2"
                            onClick={() => this.refresh_graph()}
                        >
                            Refresh Graph
                        </button>
                    </div>
                    <hr></hr>

                    <div>
                        <div>
                            <h6>Add text/colour to node</h6>
                            <input
                                type="text"
                                name="text_node"
                                className="form-control mb-2"
                                value={this.state.nodeText}
                                placeholder=""
                                onChange={(e) => {
                                    this.setState({ nodeText: e.target.value });
                                    this.update_text_node(e.target.value);
                                }}
                            />
                            <input
                                type="color"
                                name="color_node"
                                className="form-control mb-2"
                                value={'#' + this.state.nodeColour.getHexString()}
                                onChange={(e) => {
                                    this.setState({ nodeColour: new THREE.Color(e.target.value) });
                                    this.update_color_node(e.target.value);
                                }}
                            />
                        </div>
                        <div>
                            <h6>Add text/colour to edge</h6>
                            <input
                                type="text"
                                name="text_edge"
                                className="form-control mb-2"
                                value={this.state.edgeText}
                                placeholder=""
                                onChange={(e) => {
                                    this.setState({ edgeText: e.target.value });
                                    this.update_text_edge(e.target.value);
                                }}
                            />
                            <input
                                type="color"
                                name="color_edge"
                                className="form-control mb-2"
                                value={'#' + this.state.edgeColour.getHexString()}
                                onChange={(e) => {
                                    this.setState({ edgeColour: new THREE.Color(e.target.value) });
                                    this.update_color_edge(e.target.value);
                                }}
                            />
                        </div>
                    </div>
                    <hr></hr>
                </div>
            );
        }
    }

    // --------------------------------
    // Private
    // --------------------------------

    private open_file(event: React.ChangeEvent<HTMLInputElement>): void {
        const files = event.target.files;

        if (files !== null && files.length === 1) {
            const file = files[0];

            const reader = new FileReader();

            reader.onload = (e) => {
                const content = e.target?.result as string;

                const window = GLWindow.init();
                window.setContent(content);
                window.loadGraph();
            };

            reader.readAsText(file);
        }
    }

    private export_file(): void {
        let filename = prompt("Enter name of the new file", "Untitled");
        filename = filename === null ? 'Untitled' : filename;

        const window = GLWindow.init();
        window.saveFile(filename);
    }

    private apply_algorithm(name: AlgorithmType): void {
        const window = GLWindow.init();
        const graph = window.getGraph();

        if (graph !== undefined) {
            this.setState({ algorithm: name });
            AlgorithmFactoryMethod.createAlgorithm(name, graph).apply();
        }
    }

    private apply_centrality(name: CentralityType): void {
        const window = GLWindow.init();
        const graph = window.getGraph();

        if (graph !== undefined) {
            this.setState({ centrality: name });
            CentralityFactoryMethod.createCentrality(name).apply(graph);
        }
    }

    private refresh_graph(): void {
        const window = GLWindow.init();
        window.refresh();
    }

    private update_text_node(text: string): void {
        const window = GLWindow.init();
        const selectedNode = window.getSelectedNode();

        if (selectedNode !== null) {
            selectedNode.setText(text);
        }
    }

    private update_color_node(colour: string): void {
        if (colour.length > 1) {
            const window = GLWindow.init();
            const selected_node = window.getSelectedNode();

            if (selected_node !== null) {
                const RGB = Widget.hexToRGB(colour);
                selected_node.setColour(RGB.r, RGB.g, RGB.b);
            }
        }
    }

    private update_text_edge(text: string): void {
        const window = GLWindow.init();
        const selectedEdgeIndex = window.getSelectedEdgeIndex();

        if (selectedEdgeIndex >= 0) {
            const graph = window.getGraph();
            const edges = graph?.getEdges();

            if (graph !== undefined && edges !== undefined) {
                const vertices = graph.getVertices();

                const u = edges[selectedEdgeIndex][0];
                const v = edges[selectedEdgeIndex][1];

                const setEdgeText = (i: number): void => {
                    vertices[v].getEdges()[i].setText(text);
                }

                if (!Widget.set_edge_text_colour(setEdgeText, u, vertices)) {
                    Widget.set_edge_text_colour(setEdgeText, v, vertices);
                }
            }
        }
    }

    private update_color_edge(colour: string): void {
        if (colour.length > 1) {
            const window = GLWindow.init();
            const selectedEdgeIndex = window.getSelectedEdgeIndex();

            if (selectedEdgeIndex >= 0) {
                const graph = window.getGraph();
                const edges = graph?.getEdges();

                if (graph !== undefined && edges !== undefined) {
                    const vertices = graph.getVertices();

                    const u = edges[selectedEdgeIndex][0];
                    const v = edges[selectedEdgeIndex][1];

                    const setEdgeColour = (i: number): void => {
                        const RGB = Widget.hexToRGB(colour);
                        vertices[v].getEdges()[i].setColour(RGB.r, RGB.g, RGB.b);
                    };

                    if (!Widget.set_edge_text_colour(setEdgeColour, u, vertices)) {
                        Widget.set_edge_text_colour(setEdgeColour, v, vertices);
                    }
                }
            }
        }
    }

    private static set_edge_text_colour(func: (i: number) => void, v: number, vertices: Vertex[]): boolean {
        const attachedPoints = vertices[v].getAttachedPoints();

        for (let i = 0; i < attachedPoints.length; ++i) {
            if (attachedPoints[i].getVertexNumber() === v) {
                func(i);
                return true;
            }
        }

        return false;
    }

    private static hexToRGB(hex: string): { r: number, g: number, b: number } {
        const bigint = parseInt(hex.replace(/^#/, ''), 16);

        return {
            r: (bigint >> 16) & 255,
            g: (bigint >> 8) & 255,
            b: bigint & 255
        };
    }
}