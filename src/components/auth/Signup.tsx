import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { signUp, signInWithGoogle } from '../../store/slices/userSlice';
import { addTemple } from '../../store/slices/placesSlice';
import { Mail, Lock, User, MapPin, Phone, Clock } from 'lucide-react';
import { Button } from '../ui/Button';
import { toast } from 'react-toastify';

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isTemple, setIsTemple] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [templeData, setTempleData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    category: '',
    description: '',
    address: '',
    phone: '',
    hours: '',
  });

  const handleUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error('As senhas não coincidem');
      return;
    }

    setLoading(true);
    try {
      await dispatch(signUp({
        email: formData.email,
        password: formData.password,
        name: formData.name,
      }));
      navigate('/perfil');
    } catch (error) {
      console.error('Erro no cadastro:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTempleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (templeData.password !== templeData.confirmPassword) {
      toast.error('As senhas não coincidem');
      return;
    }

    if (!templeData.category || !templeData.address || !templeData.phone) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    setLoading(true);
    try {
      // Criar conta de usuário para o templo primeiro
      const userResult = await dispatch(signUp({
        email: templeData.email,
        password: templeData.password,
        name: templeData.name,
        isTemple: true,
        preferences: {
          notifications: true,
          language: 'pt',
          theme: 'light'
        },
        visitedPlaces: [],
      })).unwrap();

      if (!userResult) {
        throw new Error('Erro ao criar conta de usuário');
      }

      // Criar dados do templo
      const templeInfo = {
        name: templeData.name,
        category: templeData.category,
        type: 'temple',
        description: templeData.description,
        address: templeData.address,
        phone: templeData.phone,
        email: templeData.email,
        hours: templeData.hours,
        location: templeData.address.split(',').slice(-2).join(',').trim(),
        image: 'https://images.unsplash.com/photo-1545494097-1545e22ee878',
        latitude: 0,
        longitude: 0,
        rating: 0,
        reviews: 0,
        status: 'pending',
        userId: userResult.uid
      };

      // Adicionar templo como pendente
      await dispatch(addTemple(templeInfo));

      toast.success('Templo cadastrado com sucesso! Aguardando aprovação do administrador.');
      navigate('/templo-pendente');
    } catch (error) {
      console.error('Erro no cadastro:', error);
      toast.error('Erro ao cadastrar templo');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setLoading(true);
    try {
      await dispatch(signInWithGoogle());
      navigate('/perfil');
    } catch (error) {
      console.error('Erro no cadastro com Google:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-bold text-gray-900 mb-8">
          Criar Conta no Místico
        </h2>

        {/* Seleção de tipo de cadastro */}
        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => setIsTemple(false)}
              className={`px-4 py-2 rounded-lg ${
                !isTemple
                  ? 'bg-rose-500 text-white'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              Usuário
            </button>
            <button
              onClick={() => setIsTemple(true)}
              className={`px-4 py-2 rounded-lg ${
                isTemple
                  ? 'bg-rose-500 text-white'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              Templo/Igreja
            </button>
          </div>
        </div>

        <div className="bg-white py-8 px-4 shadow-md rounded-lg sm:px-10">
          <Button
            type="button"
            variant="outline"
            className="w-full mb-6"
            onClick={handleGoogleSignup}
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
                Ou crie uma conta com email
              </span>
            </div>
          </div>

          {isTemple ? (
            // Formulário para Templo
            <form onSubmit={handleTempleSubmit} className="space-y-6">
              <div>
                <label htmlFor="templeName" className="block text-sm font-medium text-gray-700">
                  Nome do Templo/Igreja
                </label>
                <div className="mt-1 relative">
                  <User className="absolute left-3 top-3 text-gray-400" size={20} />
                  <input
                    id="templeName"
                    type="text"
                    required
                    value={templeData.name}
                    onChange={(e) => setTempleData({ ...templeData, name: e.target.value })}
                    className="pl-10 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-rose-500 focus:border-rose-500"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="templeEmail" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <div className="mt-1 relative">
                  <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
                  <input
                    id="templeEmail"
                    type="email"
                    required
                    value={templeData.email}
                    onChange={(e) => setTempleData({ ...templeData, email: e.target.value })}
                    className="pl-10 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-rose-500 focus:border-rose-500"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="templeCategory" className="block text-sm font-medium text-gray-700">
                  Categoria
                </label>
                <select
                  id="templeCategory"
                  required
                  value={templeData.category}
                  onChange={(e) => setTempleData({ ...templeData, category: e.target.value })}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-rose-500 focus:border-rose-500 rounded-md"
                >
                  <option value="">Selecione uma categoria</option>
                  <option value="Católica">Católica</option>
                  <option value="Evangélica">Evangélica</option>
                  <option value="Budista">Budista</option>
                  <option value="Espírita">Espírita</option>
                  <option value="Umbanda">Umbanda</option>
                  <option value="Candomblé">Candomblé</option>
                  <option value="Outras">Outras</option>
                </select>
              </div>

              <div>
                <label htmlFor="templeAddress" className="block text-sm font-medium text-gray-700">
                  Endereço Completo
                </label>
                <div className="mt-1 relative">
                  <MapPin className="absolute left-3 top-3 text-gray-400" size={20} />
                  <input
                    id="templeAddress"
                    type="text"
                    required
                    value={templeData.address}
                    onChange={(e) => setTempleData({ ...templeData, address: e.target.value })}
                    className="pl-10 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-rose-500 focus:border-rose-500"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="templePhone" className="block text-sm font-medium text-gray-700">
                  Telefone
                </label>
                <div className="mt-1 relative">
                  <Phone className="absolute left-3 top-3 text-gray-400" size={20} />
                  <input
                    id="templePhone"
                    type="tel"
                    required
                    value={templeData.phone}
                    onChange={(e) => setTempleData({ ...templeData, phone: e.target.value })}
                    className="pl-10 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-rose-500 focus:border-rose-500"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="templeHours" className="block text-sm font-medium text-gray-700">
                  Horário de Funcionamento
                </label>
                <div className="mt-1 relative">
                  <Clock className="absolute left-3 top-3 text-gray-400" size={20} />
                  <input
                    id="templeHours"
                    type="text"
                    required
                    value={templeData.hours}
                    onChange={(e) => setTempleData({ ...templeData, hours: e.target.value })}
                    placeholder="Ex: Segunda a Sexta, 8h às 18h"
                    className="pl-10 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-rose-500 focus:border-rose-500"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="templeDescription" className="block text-sm font-medium text-gray-700">
                  Descrição
                </label>
                <textarea
                  id="templeDescription"
                  required
                  value={templeData.description}
                  onChange={(e) => setTempleData({ ...templeData, description: e.target.value })}
                  rows={3}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-rose-500 focus:border-rose-500"
                />
              </div>

              <div>
                <label htmlFor="templePassword" className="block text-sm font-medium text-gray-700">
                  Senha
                </label>
                <div className="mt-1 relative">
                  <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
                  <input
                    id="templePassword"
                    type="password"
                    required
                    value={templeData.password}
                    onChange={(e) => setTempleData({ ...templeData, password: e.target.value })}
                    className="pl-10 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-rose-500 focus:border-rose-500"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="templeConfirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirmar Senha
                </label>
                <div className="mt-1 relative">
                  <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
                  <input
                    id="templeConfirmPassword"
                    type="password"
                    required
                    value={templeData.confirmPassword}
                    onChange={(e) => setTempleData({ ...templeData, confirmPassword: e.target.value })}
                    className="pl-10 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-rose-500 focus:border-rose-500"
                  />
                </div>
              </div>

              <Button
                type="submit"
                loading={loading}
                className="w-full"
              >
                Cadastrar Templo
              </Button>
            </form>
          ) : (
            // Formulário para Usuário
            <form onSubmit={handleUserSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Nome Completo
                </label>
                <div className="mt-1 relative">
                  <User className="absolute left-3 top-3 text-gray-400" size={20} />
                  <input
                    id="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="pl-10 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-rose-500 focus:border-rose-500"
                  />
                </div>
              </div>

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
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="pl-10 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-rose-500 focus:border-rose-500"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirmar Senha
                </label>
                <div className="mt-1 relative">
                  <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
                  <input
                    id="confirmPassword"
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="pl-10 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-rose-500 focus:border-rose-500"
                  />
                </div>
              </div>

              <Button
                type="submit"
                loading={loading}
                className="w-full"
              >
                Criar Conta
              </Button>
            </form>
          )}

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Já tem uma conta?
                </span>
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full mt-4"
              onClick={() => navigate('/login')}
            >
              Fazer login
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;