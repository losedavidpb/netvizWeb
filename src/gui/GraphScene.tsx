import { useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import type { Graph } from "../model/Graph";

/**
 * Starts the rendering of the graph
 *
 * @param param0 graph to render
 * @returns JSX element representing the graph
 */
export const GraphScene = ({ graph, isWelcome = false }: { graph: Graph | null, isWelcome?: boolean }) => {
    const { gl, size } = useThree();
    const graphRef = useRef<THREE.Group>(null);
    const [reducedMotion, setReducedMotion] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        const updateMotionPreference = () => setReducedMotion(mediaQuery.matches);

        updateMotionPreference();
        mediaQuery.addEventListener('change', updateMotionPreference);

        return () => mediaQuery.removeEventListener('change', updateMotionPreference);
    }, []);

    useFrame(({ clock }) => {
        gl.setSize(size.width, size.height);
        gl.setViewport(0, 0, size.width, size.height);
        gl.clear(true, true);

        if (graphRef.current !== null && isWelcome && !reducedMotion) {
            graphRef.current.rotation.y = Math.sin(clock.elapsedTime * 0.12) * 0.12;
            graphRef.current.rotation.z = Math.sin(clock.elapsedTime * 0.15) * 0.04;
            graphRef.current.position.y = Math.sin(clock.elapsedTime * 0.2) * 0.08;
        }
    });

    return (
        <>
            <ambientLight />
            <pointLight position={[10, 10, 10]} />
            <OrbitControls />
            {graph !== null && (
                <group
                    key={isWelcome ? 'welcome' : 'user'}
                    ref={graphRef}
                    position={[0, 0, isWelcome ? -10 : 0]}
                >
                    {graph.draw()}
                </group>
            )}
        </>
    );
};