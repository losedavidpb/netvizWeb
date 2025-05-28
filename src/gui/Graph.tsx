import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

/**
 * Display the canvas used to render graphs
 *
 * @returns canvas for the graphs
 */
export function Graph() {
    return (
        <div className="w-100 h-100">
            <Canvas>
                <ambientLight />
                <pointLight position={[10, 10, 10]} />
                <OrbitControls />

                {/* Graph objects */}

            </Canvas>
        </div>
    );
}