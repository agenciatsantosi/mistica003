import React, { useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { MapPin, Clock, Loader2 } from 'lucide-react';
import { LazyImage } from './ui/Image';
import { selectPlacesByType } from '../store/selectors/placeSelectors';
import { fetchPlaces } from '../store/slices/placesSlice';

const CategoryPlaces = () => {
  const { type } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state: RootState) => state.places);
  const places = useSelector((state: RootState) => selectPlacesByType(state, type));

  useEffect(() => {
    console.log('Iniciando CategoryPlaces...'); // Debug
    console.log('Tipo:', type); // Debug
    console.log('Buscando lugares...'); // Debug
    dispatch(fetchPlaces());
  }, [dispatch]);

  useEffect(() => {
    console.log('Places atualizados:', places.length); // Debug
    console.log('Primeiro place:', places[0]); // Debug
  }, [places]);

  const categoryTitle = useMemo(() => {
    console.log('Tipo de categoria:', type); // Debug
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
  }, [type]);

  if (loading) {
    console.log('Carregando lugares...'); // Debug
    return (
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold mb-8">{categoryTitle}</h1>
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 text-rose-500 animate-spin" />
        </div>
      </div>
    );
  }

  if (!places || places.length === 0) {
    console.log('Nenhum lugar encontrado'); // Debug
    return (
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold mb-8">{categoryTitle}</h1>
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

  console.log('Renderizando lugares:', places); // Debug
  console.log('Lugares encontrados:', places.length); // Debug
  console.log('Primeiro lugar:', places[0]); // Debug

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-8">{categoryTitle}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {places.map((place) => (
          <article
            key={place.id}
            className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => navigate(`/local/${place.id}`)}
          >
            <div className="relative h-48">
              <LazyImage
                src={place.images?.[0] || '/placeholder-image.jpg'}
                alt={place.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">{place.name || 'Sem nome'}</h3>
              <div className="flex items-center text-gray-600 mb-2">
                <MapPin size={16} className="mr-1 flex-shrink-0" />
                <span className="truncate">
                  {typeof place.address === 'string' 
                    ? place.address 
                    : place.address?.street 
                      ? `${place.address.street}, ${place.address.number} - ${place.address.city}, ${place.address.state}`
                      : 'Endereço não disponível'
                  }
                </span>
              </div>
              {place.hours && (
                <div className="flex items-center text-gray-600 mb-3">
                  <Clock size={16} className="mr-1 flex-shrink-0" />
                  <span className="truncate">{place.hours}</span>
                </div>
              )}
              {place.description && (
                <p className="text-gray-600 mb-4 line-clamp-2">{place.description}</p>
              )}
              <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                <span className="px-3 py-1 bg-rose-500 text-white rounded-full text-sm capitalize">
                  {type}
                </span>
                {place.rating && (
                  <div className="flex items-center">
                    <div className="text-yellow-400 mr-1">
                      {'★'.repeat(Math.floor(place.rating))}
                      {'☆'.repeat(5 - Math.floor(place.rating))}
                    </div>
                    <span className="text-gray-600">
                      ({place.rating.toFixed(1)})
                    </span>
                  </div>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default CategoryPlaces;