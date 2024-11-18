import React, { useState } from 'react';
import { Settings, Globe, Bell, Shield, Database } from 'lucide-react';
import { Button } from '../ui/Button';

const SettingsManager = () => {
  const [settings, setSettings] = useState({
    siteName: 'Portal da Fé',
    siteDescription: 'Plataforma de descoberta de lugares espirituais',
    language: 'pt-BR',
    timezone: 'America/Sao_Paulo',
    notificationsEnabled: true,
    autoApproveComments: false,
    requireEmailVerification: true,
    maxUploadSize: 5,
    backupFrequency: 'daily',
    maintenanceMode: false
  });

  const handleSave = () => {
    // Implementar lógica de salvamento
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Configurações do Sistema</h2>
      </div>

      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 space-y-6">
          {/* Configurações Gerais */}
          <section>
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <Settings className="mr-2" />
              Configurações Gerais
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nome do Site
                </label>
                <input
                  type="text"
                  value={settings.siteName}
                  onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Descrição
                </label>
                <textarea
                  value={settings.siteDescription}
                  onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
                />
              </div>
            </div>
          </section>

          {/* Localização */}
          <section>
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <Globe className="mr-2" />
              Localização
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Idioma
                </label>
                <select
                  value={settings.language}
                  onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
                >
                  <option value="pt-BR">Português (Brasil)</option>
                  <option value="en">English</option>
                  <option value="es">Español</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Fuso Horário
                </label>
                <select
                  value={settings.timezone}
                  onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
                >
                  <option value="America/Sao_Paulo">América/São Paulo</option>
                  <option value="America/New_York">América/Nova York</option>
                  <option value="Europe/London">Europa/Londres</option>
                </select>
              </div>
            </div>
          </section>

          {/* Notificações */}
          <section>
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <Bell className="mr-2" />
              Notificações
            </h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="notificationsEnabled"
                  checked={settings.notificationsEnabled}
                  onChange={(e) => setSettings({ ...settings, notificationsEnabled: e.target.checked })}
                  className="h-4 w-4 text-rose-500 focus:ring-rose-500 border-gray-300 rounded"
                />
                <label htmlFor="notificationsEnabled" className="ml-2 block text-sm text-gray-900">
                  Habilitar notificações push
                </label>
              </div>
            </div>
          </section>

          {/* Segurança */}
          <section>
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <Shield className="mr-2" />
              Segurança
            </h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="requireEmailVerification"
                  checked={settings.requireEmailVerification}
                  onChange={(e) => setSettings({ ...settings, requireEmailVerification: e.target.checked })}
                  className="h-4 w-4 text-rose-500 focus:ring-rose-500 border-gray-300 rounded"
                />
                <label htmlFor="requireEmailVerification" className="ml-2 block text-sm text-gray-900">
                  Exigir verificação de email
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="autoApproveComments"
                  checked={settings.autoApproveComments}
                  onChange={(e) => setSettings({ ...settings, autoApproveComments: e.target.checked })}
                  className="h-4 w-4 text-rose-500 focus:ring-rose-500 border-gray-300 rounded"
                />
                <label htmlFor="autoApproveComments" className="ml-2 block text-sm text-gray-900">
                  Aprovar comentários automaticamente
                </label>
              </div>
            </div>
          </section>

          {/* Sistema */}
          <section>
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <Database className="mr-2" />
              Sistema
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Tamanho máximo de upload (MB)
                </label>
                <input
                  type="number"
                  value={settings.maxUploadSize}
                  onChange={(e) => setSettings({ ...settings, maxUploadSize: Number(e.target.value) })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Frequência de backup
                </label>
                <select
                  value={settings.backupFrequency}
                  onChange={(e) => setSettings({ ...settings, backupFrequency: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
                >
                  <option value="daily">Diário</option>
                  <option value="weekly">Semanal</option>
                  <option value="monthly">Mensal</option>
                </select>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="maintenanceMode"
                  checked={settings.maintenanceMode}
                  onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                  className="h-4 w-4 text-rose-500 focus:ring-rose-500 border-gray-300 rounded"
                />
                <label htmlFor="maintenanceMode" className="ml-2 block text-sm text-gray-900">
                  Modo de manutenção
                </label>
              </div>
            </div>
          </section>
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t flex justify-end">
          <Button onClick={handleSave}>
            Salvar Configurações
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SettingsManager;