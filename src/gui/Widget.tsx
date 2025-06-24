import * as THREE from 'three';
import React, { Component, type JSX } from 'react';

import CollapsibleList from './CollapsibleList';

import { GLWindow } from './GLWindow';
import { Vertex } from '../model/Vertex';
import { CentralityFactoryMethod } from '../model/centrality/CentralityFactoryMethod';
import { AlgorithmFactoryMethod } from '../model/algorithm/AlgorithmFactoryMethod';
import { AlgorithmType } from '../model/Algorithm';
import { Algorithm } from '../model/Algorithm'
import { Centrality, CentralityType } from '../model/Centrality';
import { Config } from '../Config';

/**
 * Widget :: Toolbox of the GLWindow
 *
 * @author losedavidpb <losedavidpb@gmail.com>
 */
export class Widget extends Component<{}, {
    visible: boolean,
    algorithmType: AlgorithmType,
    algorithm: Algorithm | null,
    centralityType: CentralityType,
    centrality: Centrality | null,
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
            algorithmType: Config.defaultAlgorithm,
            algorithm: null,
            centralityType: Config.defaultCentrality,
            centrality: null,
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
        this.apply_algorithm(this.state.algorithmType);
    }

    /**
     * Apply the coloration to the graph
     */
    applyColoration(): void {
        this.apply_centrality(this.state.centralityType);
    }

    /**
     * Update the text of the selected node
     *
     * @param text text to be updated
     */
    updateTextNode(text: string): void {
        this.setState({ nodeText: text });
        this.update_text_node(text);
    }

    /**
     * Update the color of the selected node
     *
     * @param color color to be updated
     */
    updateColorNode(color: string): void {
        this.setState({ nodeColour: new THREE.Color(color) });
        this.update_color_node(color);
    }

    /**
     * Update the text of the selected edge
     *
     * @param text text to be updated
     */
    updateTextEdge(text: string): void {
        this.setState({ edgeText: text });
        this.update_text_edge(text);
    }

    /**
     * Update the color of the selected edge
     *
     * @param color color to be updated
     */
    updateColorEdge(color: string): void {
        this.setState({ edgeColour: new THREE.Color(color) });
        this.update_color_edge(color);
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
                        options={['Degree Centrality', 'Distance Centrality', 'Betweenness']}
                        defaultText="Degree Centrality"
                        onOptionSelect={(e) => {
                            const opt = e.replace(/\s+/g, '') as CentralityType;
                            this.apply_centrality(opt);
                            this.refresh_graph();
                        }}
                    />
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
                                onChange={(e) => this.updateTextNode(e.target.value)}
                            />
                            <input
                                type="color"
                                name="color_node"
                                className="form-control mb-2"
                                value={'#' + this.state.nodeColour.getHexString()}
                                onChange={(e) => this.updateColorNode(e.target.value)}
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
                                onChange={(e) => this.updateTextEdge(e.target.value)}
                            />
                            <input
                                type="color"
                                name="color_edge"
                                className="form-control mb-2"
                                value={'#' + this.state.edgeColour.getHexString()}
                                onChange={(e) => this.updateColorEdge(e.target.value)}
                            />
                        </div>
                    </div>
                    <hr></hr>
                    <Footer text={Config.footer} />
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
        let filename = prompt("Enter name of the new file", Config.defaultExportFile);
        filename = filename === null ? Config.defaultExportFile : filename;

        GLWindow.init().saveFile(filename);
    }

    private apply_algorithm(name: AlgorithmType): void {
        const graph = GLWindow.init().getGraph();

        if (graph !== null) {
            const { algorithmType, algorithm } = this.state;

            if (algorithm !== null && algorithm?.getGraph() !== graph || algorithm === null || algorithmType !== name) {
                const newAlgorithm = AlgorithmFactoryMethod.createAlgorithm(name, graph);
                this.setState({ algorithmType: name, algorithm: newAlgorithm }, () => newAlgorithm.apply());
            } else {
                algorithm.apply();
            }
        }
    }

    private apply_centrality(name: CentralityType): void {
        const graph = GLWindow.init().getGraph();

        if (graph !== null) {
            const { centralityType, centrality } = this.state;

            if (centrality === null || centralityType !== name) {
                const newCentrality = CentralityFactoryMethod.createCentrality(name);
                this.setState({ centralityType: name, centrality: newCentrality }, () => newCentrality.apply(graph));
            } else {
                centrality.apply(graph);
            }
        }
    }

    private refresh_graph(): void {
        GLWindow.init().refresh();
    }

    private update_text_node(text: string): void {
        const selectedNode = GLWindow.init().getSelectedNode();

        if (selectedNode !== null) {
            selectedNode.setText(text);
        }
    }

    private update_color_node(colour: string): void {
        if (colour.length > 1) {
            const selected_node = GLWindow.init().getSelectedNode();

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

            if (graph !== null && edges !== undefined) {
                const vertices = graph.getVertices();

                const u = edges[selectedEdgeIndex][0];
                const v = edges[selectedEdgeIndex][1];

                if (!Widget.set_edge_text(u, v, vertices, text)) {
                    Widget.set_edge_text(v, u, vertices, text);
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

                if (graph !== null && edges !== undefined) {
                    const vertices = graph.getVertices();

                    const u = edges[selectedEdgeIndex][0];
                    const v = edges[selectedEdgeIndex][1];

                    if (!Widget.set_edge_colour(u, v, vertices, colour)) {
                        Widget.set_edge_colour(v, u, vertices, colour);
                    }
                }
            }
        }
    }

    private static set_edge_text(from: number, to: number, vertices: Vertex[], text: string): boolean {
        const attachedPoints = vertices[from].getAttachedPoints();

        for (let i = 0; i < attachedPoints.length; ++i) {
            if (attachedPoints[i].getVertexNumber() === to) {
                vertices[from].getEdges()[i].setText(text);
                return true;
            }
        }

        return false;
    }

    private static set_edge_colour(from: number, to: number, vertices: Vertex[], colour: string): boolean {
        const attachedPoints = vertices[from].getAttachedPoints();

        for (let i = 0; i < attachedPoints.length; ++i) {
            if (attachedPoints[i].getVertexNumber() === to) {
                const RGB = Widget.hexToRGB(colour);
                console.log(RGB.r + ", " + RGB.g + ", " + RGB.b);
                vertices[from].getEdges()[i].setColour(RGB.r, RGB.g, RGB.b);
                return true;
            }
        }

        return false;
    }

    private static hexToRGB(hex: string): { r: number, g: number, b: number } {
        const bigint = parseInt(hex.replace(/^#/, ''), 16);

        return {
            r: ((bigint >> 16) & 255) / 255,
            g: ((bigint >> 8) & 255) / 255,
            b: (bigint & 255) / 255
        };
    }
}

// --------------------------------
// Components
// --------------------------------

const Footer: React.FC<{ text: string }> = ({ text }) => {
    return (
        <footer style={{
            backgroundColor: 'black',
            color: 'white',
            fontSize: '0.8rem',
            padding: '0.5rem 1rem',
            textAlign: 'center',
            position: 'fixed',
            bottom: 0,
            width: '100%',
            zIndex: 1000,
        }}>
            {text}
        </footer>
    );
};