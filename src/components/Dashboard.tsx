import { useMemo } from 'react';
import type { FinancialState } from '../App';
import { Download } from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
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
      // Capital injections at specific months
      let cashInjected = 0;
      if (i === 3) cashInjected += state.seedFunding;
      if (i === 9) cashInjected += state.seriesAFunding;

      currentCash += cashInjected;

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

  const pieData = [
    { name: 'Rent & Util', value: state.rent, color: '#8b5cf6' },
    { name: 'SaaS', value: state.saas, color: '#3b82f6' },
    { name: 'Hiring', value: state.hiring, color: '#ec4899' },
    { name: 'Marketing', value: state.marketing, color: '#10b981' },
  ].filter((d) => d.value > 0);

  const exportToCSV = () => {
    const headers = ['Month,Cash Balance,Revenue,Monthly Expenses'];
    const rows = data.map(d => `${d.month},${d.cash},${d.revenue},${d.expenses}`);
    const csvContent = headers.concat(rows).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'zeroday_projection.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-10 h-full flex flex-col max-w-[1400px] mx-auto w-full">
      <header className="mb-8 flex items-baseline justify-between">
        <div>
          <h2 className="text-2xl font-medium tracking-tight text-white mb-1">Projections</h2>
          <p className="text-sm text-slate-500">Visualize your runway and growth trajectory</p>
        </div>
        <div className="flex gap-10 items-center justify-end">
          <div className="text-right">
            <div className="text-xs font-medium text-slate-500 mb-1 uppercase tracking-wider">Monthly Burn</div>
            <div className="text-xl font-medium text-slate-200 font-mono">${monthlyBurn.toLocaleString()}</div>
          </div>
          <div className="text-right">
            <div className="text-xs font-medium text-slate-500 mb-1 uppercase tracking-wider">Runway</div>
            <div className="text-xl font-medium text-slate-200 font-mono">{runwayMonths} <span className="text-sm font-sans text-slate-500">mos</span></div>
          </div>
          <button 
            onClick={exportToCSV}
            className="flex items-center gap-2 px-4 py-2 ml-4 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium transition-colors border border-slate-700 shadow-sm cursor-pointer"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </header>
      
      <div className="flex-1 grid grid-cols-3 gap-6 mt-4 min-h-0">
        
        {/* Main Area Chart */}
        <div className="col-span-2 border border-slate-800 rounded-xl bg-[#080808] p-8 flex flex-col shadow-[0_0_0_1px_rgba(255,255,255,0.05)_inset] relative overflow-hidden h-full">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-slate-800/20 blur-[100px] rounded-full pointer-events-none" />
          <h3 className="text-sm font-medium text-slate-400 mb-8 relative z-10 flex-shrink-0">Cash Projection (12 Months)</h3>
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

        {/* Burn Breakdown Pie Chart */}
        <div className="col-span-1 border border-slate-800 rounded-xl bg-[#080808] p-8 flex flex-col shadow-[0_0_0_1px_rgba(255,255,255,0.05)_inset] relative overflow-hidden h-full">
          <h3 className="text-sm font-medium text-slate-400 mb-8 relative z-10 flex-shrink-0">Burn Breakdown</h3>
          <div className="flex-1 min-h-0 relative z-10 w-full flex items-center justify-center">
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#0f172a', 
                      borderColor: '#1e293b',
                      borderRadius: '8px',
                      color: '#f1f5f9',
                    }}
                    itemStyle={{ color: '#e2e8f0', fontSize: '14px', fontWeight: 500 }}
                    formatter={(value: any) => [`$${Number(value).toLocaleString()}`, 'Amount']}
                  />
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius="65%"
                    outerRadius="90%"
                    paddingAngle={3}
                    dataKey="value"
                    stroke="none"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-slate-600 text-sm">No burn data</div>
            )}
          </div>
          <div className="mt-8 flex flex-col gap-3 flex-shrink-0">
            {pieData.map((item, i) => (
              <div key={i} className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-300">{item.name}</span>
                </div>
                <span className="text-slate-400 font-mono">${item.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
