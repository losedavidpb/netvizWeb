import { Canvas } from '@react-three/fiber';
import { createRef, type JSX, type RefObject } from 'react';
import * as THREE from 'three';

import { Config } from '../Config';
import { DeleteEdge } from '../controller/commands/DeleteEdge';
import { DeleteVertex } from '../controller/commands/DeleteVertex';
import { DragVertex } from '../controller/commands/DragVertex';
import { LoadGraph } from '../controller/commands/LoadGraph';
import { NameByIndex } from '../controller/commands/NameByIndex';
import { RefreshGraph } from '../controller/commands/RefreshGraph';
import { SaveGraph } from '../controller/commands/SaveGraph';
import { SelectEdge } from '../controller/commands/SelectEdge';
import { SelectVertex } from '../controller/commands/SelectVertex';
import type { Graph } from '../model/Graph';
import type { Vertex } from '../model/Vertex';
import { AlgorithmFactoryMethod } from '../model/algorithm/AlgorithmFactoryMethod';
import { CentralityFactoryMethod } from '../model/centrality/CentralityFactoryMethod';
import { Footer } from './Footer';
import { GraphScene } from './GraphScene';
import { Widget } from './Widget';

/**
 * GLWindow :: Main window of the app
 *
 * @author losedavidpb <losedavidpb@gmail.com>
 */
export class GLWindow {

    // --------------------------------
    // Properties
    // --------------------------------

    private static instance: GLWindow;

    private readonly widgetRef: RefObject<Widget | null>;

    private widgetVisible: boolean = true;
    private applyAlgorithm: boolean = true;
    private applyColouration: boolean = true;

    private content: string = '';
    private graph: Graph | null = null;
    private welcomeGraph: Graph | null = null;

    private selectedNode: Vertex | null = null;
    private selectedEdgeIndex: number = -1;

    /**
     * Get the instance of the window
     *
     * @returns GLWindow
     */
    static init(): GLWindow {
        GLWindow.instance ??= new GLWindow();
        return GLWindow.instance;
    }

    // --------------------------------
    // Constructor
    // --------------------------------

    // Avoid multiple instances
    private constructor() {
        this.widgetRef = createRef<Widget>();
        const mobileViewport = window.matchMedia('(max-width: 47.99rem)');
        this.widgetVisible = !mobileViewport.matches;

        this.init_commands();
        this.init_key_bindings();
        this.init_mouse_bindings();
        mobileViewport.addEventListener('change', (event) => {
            this.widgetVisible = !event.matches;
            this.refresh();
        });
        void this.load_welcome_graph();
    }

    private async load_welcome_graph(): Promise<void> {
        const response = await fetch(`${import.meta.env.BASE_URL}${Config.welcomeGraphPath}`);
        const content = await response.text();
        const firstLine = content.split(/\r?\n/, 1)[0];

        const { GraphFactoryMethod } = await import('../model/graph/GraphFactoryMethod');
        const graph = GraphFactoryMethod.create(firstLine, content);
        const algorithm = AlgorithmFactoryMethod.create(Config.defaultAlgorithm, graph);

        for (let iteration = 0; iteration < 200; iteration++) {
            algorithm.apply();
        }

        CentralityFactoryMethod.create(Config.defaultCentrality).apply(graph);

        this.fit_welcome_graph(graph);
        this.welcomeGraph = graph;
        this.refresh();
    }

    private fit_welcome_graph(graph: Graph): void {
        const bounds = graph.getBoundingBox();
        const centre = bounds.getCenter(new THREE.Vector3());
        const size = bounds.getSize(new THREE.Vector3());
        const scale = Math.min(24 / Math.max(size.x, 1), 14 / Math.max(size.y, 1));

        graph.getVertices().forEach((vertex) => {
            const position = vertex.getPos();

            vertex.setPos({
                x: (position.x - centre.x) * scale,
                y: (position.y - centre.y) * scale,
                z: 0,
            });
        });
    }

    private init_commands(): void {
        Config.commands.add('LoadGraph', new LoadGraph(this));
        Config.commands.add('SaveGraph', new SaveGraph(this));
        Config.commands.add('DeleteVertex', new DeleteVertex(this));
        Config.commands.add('DeleteEdge', new DeleteEdge(this));
        Config.commands.add('RefreshGraph', new RefreshGraph());
        Config.commands.add('DragVertex', new DragVertex(this));
        Config.commands.add('SelectEdge', new SelectEdge(this));
        Config.commands.add('SelectVertex', new SelectVertex(this));
        Config.commands.add('NameByIndex', new NameByIndex(this));
    }

    private init_key_bindings(): void {
        Config.setKeyHandler('toogleToolbox', () => this.toggleWidget());
        Config.setKeyHandler('nameByIndex', () => this.nameByIndex());
        Config.setKeyHandler('pngScreenshot', () => this.pngScreenshot(Config.defaultPNG));
        Config.setKeyHandler('svgScreenshot', () => this.svgScreenshot(Config.defaultSVG));
        Config.setKeyHandler('deleteVertex', () => this.deleteVertex());
        Config.setKeyHandler('deleteEdge', () => this.deleteEdge());
    }

    private init_mouse_bindings(): void {
        Config.setMousehandler('right', () => {
            const mousePos = Config.getMousePos();

            if (Config.keyBindings['select'].state) {
                this.selectEdge(mousePos.x, mousePos.y);
            } else {
                this.selectVertex(mousePos.x, mousePos.y);
            }
        });
    }

    /**
     * Enables or disables the algorithm
     *
     * @param state visibility state
     */
    setApplyAlgorithm(state: boolean): void {
        this.applyAlgorithm = state;
    }

