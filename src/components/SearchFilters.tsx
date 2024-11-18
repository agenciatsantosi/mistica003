import React from 'react';
import { Search } from 'lucide-react';

const SearchFilters = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="relative">
        <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
        <input
          type="search"
          placeholder="Busque por nome, religião ou cidade..."
          className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-200 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 transition-all"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <select className="w-full p-3 rounded-lg border border-gray-200 focus:border-rose-500">
          <option value="">Tipo de Local</option>
          <option value="igreja">Igrejas</option>
          <option value="templo">Templos</option>
          <option value="centro">Centros Espirituais</option>
        </select>
        
        <select className="w-full p-3 rounded-lg border border-gray-200 focus:border-rose-500">
          <option value="">Distância</option>
          <option value="5">Até 5km</option>
          <option value="10">Até 10km</option>
          <option value="20">Até 20km</option>
        </select>
        
        <select className="w-full p-3 rounded-lg border border-gray-200 focus:border-rose-500">
          <option value="">Avaliação</option>
          <option value="4">4+ estrelas</option>
          <option value="3">3+ estrelas</option>
          <option value="2">2+ estrelas</option>
        </select>
      </div>
    </div>
  );
};

export default SearchFilters;