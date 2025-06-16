import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { SVGRenderer } from 'three/examples/jsm/Addons.js';
import { createRef, type JSX, type RefObject } from 'react';
import * as THREE from 'three';

import { Graph } from '../model/Graph';
import { Vertex } from '../model/Vertex';
import { Betweenness } from '../model/centrality/Betweenness';
import { CommandMap } from '../controller/CommandMap';
import { Widget } from './Widget';
import { LoadGraph } from '../controller/commands/LoadGraph';
import { RefreshGraph } from '../controller/commands/RefreshGraph';

/**
 * GLWindow :: Representation of a GLWindow
 *
 * @author losedavidpb <losedavidpb@gmail.com>
 */
export class GLWindow {

    // --------------------------------
    // Properties
    // --------------------------------

    private static instance: GLWindow;

    private width: number;
    private height: number;

    private pitch: number = 0;
    private yaw: number = 0;

    private translate: THREE.Vector3;
    private mouse: THREE.Vector2;

    private widgetRef: RefObject<Widget | null>;

    private content: string = '';
    private graph: Graph | undefined;

    private commands: CommandMap = new CommandMap();

    private selectedNode: Vertex | null;
    private selectedVertexNumber: number | undefined;
    private selectedEdgeIndex: number;

    private keyCTRL: boolean = false;
    private keySHIFT: boolean = false;

    private mouseDiff: THREE.Vector2;

    private mouseRIGHT: boolean = false;
    private mouseMIDDLE: boolean = false;
    private mouseLEFT: boolean = false;

    // Avoid the definition of multiple instances
    private constructor(width: number, height: number) {
        this.width = width;
        this.height = height;

        this.widgetRef = createRef<Widget>();

        this.translate = new THREE.Vector3(0, 0, 1);
        this.mouse = new THREE.Vector2(0, 0);
        this.mouseDiff = new THREE.Vector2();

        this.selectedNode = null;
        this.selectedEdgeIndex = -1;

        this.init_commands();
    }

    /**
     * Get the instance of the window
     *
     * @returns GLWindow
     */
    static init(): GLWindow {
        if (GLWindow.instance === undefined) {
            GLWindow.instance = new GLWindow(1280, 720);
        }

        return GLWindow.instance;
    }

    /**
     * Set React callback for rendering
     *
     * @param callback callback for react
     */
    setUpdateCallback(callback: () => void): void {
        const cmd = this.commands.get('RefreshGraph') as RefreshGraph;
        cmd.setCallback(callback);
    }

    /**
     * Get the widget of the window
     *
     * @returns widget
     */
    getWidget(): Widget | null {
        return this.widgetRef.current;
    }

    /**
     * Get the content of the graph
     *
     * @returns content of the graph
     */
    getContent(): string {
        return this.content;
    }

    /**
     * Set a new graph file path
     *
     * @param content graph file path
     */
    setContent(content: string): void {
        this.content = content;
    }

    /**
     * Get the graph
     *
     * @returns graph
     */
    getGraph(): Graph | undefined {
        return this.graph;
    }

    /**
     * Set a new graph
     *
     * @param graph new graph
     */
    setGraph(graph: Graph): void {
        this.graph = graph;
    }

    /**
     * Get the selected node
     *
     * @returns selected node
     */
    getSelectedNode(): Vertex | null {
        return this.selectedNode;
    }

    /**
     * Set the selected node
     *
     * @param selectedNode selected node
     */
    setSelectedNode(selectedNode: Vertex | null): void {
        this.selectedNode = selectedNode;
    }

    /**
     * Get the selected edge index
     *
     * @returns selected edge index
     */
    getSelectedEdgeIndex(): number {
        return this.selectedEdgeIndex;
    }

    /**
     * Set a the index of the selected edge
     *
     * @param selectedEdgeIndex selected edge index
     */
    setSelectedEdgeIndex(selectedEdgeIndex: number): void {
        this.selectedEdgeIndex = selectedEdgeIndex;
    }

    /**
     * Take a PNG screenshot of the current graph
     *
     * @param filename filename of the screenshot
     */
    pngScreenshot = (filename: string) => {
        if (this.graph !== undefined && filename !== '') {
            const png_filename = filename.endsWith('.png') ? filename : `${filename}.png`;

            window.focus();

            Graph.renderer.render(Graph.scene, Graph.camera);

            const canvas = Graph.renderer.domElement;
            const image = canvas.toDataURL("image/png");

            const link = document.createElement("a");
            link.href = image;
            link.download = png_filename;
            link.click();
        }
    };

