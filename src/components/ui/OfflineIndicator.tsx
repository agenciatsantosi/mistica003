import React from 'react';
import { WifiOff } from 'lucide-react';

const OfflineIndicator = () => {
  const [isOffline, setIsOffline] = React.useState(!navigator.onLine);

  React.useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-yellow-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2 animate-fade-in">
      <WifiOff size={16} />
      <span>Você está offline</span>
    </div>
  );
};

export default OfflineIndicator;