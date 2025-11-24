
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Customer, RPL, ZymeEntry, CommentItem } from '../types';
import { INITIAL_COMMENTS, INITIAL_APRV_COMMENTS } from '../constants';
import { dbService, STORES } from '../services/storage';
import { Loader2 } from 'lucide-react';

interface DataContextType {
  customers: Customer[];
  rpls: RPL[];
  zymeData: ZymeEntry[];
  generalComments: CommentItem[];
  aprvComments: CommentItem[];
  addCustomer: (c: Customer) => void;
  updateCustomer: (c: Customer) => void;
  deleteCustomer: (id: string) => void;
  deleteCustomers: (ids: string[]) => void;
  addRPL: (r: RPL) => void;
  updateRPL: (r: RPL) => void;
  deleteRPL: (id: string) => void;
  deleteRPLs: (ids: string[]) => void;
  addZyme: (z: ZymeEntry) => void;
  deleteZyme: (id: string) => void;
  bulkImportCustomers: (data: Customer[]) => void;
  bulkImportRPL: (data: RPL[]) => void;
  bulkImportZyme: (data: ZymeEntry[]) => void;
  addGeneralComment: (text: string) => void;
  deleteGeneralComment: (id: string) => void;
  bulkImportGeneralComments: (data: CommentItem[]) => void;
  addAprvComment: (title: string, text: string, additionalInfo?: string, remarks?: string) => void;
  deleteAprvComment: (id: string) => void;
  bulkImportAprvComments: (data: CommentItem[]) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [rpls, setRpls] = useState<RPL[]>([]);
  const [zymeData, setZymeData] = useState<ZymeEntry[]>([]);
  const [generalComments, setGeneralComments] = useState<CommentItem[]>([]);
  const [aprvComments, setAprvComments] = useState<CommentItem[]>([]);

  // Initial Load from IndexedDB (with fallback to localStorage for migration)
  useEffect(() => {
    const loadData = async () => {
        try {
            // 1. Customers
            let loadedCustomers = await dbService.get<Customer[]>(STORES.CUSTOMERS);
            if (!loadedCustomers) {
                const ls = localStorage.getItem('app_customers');
                loadedCustomers = ls ? JSON.parse(ls) : [];
                if (loadedCustomers && loadedCustomers.length > 0) await dbService.set(STORES.CUSTOMERS, loadedCustomers);
            }
            setCustomers(loadedCustomers || []);

            // 2. RPL
            let loadedRpls = await dbService.get<RPL[]>(STORES.RPLS);
            if (!loadedRpls) {
                const ls = localStorage.getItem('app_rpls');
                loadedRpls = ls ? JSON.parse(ls) : [];
                if (loadedRpls && loadedRpls.length > 0) await dbService.set(STORES.RPLS, loadedRpls);
            }
            setRpls(loadedRpls || []);

            // 3. Zyme
            let loadedZyme = await dbService.get<ZymeEntry[]>(STORES.ZYME);
            if (!loadedZyme) {
                const ls = localStorage.getItem('app_zyme');
                loadedZyme = ls ? JSON.parse(ls) : [];
                if (loadedZyme && loadedZyme.length > 0) await dbService.set(STORES.ZYME, loadedZyme);
            }
            setZymeData(loadedZyme || []);

            // 4. General Comments
            let loadedComments = await dbService.get<CommentItem[]>(STORES.GENERAL_COMMENTS);
            if (!loadedComments) {
                const ls = localStorage.getItem('app_general_comments');
                loadedComments = ls ? JSON.parse(ls) : null;
                // If totally empty (new user), use constants
                if (!loadedComments) loadedComments = INITIAL_COMMENTS;
                await dbService.set(STORES.GENERAL_COMMENTS, loadedComments);
            }
            setGeneralComments(loadedComments || []);

            // 5. APRV Comments
            let loadedAprv = await dbService.get<CommentItem[]>(STORES.APRV_COMMENTS);
            if (!loadedAprv) {
                const ls = localStorage.getItem('app_aprv_comments');
                loadedAprv = ls ? JSON.parse(ls) : null;
                // If totally empty (new user), use constants
                if (!loadedAprv) loadedAprv = INITIAL_APRV_COMMENTS;
                await dbService.set(STORES.APRV_COMMENTS, loadedAprv);
            }
            setAprvComments(loadedAprv || []);

        } catch (error) {
            console.error("Failed to load data from storage", error);
        } finally {
            setLoading(false);
        }
    };
    loadData();
  }, []);

  // Persist changes to IndexedDB
  // Note: For extremely large datasets (100k+), we might debounce this, 
  // but for <50k records, IDB put is very fast.
  useEffect(() => { if (!loading) dbService.set(STORES.CUSTOMERS, customers); }, [customers, loading]);
  useEffect(() => { if (!loading) dbService.set(STORES.RPLS, rpls); }, [rpls, loading]);
  useEffect(() => { if (!loading) dbService.set(STORES.ZYME, zymeData); }, [zymeData, loading]);
  useEffect(() => { if (!loading) dbService.set(STORES.GENERAL_COMMENTS, generalComments); }, [generalComments, loading]);
  useEffect(() => { if (!loading) dbService.set(STORES.APRV_COMMENTS, aprvComments); }, [aprvComments, loading]);


