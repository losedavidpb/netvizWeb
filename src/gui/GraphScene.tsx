import { useFrame, useThree } from "@react-three/fiber";
import { useEffect } from "react";
import { OrbitControls } from "@react-three/drei";
import * as THREE from 'three';

import type { Graph } from "../model/Graph";

/**
 * Starts the rendering of the graph.
 *
 * @param param0 graph to render
 * @returns JSX element representing the graph
 */
export const GraphScene = ({ graph }: { graph: Graph | null }) => {
    const { camera, gl, size } = useThree();

    useEffect(() => {
        if (graph === null) return;

        const pers_camera = camera as THREE.PerspectiveCamera;
        const bounds = graph.getBoundingBox();

        const center = bounds.getCenter(new THREE.Vector3());
        const size = bounds.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const fov = pers_camera.fov * (Math.PI / 180);

        const distance = maxDim / (2 * Math.tan(fov / 2));
        const offset = 1.2;

        const distancePosition = new THREE.Vector3(distance, distance, distance);
        const newPosition = center.clone().add(distancePosition.multiplyScalar(offset));
        pers_camera.position.copy(newPosition);

        pers_camera.near = 0.1;
        pers_camera.far = distance * 10;
        pers_camera.updateProjectionMatrix();

        pers_camera.lookAt(center);
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
            {graph !== null ? graph.draw() : null}
        </>
    );
};