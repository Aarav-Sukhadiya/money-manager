import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import BottomNav from "./components/BottomNav";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import AddTransaction from "./pages/AddTransaction";
import Budget from "./pages/Budget";
import Analytics from "./pages/Analytics";
import Currency from "./pages/Currency";

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <BottomNav />
        <div className="main-area">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/transactions/new" element={<AddTransaction />} />
              <Route path="/transactions/edit/:id" element={<AddTransaction />} />
              <Route path="/budget" element={<Budget />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/currency" element={<Currency />} />
            </Routes>
          </AnimatePresence>
        </div>
      </div>
    </BrowserRouter>
  );
}