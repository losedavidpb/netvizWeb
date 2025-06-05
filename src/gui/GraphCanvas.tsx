import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useEffect, useState } from 'react';

import { Vertex } from '../model/Vertex';
import { Edge } from '../model/Edge';
import { Graph } from '../model/Graph';

function VertexTest({ position }: { position: [number, number, number] }) {
    const { camera, gl } = useThree();
    const [vertex, setVertex] = useState<Vertex | null>(null);

    useEffect(() => {
        const pos = position;
        const vertex = new Vertex(pos[0], pos[1], pos[2]);
        vertex.setText("Test");
        setVertex(vertex);
    }, [position, camera, gl]);

    return vertex?.draw() ?? null;
}

function EdgeTest({ pos1, pos2 }: { pos1: [number, number, number], pos2: [number, number, number] }) {
    const { camera, gl } = useThree();
    const [edge, setEdge] = useState<Edge | null>(null);

    useEffect(() => {
        const base = new Vertex(pos1[0], pos1[1], pos1[2]);
        const connect = new Vertex(pos2[0], pos2[1], pos2[2]);

        const edge = new Edge(base, connect);
        edge.setText("Test");

        setEdge(edge);
    }, [pos1, pos2, camera, gl]);

    return edge?.draw() ?? null;
}

/**
 * Display the canvas used to render graphs
 *
 * @returns canvas for the graphs
 */
export function GraphCanvas() {
    return (
        <div className="w-100 h-100">
            <Canvas onCreated={({ scene, camera, gl }) => {
                Graph.scene = scene;
                Graph.camera = camera;
                Graph.renderer = gl;
            }}>
                <ambientLight />
                <pointLight position={[10, 10, 10]} />
                <OrbitControls />
                <EdgeTest pos1={[0, 0, 0]} pos2={[2, 2, 0]} />
            </Canvas>
        </div>
    );
}