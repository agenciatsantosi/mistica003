import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useGeolocation } from '../hooks/useGeolocation';
import PlacesMap from './places/PlacesMap';
import { Place } from '../types/place';
import { toast } from 'react-toastify';
import { MapPin, Loader2 } from 'lucide-react';

const NearbyPlaces = () => {
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const { latitude, longitude, error: locationError } = useGeolocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNearbyPlaces = async () => {
      if (!latitude || !longitude) return;

      try {
        const placesRef = collection(db, 'places');
        // Primeiro buscar apenas lugares ativos
        const q = query(
          placesRef,
          where('status', '==', 'active')
        );

        const snapshot = await getDocs(q);
        const placesData: Place[] = [];

        snapshot.forEach((doc) => {
          const data = doc.data() as Omit<Place, 'id'>;
          placesData.push({
            id: doc.id,
            ...data,
            createdAt: data.createdAt.toDate(),
            updatedAt: data.updatedAt.toDate(),
          });
        });

        // Calcular distância e filtrar por proximidade (10km)
        const nearbyPlaces = placesData
          .map(place => ({
            ...place,
            distance: calculateDistance(
              latitude,
              longitude,
              place.latitude,
              place.longitude
            )
          }))
          .filter(place => place.distance <= 10)
          .sort((a, b) => (b.rating || 0) - (a.rating || 0))
          .slice(0, 20);

        setPlaces(nearbyPlaces);
      } catch (error) {
        console.error('Erro ao buscar locais próximos:', error);
        toast.error('Erro ao buscar locais próximos');
      } finally {
        setLoading(false);
      }
    };

    fetchNearbyPlaces();
  }, [latitude, longitude]);

  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const R = 6371; // Raio da Terra em km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const toRad = (value: number): number => {
    return (value * Math.PI) / 180;
  };

  const handlePlaceSelect = (place: Place) => {
    navigate(`/local/${place.id}`);
  };

  if (locationError) {
    return (
      <div className="bg-yellow-50 p-4 rounded-lg mb-8">
        <div className="flex items-center">
          <MapPin className="h-5 w-5 text-yellow-700 mr-2" />
          <p className="text-yellow-700">
            Para ver locais próximos, precisamos de acesso à sua localização.
            Por favor, permita o acesso e recarregue a página.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 text-rose-500 animate-spin" />
      </div>
    );
  }

  if (places.length === 0) {
    return (
      <div className="bg-gray-50 p-4 rounded-lg mb-8">
        <div className="flex items-center">
          <MapPin className="h-5 w-5 text-gray-500 mr-2" />
          <p className="text-gray-500">
            Não encontramos locais religiosos próximos a você em um raio de 10km.
          </p>
        </div>
      </div>
    );
  }

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">
        Locais Religiosos Próximos
      </h2>

      <div className="grid gap-6 mb-6">
        <PlacesMap
          places={places}
          center={{ lat: latitude || 0, lng: longitude || 0 }}
          onPlaceSelect={handlePlaceSelect}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {places.map((place) => (
          <div
            key={place.id}
            className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => handlePlaceSelect(place)}
          >
            <img
              src={place.images[0] || 'https://via.placeholder.com/300x200'}
              alt={place.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {place.name}
              </h3>
              <p className="text-sm text-gray-500 mb-2">
                {place.address}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-gray-500">
                  <MapPin className="h-4 w-4 mr-1" />
                  {place.distance.toFixed(1)}km de distância
                </div>
                {place.rating && (
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-900">
                      {place.rating.toFixed(1)}
                    </span>
                    <span className="text-yellow-400 ml-1">★</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default NearbyPlaces;