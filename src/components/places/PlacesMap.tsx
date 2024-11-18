import { useEffect, useRef, useState } from 'react';
import { useGeolocation } from '../../hooks/useGeolocation';
import { toast } from 'react-toastify';
import { Place } from '../../types/place';

declare global {
  interface Window {
    google: any;
  }
}

interface PlacesMapProps {
  places: Place[];
  onPlaceSelect?: (place: Place) => void;
  center?: { lat: number; lng: number };
  zoom?: number;
}

const PlacesMap = ({ places, onPlaceSelect, center, zoom = 13 }: PlacesMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const { latitude, longitude, loading, error } = useGeolocation();
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    // Carregar o script do Google Maps
    if (!window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => setMapLoaded(true);
      document.head.appendChild(script);

      return () => {
        document.head.removeChild(script);
      };
    } else {
      setMapLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!mapLoaded || !mapRef.current || loading) return;

    const mapCenter = center || (latitude && longitude 
      ? { lat: latitude, lng: longitude }
      : { lat: -23.5505, lng: -46.6333 }); // São Paulo como fallback

    googleMapRef.current = new window.google.maps.Map(mapRef.current, {
      center: mapCenter,
      zoom,
      styles: [
        {
          featureType: 'poi.business',
          stylers: [{ visibility: 'off' }],
        },
        {
          featureType: 'transit',
          elementType: 'labels.icon',
          stylers: [{ visibility: 'off' }],
        },
      ],
    });

    // Adicionar marcador da localização atual se disponível
    if (latitude && longitude) {
      new window.google.maps.Marker({
        position: { lat: latitude, lng: longitude },
        map: googleMapRef.current,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: '#4285F4',
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 2,
        },
        title: 'Sua localização',
      });
    }

    // Limpar marcadores anteriores
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    // Adicionar marcadores para cada local
    places.forEach(place => {
      if (place.latitude && place.longitude) {
        const marker = new window.google.maps.Marker({
          position: { lat: place.latitude, lng: place.longitude },
          map: googleMapRef.current,
          title: place.name,
          animation: window.google.maps.Animation.DROP,
        });

        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div class="p-2">
              <h3 class="font-bold">${place.name}</h3>
              <p class="text-sm">${place.address}</p>
              ${place.rating ? `<p class="text-sm">⭐ ${place.rating.toFixed(1)}</p>` : ''}
            </div>
          `,
        });

        marker.addListener('click', () => {
          infoWindow.open(googleMapRef.current, marker);
          onPlaceSelect?.(place);
        });

        markersRef.current.push(marker);
      }
    });

  }, [mapLoaded, places, latitude, longitude, loading, center, zoom, onPlaceSelect]);

  if (error) {
    toast.error('Erro ao carregar o mapa: ' + error);
    return null;
  }

  return (
    <div 
      ref={mapRef} 
      className="w-full h-[400px] rounded-lg shadow-lg"
      style={{ minHeight: '400px' }}
    />
  );
};

export default PlacesMap;
