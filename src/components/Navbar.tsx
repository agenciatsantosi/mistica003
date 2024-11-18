import React from 'react';
import { Search, Heart, User, LogIn, LogOut, Settings } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { RootState } from '../store';
import { signOut } from '../store/slices/userSlice';
import { Button } from './ui/Button';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state: RootState) => state.user);

  const handleSignOut = async () => {
    await dispatch(signOut());
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center">
            <img src="/logo.png" alt="Portal da Fé" className="h-8 w-auto" />
            <span className="ml-2 text-xl font-semibold text-rose-600">
              Portal da Fé
            </span>
          </Link>
          
          <div className="flex items-center space-x-6">
            <NavLink to="/explorar" icon={<Search />} text="Explorar" />
            
            {currentUser ? (
              <>
                <NavLink to="/favoritos" icon={<Heart />} text="Favoritos" />
                <NavLink to="/perfil" icon={<User />} text="Perfil" />
                {currentUser.isAdmin && (
                  <NavLink to="/admin" icon={<Settings />} text="Admin" />
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSignOut}
                  icon={<LogOut size={16} />}
                >
                  Sair
                </Button>
              </>
            ) : (
              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate('/login')}
                icon={<LogIn size={16} />}
              >
                Entrar
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

const NavLink = ({ 
  to, 
  icon, 
  text 
}: { 
  to: string; 
  icon: React.ReactNode; 
  text: string;
}) => (
  <Link
    to={to}
    className="flex items-center space-x-2 text-gray-600 hover:text-rose-500 transition-colors"
  >
    <span className="w-5 h-5">{icon}</span>
    <span className="hidden md:inline">{text}</span>
  </Link>
);

export default Navbar;