import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGeolocation } from '../hooks/useGeolocation';
import { calculateDistance } from '../utils/distance';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { MapPin, Navigation } from 'lucide-react';
import { LazyImage } from './ui/Image';

interface Place {
  id: string;
  name: string;
  image: string;
  latitude: number;
  longitude: number;
  type: string;
  category: string;
  distance?: number;
}

const NearbyPlaces = () => {
  const navigate = useNavigate();
  const { latitude, longitude, error, loading } = useGeolocation();
  const places = useSelector((state: RootState) => state.places.items);

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Buscando lugares próximos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 text-rose-500 hover:text-rose-600"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  if (!latitude || !longitude) return null;

  const nearbyPlaces = places
    .map(place => ({
      ...place,
      distance: calculateDistance(
        latitude,
        longitude,
        place.latitude,
        place.longitude
      ),
    }))
    .filter(place => place.distance <= 10) // Filtrar lugares até 10km
    .sort((a, b) => (a.distance || 0) - (b.distance || 0));

  const handlePlaceClick = (placeId: string) => {
    navigate(`/local/${placeId}`);
  };

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6">Lugares Próximos a Você</h2>
        
        {nearbyPlaces.length === 0 ? (
          <p className="text-center text-gray-600">
            Nenhum lugar encontrado em um raio de 10km.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {nearbyPlaces.map(place => (
              <div
                key={place.id}
                onClick={() => handlePlaceClick(place.id)}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              >
                <LazyImage
                  src={place.image}
                  alt={place.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2">{place.name}</h3>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span className="flex items-center">
                      <MapPin size={16} className="mr-1" />
                      {place.distance?.toFixed(1)} km
                    </span>
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${place.latitude},${place.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-rose-500 hover:text-rose-600"
                      onClick={(e) => e.stopPropagation()} // Evita que o clique no link de navegação abra o perfil
                    >
                      <Navigation size={16} className="mr-1" />
                      Como chegar
                    </a>
                  </div>
                  <span className="inline-block mt-2 px-2 py-1 bg-rose-100 text-rose-600 text-xs rounded-full">
                    {place.category}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default NearbyPlaces;