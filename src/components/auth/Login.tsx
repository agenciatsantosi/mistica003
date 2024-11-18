import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { signIn, signInWithGoogle } from '../../store/slices/userSlice';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await dispatch(signIn({ email, password })).unwrap();
      if (result.isAdmin) {
        navigate('/admin');
      } else {
        navigate('/perfil');
      }
    } catch (error) {
      console.error('Erro no login:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const result = await dispatch(signInWithGoogle()).unwrap();
      if (result.isAdmin) {
        navigate('/admin');
      } else {
        navigate('/perfil');
      }
    } catch (error) {
      console.error('Erro no login com Google:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-bold text-gray-900 mb-8">
          Entrar no Místico
        </h2>
        
        <div className="bg-white py-8 px-4 shadow-md rounded-lg sm:px-10">
          <Button
            type="button"
            variant="outline"
            className="w-full mb-6"
            onClick={handleGoogleLogin}
            loading={loading}
          >
            <img 
              src="https://www.google.com/favicon.ico" 
              alt="Google" 
              className="w-5 h-5 mr-2"
            />
            Continuar com Google
          </Button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                Ou entre com seu email
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="mt-1 relative">
                <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-rose-500 focus:border-rose-500"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Senha
              </label>
              <div className="mt-1 relative">
                <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-rose-500 focus:border-rose-500"
                />
              </div>
            </div>

            <Button
              type="submit"
              loading={loading}
              className="w-full"
            >
              Entrar
            </Button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Não tem uma conta?
                </span>
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full mt-4"
              onClick={() => navigate('/cadastro')}
            >
              Criar nova conta
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;