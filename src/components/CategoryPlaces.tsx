import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { MapPin, Clock } from 'lucide-react';
import { LazyImage } from './ui/Image';

const CategoryPlaces = () => {
  const { type } = useParams();
  const navigate = useNavigate();
  const places = useSelector((state: RootState) => 
    state.places.items.filter(place => place.type === type)
  );

  const getCategoryTitle = () => {
    switch (type) {
      case 'igreja':
        return 'Igrejas';
      case 'templo':
        return 'Templos';
      case 'centro':
        return 'Centros Espirituais';
      default:
        return 'Lugares';
    }
  };

  if (places.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold mb-8">{getCategoryTitle()}</h1>
        <div className="text-center py-12">
          <p className="text-gray-600">Nenhum local encontrado nesta categoria.</p>
          <button 
            onClick={() => navigate('/')}
            className="mt-4 text-rose-500 hover:text-rose-600"
          >
            Voltar para a página inicial
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-8">{getCategoryTitle()}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {places.map((place) => (
          <article
            key={place.id}
            className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => navigate(`/local/${place.id}`)}
          >
            <LazyImage
              src={place.image}
              alt={place.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">{place.name}</h3>
              <div className="flex items-center text-gray-600 mb-2">
                <MapPin size={16} className="mr-1" />
                {place.location}
              </div>
              <div className="flex items-center text-gray-600 mb-3">
                <Clock size={16} className="mr-1" />
                {place.hours}
              </div>
              <p className="text-gray-600 mb-4">{place.description}</p>
              <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                <span className="px-3 py-1 bg-rose-500 text-white rounded-full text-sm">
                  {place.category}
                </span>
                <div className="flex items-center">
                  <div className="text-yellow-400 mr-1">
                    {'★'.repeat(place.rating)}{'☆'.repeat(5 - place.rating)}
                  </div>
                  <span className="text-gray-600">({place.reviews})</span>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default CategoryPlaces;