import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, AlertCircle } from 'lucide-react';
import { Button } from '../ui/Button';

const TempleWaitingApproval = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto text-center">
        <Clock className="mx-auto h-12 w-12 text-rose-500" />
        <h2 className="mt-6 text-3xl font-bold text-gray-900">
          Aguardando Aprovação
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Seu templo foi cadastrado com sucesso e está aguardando aprovação do administrador.
          Você receberá uma notificação assim que seu cadastro for aprovado.
        </p>
        
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Importante
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>
                  Durante o período de aprovação, você já pode acessar seu painel
                  administrativo e começar a configurar seu perfil.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <Button
            onClick={() => navigate('/perfil')}
            className="w-full"
          >
            Acessar Meu Perfil
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate('/')}
            className="w-full"
          >
            Voltar para Página Inicial
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TempleWaitingApproval;