import { useState, useEffect } from 'react';
import init, { eval_expr } from '../../rust-calc/pkg/rust_calc.js'; 

export default function CalculatorTab() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [ready, setReady] = useState(false);

  useEffect(() => {
  (async () => {
    try {
      console.log("Attempting to init WASM...");
      await init('/rust_calc_bg.wasm');
      console.log("WASM init successful");
      setReady(true);
    } catch (err) {
      console.error("WASM init failed:", err);
    }
  })();
}, []);

  const handleCalc = () => {
  if (!ready) {
    setResult("WASM not ready...");
    return;
  }

  try {
    const res = eval_expr(input);
    
    if (res === "Invalid expression") {
      setResult("Not a valid expression man");
    } else {
      setResult(res);
    }
  } catch (err) {
    setResult("Something went wrong");
  }
};

  return (
    <div className="min-h-[calc(100vh-65px)] bg-gray-900 text-white flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-400">Rust Calculator </h2>
      <input 
      className="w-full p-3 mb-4 text-white outline-2 rounded-lg outline-blue-400 focus:ring-blue-500"
      value={input} onChange={(e) => setInput(e.target.value)}
      placeholder='Write your expression here' />
      <button 
       className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
      onClick={handleCalc}>Calculate</button>
       <div className="mt-6 text-center">
          <span className="text-gray-400">Result:</span>{' '}
          <span className="font-mono text-lg">{result}</span>
        </div>
    </div>
    </div>
  );
}
