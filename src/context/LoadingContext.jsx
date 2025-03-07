import React, { createContext, useContext, useState } from 'react';
import LoadingSpinner from '../components/LoadingSpinner';

const LoadingContext = createContext();

export const LoadingProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('Carregando...');
  
  // Método simples para iniciar loading
  const startLoading = (customMessage) => {
    if (customMessage) {
      setMessage(customMessage);
    }
    setLoading(true);
  };
  
  // Método para parar loading
  const stopLoading = () => {
    setLoading(false);
    setMessage('Carregando...'); // Reset para mensagem padrão
  };
  
  return (
    <LoadingContext.Provider value={{ 
      loading,
      startLoading,
      stopLoading,
      // Para compatibilidade com código existente
      setLoading: (value) => {
        if (typeof value === 'boolean') {
          value ? startLoading() : stopLoading();
        } else if (typeof value === 'string') {
          startLoading(value);
        }
      }
    }}>
      {loading && <LoadingSpinner message={message} />}
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};

export default LoadingContext;