import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/home";
import Sencilla from "./pages/Sencilla";


function App() {

  return (

    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sencilla" element={<Sencilla />} />
      </Routes>

    </BrowserRouter>

  );

}

export default App;

