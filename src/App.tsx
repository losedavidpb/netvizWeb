import { GraphCanvas } from "./gui/GraphCanvas";
import { Toolbox } from "./gui/Toolbox";

/**
 * Execute the React application
 *
 * @returns HTML content
 */
function App() {
  return (
    <div className="container-fluid vh-100 p-0">
      <div className="row g-0 h-100">
        <div className="col-auto">
          <Toolbox />
        </div>
        <div className="col bg-light">
          <GraphCanvas />
        </div>
      </div>
    </div>
  );
}

export default App;