import { BrowserRouter, Routes, Route } from 'react-router-dom';
import KioskApp from './pages/KioskApp.tsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<KioskApp />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;