    /**
     * Enables or disables the colouration algorithm
     *
     * @param state visibility state
     */
    setApplyColouration(state: boolean): void {
        this.applyColouration = state;
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
    getGraph(): Graph | null {
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
        const cmd = Config.commands.get('RefreshGraph') as RefreshGraph;
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

            Config.renderer.render(Config.scene, Config.camera);

            const canvas = Config.renderer.domElement;
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

            Config.renderer.render(Config.scene, Config.camera);

            const canvas = Config.renderer.domElement;
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
        this.widgetVisible = !this.widgetVisible;
        this.refresh();
    }

    /**
     * Hides the toolbox after a graph action on small screens
     */
    hideWidgetOnMobile(): void {
        if (window.matchMedia('(max-width: 47.99rem)').matches && this.widgetVisible) {
            this.widgetVisible = false;
            this.refresh();
        }
    }

    /**
     * Load a graph based on the graph file path
     */
    loadGraph(): void {
        Config.commands.execute('LoadGraph');
    }

    /**
     * Save the graph at passed filename
     *
     * @param filename filename for the graph
     */
    saveFile(filename: string): void {
        const cmd = Config.commands.get('SaveGraph') as SaveGraph;
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
        const cmd = Config.commands.get('SelectVertex') as SelectVertex;
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
        const cmd = Config.commands.get('SelectEdge') as SelectEdge;
        cmd.setMousePosition(mouseX, mouseY);
        cmd.execute();
    }

    /**
     * Name the vertices of the graph based on their index
     */
    nameByIndex(): void {
        Config.commands.execute('NameByIndex');
    }

    /**
     * Drag and move the selected vertex
     *
     * @param mouseDiff mouse diff vector
     * @param translateZ Z-coord of the translate vector
     */
    dragVertex(mouseDiff: THREE.Vector2, translateZ: number): void {
        const cmd = Config.commands.get('DragVertex') as DragVertex;
        cmd.setMouseDiff(mouseDiff);
        cmd.setTranslateZ(translateZ);
        cmd.execute();
    }

    /**
     * Delete the selected vertex
     */
    deleteVertex(): void {
        const cmd = Config.commands.get('DeleteVertex') as DeleteVertex;
        cmd.setSelectedNode(this.selectedNode);
        cmd.execute();

        this.selectedNode = null;
    }

    /**
     * Delete the selected edge
     */
    deleteEdge(): void {
        const cmd = Config.commands.get('DeleteEdge') as DeleteEdge;
        cmd.setSelectedEdge(this.selectedEdgeIndex);
        cmd.execute();

        this.selectedEdgeIndex = -1;
    }

    /**
     * Refresh the current graph
     */
    refresh(applyAlgorithm?: boolean, applyColoration?: boolean): void {
        if (applyAlgorithm !== undefined) this.setApplyAlgorithm(applyAlgorithm);
        if (applyColoration !== undefined) this.setApplyColouration(applyColoration);

        Config.commands.execute('RefreshGraph');
    }

    /**
     * Update the color of the selected node
     *
     * @param color color to be updated
     */
    updateColorNode(color: THREE.Color): void {
        this.widgetRef.current?.updateColorNode(
            '#' + color.getHexString()
        );
    }

    /**
     * Update the text of the selected node
     *
     * @param text text to be updated
     */
    updateTextNode(text: string): void {
        this.widgetRef.current?.updateTextNode(text);
    }

    /**
     * Update the color of the selected edge
     *
     * @param color color to be updated
     */
    updateColorEdge(color: THREE.Color): void {
        this.widgetRef.current?.updateColorEdge(
            '#' + color.getHexString()
        );
    }

    /**
     * Update the text of the selected edge
     *
     * @param text text to be updated
     */
    updateTextEdge(text: string): void {
        this.widgetRef.current?.updateTextEdge(text);
    }

    /**
     * Start the rendering process of the window
     */
    render(): JSX.Element {
        return (
            <div
                className="w-100 h-100 graph-window"
                tabIndex={0}
                onKeyDown={(event) => Config.keyPressed(event.key)}
                onKeyUp={(event) => Config.keyReleased(event.key)}
            >
                <Canvas
                    gl={{ antialias: true }}
                    onMouseDown={(event) => Config.mousePressed(event)}
                    onMouseUp={(event) => Config.mouseReleased(event)}
                    onMouseMove={(event) => Config.mousePosition(this, event)}
                    onContextMenu={e => e.preventDefault()}
                    onCreated={({ scene, camera, gl }) => {
                        Config.scene = scene;
                        Config.camera = camera;
                        Config.renderer = gl;
                    }}
                >
                    <GraphScene
                        graph={this.graph ?? this.welcomeGraph}
                        isWelcome={this.graph === null}
                    />
                </Canvas>
                <button
                    type="button"
                    className={`toolbox-toggle${this.widgetVisible ? ' toolbox-toggle--open' : ''}`}
                    aria-label={this.widgetVisible ? 'Close toolbox' : 'Open toolbox'}
                    aria-expanded={this.widgetVisible}
                    aria-controls="toolbox"
                    onClick={() => this.toggleWidget()}
                >
                    <span aria-hidden="true">{this.widgetVisible ? '\u00d7' : '\u2630'}</span>
                </button>
                {this.graph === null && (
                    <div className="welcome-message">
                        <h1 className="welcome-title">{Config.name}</h1>
                        <p className="welcome-subtitle">{Config.welcomeSubtitle}</p>
                    </div>
                )}
                <Widget
                    ref={this.widgetRef}
                    visible={this.widgetVisible}
                    applyAlgorithm={this.applyAlgorithm}
                    applyColouration={this.applyColouration}
                />
                <Footer text={Config.footer} />
            </div>
        );
    }
}