
import React, { useState } from 'react';
import { COUNTRIES } from '../constants';
import { Search, MapPin, Globe } from 'lucide-react';

const Countries: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter and sort countries based on search term
  const getFilteredCountries = () => {
    if (searchTerm.trim() === '') return [];

    const lowerTerm = searchTerm.toLowerCase().trim();
    
    // Exact Code Match (Priority 1) - If found, return ONLY this result
    const exactCodeMatch = COUNTRIES.find(c => c.code.toLowerCase() === lowerTerm);
    if (exactCodeMatch) {
        return [exactCodeMatch];
    }
    
    // Otherwise search by name or partial code
    return COUNTRIES.filter(c => 
        c.name.toLowerCase().includes(lowerTerm) ||
        c.code.toLowerCase().includes(lowerTerm)
    );
  };

  const filteredCountries = getFilteredCountries();

  return (
    <div className="max-w-4xl mx-auto mt-12 space-y-8 px-4">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">Country Region Lookup</h2>
        <p className="text-slate-500 text-lg">Enter a 2-letter country code (e.g., RU) or name to find the region.</p>
      </div>
      
      <div className="bg-white p-2 rounded-2xl shadow-xl border border-slate-100 transform transition-all focus-within:ring-4 focus-within:ring-blue-50 focus-within:shadow-2xl max-w-2xl mx-auto">
        <div className="relative flex items-center">
          <Search className="absolute left-6 w-6 h-6 text-slate-400" />
          <input
            type="text"
            placeholder="Search by Code or Name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-16 pr-6 py-4 text-xl border-none rounded-xl focus:ring-0 placeholder:text-slate-300 text-slate-800 font-medium"
            autoFocus
          />
        </div>
      </div>

      {searchTerm && (
        <div className="space-y-4 animate-fade-in max-w-2xl mx-auto">
          {filteredCountries.length === 0 ? (
             <div className="text-center p-12 bg-white rounded-2xl border border-slate-200 shadow-sm">
                <Globe className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                <p className="text-slate-500 text-lg font-medium">No countries found for "{searchTerm}"</p>
                <p className="text-slate-400 text-sm mt-2">Try checking the country code.</p>
             </div>
          ) : (
            <div className="grid gap-4">
                {filteredCountries.map((country, index) => (
                  <div key={`${country.code}-${index}`} className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-6 hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center gap-5">
                        <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg flex items-center justify-center text-white font-bold text-2xl">
                            {country.code}
                        </div>
                        <div>
                           <h3 className="text-2xl font-bold text-slate-900">{country.name}</h3>
                           <p className="text-sm text-slate-500 font-medium">Country Name</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-4 bg-slate-50 px-6 py-4 rounded-xl border border-slate-100 sm:self-stretch sm:items-center min-w-[140px]">
                        <MapPin className={`w-6 h-6 ${
                                country.region === 'AMS' ? 'text-blue-500' :
                                country.region === 'EMEA' ? 'text-purple-500' :
                                'text-orange-500'
                            }`} />
                        <div>
                            <span className={`block text-xl font-bold ${
                                country.region === 'AMS' ? 'text-blue-700' :
                                country.region === 'EMEA' ? 'text-purple-700' :
                                'text-orange-700'
                            }`}>
                                {country.region}
                            </span>
                            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Region</span>
                        </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Countries;
