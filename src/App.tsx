import { useEffect, useState, type JSX } from "react";
import { GLWindow } from "./gui/GLWindow";

/**
 * Executes the React application
 *
 * @returns HTML content
 */
function App(): JSX.Element {
  const [glWindow, setGLWindow] = useState<GLWindow | null>(null);
  const [_, forceUpdate] = useState(0);

  // Force constant rendering
  useEffect(() => {
    const instance = GLWindow.init();

    instance.setUpdateCallback(
      () => forceUpdate(n => n + 1)
    );

    setGLWindow(instance);
  }, []);

  return (
    <div className="container-fluid vh-100 p-0">
      <div className="row g-0 h-100">
        {glWindow?.render()}
      </div>
    </div>
  );
}

export default App;