import { useMemo } from 'react';
import type { FinancialState } from '../App';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface DashboardProps {
  state: FinancialState;
}

export default function Dashboard({ state }: DashboardProps) {
  // Generate 12 months of projection data
  const data = useMemo(() => {
    let currentCash = state.cashOnHand;
    const monthlyBurn = state.rent + state.saas + state.hiring + state.marketing;
    const monthlyNet = state.revenue - monthlyBurn;

    const projections = [];
    for (let i = 0; i <= 12; i++) {
      projections.push({
        month: `Month ${i}`,
        cash: Math.max(0, currentCash),
        revenue: state.revenue,
        expenses: monthlyBurn,
      });
      currentCash += monthlyNet;
    }
    return projections;
  }, [state]);

  const monthlyBurn = state.rent + state.saas + state.hiring + state.marketing;
  const runwayMonths = monthlyBurn > state.revenue 
    ? (state.cashOnHand / (monthlyBurn - state.revenue)).toFixed(1) 
    : 'Infinite';

  return (
    <div className="p-10 h-full flex flex-col max-w-7xl mx-auto w-full">
      <header className="mb-8 flex items-baseline justify-between">
        <div>
          <h2 className="text-2xl font-medium tracking-tight text-white mb-1">Projections</h2>
          <p className="text-sm text-slate-500">Visualize your runway and growth trajectory</p>
        </div>
        <div className="flex gap-10 text-right">
          <div>
            <div className="text-xs font-medium text-slate-500 mb-1 uppercase tracking-wider">Monthly Burn</div>
            <div className="text-xl font-medium text-slate-200 font-mono">${monthlyBurn.toLocaleString()}</div>
          </div>
          <div>
            <div className="text-xs font-medium text-slate-500 mb-1 uppercase tracking-wider">Runway</div>
            <div className="text-xl font-medium text-slate-200 font-mono">{runwayMonths} <span className="text-sm font-sans text-slate-500">mos</span></div>
          </div>
        </div>
      </header>
      
      <div className="flex-1 border border-slate-800 rounded-xl bg-[#080808] p-8 flex flex-col mt-4 shadow-[0_0_0_1px_rgba(255,255,255,0.05)_inset] relative overflow-hidden">
        
        {/* Subtle background glow effect simulating Linear design */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-slate-800/20 blur-[100px] rounded-full pointer-events-none" />

        <h3 className="text-sm font-medium text-slate-400 mb-8 relative z-10">Cash Projection (12 Months)</h3>
        
        <div className="flex-1 min-h-0 relative z-10 w-full ml-[-20px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorCash" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#818cf8" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#1e293b" />
              <XAxis 
                dataKey="month" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }} 
                dy={15}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
                tickFormatter={(val) => `$${(val / 1000)}k`}
                dx={-10}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#0f172a', 
                  borderColor: '#1e293b',
                  borderRadius: '8px',
                  color: '#f1f5f9',
                  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5)',
                  padding: '12px 16px'
                }}
                itemStyle={{ color: '#e2e8f0', fontSize: '14px', fontWeight: 500 }}
                labelStyle={{ color: '#94a3b8', fontSize: '12px', marginBottom: '8px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}
                formatter={(value: any) => [`$${Number(value).toLocaleString()}`, 'Cash']}
              />
              <Area 
                type="monotone" 
                dataKey="cash" 
                stroke="#818cf8" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorCash)" 
                activeDot={{ r: 5, strokeWidth: 0, fill: '#818cf8', stroke: '#e0e7ff' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
