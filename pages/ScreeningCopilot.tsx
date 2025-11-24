import React, { useState } from 'react';
import { searchEntity } from '../services/geminiService';
import { Sparkles, Search, Loader2, Globe, ExternalLink, Link as LinkIcon, RefreshCw, MapPin, Building2, ChevronRight, Save, UserPlus, AlertOctagon, CheckCircle2, X } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useData } from '../context/DataContext';

const ScreeningCopilot: React.FC = () => {
  const { addCustomer, addRPL } = useData();
  
  // Search State
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [groundingMetadata, setGroundingMetadata] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Save Modal State
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [saveStep, setSaveStep] = useState<1 | 2>(1); // 1: Select Type, 2: Confirm Details
  const [saveCategory, setSaveCategory] = useState<'customer' | 'rpl' | null>(null);
  const [availableLinks, setAvailableLinks] = useState<string[]>([]);
  const [selectedLink, setSelectedLink] = useState('');
  const [businessSummary, setBusinessSummary] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !address) return;

    setLoading(true);
    setError(null);
    setResult(null);
    setGroundingMetadata(null);

    try {
      const response = await searchEntity(name, address);
      setResult(response.text || "No information found.");
      setGroundingMetadata(response.groundingMetadata);
    } catch (err) {
      setError("Failed to fetch information. Please check your API Key or internet connection.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setName('');
    setAddress('');
    setResult(null);
    setGroundingMetadata(null);
    setError(null);
    setIsSaveModalOpen(false);
  };

  // --- Save Logic ---

  const openSaveModal = () => {
    // 1. Extract Links
    const links: string[] = [];
    if (groundingMetadata?.groundingChunks) {
      groundingMetadata.groundingChunks.forEach((chunk: any) => {
        if (chunk.web?.uri) links.push(chunk.web.uri);
      });
    }
    const uniqueLinks = Array.from(new Set(links));
    setAvailableLinks(uniqueLinks);
    setSelectedLink(uniqueLinks.length > 0 ? uniqueLinks[0] : '');

    // 2. Extract Summary (Naive implementation: First sentence that looks like a description)
    // Cleaning up markdown to get plain text for the input
    const plainText = result?.replace(/[#*`]/g, '') || '';
    const sentences = plainText.split('. ');
    // Try to find a sentence that mentions "is a" or "business" or take the first one
    const summaryCandidate = sentences.find(s => s.toLowerCase().includes('is a') || s.toLowerCase().includes('specializes')) || sentences[0] || '';
    setBusinessSummary(summaryCandidate.substring(0, 150) + (summaryCandidate.length > 150 ? '...' : ''));

    setSaveCategory(null);
    setSaveStep(1);
    setIsSaveModalOpen(true);
  };

  const handleConfirmSave = () => {
    if (!saveCategory) return;

    // Combine details into the address field for visibility in the main table/comparator
    // Format: [Physical Address] | Website: [URL] | Business: [Summary]
    const enrichedAddress = `${address} \nWebsite: ${selectedLink || 'N/A'} \nBusiness: ${businessSummary}`;

    const entityData = {
        id: Math.random().toString(36).substr(2, 9),
        name: name,
        address: enrichedAddress,
        website: selectedLink,
        businessSummary: businessSummary
    };

    if (saveCategory === 'customer') {
        addCustomer(entityData);
        alert('Saved successfully to Customers list!');
    } else {
        addRPL(entityData);
        alert('Saved successfully to RPL list!');
    }

    setIsSaveModalOpen(false);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 relative">
      {/* Header Section */}
      <div className="text-center space-y-3 mb-10">
        <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight flex items-center justify-center gap-3">
          <div className="p-2 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl shadow-lg">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          Screening Co-pilot
        </h2>
        <p className="text-lg text-slate-500 max-w-2xl mx-auto">
          AI-powered entity verification engine. Identify business activities, confirm locations, check for individual status, and retrieve official web sources instantly.
        </p>
      </div>
      
      {/* Search Bar Container */}
      <div className="sticky top-20 z-20 mx-auto max-w-5xl">
        <form onSubmit={handleSearch} className="relative">
            <div className="bg-white p-2 rounded-2xl shadow-xl border border-slate-200 flex flex-col md:flex-row items-center gap-0 md:gap-2 focus-within:ring-4 focus-within:ring-purple-500/10 transition-shadow duration-300">
                
                {/* Entity Name Input */}
                <div className="relative flex-1 w-full md:w-auto group px-4 py-2">
                    <div className="flex items-center gap-3">
                        <Building2 className="w-5 h-5 text-slate-400 group-focus-within:text-purple-600 transition-colors" />
                        <div className="flex-1">
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Entity / Individual Name</label>
                            <input
                              type="text"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              className="w-full bg-transparent border-none p-0 text-slate-900 placeholder-slate-300 focus:ring-0 font-semibold text-lg"
                              placeholder="e.g. Acme Corp or John Doe"
                              required
                            />
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className="hidden md:block w-px h-10 bg-slate-200"></div>
                <div className="md:hidden w-full h-px bg-slate-100 my-2"></div>

                {/* Address Input */}
                <div className="relative flex-1 w-full md:w-auto group px-4 py-2">
                     <div className="flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-slate-400 group-focus-within:text-purple-600 transition-colors" />
                        <div className="flex-1">
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Address / Location</label>
                            <input
                              type="text"
                              value={address}
                              onChange={(e) => setAddress(e.target.value)}
                              className="w-full bg-transparent border-none p-0 text-slate-900 placeholder-slate-300 focus:ring-0 font-semibold text-lg"
                              placeholder="City, Country or Full Address"
                              required
                            />
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="p-2 flex gap-2 w-full md:w-auto">
                    <button
                        type="button"
                        onClick={handleClear}
                        className="px-4 py-3 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all"
                        title="Clear Search"
                    >
                        <RefreshCw className="w-5 h-5" />
                    </button>
                    <button
                        type="submit"
                        disabled={loading || !name || !address}
                        className="flex-1 md:flex-none px-8 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 shadow-lg shadow-purple-200 hover:shadow-purple-300 disabled:opacity-50 disabled:shadow-none transition-all font-semibold flex items-center justify-center gap-2 min-w-[140px]"
                    >
                        {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <Search className="w-5 h-5" />}
                        {loading ? 'Analyzing...' : 'Identify'}
                    </button>
                </div>
            </div>
        </form>
      </div>

      {error && (
        <div className="max-w-4xl mx-auto p-4 bg-red-50 text-red-700 border border-red-200 rounded-xl flex items-center gap-3">
           <div className="p-2 bg-red-100 rounded-full"><RefreshCw className="w-4 h-4"/></div>
           {error}
        </div>
      )}

      {(result || (groundingMetadata?.groundingChunks?.length > 0)) && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in max-w-6xl mx-auto pb-32">
          
          {/* Main Analysis Column */}
          <div className="lg:col-span-2 space-y-6">
              {result && (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="bg-gradient-to-r from-purple-50 to-white px-6 py-4 border-b border-purple-100 flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-purple-600" />
                        <h3 className="font-bold text-slate-800">AI Analysis Result</h3>
                    </div>
                    <div className="p-8 prose prose-slate max-w-none text-slate-700 leading-relaxed prose-headings:text-slate-900 prose-a:text-purple-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-slate-900">
                        <ReactMarkdown components={{
                            a: ({node, ...props}) => (
                                <a {...props} className="text-purple-600 hover:text-purple-800 font-semibold bg-purple-50 px-1 rounded transition-colors" target="_blank" rel="noopener noreferrer" />
                            ),
                            li: ({node, ...props}) => (
                                <li {...props} className="marker:text-purple-400" />
                            )
                        }}>{result}</ReactMarkdown>
                    </div>
                </div>
              )}
          </div>

          {/* Sidebar Column (Sources) */}
          <div className="space-y-6">
             {groundingMetadata?.groundingChunks?.length > 0 && (
                 <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                    <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                       <LinkIcon className="w-4 h-4" />
                       Verified Sources
                    </h4>
                    <div className="space-y-3">
                        {groundingMetadata.groundingChunks.map((chunk: any, i: number) => {
                            if(chunk.web) {
                                return (
                                    <a 
                                       key={i}
                                       href={chunk.web.uri}
                                       target="_blank"
                                       rel="noopener noreferrer"
                                       className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-purple-300 hover:scale-[1.02] transition-all group"
                                    >
                                        <div className="h-8 w-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                                            <Globe className="w-4 h-4" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-sm font-bold text-slate-800 truncate group-hover:text-purple-700 transition-colors">
                                                {chunk.web.title}
                                            </div>
                                            <div className="text-xs text-slate-400 truncate">{new URL(chunk.web.uri).hostname}</div>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-purple-400" />
                                    </a>
                                );
                            }
                            return null;
                        })}
                    </div>
                 </div>
             )}
             
             {/* Quick Actions Card */}
             <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-6 text-white shadow-lg">
                <h4 className="font-bold text-lg mb-2">Next Steps</h4>
                <p className="text-purple-100 text-sm mb-4">
                    Based on the analysis, you can save this entity to your database for future screening.
                </p>
                <button 
                    onClick={openSaveModal}
                    className="w-full py-3 bg-white text-indigo-700 hover:bg-indigo-50 rounded-xl text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2"
                >
                    <Save className="w-4 h-4" />
                    Add to My Data
                </button>
             </div>
          </div>
        </div>
      )}

      {/* Save Modal */}
      {isSaveModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in">
                {/* Modal Header */}
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <h3 className="text-lg font-bold text-slate-900">Save Entity to Database</h3>
                    <button onClick={() => setIsSaveModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-200 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {saveStep === 1 ? (
                        <div className="space-y-6">
                             <div className="text-center space-y-2">
                                <h4 className="text-xl font-bold text-slate-800">What type of entity is this?</h4>
                                <p className="text-slate-500 text-sm">Select the list where you want to save this record.</p>
                             </div>
                             <div className="grid grid-cols-2 gap-4">
                                <button
                                    onClick={() => { setSaveCategory('customer'); setSaveStep(2); }}
                                    className="flex flex-col items-center gap-3 p-6 rounded-xl border-2 border-slate-200 hover:border-indigo-500 hover:bg-indigo-50 transition-all group"
                                >
                                    <div className="p-4 bg-indigo-100 text-indigo-600 rounded-full group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                        <UserPlus className="w-8 h-8" />
                                    </div>
                                    <span className="font-bold text-slate-700 group-hover:text-indigo-700">Customer</span>
                                </button>

                                <button
                                    onClick={() => { setSaveCategory('rpl'); setSaveStep(2); }}
                                    className="flex flex-col items-center gap-3 p-6 rounded-xl border-2 border-slate-200 hover:border-red-500 hover:bg-red-50 transition-all group"
                                >
                                    <div className="p-4 bg-red-100 text-red-600 rounded-full group-hover:bg-red-600 group-hover:text-white transition-colors">
                                        <AlertOctagon className="w-8 h-8" />
                                    </div>
                                    <span className="font-bold text-slate-700 group-hover:text-red-700">Restricted Party (RPL)</span>
                                </button>
                             </div>
                        </div>
                    ) : (
                        <div className="space-y-5">
                            {/* Link Selection */}
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Select Website Link</label>
                                {availableLinks.length > 0 ? (
                                    <div className="space-y-2 max-h-32 overflow-y-auto border border-slate-200 rounded-lg p-2 bg-slate-50">
                                        {availableLinks.map((link, idx) => (
                                            <label key={idx} className="flex items-center gap-3 p-2 rounded hover:bg-white cursor-pointer transition-colors">
                                                <input 
                                                    type="radio" 
                                                    name="website" 
                                                    value={link} 
                                                    checked={selectedLink === link}
                                                    onChange={() => setSelectedLink(link)}
                                                    className="text-indigo-600 focus:ring-indigo-500"
                                                />
                                                <span className="text-sm text-slate-600 truncate">{link}</span>
                                            </label>
                                        ))}
                                    </div>
                                ) : (
                                    <input 
                                        type="text" 
                                        placeholder="Enter website URL manually..."
                                        value={selectedLink}
                                        onChange={(e) => setSelectedLink(e.target.value)}
                                        className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                    />
                                )}
                            </div>

                            {/* Summary Edit */}
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Business Summary (One Line)</label>
                                <textarea
                                    value={businessSummary}
                                    onChange={(e) => setBusinessSummary(e.target.value)}
                                    placeholder="Brief description of what the business does..."
                                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 h-24 text-sm"
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button 
                                    onClick={() => setSaveStep(1)}
                                    className="flex-1 px-4 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-lg transition-colors"
                                >
                                    Back
                                </button>
                                <button 
                                    onClick={handleConfirmSave}
                                    className="flex-1 px-4 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 shadow-md transition-colors flex items-center justify-center gap-2"
                                >
                                    <CheckCircle2 className="w-4 h-4" />
                                    Confirm & Save
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default ScreeningCopilot;