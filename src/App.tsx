import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Main from "./pages/MainPage";
import Licenses from "./pages/Licenses";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/licenses" element={<Licenses />} />
      </Routes>
    </Router>
  );
}
