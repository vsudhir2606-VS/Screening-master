import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import { Entity } from '../types';

interface DataTableProps<T extends Entity> {
  data: T[];
  onEdit?: (item: T) => void;
  onDelete: (id: string) => void;
  title: string;
  selectable?: boolean;
  selectedIds?: string[];
  onSelectionChange?: (ids: string[]) => void;
}

export function DataTable<T extends Entity>({ 
    data, onEdit, onDelete, title, 
    selectable = false, selectedIds = [], onSelectionChange 
}: DataTableProps<T>) {
  
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onSelectionChange) {
        if (e.target.checked) {
            onSelectionChange(data.map(d => d.id));
        } else {
            onSelectionChange([]);
        }
    }
  };

  const handleSelectOne = (id: string) => {
    if (onSelectionChange) {
        if (selectedIds.includes(id)) {
            onSelectionChange(selectedIds.filter(sid => sid !== id));
        } else {
            onSelectionChange([...selectedIds, id]);
        }
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden ring-1 ring-slate-100">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50/80">
            <tr>
              {selectable && (
                  <th className="px-6 py-4 text-left w-10">
                      <input 
                        type="checkbox" 
                        onChange={handleSelectAll}
                        checked={data.length > 0 && selectedIds.length === data.length}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                      />
                  </th>
              )}
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Address</th>
              <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-100">
            {data.length === 0 ? (
              <tr>
                <td colSpan={selectable ? 4 : 3} className="px-6 py-12 text-center text-slate-400 italic">No {title.toLowerCase()} found.</td>
              </tr>
            ) : (
              data.map((item) => (
                <tr key={item.id} className={`group hover:bg-slate-50/80 transition-colors duration-150 ${selectedIds.includes(item.id) ? 'bg-blue-50/50' : ''}`}>
                  {selectable && (
                      <td className="px-6 py-4">
                          <input 
                            type="checkbox" 
                            checked={selectedIds.includes(item.id)}
                            onChange={() => handleSelectOne(item.id)}
                            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                          />
                      </td>
                  )}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-900 group-hover:text-blue-700 transition-colors">{item.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 truncate max-w-xs">{item.address}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    {onEdit && (
                       <button 
                        onClick={() => onEdit(item)} 
                        className="text-slate-400 hover:text-blue-600 bg-transparent hover:bg-blue-50 p-2 rounded-lg mr-1 transition-all"
                        title="Edit"
                       >
                         <Edit2 className="w-4 h-4" />
                       </button>
                    )}
                    <button 
                        onClick={() => onDelete(item.id)} 
                        className="text-slate-400 hover:text-red-600 bg-transparent hover:bg-red-50 p-2 rounded-lg transition-all"
                        title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}