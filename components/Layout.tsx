import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { ShieldCheck, Users, AlertOctagon, MessageSquare, Globe, CheckSquare, Search, Sparkles, Settings, LogOut, Download } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { exportToExcel } from '../services/excelService';

const Layout: React.FC = () => {
  const { user, logout } = useAuth();
  const { customers, rpls, zymeData, generalComments, aprvComments } = useData();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleQuickSave = () => {
    const date = new Date().toISOString().split('T')[0];
    exportToExcel([
        { sheetName: 'Customers', data: customers },
        { sheetName: 'RPL', data: rpls },
        { sheetName: 'Zyme_Data', data: zymeData },
        { sheetName: 'General_Comments', data: generalComments },
        { sheetName: 'APRV_Comments', data: aprvComments },
    ], `ScreeningTool_Backup_${date}`);
  };

  const navClass = ({ isActive }: { isActive: boolean }) =>
    `relative flex items-center gap-2 px-3 py-2 text-sm font-medium transition-all duration-200 whitespace-nowrap rounded-lg ${
      isActive 
      ? 'bg-indigo-600 text-white shadow-md' 
      : 'text-slate-300 hover:text-white hover:bg-slate-800'
    }`;

  return (
    <div className="flex flex-col h-screen bg-slate-50 font-inter selection:bg-indigo-100 selection:text-indigo-900">
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
            animation: fadeIn 0.4s ease-out forwards;
        }
      `}</style>

      {/* Top Navigation Bar - Dark Theme */}
      <header className="bg-slate-900 border-b border-slate-800 shadow-sm z-30 sticky top-0">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center flex-1 overflow-hidden">
              {/* Brand/Logo */}
              <div className="flex-shrink-0 flex items-center gap-3 mr-8 cursor-default select-none group">
                <div className="p-1.5 bg-indigo-500/20 rounded-lg border border-indigo-500/30">
                    <ShieldCheck className="w-6 h-6 text-indigo-400" />
                </div>
                <span className="text-lg font-bold text-white tracking-tight hidden xl:block">
                    Screening Tool
                </span>
              </div>
              
              {/* Navigation Links */}
              <nav className="flex h-full items-center gap-1 overflow-x-auto no-scrollbar py-2">
                <NavLink to="/" className={navClass} end>
                  <ShieldCheck className="w-4 h-4" />
                  Home
                </NavLink>
                <NavLink to="/copilot" className={({ isActive }) =>
                    `relative flex items-center gap-2 px-3 py-2 text-sm font-medium transition-all duration-200 whitespace-nowrap rounded-lg ${
                      isActive 
                      ? 'bg-purple-600 text-white shadow-md' 
                      : 'text-slate-300 hover:text-purple-300 hover:bg-slate-800'
                    }`
                }>
                  <Sparkles className="w-4 h-4" />
                  Co-pilot
                </NavLink>
                <div className="w-px h-6 bg-slate-700 mx-2 hidden lg:block"></div>
                <NavLink to="/customers" className={navClass}>
                  <Users className="w-4 h-4" />
                  Customers
                </NavLink>
                <NavLink to="/rpl" className={navClass}>
                  <AlertOctagon className="w-4 h-4" />
                  RPL
                </NavLink>
                <div className="w-px h-6 bg-slate-700 mx-2 hidden lg:block"></div>
                <NavLink to="/comments" className={navClass}>
                  <MessageSquare className="w-4 h-4" />
                  Comments
                </NavLink>
                <NavLink to="/countries" className={navClass}>
                  <Globe className="w-4 h-4" />
                  Countries
                </NavLink>
                <NavLink to="/aprv" className={navClass}>
                  <CheckSquare className="w-4 h-4" />
                  APRV
                </NavLink>
                <NavLink to="/zyme" className={navClass}>
                  <Search className="w-4 h-4" />
                  Zyme
                </NavLink>
              </nav>
            </div>

            {/* User Actions */}
            <div className="flex items-center gap-3 pl-4 ml-4 border-l border-slate-700">
               {/* User Profile Display */}
               <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-700 bg-slate-800">
                  <span className="text-xs text-slate-300">Welcome, <span className="font-bold text-white">{user?.name || 'User'}</span></span>
               </div>

               <button
                  onClick={handleQuickSave}
                  className="p-2.5 rounded-lg text-emerald-400 hover:bg-emerald-500/10 hover:text-emerald-300 transition-all flex items-center gap-2"
                  title="Download a backup Excel file (Auto-save is always active)"
               >
                 <Download className="w-5 h-5" />
                 <span className="text-sm font-bold hidden lg:inline">Download Backup</span>
               </button>

               <NavLink to="/settings" className={({ isActive }) =>
                `p-2.5 rounded-lg transition-all duration-200 flex items-center gap-2 text-sm font-medium ${
                  isActive 
                  ? 'bg-indigo-600 text-white' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`} title="Settings">
                <Settings className="w-5 h-5" />
                <span className="hidden lg:inline">Settings</span>
              </NavLink>

              <button 
                onClick={handleLogout}
                className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-red-900/30 hover:text-red-400 border border-slate-700 transition-all text-sm font-medium"
                title="Sign Out"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-slate-50 scroll-smooth">
        <div className="max-w-[1920px] mx-auto p-6 md:p-8 pb-16">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;