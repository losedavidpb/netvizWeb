import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { SVGRenderer } from 'three/examples/jsm/Addons.js';
import { createRef, useEffect, type JSX, type RefObject } from 'react';
import * as THREE from 'three';

import { Graph } from '../model/Graph';
import { Vertex } from '../model/Vertex';
import { Betweenness } from '../model/centrality/Betweenness';
import { CommandMap } from '../controller/CommandMap';
import { Widget } from './Widget';
import { LoadGraph } from '../controller/commands/LoadGraph';
import { RefreshGraph } from '../controller/commands/RefreshGraph';
import { SaveGraph } from '../controller/commands/SaveGraph';
import { SelectVertex } from '../controller/commands/SelectVertex';
import { SelectEdge } from '../controller/commands/SelectEdge';
import { NameByIndex } from '../controller/commands/NameByIndex';
import { DragVertex } from '../controller/commands/DragVertex';
import { DeleteVertex } from '../controller/commands/DeleteVertex';
import { DeleteEdge } from '../controller/commands/DeleteEdge';
import { TaskRunner } from '../model/Worker';

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

    private algorithmRunner: TaskRunner | undefined;
    private firstIteration: boolean = true;

    private size: THREE.Vector2;
    private widgetRef: RefObject<Widget | null>;

    private content: string = '';
    private graph: Graph | undefined;

    private selectedNode: Vertex | null;
    private selectedEdgeIndex: number;

    private commands: CommandMap = new CommandMap();

    private pitch: number = 0;
    private yaw: number = 0;

    private translate: THREE.Vector3;

    private mouse: THREE.Vector2;
    private mouseDiff: THREE.Vector2;

    private mouseRIGHT: boolean = false;
    private mouseMIDDLE: boolean = false;
    private mouseLEFT: boolean = false;

    private keyCTRL: boolean = false;
    private keySHIFT: boolean = false;

    private constructor(width: number, height: number) {
        this.size = new THREE.Vector2(width, height);
        this.widgetRef = createRef<Widget>();

        this.selectedNode = null;
        this.selectedEdgeIndex = -1;

        this.translate = new THREE.Vector3(0, 0, 1);
        this.mouse = new THREE.Vector2(0, 0);
        this.mouseDiff = new THREE.Vector2();

        this.init_threads();
        this.init_commands();
    }

    // --------------------------------
    // Init
    // --------------------------------

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

    private init_threads(): void {
        this.firstIteration = true;

        this.algorithmRunner = new TaskRunner(() => {
            if (this.widgetRef.current !== null) {
                this.widgetRef.current.applyAlgorithm();
                this.refresh(true, this.firstIteration);

                if (this.firstIteration) {
                    this.firstIteration = false;
                }
            }
        });
    }

    private init_commands(): void {
        this.commands = new CommandMap();
        this.commands.add('LoadGraph', new LoadGraph(this));
        this.commands.add('SaveGraph', new SaveGraph(this));
        this.commands.add('DeleteVertex', new DeleteVertex(this));
        this.commands.add('DeleteEdge', new DeleteEdge(this));
        this.commands.add('RefreshGraph', new RefreshGraph(this));
        this.commands.add('DragVertex', new DragVertex(this));
        this.commands.add('SelectEdge', new SelectEdge(this));
        this.commands.add('SelectVertex', new SelectVertex(this));
        this.commands.add('NameByIndex', new NameByIndex(this));
    }

    /**
     * Get the size of the window
     *
     * @returns size of the window
     */
    getSize(): THREE.Vector2 {
        return new THREE.Vector2(this.size.x, this.size.y);
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
     * Set the index of the selected edge
     *
     * @param selectedEdgeIndex selected edge index
     */
    setSelectedEdgeIndex(selectedEdgeIndex: number): void {
        this.selectedEdgeIndex = selectedEdgeIndex;
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

            window.focus();

            Graph.renderer.render(Graph.scene, Graph.camera);

            const canvas = Graph.renderer.domElement;
            const imageData = canvas.toDataURL("image/png");

            // Create SVG with embedded PNG image
            const svgContent = `
                <svg xmlns="http://www.w3.org/2000/svg" width="${canvas.width}" height="${canvas.height}">
                    <rect width="100%" height="100%" fill="black" />
                    <image href="${imageData}" width="${canvas.width}" height="${canvas.height}" />
                </svg>
            `;

            const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
            const url = URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = url;
            link.download = svg_filename;
            link.click();

            URL.revokeObjectURL(url);
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
        cmd.execute();
    }

    /**
     * Select a specific vertex from the current graph
     *
     * @param mouseX x-coord of the mouse
     * @param mouseY y-coord of the mouse
     */
    selectVertex(mouseX: number, mouseY: number): void {
        const cmd = this.commands.get('SelectVertex') as SelectVertex;
        cmd.setMousePosition(mouseX, mouseY);
        cmd.execute();
    }

    /**
     * Select a specific edge from the current graph
     *
     * @param mouseX x-coord of the mouse
     * @param mouseY y-coord of the mouse
     */
    selectEdge(mouseX: number, mouseY: number): void {
        const cmd = this.commands.get('SelectEdge') as SelectEdge;
        cmd.setMousePosition(mouseX, mouseY);
        cmd.execute();
    }

    /**
     * Name the vertices of the graph based on their index
     */
    nameByIndex(): void {
        this.commands.execute('NameByIndex');
    }

    /**
     * Drag and move the selected vertex
     *
     * @param mouseDiff mouse diff vector
     * @param translateZ Z-coord of the translate vector
     */
    dragVertex(mouseDiff: THREE.Vector2, translateZ: number): void {
        const cmd = this.commands.get('DragVertex') as DragVertex;
        cmd.setMouseDiff(mouseDiff);
        cmd.setTranslateZ(translateZ);
        cmd.execute();
    }

    /**
     * Delete the selected vertex
     */
    deleteVertex(): void {
        const cmd = this.commands.get('DeleteVertex') as DeleteVertex;
        cmd.setSelectedNode(this.selectedNode);
        cmd.execute();

        this.selectedNode = null;
    }

    /**
     * Delete the selected edge
     */
    deleteEdge(): void {
        const cmd = this.commands.get('DeleteEdge') as DeleteEdge;
        cmd.setSelectedEdge(this.selectedEdgeIndex);
        cmd.execute();

        this.selectedEdgeIndex = -1;
    }



    /**
     * Refresh the current graph
     */
    refresh(applyAlgorithm: boolean = true, applyColoration: boolean = true): void {
        const cmd = this.commands.get('RefreshGraph') as RefreshGraph;

        cmd.setApplyAlgorithm(applyAlgorithm);
        cmd.setApplyColoration(applyColoration);
        cmd.execute();
    }

    /**
     * Update the color of the selected node
     *
     * @param color color to be updated
     */
    updateColorNode(color: THREE.Color): void {
        if (this.widgetRef.current !== null) {
            this.widgetRef.current.updateColorNode(
                '#' + color.getHexString()
            );
        }
    }

    /**
     * Update the text of the selected node
     *
     * @param text text to be updated
     */
    updateTextNode(text: string): void {
        if (this.widgetRef.current !== null) {
            this.widgetRef.current.updateTextNode(text);
        }
    }

    /**
     * Update the color of the selected edge
     *
     * @param color color to be updated
     */
    updateColorEdge(color: THREE.Color): void {
        if (this.widgetRef.current !== null) {
            this.widgetRef.current.updateColorEdge(
                '#' + color.getHexString()
            );
        }
    }

    /**
     * Update the text of the selected edge
     *
     * @param text text to be updated
     */
    updateTextEdge(text: string): void {
        if (this.widgetRef.current !== null) {
            this.widgetRef.current.updateTextEdge(text);
        }
    }

    /**
     * Apply the selected algorithm
     */
    applyAlgorithm(): void {
        if (this.algorithmRunner) {
            this.algorithmRunner.start();
        }
    }

    /**
     * Apply the selected centrality algorithm
     */
    applyColoration(): void {
        if (this.widgetRef.current !== null) {
            this.widgetRef.current.applyColoration();
        }
    }

    /**
     * Start the rendering process of the window
     */
    render(): JSX.Element {
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
                    <GraphScene
                        graph={this.graph}
                        pitch={this.pitch}
                        yaw={this.yaw}
                    />
                </Canvas>
                <Widget ref={this.widgetRef} />
            </div>
        );
    }

    // --------------------------------
    // Private
    // --------------------------------

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
            console.log(window.keySHIFT);
            if (window.keySHIFT) {
                this.selectEdge(event.clientX, event.clientY);
            } else {
                this.selectVertex(event.clientX, event.clientY);
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
        const [width, _] = window.getSize();

        window.mouseDiff.x = window.mouse.x - event.clientX;
        window.mouseDiff.y = window.mouse.y - event.clientY;

        if (window.mouseMIDDLE) {
            window.yaw += (event.clientX - window.mouse.x) / 8;
            window.pitch += (event.clientY - window.mouse.y) / 8;
        }

        if (window.mouseLEFT && !window.keyCTRL) {
            window.translate.x += ((event.clientX - window.mouse.x) / width) * window.translate.z;
            window.translate.y += ((window.mouse.y - event.clientY) / width) * window.translate.z;
        }

        window.mouse = new THREE.Vector2(
            event.clientX, event.clientY
        );

        if (window.mouseLEFT && window.keyCTRL) {
            window.dragVertex(window.mouseDiff, window.translate.z);
        }
    };

    private keyPressedEvent = (event: React.KeyboardEvent) => {
        const window = GLWindow.init();

        console.log(event.key);

        if (event.key.toLowerCase() === 't') {
            window.toggleWidget();
        }

        if (event.key.toLowerCase() === 'n') {
            window.nameByIndex();
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
                    window.deleteVertex();
                }
            }
        }

        if (event.key === 'Insert') {
            if (window.graph !== undefined) {
                if (window.graph.getNumVertices() > 1) {
                    window.deleteEdge();
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
}

// --------------------------------
// Components
// --------------------------------

const GraphScene = ({ graph, yaw, pitch, }: { graph: Graph | undefined, yaw: number, pitch: number }) => {
    const { camera, gl, size } = useThree();

    useEffect(() => {
        if (!graph) return;

        const pers_camera = camera as THREE.PerspectiveCamera;
        const bounds = graph.getBoundingBox();
        const center = bounds.getCenter(new THREE.Vector3());
        const size_center = bounds.getSize(new THREE.Vector3());
        const max_dim = Math.max(size_center.x, size_center.y, size_center.z);

        const fov = pers_camera.fov * (Math.PI / 180);
        const distance = max_dim / (2 * Math.tan(fov / 2));
        const position = new THREE.Vector3(0, 0, center.z + distance * 1.5);

        const pitch_rad = THREE.MathUtils.degToRad(pitch);
        const yaw_rad = THREE.MathUtils.degToRad(yaw);
        const rotation = new THREE.Euler(pitch_rad, yaw_rad, 0, "YXZ");

        position.applyEuler(rotation).add(center);

        pers_camera.position.copy(position);
        pers_camera.lookAt(center);
        pers_camera.updateProjectionMatrix();
    }, [graph, yaw, pitch]);

    useFrame(() => {
        gl.setSize(size.width, size.height);
        gl.setViewport(0, 0, size.width, size.height);
        gl.clear(true, true);
    });

    return (
        <>
            <ambientLight />
            <pointLight position={[10, 10, 10]} />
            <OrbitControls />
            {graph ? graph.draw() : null}
        </>
    );
};