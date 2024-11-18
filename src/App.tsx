import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './lib/firebase';
import { setUser } from './store/slices/userSlice';
import { RootState } from './store';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import SearchFilters from './components/SearchFilters';
import Categories from './components/Categories';
import NearbyPlaces from './components/NearbyPlaces';
import FeaturedPlaces from './components/FeaturedPlaces';
import CategoryPlaces from './components/CategoryPlaces';
import PlaceDetails from './components/places/PlaceDetails';
import CTA from './components/CTA';
import Footer from './components/Footer';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import UserProfile from './components/profile/UserProfile';
import FavoritesList from './components/favorites/FavoritesList';
import OfflineIndicator from './components/ui/OfflineIndicator';
import { Toast } from './components/ui/Toast';
import AdminPanel from './components/admin/AdminPanel';
import TempleWaitingApproval from './components/temple/TempleWaitingApproval';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { currentUser } = useSelector((state: RootState) => state.user);
  
  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { currentUser } = useSelector((state: RootState) => state.user);
  
  if (!currentUser?.isAdmin) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      dispatch(setUser(user));
    });

    return () => unsubscribe();
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Routes>
        <Route path="/" element={
          <>
            <Hero />
            <main className="container mx-auto px-4 -mt-8 relative z-10">
              <SearchFilters />
              <Categories />
              <NearbyPlaces />
              <FeaturedPlaces />
            </main>
            <CTA />
          </>
        } />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Signup />} />
        <Route path="/local/:id" element={<PlaceDetails />} />
        <Route path="/categoria/:type" element={<CategoryPlaces />} />
        <Route path="/templo-pendente" element={<TempleWaitingApproval />} />
        <Route path="/perfil" element={
          <ProtectedRoute>
            <UserProfile />
          </ProtectedRoute>
        } />
        <Route path="/favoritos" element={
          <ProtectedRoute>
            <FavoritesList />
          </ProtectedRoute>
        } />
        <Route path="/admin" element={
          <AdminRoute>
            <AdminPanel />
          </AdminRoute>
        } />
      </Routes>
      <Footer />
      <OfflineIndicator />
      <Toast />
    </div>
  );
};

export default App;