import { BrowserRouter, Routes, Route } from 'react-router-dom';
import KioskApp from './pages/KioskApp.tsx';
import OrderStatusPage from './pages/OrderStatusPage.tsx';
import OrderManagementPage from './pages/OrderManagementPage.tsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<KioskApp />} />
        <Route path="/order-status" element={<OrderStatusPage />} />
        <Route path="/order-management" element={<OrderManagementPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;