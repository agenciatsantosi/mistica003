import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  error: string | null;
  loading: boolean;
}

export const useGeolocation = () => {
  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    error: null,
    loading: true,
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setState(prev => ({
        ...prev,
        error: 'Geolocalização não é suportada pelo seu navegador',
        loading: false,
      }));
      toast.error('Geolocalização não é suportada pelo seu navegador');
      return;
    }

    const handleSuccess = (position: GeolocationPosition) => {
      setState({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        error: null,
        loading: false,
      });
    };

    const handleError = (error: GeolocationPositionError) => {
      setState(prev => ({
        ...prev,
        error: error.message,
        loading: false,
      }));
      
      switch (error.code) {
        case error.PERMISSION_DENIED:
          toast.error('Por favor, permita o acesso à sua localização para melhor experiência');
          break;
        case error.POSITION_UNAVAILABLE:
          toast.error('Informação de localização indisponível');
          break;
        case error.TIMEOUT:
          toast.error('Tempo esgotado ao tentar obter localização');
          break;
        default:
          toast.error('Erro ao obter localização');
      }
    };

    const options: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    };

    const watchId = navigator.geolocation.watchPosition(
      handleSuccess,
      handleError,
      options
    );

    // Cleanup function to remove the watcher
    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  const requestLocation = () => {
    setState(prev => ({ ...prev, loading: true }));
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null,
          loading: false,
        });
      },
      (error) => {
        setState(prev => ({
          ...prev,
          error: error.message,
          loading: false,
        }));
        toast.error('Erro ao obter localização');
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );
  };

  return { ...state, requestLocation };
};