    /**
     * Take a SVG screenshot of the current graph
     *
     * @param filename filename of the screenshot
     */
    svgScreenshot = (filename: string) => {
        if (this.graph !== undefined && filename !== '') {
            const svg_filename = filename.endsWith('.svg') ? filename : `${filename}.svg`;

            const svgRenderer = new SVGRenderer();
            svgRenderer.setSize(this.width, this.height);

            document.body.appendChild(svgRenderer.domElement);
            svgRenderer.render(Graph.scene, Graph.camera);

            const svgElement = svgRenderer.domElement as SVGSVGElement;
            const svgData = new XMLSerializer().serializeToString(svgElement);
            const blob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });

            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = svg_filename;
            link.click();
        }
    };

    /**
     * Toggle the view of the widget
     */
    toggleWidget(): void {
        if (this.widgetRef.current !== null) {
            this.widgetRef.current.toggleView();
        }
    }

    /**
     * Load a graph based on the graph file path
     */
    loadGraph(): void {
        this.commands.execute('LoadGraph');
    }

    /**
     * Save the graph at passed filename
     *
     * @param filename filename for the graph
     */
    saveFile(filename: string): void {
        const cmd = this.commands.get('SaveGraph') as SaveGraph;
        cmd.setFilename(filename);

        cmd.execute('SaveGraph');
    }

    /**
     * Apply the selected algorithm
     */
    applyAlgorithm(): void {
        if (this.widgetRef.current !== null) {
            this.widgetRef.current.applyAlgorithm();
        }
    }

    applyColoration(): void {
        if (this.widgetRef.current !== null) {
            this.widgetRef.current.applyColoration();
        }
    }

    /**
     * Refresh the current graph
     */
    refresh(): void {
        this.commands.execute('RefreshGraph');
    }

    /**
     * Start the rendering process of the window
     */
    render() {
        return (
            <div
                className="w-100 h-100"
                tabIndex={0}
                onKeyDown={this.keyPressedEvent}
                onKeyUp={this.keyReleasedEvent}
            >
                <Canvas
                    gl={{ antialias: true }}
                    onWheel={this.scrollEvent}
                    onMouseDown={this.mousePressedEvent}
                    onMouseUp={this.mouseReleasedEvent}
                    onMouseMove={this.mousePositionEvent}
                    onContextMenu={e => e.preventDefault()}
                    onCreated={({ scene, camera, gl }) => {
                        Graph.scene = scene;
                        Graph.camera = camera;
                        Graph.renderer = gl;
                    }}
                >
                    <this.GraphScene
                        pitch={this.pitch}
                        yaw={this.yaw}
                        translate={this.translate}
                        graph={this.graph}
                    />
                </Canvas>
                <Widget ref={this.widgetRef} />
            </div>
        );
    }

    // --------------------------------
    // Private
    // --------------------------------

    init_commands(): void {
        this.commands = new CommandMap();
        this.commands.add('LoadGraph', new LoadGraph(this));
        //this.commands.addCommand('DeleteVertex': new DeleteVertex(this, -1));
        //this.commands.addCommand('DeleteEdge': new DeleteEdge(this, -1));
        //this.commands.addCommand('ColourNode': new ColourNode(this));
        //this.commands.addCommand('TextNode': new TextNode(this));
        this.commands.add('RefreshGraph', new RefreshGraph(this));
        //this.commands.addCommand('DragVertex': new DragVertex(this));
        //this.commands.addCommand('SelectEdge': new SelectEdge(this));
        //this.commands.addCommand('SelectVertex': new SelectVertex(this));
        //this.commands.addCommand('NameByIndex': new NameByIndex(this);
    }

    private scrollEvent = (event: React.WheelEvent) => {
        const window = GLWindow.init();
        window.translate.z += (event.deltaY / 20) * window.translate.z;

        if (window.translate.z < 0.12) {
            window.translate.z = 0.12;
        }
    };

    private mousePressedEvent = (event: React.MouseEvent) => {
        const window = GLWindow.init();

        // Right Button
        if (event.button === 2) {
            window.mouseRIGHT = true;

            if (window.keySHIFT) {
                window.commands.execute('SelectEdge');
            } else {
                window.commands.execute('SelectVertex');
            }
        }

        // Left button
        if (event.button === 0) {
            window.mouseLEFT = true;
        }

        // Middle button
        if (event.button === 1) {
            window.mouseMIDDLE = true;
        }
    };

    private mouseReleasedEvent = (event: React.MouseEvent) => {
        const window = GLWindow.init();

        // Right Button
        if (event.button === 2) {
            window.mouseRIGHT = false;
        }

        // Left button
        if (event.button === 0) {
            window.mouseLEFT = false;
        }

        // Middle button
        if (event.button === 1) {
            window.mouseMIDDLE = false;
        }
    };

    private mousePositionEvent = (event: React.MouseEvent) => {
        const window = GLWindow.init();

        window.mouseDiff.x = window.mouse.x - event.clientX;
        window.mouseDiff.y = window.mouse.y - event.clientY;

        if (window.mouseMIDDLE) {
            window.yaw += (event.clientX - window.mouse.x) / 8;
            window.pitch += (event.clientY - window.mouse.y) / 8;

        }

        if (window.mouseLEFT && !window.keyCTRL) {
            window.translate.x += ((event.clientX - window.mouse.x) / window.width) * window.translate.z;
            window.translate.y += ((window.mouse.y - event.clientY) / window.width) * window.translate.z;
        }

        window.mouse = new THREE.Vector2(
            event.clientX, event.clientY
        );

        if (window.mouseLEFT && window.keyCTRL) {
            window.commands.execute('DragNode');
        }
    };

    private keyPressedEvent = (event: React.KeyboardEvent) => {
        const window = GLWindow.init();

        if (event.key.toLowerCase() === 't') {
            window.toggleWidget();
        }

        if (event.key.toLowerCase() === 'n') {
            window.commands.execute('NameByIndex');
        }

        if (event.key === 'F5') {
            window.pngScreenshot("DefaultPng.png");
        }

        if (event.key === 'F6') {
            window.svgScreenshot("DefaultSVG.svg");
        }

        if (event.key.toLowerCase() === 'b') {
            if (window.graph !== undefined) {
                new Betweenness().apply(window.graph);
            }
        }

        if (event.key === 'Delete') {
            if (window.graph !== undefined) {
                if (window.graph.getNumVertices() > 1) {
                    //const cmd = window.commands.get('DeleteVertex') as DeleteVertex;
                    //cmd.setDeleteNode(window.selectedVertexNumber);
                    //cmd.execute();

                    window.selectedVertexNumber = -1;
                }
            }
        }

        if (event.key === 'Insert') {
            if (window.graph !== undefined) {
                if (window.graph.getNumVertices() > 1) {
                    //const cmd = window.commands.get('DeleteEdge') as DeleteEdge;
                    //cmd.setDeleteEdge(window.selectedEdgeIndex);
                    //cmd.execute();

                    window.selectedEdgeIndex = -1;
                }
            }
        }

        if (event.key === 'Control') {
            window.keyCTRL = true;
        }

        if (event.key === 'Shift') {
            window.keySHIFT = true;
        }

        window.move_graph_with_keys(event);
    };

    private keyReleasedEvent = (event: React.KeyboardEvent) => {
        const window = GLWindow.init();

        if (event.key === 'Control') {
            window.keyCTRL = false;
        }

        if (event.key === 'Shift') {
            window.keySHIFT = false;
        }

        window.move_graph_with_keys(event);
    };

    private move_graph_with_keys(event: React.KeyboardEvent): void {
        const window = GLWindow.init();

        if (event.key === 'ArrowLeft') {
            window.translate.x -= .01;
        }

        if (event.key === 'ArrowRight') {
            window.translate.x += .01;
        }

        if (event.key === 'ArrowDown') {
            window.translate.y -= .01;
        }

        if (event.key === 'ArrowUp') {
            window.translate.y += .01;
        }
    }

    private GraphScene({ pitch, yaw, translate, graph }: {
        pitch: number;
        yaw: number;
        translate: THREE.Vector3;
        graph?: Graph;
    }): JSX.Element {

        const { camera, gl, size } = useThree();

        useFrame(() => {
            gl.setSize(size.width, size.height);
            gl.setViewport(0, 0, size.width, size.height);
            gl.clear(true, true);

            camera.position.set(0, 0, translate.z);
            camera.rotation.set(
                THREE.MathUtils.degToRad(pitch),
                THREE.MathUtils.degToRad(yaw), 0
            );

            camera.lookAt(translate.x, translate.y, 0);
        });

        return (
            <>
                <ambientLight />
                <pointLight position={[10, 10, 10]} />
                <OrbitControls />
                {graph ? graph.draw() : null}
            </>
        );
    }
}