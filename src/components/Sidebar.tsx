import type { FinancialState } from '../App';
import { Label } from './ui/Label';
import { Slider } from './ui/Slider';
import { Input } from './ui/Input';

interface SidebarProps {
  state: FinancialState;
  updateState: (key: keyof FinancialState, value: number) => void;
}

function InputGroup({ 
  label, value, onChange, max 
}: { 
  label: string, value: number, onChange: (val: number) => void, max: number 
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <Label>{label}</Label>
        <div className="flex items-center gap-1">
          <span className="text-xs text-slate-500">$</span>
          <Input 
            type="number" 
            value={value} 
            onChange={(e) => onChange(Number(e.target.value))}
            className="w-24 h-7 text-xs text-right pr-2 font-mono"
          />
        </div>
      </div>
      <Slider 
        min={0} 
        max={max} 
        step={100} 
        value={[value]} 
        onValueChange={(vals) => onChange(vals[0])} 
      />
    </div>
  );
}

export default function Sidebar({ state, updateState }: SidebarProps) {
  return (
    <aside className="w-80 h-full flex flex-col border-r border-slate-800 p-6 bg-[#000000] z-10 relative overflow-hidden">
      <div className="mb-10">
        <h1 className="text-xl font-medium tracking-tight text-white mb-1">ZeroDay</h1>
        <p className="text-sm text-slate-500">Financial Modeling</p>
      </div>
      
      <div className="flex flex-col gap-10 flex-1 overflow-y-auto pr-2 pb-8">
        
        <section>
          <h2 className="text-[10px] font-bold text-slate-500 tracking-widest uppercase mb-5 border-b border-slate-800/60 pb-2">Capital</h2>
          <div className="flex flex-col gap-6">
            <InputGroup 
              label="Cash on hand" 
              value={state.cashOnHand} 
              onChange={(v) => updateState('cashOnHand', v)} 
              max={2000000} 
            />
            <InputGroup 
              label="Monthly Revenue" 
              value={state.revenue} 
              onChange={(v) => updateState('revenue', v)} 
              max={200000} 
            />
          </div>
        </section>

        <section>
          <h2 className="text-[10px] font-bold text-slate-500 tracking-widest uppercase mb-5 border-b border-slate-800/60 pb-2">Future Funding</h2>
          <div className="flex flex-col gap-6">
            <InputGroup 
              label="Seed Round (Month 3)" 
              value={state.seedFunding} 
              onChange={(v) => updateState('seedFunding', v)} 
              max={1000000} 
            />
            <InputGroup 
              label="Series A (Month 9)" 
              value={state.seriesAFunding} 
              onChange={(v) => updateState('seriesAFunding', v)} 
              max={5000000} 
            />
          </div>
        </section>

        <section>
          <h2 className="text-[10px] font-bold text-slate-500 tracking-widest uppercase mb-5 border-b border-slate-800/60 pb-2">Fixed Costs</h2>
          <div className="flex flex-col gap-6">
            <InputGroup 
              label="Rent & Utilities" 
              value={state.rent} 
              onChange={(v) => updateState('rent', v)} 
              max={50000} 
            />
            <InputGroup 
              label="SaaS & Services" 
              value={state.saas} 
              onChange={(v) => updateState('saas', v)} 
              max={20000} 
            />
          </div>
        </section>

        <section>
          <h2 className="text-[10px] font-bold text-slate-500 tracking-widest uppercase mb-5 border-b border-slate-800/60 pb-2">Growth</h2>
          <div className="flex flex-col gap-6">
            <InputGroup 
              label="Hiring & Payroll" 
              value={state.hiring} 
              onChange={(v) => updateState('hiring', v)} 
              max={300000} 
            />
            <InputGroup 
              label="Marketing & Ads" 
              value={state.marketing} 
              onChange={(v) => updateState('marketing', v)} 
              max={150000} 
            />
          </div>
        </section>

      </div>
    </aside>
  );
}
