import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { fetchFavorites, toggleFavorite } from '../../store/slices/favoritesSlice';
import { Heart, MapPin, Clock } from 'lucide-react';

const FavoritesList = () => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state: RootState) => state.user);
  const { items, loading } = useSelector((state: RootState) => state.favorites);
  const places = useSelector((state: RootState) => state.places.items);

  useEffect(() => {
    if (currentUser?.uid) {
      dispatch(fetchFavorites(currentUser.uid));
    }
  }, [currentUser, dispatch]);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500"></div>
    </div>;
  }

  const favoriteItems = places.filter(place => items.includes(place.id));

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Meus Favoritos</h1>
      
      {favoriteItems.length === 0 ? (
        <div className="text-center py-12">
          <Heart size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600">Você ainda não tem lugares favoritos</p>
          <a href="/" className="text-rose-500 hover:text-rose-600 mt-2 inline-block">
            Explorar lugares
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favoriteItems.map((place) => (
            <article key={place.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <img
                src={place.image}
                alt={place.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-semibold">{place.name}</h2>
                  <button
                    onClick={() => dispatch(toggleFavorite({
                      userId: currentUser!.uid,
                      placeId: place.id,
                      isFavorite: true
                    }))}
                    className="text-rose-500 hover:text-rose-600"
                  >
                    <Heart size={24} fill="currentColor" />
                  </button>
                </div>
                
                <div className="flex items-center text-gray-600 mb-2">
                  <MapPin size={16} className="mr-1" />
                  {place.location}
                </div>
                
                <div className="flex items-center text-gray-600 mb-4">
                  <Clock size={16} className="mr-1" />
                  {place.hours}
                </div>
                
                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                  <span className="px-3 py-1 bg-rose-500 text-white rounded-full text-sm">
                    {place.category}
                  </span>
                  <div className="flex items-center">
                    <div className="text-yellow-400 mr-1">
                      {'★'.repeat(place.rating)}{'☆'.repeat(5 - place.rating)}
                    </div>
                    <span className="text-gray-600 text-sm">({place.reviews})</span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesList;