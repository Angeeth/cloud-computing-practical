import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import { Toaster } from "react-hot-toast";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Search from "./pages/Search";
import Cart from "./pages/Cart";
import Payment from "./pages/Payment";

function App() {
  return (
    <AppProvider>
      <Toaster position="bottom-right" toastOptions={{
        style: {
          background: '#1e293b',
          color: '#fff',
          border: '1px border #334155'
        }
      }} />
      <BrowserRouter>
        <div className="flex flex-col min-h-screen bg-[#0a0e1a]">
          <Navbar />
          <main className="flex-grow pt-20">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/search" element={<Search />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/payment" element={<Payment />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;