import { useFrame, useThree } from "@react-three/fiber";
import { useEffect } from "react";
import { OrbitControls } from "@react-three/drei";
import * as THREE from 'three';

import type { Graph } from "../model/Graph";

/**
 * Render the current graph
 *
 * @param param0 graph to render
 * @returns JSX.Element
 */
export const GraphScene = ({ graph }: { graph: Graph | null }) => {
    const { camera, gl, size } = useThree();

    useEffect(() => {
        if (graph === null) return;

        const pers_camera = camera as THREE.PerspectiveCamera;
        const bounds = graph.getBoundingBox();
        const center = bounds.getCenter(new THREE.Vector3());
        const size_center = bounds.getSize(new THREE.Vector3());
        const max_dim = Math.max(size_center.x, size_center.y, size_center.z);

        const fov = pers_camera.fov * (Math.PI / 180);
        const distance = max_dim / (2 * Math.tan(fov / 2));
        const position = new THREE.Vector3(0, 0, center.z + distance * 1.5);

        pers_camera.position.copy(position);
        pers_camera.lookAt(center);
        pers_camera.updateProjectionMatrix();
    }, [graph, camera]);

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