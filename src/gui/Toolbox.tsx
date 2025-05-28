import { useState, useRef } from "react";
import CollapsibleList from "./CollapsibleList";

/**
 * Display the toolbox
 *
 * @returns HTML for the toolbox
 */
export function Toolbox() {
    const [selectedOptAlgorithm, setSelectedOptAlgorithm] = useState<string | null>('Fruchterman Reingold');
    const [selectedOptColour, setSelectedOptColour] = useState<string | null>('Degree Centrality');

    const [textNode, setTextNode] = useState<string>("");
    const [colorNode, setColorNode] = useState('#ffffff');

    const [textEdge, setTextEdge] = useState<string>("");
    const [colorEdge, setColorEdge] = useState('#ffffff');

    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [fileContent, setFileContent] = useState<string>('');
    const [fileName, setFileName] = useState<string>('');

    return (
        <div className="container bg-white shadow-sm rounded" id="toolbox">
            <h1 className="mb-3">Toolbox</h1>
            <hr></hr>

            <div className="d-flex flex-column mb-3">
                <button
                    className="btn btn-light btn-outline-primary mb-2"
                    onClick={() => fileInputRef.current?.click()}
                >
                    Open File
                </button>

                <input
                    ref={fileInputRef}
                    type="file"
                    style={{ display: 'none' }}
                    onChange={() => console.log("Loading Graph ...")}
                />

                <button
                    className="btn btn-light btn-outline-primary mb-2"
                    onClick={() => console.log("Exporting Graph ...")}
                >
                    Export As
                </button>
            </div>
            <hr></hr>

            <h4>Graph Settings</h4>
            <CollapsibleList
                options={['Fruchterman Reingold', 'Simple Force Directed', 'Multi Level']}
                defaultText="Fruchterman Reingold"
                onOptionSelect={(e) => setSelectedOptAlgorithm(e)}
            />

            <CollapsibleList
                options={['Degree Centrality', 'Distance Centrality', 'Betweenness Centrality']}
                defaultText="Degree Centrality"
                onOptionSelect={(e) => setSelectedOptColour(e)}
            />

            <div className="d-flex flex-column mb-3">
                <button
                    className="btn btn-light btn-outline-primary mb-2"
                    onClick={() => console.log("Refreshing graph ...")}
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
                        value={textNode}
                        placeholder=""
                        onChange={(e) => setTextNode(e.target.value)}
                    />
                    <input
                        type="color"
                        name="color_node"
                        className="form-control mb-2"
                        value={colorNode}
                        onChange={(e) => setColorNode(e.target.value)}
                    />
                </div>
                <div>
                    <h6>Add text/colour to edge</h6>
                    <input
                        type="text"
                        name="text_edge"
                        className="form-control mb-2"
                        value={textEdge}
                        placeholder=""
                        onChange={(e) => setTextEdge(e.target.value)}
                    />
                    <input
                        type="color"
                        name="color_edge"
                        className="form-control mb-2"
                        value={colorEdge}
                        onChange={(e) => setColorEdge(e.target.value)}
                    />
                </div>
            </div>
            <hr></hr>
        </div>
    );
}