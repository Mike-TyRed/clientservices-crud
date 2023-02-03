import { Routes, Route, BrowserRouter } from "react-router-dom";
import ShowClients from "./components/ShowClients";
import ShowServices from "./components/ShowServices";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/clients" element={<ShowClients></ShowClients>}></Route>
        <Route path="/services" element={<ShowServices></ShowServices>}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
