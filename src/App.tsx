import { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';

export interface FinancialState {
  cashOnHand: number;
  revenue: number;
  rent: number;
  saas: number;
  hiring: number;
  marketing: number;
}

const defaultState: FinancialState = {
  cashOnHand: 500000,
  revenue: 20000,
  rent: 5000,
  saas: 2000,
  hiring: 10000,
  marketing: 5000,
};

function App() {
  const [state, setState] = useState<FinancialState>(defaultState);

  const updateState = (key: keyof FinancialState, value: number) => {
    setState((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="flex h-screen w-full bg-[#000000] text-slate-300 font-sans overflow-hidden">
      <Sidebar state={state} updateState={updateState} />
      <main className="flex-1 flex flex-col overflow-y-auto">
        <Dashboard state={state} />
      </main>
    </div>
  );
}

export default App;
