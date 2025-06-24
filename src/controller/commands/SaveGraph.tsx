import { Config } from "../../Config";
import type { GLWindow } from "../../gui/GLWindow";
import type { Command } from "../Command";

/**
 * Available file types
 */
export const FileType = {
    ADJACENCY: "ADJACENCY",
    EDGELIST: "EDGELIST",
    MATRIX_MARKET: "MATRIX_MARKET",
    PNG: "PNG",
    SVG: "SVG"
} as const;

// Derive a union type from the values
export type FileType = typeof FileType[keyof typeof FileType];

/**
 * SaveGraph :: Command to save graphs
 *
 * @author losedavidpb <losedavidpb@gmail.com>
 */
export class SaveGraph implements Command {

    // --------------------------------
    // Properties
    // --------------------------------

    private window: GLWindow;

    private filename: string = '';
    private fileType: FileType = Config.defaultFileType;

    /**
     * Constructor for SaveGraph
     *
     * @param window parent window
     */
    constructor(window: GLWindow) {
        this.window = window;
    }

    /**
     * Set the type of the file to be saved
     *
     * @param fileType new file type
     */
    setFileType(fileType: FileType): void {
        this.fileType = fileType;
    }

    /**
     * Set the name of the file to be saved
     *
     * @param filename new filename
     */
    setFilename(filename: string): void {
        this.filename = filename;
        this.set_filetype();
    }

    execute(): void {
        if (this.filename !== '') {
            switch (this.fileType) {
                case FileType.ADJACENCY: this.save_adjacency();         break;
                case FileType.EDGELIST: this.save_edges();              break;
                case FileType.MATRIX_MARKET: this.save_matrix_market(); break;
                case FileType.PNG: this.save_PNG();                     break;
                case FileType.SVG: this.save_SVG();                     break;
            }
        }
    }

    // --------------------------------
    // Private
    // --------------------------------

    private set_filetype(): void {
        function get_ext(filename: string): string {
            return filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2);
        }

        switch (get_ext(this.filename)) {
            case 'adj': this.fileType = FileType.ADJACENCY;     break;
            case 'edg': this.fileType = FileType.EDGELIST;      break;
            case 'mtx': this.fileType = FileType.MATRIX_MARKET; break;
            case 'png': this.fileType = FileType.PNG;           break;
            case 'svg': this.fileType = FileType.SVG;           break;
            default:    // Default file
                this.filename += Config.defaultExtension;
                this.fileType = Config.defaultFileType;
            break;
        }

        // Add .txt to provide support with previous files
        // for adjacency and edges file types
        if (this.fileType === FileType.ADJACENCY || this.fileType === FileType.EDGELIST) {
            this.filename += '.txt';
        }
    }

    private save_SVG(): void {
        this.window.svgScreenshot(this.filename);
    }

    private save_PNG(): void {
        this.window.pngScreenshot(this.filename);
    }

    private save_edges(): void {
        const graph = this.window.getGraph();

        if (graph !== null) {
            const edges = graph.getEdges();
            let content = '';

            for (let i = 0; i < edges.length; ++i) {
                content += edges[i][0] + ' ' + edges[i][1] + '\n';
            }

            this.save_file(content);
        }
    }

    private save_adjacency(): void {
        const graph = this.window.getGraph();

        if (graph !== null) {
            const adjacency_matrix = graph.getAdjacencyMatrix();
            const num_vertices = graph.getNumVertices();

            let content = '';

            for (let i = 0; i < num_vertices; ++i) {
                for (let j = 0; j < num_vertices; ++j) {
                    content += adjacency_matrix[i][j];
                    if (j < num_vertices - 1) content += ' ';
                }

                content += '\n';
            }

            this.save_file(content);
        }
    }

    private save_matrix_market(): void {
        const graph = this.window.getGraph();

        if (graph !== null) {
            const edges = graph.getEdges();
            const num_edges = graph.getNumEdges();
            const num_vertices = graph.getNumVertices();

            let content = '%% MatrixMarket matrix coordinate pattern symmetric\n';
            content += num_vertices + ' ' + num_vertices + ' ' + num_edges + '\n';

            for (let i = 0; i < num_edges; ++i) {
                content += edges[i][0] + ' ' + edges[i][1] + '\n';
            }

            this.save_file(content);
        }
    }

    private save_file(content: string): void {
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = this.filename;
        a.click();

        URL.revokeObjectURL(url);
    }
}