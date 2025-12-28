
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);

// إضافة محرك معالجة أخطاء بسيط لضمان استقرار المنصة
try {
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} catch (error) {
  console.error("FLIXO Kernel Error:", error);
  rootElement.innerHTML = `
    <div style="background: black; color: #7C3AED; height: 100vh; display: flex; align-items: center; justify-content: center; font-family: sans-serif; text-align: center; padding: 20px;">
      <div>
        <h1 style="font-size: 2rem; font-weight: 900; margin-bottom: 10px;">FLIXO SYSTEM ERROR</h1>
        <p style="color: #666; font-size: 0.8rem;">عذراً سيادة المدير خالد المنتصر، حدث اضطراب في النواة.</p>
        <button onclick="localStorage.clear(); location.reload();" style="margin-top: 20px; padding: 10px 20px; background: #7C3AED; color: white; border: none; border-radius: 10px; cursor: pointer; font-weight: bold;">إعادة تهيئة النظام</button>
      </div>
    </div>
  `;
}
