import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/layout/navbar";
import CustomerDashboard from "./pages/CustomerDashboard";
import Home from "./pages/Home";

function App() {
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/customer-dashboard" element={<CustomerDashboard />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
