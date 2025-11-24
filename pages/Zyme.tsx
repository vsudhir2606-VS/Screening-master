import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Search, Copy, Check } from 'lucide-react';

const ZymePage: React.FC = () => {
  const { zymeData } = useData();
  const [search, setSearch] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const results = search 
    ? zymeData.filter(item => item.name.toLowerCase().includes(search.toLowerCase()))
    : [];

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <div className="space-y-6">
       <h2 className="text-2xl font-bold text-slate-800">Zyme Search</h2>
       <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
         <div className="relative max-w-xl">
           <label className="block text-sm font-medium text-slate-700 mb-2">Search Name</label>
           <div className="relative">
             <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
             <input
               type="text"
               value={search}
               onChange={(e) => setSearch(e.target.value)}
               placeholder="Enter name to search in Zyme database..."
               className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
             />
           </div>
         </div>
       </div>

       {search && (
         <div className="bg-white rounded-lg shadow border border-slate-200 overflow-hidden animate-fade-in">
            <div className="p-4 bg-slate-50 border-b border-slate-200">
               <h3 className="font-semibold text-slate-700">Search Results ({results.length})</h3>
            </div>
            {results.length === 0 ? (
                <div className="p-6 text-center text-slate-500">No matches found in Zyme data.</div>
            ) : (
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-white">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider w-1/4">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider w-1/2">Comment</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider w-1/4">Date</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-200">
                    {results.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 text-sm font-semibold text-slate-900 align-top">{item.name}</td>
                        <td className="px-6 py-4 text-sm text-slate-600 align-top">
                            <div className="flex items-start justify-between gap-4 group">
                                <span className="whitespace-pre-wrap">{item.address}</span>
                                <button
                                    onClick={() => handleCopy(item.id, item.address)}
                                    className="text-slate-400 hover:text-blue-600 p-1.5 rounded-md hover:bg-blue-50 transition-all shrink-0"
                                    title="Copy Comment"
                                >
                                    {copiedId === item.id ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                                </button>
                            </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 font-mono align-top">{item.type || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
            )}
         </div>
       )}
    </div>
  );
};

export default ZymePage;