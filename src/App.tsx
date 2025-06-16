import { useEffect, useState, type JSX } from "react";
import { GLWindow } from "./gui/GLWindow";

/**
 * Execute the React application
 *
 * @returns HTML content
 */
function App(): JSX.Element {
  const [window, setWindow] = useState<JSX.Element | null>(null);
  useEffect(() => setWindow(GLWindow.init().render()), []);

  return (
    <div className="container-fluid vh-100 p-0">
      <div className="row g-0 h-100">
        {window}
      </div>
    </div>
  );
}

export default App;