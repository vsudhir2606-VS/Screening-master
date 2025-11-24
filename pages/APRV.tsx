import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Copy, Check, Trash2, Plus, Info } from 'lucide-react';

const AprvPage: React.FC = () => {
  const { aprvComments, addAprvComment, deleteAprvComment } = useData();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  // Form State
  const [newTitle, setNewTitle] = useState('');
  const [newApproval, setNewApproval] = useState('');
  const [newAdditional, setNewAdditional] = useState('');
  const [newRemarks, setNewRemarks] = useState('');

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newApproval.trim() && newTitle.trim()) {
      addAprvComment(
          newTitle.trim(), 
          newApproval.trim(), 
          newAdditional.trim(), 
          newRemarks.trim()
      );
      setNewTitle('');
      setNewApproval('');
      setNewAdditional('');
      setNewRemarks('');
    }
  };

  return (
    <div className="space-y-8 pb-10">
      <div className="flex items-center justify-between pb-6 border-b border-slate-200">
         <div>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Approval Information</h2>
            <p className="text-slate-500 mt-2">A reference table for standard approvals. You can add new entries or delete existing ones.</p>
         </div>
      </div>
      
      {/* Table Layout */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50/50">
                    <tr>
                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider w-[20%]">Applying For</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider w-[35%]">Approval</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider w-[20%]">Additional Comments</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider w-[15%]">Remarks</th>
                        <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider w-[10%]"></th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                    {aprvComments.map((comment) => (
                        <tr key={comment.id} className="hover:bg-slate-50/80 transition-colors group">
                            <td className="px-6 py-5 text-sm font-semibold text-slate-900 align-top">
                                {comment.title || 'N/A'}
                            </td>
                            <td className="px-6 py-5 align-top">
                                <div className="flex flex-col gap-2">
                                    <div className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                                        {comment.text}
                                    </div>
                                    {/* Copy Button Pill */}
                                    <div className="pt-1">
                                        <button
                                            onClick={() => handleCopy(comment.id, comment.text)}
                                            className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded text-xs font-bold uppercase tracking-wide transition-colors"
                                            title="Copy Approval Text"
                                        >
                                            {copiedId === comment.id ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                            {copiedId === comment.id ? 'Copied' : 'Copy'}
                                        </button>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-5 text-sm text-slate-600 whitespace-pre-wrap align-top">
                                {comment.additionalInfo || '-'}
                            </td>
                             <td className="px-6 py-5 text-sm text-slate-500 whitespace-pre-wrap align-top italic">
                                {comment.remarks || '-'}
                            </td>
                            <td className="px-6 py-5 text-right align-top">
                                <button
                                    onClick={() => deleteAprvComment(comment.id)}
                                    className="text-slate-300 hover:text-red-500 transition-colors p-1"
                                    title="Delete Entry"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>

      {/* Add New Section */}
      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 mt-8">
        <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            Add New Approval Entry
        </h3>
        <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">Applying For / Title <span className="text-red-500">*</span></label>
            <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. HUAWEI CHINA / LIKP"
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-shadow"
                required
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">Approval Text <span className="text-red-500">*</span> <span className="text-xs text-slate-400 font-normal">(This text will be copied)</span></label>
            <textarea
                value={newApproval}
                onChange={(e) => setNewApproval(e.target.value)}
                placeholder="Enter the main approval content..."
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-shadow"
                rows={4}
                required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Additional Comments <span className="text-xs text-slate-400">(Optional)</span></label>
            <textarea
                value={newAdditional}
                onChange={(e) => setNewAdditional(e.target.value)}
                placeholder="Extra context..."
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-shadow"
                rows={2}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Remarks <span className="text-xs text-slate-400">(Optional)</span></label>
            <textarea
                value={newRemarks}
                onChange={(e) => setNewRemarks(e.target.value)}
                placeholder="Notes or Dtypes..."
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-shadow"
                rows={2}
            />
          </div>
          <div className="md:col-span-2 flex justify-end pt-4">
            <button
              type="submit"
              className="px-8 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 shadow-sm hover:shadow-md transition-all flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Approval Record
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AprvPage;