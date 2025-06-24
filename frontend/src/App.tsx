import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ListPage } from "./pages/ListPage";

function App() {
  return (
    <BrowserRouter
      future={{
        v7_relativeSplatPath: true,
        v7_startTransition: true,
      }}
    >
      <Routes>
        <Route path="/" element={<ListPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
