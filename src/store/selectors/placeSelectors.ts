import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../index';

export const selectAllPlaces = (state: RootState) => {
  console.log('Estado completo:', state); // Debug
  console.log('Places no estado:', state.places.items); // Debug
  return state.places.items;
};

export const selectPlacesByType = createSelector(
  [selectAllPlaces, (_state: RootState, type: string | undefined) => type],
  (places, type) => {
    console.log('Filtrando lugares...'); // Debug
    console.log('Total de lugares:', places.length); // Debug
    console.log('Tipo buscado:', type); // Debug

    const filtered = places.filter(place => {
      console.log('Verificando lugar:', place); // Debug
      
      // Check if place type contains our search type or vice versa
      const typeMatch = place.type?.toLowerCase().includes(type?.toLowerCase() || '') || 
                       type?.toLowerCase().includes(place.type?.toLowerCase() || '');
      
      // Accept both 'active' and 'approved' status
      const statusMatch = !place.status || place.status === 'active' || place.status === 'approved';
      
      const isMatch = typeMatch && statusMatch;
      console.log('É match?', isMatch, '(type:', place.type, 'status:', place.status, ')'); // Debug
      
      return isMatch;
    });

    console.log('Lugares filtrados:', filtered); // Debug
    return filtered;
  }
);
