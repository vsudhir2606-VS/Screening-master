import React, { useState, useEffect } from 'react';
import { Entity } from '../types';

interface EntityFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: Entity | null;
  title: string;
  showType?: boolean;
  addressLabel?: string;
  typeLabel?: string;
}

const EntityFormModal: React.FC<EntityFormModalProps> = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  initialData, 
  title, 
  showType = false,
  addressLabel = 'Address',
  typeLabel = 'Type'
}) => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [type, setType] = useState('');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setAddress(initialData.address);
      if (showType) setType(initialData['type'] || '');
    } else {
      setName('');
      setAddress('');
      setType('');
    }
  }, [initialData, isOpen, showType]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data: any = { id: initialData?.id, name, address };
    if (showType) data.type = type;
    onSubmit(data);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 animate-fade-in transform transition-all scale-100">
        <h2 className="text-xl font-bold text-slate-900 mb-6">{initialData ? 'Edit' : 'Add'} {title}</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="block w-full rounded-lg border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2.5 text-sm transition-shadow"
              placeholder={`Enter ${title.toLowerCase()} name`}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">{addressLabel}</label>
            <textarea
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="block w-full rounded-lg border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2.5 text-sm transition-shadow"
              rows={3}
              placeholder={`Enter ${addressLabel.toLowerCase()}...`}
            />
          </div>
          {showType && (
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">{typeLabel}</label>
              <input
                type="text"
                value={type}
                onChange={(e) => setType(e.target.value)}
                placeholder={`e.g. ${typeLabel === 'Date' ? 'YYYY-MM-DD' : 'Distributor'}`}
                className="block w-full rounded-lg border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2.5 text-sm transition-shadow"
              />
            </div>
          )}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-sm hover:shadow transition-all"
            >
              Save Entry
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EntityFormModal;