import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Customer, RPL } from '../types';
import { Copy, Check, User, AlertTriangle } from 'lucide-react';

const Home: React.FC = () => {
  const { customers, rpls } = useData();
  const [customerSearch, setCustomerSearch] = useState('');
  const [rplSearch, setRplSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [selectedRPL, setSelectedRPL] = useState<RPL | null>(null);
  const [result, setResult] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [compactFormat, setCompactFormat] = useState(false);

  // Filter lists based on search
  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(customerSearch.toLowerCase())
  ).slice(0, 5);

  const filteredRPLs = rpls.filter(r => 
    r.name.toLowerCase().includes(rplSearch.toLowerCase())
  ).slice(0, 5);

  const handleGenerate = () => {
    if (!selectedCustomer || !selectedRPL) return;

    let text = '';
    if (compactFormat) {
       text = `SPLF - False SPL Match. Customer: ${selectedCustomer.name} (${selectedCustomer.address}) vs RPL: ${selectedRPL.name} (${selectedRPL.address})`;
    } else {
       text = `SPLF - False SPL Match- Customer and RPL are different.
Customer
Name- ${selectedCustomer.name}
address- ${selectedCustomer.address}
RPL -
Name - ${selectedRPL.name}
address - ${selectedRPL.address}
`;
    }
    setResult(text);
  };

  const handleClear = () => {
    setCustomerSearch('');
    setRplSearch('');
    setSelectedCustomer(null);
    setSelectedRPL(null);
    setResult('');
    setCopied(false);
    setCompactFormat(false);
  };

  const copyToClipboard = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col items-center justify-start pt-10 min-h-[80vh] space-y-8 px-4">
      {/* Header Section */}
      <div className="text-center space-y-3">
        <h1 className="text-5xl font-bold text-slate-900 tracking-tight">Screening Portal</h1>
        <p className="text-slate-500 text-lg">Select a customer and a restricted party to generate a screening comment.</p>
      </div>

      {/* Main Card */}
      <div className="bg-white p-10 rounded-2xl shadow-lg border border-slate-200 w-full max-w-5xl transition-all duration-300">
        
        {/* Search Inputs Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          
          {/* Customer Search */}
          <div className="relative space-y-2">
            <label className="block text-sm font-bold text-slate-600">Search Customer</label>
            <div className="relative group">
                <input
                  type="text"
                  value={selectedCustomer ? selectedCustomer.name : customerSearch}
                  onChange={(e) => {
                    setCustomerSearch(e.target.value);
                    setSelectedCustomer(null);
                  }}
                  placeholder="Type to search customers..."
                  className={`w-full p-4 bg-white border rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all font-medium text-slate-800 placeholder:text-slate-400 ${selectedCustomer ? 'border-indigo-500 bg-indigo-50/30' : 'border-slate-300'}`}
                />
                
                {/* Customer Dropdown */}
                {customerSearch && !selectedCustomer && filteredCustomers.length > 0 && (
                  <ul className="absolute z-50 w-full bg-white border border-slate-200 rounded-xl shadow-2xl mt-2 overflow-hidden max-h-60 overflow-y-auto">
                    {filteredCustomers.map(c => (
                      <li 
                        key={c.id} 
                        onClick={() => {
                            setSelectedCustomer(c);
                            setCustomerSearch('');
                        }}
                        className="p-4 hover:bg-indigo-50 cursor-pointer border-b border-slate-50 last:border-0 transition-colors flex items-start gap-3 group/item"
                      >
                        <div className="p-2 bg-slate-100 rounded-full group-hover/item:bg-indigo-200 text-slate-400 group-hover/item:text-indigo-600 transition-colors">
                            <User className="w-4 h-4" />
                        </div>
                        <div>
                            <div className="font-semibold text-slate-800 group-hover/item:text-indigo-700">{c.name}</div>
                            <div className="text-xs text-slate-500">{c.address}</div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
            </div>
          </div>

          {/* RPL Search */}
          <div className="relative space-y-2">
             <label className="block text-sm font-bold text-slate-600">Search Restricted Party (RPL)</label>
             <div className="relative group">
                <input
                  type="text"
                  value={selectedRPL ? selectedRPL.name : rplSearch}
                  onChange={(e) => {
                    setRplSearch(e.target.value);
                    setSelectedRPL(null);
                  }}
                  placeholder="Type to search RPLs..."
                  className={`w-full p-4 bg-white border rounded-lg focus:bg-white focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all font-medium text-slate-800 placeholder:text-slate-400 ${selectedRPL ? 'border-slate-500 bg-slate-50/30' : 'border-slate-300'}`}
                />

                {/* RPL Dropdown */}
                {rplSearch && !selectedRPL && filteredRPLs.length > 0 && (
                  <ul className="absolute z-50 w-full bg-white border border-slate-200 rounded-xl shadow-2xl mt-2 overflow-hidden max-h-60 overflow-y-auto">
                    {filteredRPLs.map(r => (
                      <li 
                        key={r.id} 
                        onClick={() => {
                            setSelectedRPL(r);
                            setRplSearch('');
                        }}
                        className="p-4 hover:bg-slate-50 cursor-pointer border-b border-slate-50 last:border-0 transition-colors flex items-start gap-3 group/item"
                      >
                         <div className="p-2 bg-slate-100 rounded-full group-hover/item:bg-slate-200 text-slate-400 group-hover/item:text-slate-600 transition-colors">
                            <AlertTriangle className="w-4 h-4" />
                        </div>
                        <div>
                            <div className="font-semibold text-slate-800">{r.name}</div>
                            <div className="text-xs text-slate-500">{r.address}</div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
             </div>
          </div>
        </div>

        {/* Action Buttons Row */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-slate-600 select-none hover:text-slate-900 transition-colors">
                <input 
                    type="checkbox" 
                    checked={compactFormat} 
                    onChange={e => setCompactFormat(e.target.checked)} 
                    className="w-5 h-5 rounded border-slate-300 text-slate-600 focus:ring-slate-500" 
                />
                <span className="font-medium text-sm">Compact Format</span>
            </label>

            {/* Generate Button - Grey/Slate Blue as per image */}
            <button
                onClick={handleGenerate}
                disabled={!selectedCustomer || !selectedRPL}
                className="px-8 py-3 bg-slate-500 hover:bg-slate-600 text-white font-bold text-lg rounded-lg shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all min-w-[160px]"
            >
                Generate
            </button>
            
            {/* Clear Button - Light Grey as per image */}
            <button
                onClick={handleClear}
                className="px-8 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-lg rounded-lg transition-all min-w-[160px]"
            >
                Clear Selection
            </button>
        </div>
      </div>

      {/* Result Card */}
      {result && (
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden w-full max-w-5xl animate-fade-in relative group">
             {/* Copy Overlay Button */}
             <div className="absolute top-4 right-4">
                 <button
                    onClick={copyToClipboard}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-700 hover:text-indigo-600 hover:border-indigo-400 transition-all shadow-sm"
                >
                    {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                    {copied ? 'Copied!' : 'Copy Result'}
                </button>
             </div>

            <div className="p-8">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Generated Comment</h3>
                <div className="font-mono text-sm text-slate-700 whitespace-pre-wrap leading-relaxed bg-slate-50 p-6 rounded-xl border border-slate-100">
                    {result}
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default Home;