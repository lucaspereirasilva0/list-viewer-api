import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import CreateItemPage from "./pages/CreateItemPage";
import { ListPage } from "./pages/ListPage";

function Navbar() {
  return (
    <nav className="bg-gray-800 p-4">
      <ul className="flex justify-center space-x-4">
        <li>
          <Link to="/" className="text-white hover:text-gray-300">
            Adicionar Item
          </Link>
        </li>
        <li>
          <Link to="/list" className="text-white hover:text-gray-300">
            Ver Lista
          </Link>
        </li>
      </ul>
    </nav>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<CreateItemPage />} />
        <Route path="/list" element={<ListPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
