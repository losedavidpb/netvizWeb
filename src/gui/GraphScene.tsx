import { useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import type { Graph } from "../model/Graph";

/**
 * Starts the rendering of the graph.
 *
 * @param param0 graph to render
 * @returns JSX element representing the graph
 */
export const GraphScene = ({ graph }: { graph: Graph | null }) => {
    const { gl, size } = useThree();

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
            {graph !== null ? graph.draw() : null}
        </>
    );
};