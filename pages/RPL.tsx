import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { DataTable } from '../components/DataTable';
import EntityFormModal from '../components/EntityFormModal';
import { RPL } from '../types';
import { readExcelFile } from '../services/excelService';
import { Plus, Upload, Trash2, AlertOctagon, RefreshCcw, Search } from 'lucide-react';

const RplPage: React.FC = () => {
  const { rpls, addRPL, updateRPL, deleteRPL, deleteRPLs, bulkImportRPL } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<RPL | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showDuplicatesOnly, setShowDuplicatesOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSave = (data: Partial<RPL>) => {
    if (data.id) {
      updateRPL(data as RPL);
    } else {
      addRPL({ ...data, id: Math.random().toString(36).substr(2, 9) } as RPL);
    }
  };

  const handleEdit = (item: RPL) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      try {
        const data = await readExcelFile<RPL>(e.target.files[0]);
        const validData = data.filter(d => d.name && d.address);
        if(validData.length > 0) {
            bulkImportRPL(validData);
            alert(`Successfully imported ${validData.length} RPL entries.`);
        } else {
            alert("No valid data found. Excel must have 'name' and 'address' columns.");
        }
      } catch (error) {
        console.error(error);
        alert('Error parsing Excel file');
      }
      e.target.value = '';
    }
  };

  const handleBulkDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${selectedIds.length} items?`)) {
      deleteRPLs(selectedIds);
      setSelectedIds([]);
    }
  };

  const getDuplicates = () => {
    const seen = new Set<string>();
    const duplicateKeys = new Set<string>();
    
    rpls.forEach(r => {
        const key = `${r.name.trim().toLowerCase()}|${r.address.trim().toLowerCase()}`;
        if(seen.has(key)) {
            duplicateKeys.add(key);
        }
        seen.add(key);
    });

    return rpls.filter(r => {
        const key = `${r.name.trim().toLowerCase()}|${r.address.trim().toLowerCase()}`;
        return duplicateKeys.has(key);
    });
  };

  const filteredData = showDuplicatesOnly 
    ? getDuplicates() 
    : rpls.filter(r => 
        r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.address.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-4 border-b border-slate-200 pb-6">
        <div>
            <h2 className="text-3xl font-bold text-slate-900">Manage Restricted Parties (RPL)</h2>
            <div className="flex flex-wrap gap-3 mt-4">
                {/* Add RPL Button - Indigo/Purple */}
                <button
                    onClick={handleAddNew}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center gap-2 font-medium shadow-sm transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Add RPL
                </button>

                {/* Bulk Upload Button - Green */}
                <label className="cursor-pointer px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center gap-2 font-medium shadow-sm transition-colors">
                    <Upload className="w-4 h-4" />
                    Bulk Upload
                    <input type="file" accept=".xlsx, .xls" className="hidden" onChange={handleFileUpload} />
                </label>

                {/* Utility Buttons */}
                <button
                    onClick={() => setShowDuplicatesOnly(!showDuplicatesOnly)}
                    className={`px-4 py-2 rounded-md flex items-center gap-2 border ${showDuplicatesOnly ? 'bg-amber-100 text-amber-800 border-amber-300' : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'}`}
                >
                    {showDuplicatesOnly ? <RefreshCcw className="w-4 h-4"/> : <AlertOctagon className="w-4 h-4" />}
                    {showDuplicatesOnly ? 'Show All' : 'Detect Duplicates'}
                </button>

                 {selectedIds.length > 0 && (
                    <button
                        onClick={handleBulkDelete}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center gap-2 shadow-sm"
                    >
                        <Trash2 className="w-4 h-4" />
                        Delete ({selectedIds.length})
                    </button>
                )}
            </div>
        </div>

        {/* Search Bar */}
        <div className="w-full lg:w-96">
            <div className="relative">
                <input
                    type="text"
                    placeholder="Search by name or address..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
            </div>
        </div>
      </div>

      {showDuplicatesOnly && (
          <div className="bg-amber-50 p-4 rounded-md border border-amber-200 text-amber-800 text-sm flex items-center gap-2">
             <AlertOctagon className="w-5 h-5"/>
             Showing potential duplicates based on exact Name and Address match.
          </div>
      )}

      <DataTable
        title={showDuplicatesOnly ? "Duplicates" : "RPL"}
        data={filteredData}
        onEdit={handleEdit}
        onDelete={deleteRPL}
        selectable={true}
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
      />

      <EntityFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSave}
        initialData={editingItem}
        title="RPL Entry"
      />
    </div>
  );
};

export default RplPage;