import { EthProvider } from "./contexts/EthContext";
import { BrowserRouter as Router } from 'react-router-dom';
import RouterComponent from "./components/RouterComponent"

function App() {
  return (
    <EthProvider>
      <Router>
        
        <RouterComponent/>
      </Router>
    </EthProvider>
  );
}

export default App;
