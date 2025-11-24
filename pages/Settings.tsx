
import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { DataTable } from '../components/DataTable';
import { readExcelFile, readBackupFile, exportToExcel } from '../services/excelService';
import { dbService } from '../services/storage';
import { ZymeEntry } from '../types';
import { Upload, Download, Trash2, Database, RefreshCw, Plus, UserPlus, AlertTriangle } from 'lucide-react';
import EntityFormModal from '../components/EntityFormModal';

const Settings: React.FC = () => {
  const { 
    zymeData, bulkImportZyme, deleteZyme, addZyme,
    customers, rpls, generalComments, aprvComments,
    bulkImportCustomers, bulkImportRPL, bulkImportGeneralComments, bulkImportAprvComments
  } = useData();
  
  const [activeTab, setActiveTab] = useState<'zyme' | 'backup'>('zyme');
  const [isZymeModalOpen, setIsZymeModalOpen] = useState(false);

  const handleZymeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      try {
        const data = await readExcelFile<ZymeEntry>(e.target.files[0]);
        // Basic check
        const validData = data.filter(d => d.name);
        if (validData.length > 0) {
            bulkImportZyme(validData);
            alert(`Imported ${validData.length} Zyme records.`);
        }
      } catch (error) {
        console.error(error);
        alert('Failed to read Excel file.');
      }
      e.target.value = '';
    }
  };

  const handleAddZyme = (data: any) => {
    addZyme({
        id: Math.random().toString(36).substr(2, 9),
        name: data.name,
        address: data.address, // Maps to 'Comment' in Zyme UI
        type: data.type        // Maps to 'Date' in Zyme UI
    });
  };

  const handleBackup = () => {
    const date = new Date().toISOString().split('T')[0];
    exportToExcel([
        { sheetName: 'Customers', data: customers },
        { sheetName: 'RPL', data: rpls },
        { sheetName: 'Zyme_Data', data: zymeData },
        { sheetName: 'General_Comments', data: generalComments },
        { sheetName: 'APRV_Comments', data: aprvComments },
    ], `ScreeningTool_Backup_${date}`);
  };

  const handleRestore = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      try {
        const backupData = await readBackupFile(e.target.files[0]);
        
        let count = 0;
        if (backupData['Customers']) {
            bulkImportCustomers(backupData['Customers']);
            count += backupData['Customers'].length;
        }
        if (backupData['RPL']) {
            bulkImportRPL(backupData['RPL']);
            count += backupData['RPL'].length;
        }
        if (backupData['Zyme_Data']) {
            bulkImportZyme(backupData['Zyme_Data']);
            count += backupData['Zyme_Data'].length;
        }
        if (backupData['General_Comments']) {
            bulkImportGeneralComments(backupData['General_Comments']);
            count += backupData['General_Comments'].length;
        }
        if (backupData['APRV_Comments']) {
            bulkImportAprvComments(backupData['APRV_Comments']);
            count += backupData['APRV_Comments'].length;
        }

        alert(`Restore complete! Processed ${count} total records. Data restored successfully.`);
      } catch (error) {
        console.error(error);
        alert('Failed to parse backup file. Please ensure it is a valid Excel file.');
      }
      e.target.value = '';
    }
  };

  const handleResetApp = async () => {
    if(window.confirm("DANGER: This will delete ALL data (Customers, RPL, Zyme, Comments). This cannot be undone. Are you sure?")) {
        await dbService.clear();
        localStorage.clear();
        window.location.reload();
    }
  };

  return (
    <div className="space-y-8 pb-10">
      <div className="border-b border-slate-200 pb-6">
          <h2 className="text-3xl font-bold text-slate-900">Settings</h2>
          <p className="text-slate-500 mt-2">Manage your application data and settings.</p>
      </div>
      
      {/* User Management Section (Visual only as auth is mocked) */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
         <h3 className="text-lg font-bold text-slate-800 mb-4">User Management</h3>
         <div className="flex items-center gap-4 mb-6">
            <div className="flex-1">
                <label className="block text-sm font-medium text-slate-700 mb-1">Add New User</label>
                <input type="text" placeholder="Enter username" className="w-full border-slate-300 rounded-md text-sm p-2 border" />
            </div>
            <div className="self-end">
                <button className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 shadow-sm">
                    Add User
                </button>
            </div>
         </div>
         <div>
             <h4 className="text-sm font-medium text-slate-700 mb-2">Existing Users</h4>
             <div className="p-3 border border-slate-200 rounded-md bg-slate-50 flex justify-between items-center">
                 <span className="text-sm font-medium text-slate-800">vsudhir <span className="text-slate-400 font-normal">(You)</span></span>
                 <span className="text-xs bg-slate-200 text-slate-600 px-2 py-1 rounded">Admin</span>
             </div>
         </div>
      </div>

      {/* Data Management Section */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
         <h3 className="text-lg font-bold text-slate-800 mb-4">Data Management</h3>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <button
                onClick={() => document.getElementById('restore-input')?.click()}
                className="flex items-center justify-center gap-2 px-4 py-3 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 font-medium transition-colors"
             >
                <Upload className="w-5 h-5 text-slate-500" />
                Restore from Excel
                <input id="restore-input" type="file" accept=".xlsx, .xls" className="hidden" onChange={handleRestore} />
             </button>
             <button
                onClick={handleBackup}
                className="flex items-center justify-center gap-2 px-4 py-3 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 font-medium transition-colors"
             >
                <Download className="w-5 h-5 text-slate-500" />
                Backup to Excel
             </button>
         </div>
      </div>

       {/* About Section */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
        <h3 className="text-lg font-bold text-slate-800 mb-4">About This Tool</h3>
        <div className="text-sm text-slate-600 space-y-2 leading-relaxed">
            <p>This tool is designed to streamline the customer screening process. Key features include:</p>
            <ul className="list-disc pl-5 space-y-1">
                <li><strong>Secure User Access:</strong> Login system with admin-controlled user management.</li>
                <li><strong>High-Capacity Storage:</strong> Powered by IndexedDB to support hundreds of thousands of records.</li>
                <li><strong>Customer & RPL Management:</strong> Add, edit, delete, and search your data.</li>
                <li><strong>Bulk Upload:</strong> Quickly populate customer and RPL lists from Excel files.</li>
                <li><strong>Duplicate Detection:</strong> Automatically identify and clean duplicate entries.</li>
                <li><strong>Screening Generation:</strong> Create comparison comments between customers and RPLs.</li>
                <li><strong>Comment Library:</strong> Manage a list of standard, reusable comments.</li>
                <li><strong>Reference Data:</strong> Quick lookups for country codes and standard approvals.</li>
                <li><strong>Data Portability:</strong> Full data backup and restore using Excel.</li>
            </ul>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="border border-red-200 bg-red-50 rounded-lg p-6">
        <h3 className="text-lg font-bold text-red-800 mb-2">Danger Zone</h3>
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-red-700">
                <p className="font-bold">Reset All Data</p>
                <p>This will permanently delete all customers, RPLs, and comments, resetting the application to its initial state. This action cannot be undone.</p>
            </div>
            <button 
                onClick={handleResetApp}
                className="px-4 py-2 bg-red-600 text-white text-sm font-bold rounded-md hover:bg-red-700 shadow-sm flex items-center gap-2 whitespace-nowrap"
            >
                <AlertTriangle className="w-4 h-4" />
                Reset Application
            </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
