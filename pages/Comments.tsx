import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Copy, Check, Trash2, Plus } from 'lucide-react';

const Comments: React.FC = () => {
  const { generalComments, addGeneralComment, deleteGeneralComment } = useData();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [newComment, setNewComment] = useState('');

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      addGeneralComment(newComment.trim());
      setNewComment('');
    }
  };

  return (
    <div className="space-y-8 pb-10 max-w-5xl mx-auto">
      <div className="border-b border-slate-200 pb-6">
          <h2 className="text-3xl font-bold text-slate-900">Standard Comments</h2>
          <p className="text-slate-500 mt-2">Quickly copy, add, or delete standard screening comments for your reports.</p>
      </div>
      
      <div className="grid gap-4">
        {generalComments.map((comment) => (
          <div key={comment.id} className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 group hover:border-indigo-200 hover:shadow-md transition-all">
            <p className="text-slate-700 whitespace-pre-wrap flex-1 font-mono text-sm">{comment.text}</p>
            <div className="flex items-center gap-3 shrink-0">
                {/* Copy Button - Light Indigo Pill */}
                <button
                  onClick={() => handleCopy(comment.id, comment.text)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-md text-sm font-medium transition-colors"
                  title="Copy"
                >
                  {copiedId === comment.id ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copiedId === comment.id ? 'Copied' : 'Copy'}
                </button>
                
                {/* Delete Icon */}
                <button
                  onClick={() => deleteGeneralComment(comment.id)}
                  className="p-2 text-slate-300 hover:text-red-500 rounded transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm mt-8">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Add New Comment</h3>
        <form onSubmit={handleAdd} className="space-y-4">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Enter new comment text..."
            className="w-full p-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            rows={3}
            required
          />
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 flex items-center gap-2 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Add Comment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Comments;