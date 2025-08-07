import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import CalculatorTab from './pages/CalculatorTab';
import ShaderTab from './pages/ShaderTab';
import './index.css'; 

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<CalculatorTab />} />
          <Route path="shader" element={<ShaderTab />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
