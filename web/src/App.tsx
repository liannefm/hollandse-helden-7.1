import { BrowserRouter, Routes, Route } from 'react-router-dom';
import KioskApp from './pages/KioskApp.tsx';
import OrderStatusPage from './pages/OrderStatusPage.tsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<KioskApp />} />
        <Route path="/order-status" element={<OrderStatusPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;