  // Customers
  const addCustomer = (c: Customer) => setCustomers(prev => [...prev, c]);
  const updateCustomer = (c: Customer) => setCustomers(prev => prev.map(item => item.id === c.id ? c : item));
  const deleteCustomer = (id: string) => setCustomers(prev => prev.filter(item => item.id !== id));
  const deleteCustomers = (ids: string[]) => setCustomers(prev => prev.filter(item => !ids.includes(item.id)));
  const bulkImportCustomers = (data: Customer[]) => {
    setCustomers(prev => {
        const existingIds = new Set(prev.map(p => p.id));
        const newItems = data
            .map(d => ({ ...d, id: d.id || Math.random().toString(36).substr(2, 9) }))
            .filter(d => !existingIds.has(d.id));
        return [...prev, ...newItems];
    });
  };

  // RPL
  const addRPL = (r: RPL) => setRpls(prev => [...prev, r]);
  const updateRPL = (r: RPL) => setRpls(prev => prev.map(item => item.id === r.id ? r : item));
  const deleteRPL = (id: string) => setRpls(prev => prev.filter(item => item.id !== id));
  const deleteRPLs = (ids: string[]) => setRpls(prev => prev.filter(item => !ids.includes(item.id)));
  const bulkImportRPL = (data: RPL[]) => {
    setRpls(prev => {
        const existingIds = new Set(prev.map(p => p.id));
        const newItems = data
            .map(d => ({ ...d, id: d.id || Math.random().toString(36).substr(2, 9) }))
            .filter(d => !existingIds.has(d.id));
        return [...prev, ...newItems];
    });
  };

  // Zyme
  const addZyme = (z: ZymeEntry) => setZymeData(prev => [...prev, z]);
  const deleteZyme = (id: string) => setZymeData(prev => prev.filter(item => item.id !== id));
  const bulkImportZyme = (data: ZymeEntry[]) => {
    setZymeData(prev => {
        const existingIds = new Set(prev.map(p => p.id));
        const newItems = data
            .map(d => ({ ...d, id: d.id || Math.random().toString(36).substr(2, 9) }))
            .filter(d => !existingIds.has(d.id));
        return [...prev, ...newItems];
    });
  };

  // Comments
  const addGeneralComment = (text: string) => {
    const newComment: CommentItem = {
        id: Math.random().toString(36).substr(2, 9),
        text,
        category: 'General'
    };
    setGeneralComments(prev => [...prev, newComment]);
  };
  const deleteGeneralComment = (id: string) => setGeneralComments(prev => prev.filter(c => c.id !== id));
  
  const bulkImportGeneralComments = (data: CommentItem[]) => {
     setGeneralComments(prev => {
        const existingTexts = new Set(prev.map(c => c.text));
        const newItems = data
            .filter(d => d.text && !existingTexts.has(d.text))
            .map(d => ({ ...d, id: d.id || Math.random().toString(36).substr(2, 9), category: 'General' as const }));
        return [...prev, ...newItems];
    });
  };

  // APRV
  const addAprvComment = (title: string, text: string, additionalInfo?: string, remarks?: string) => {
    const newComment: CommentItem = {
        id: Math.random().toString(36).substr(2, 9),
        title,
        text,
        additionalInfo,
        remarks,
        category: 'APRV'
    };
    setAprvComments(prev => [...prev, newComment]);
  };
  const deleteAprvComment = (id: string) => setAprvComments(prev => prev.filter(c => c.id !== id));

  const bulkImportAprvComments = (data: CommentItem[]) => {
     setAprvComments(prev => {
        const existingTitles = new Set(prev.map(c => c.title));
        const newItems = data
            .filter(d => d.title && !existingTitles.has(d.title))
            .map(d => ({ 
                ...d, 
                id: d.id || Math.random().toString(36).substr(2, 9), 
                category: 'APRV' as const 
            }));
        return [...prev, ...newItems];
    });
  };

  if (loading) {
      return (
          <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
              <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
              <p className="text-slate-600 font-medium">Loading your database...</p>
          </div>
      );
  }

  return (
    <DataContext.Provider value={{
      customers, rpls, zymeData, generalComments, aprvComments,
      addCustomer, updateCustomer, deleteCustomer, deleteCustomers, bulkImportCustomers,
      addRPL, updateRPL, deleteRPL, deleteRPLs, bulkImportRPL,
      addZyme, deleteZyme, bulkImportZyme,
      addGeneralComment, deleteGeneralComment, bulkImportGeneralComments,
      addAprvComment, deleteAprvComment, bulkImportAprvComments
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
