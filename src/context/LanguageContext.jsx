import React, { createContext, useContext, useState, useEffect } from "react";
import enTranslations from "../i18n/en";

// Objeto com as traduções disponíveis
const translations = {
  en: enTranslations,
};

// Opções de idiomas disponíveis para seleção
export const languageOptions = [{ value: "en", label: "English", flag: "🇺🇸" }];

// Criação do contexto
const LanguageContext = createContext();

// Hook personalizado para facilitar o acesso ao contexto
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

// Componente Provider
export const LanguageProvider = ({ children }) => {
  // Tenta ler o idioma do localStorage, ou usa o idioma do navegador, ou pt como fallback
  const getBrowserLanguage = () => {
    const browserLang = navigator.language.split("-")[0];
    return ["en"].includes(browserLang) ? browserLang : "pt";
  };

  const [language, setLanguage] = useState(() => {
    const savedLanguage = localStorage.getItem("language");
    return savedLanguage || getBrowserLanguage();
  });

  // Tradução atual baseada no idioma selecionado
  const t = translations[language] || translations.en;

  // Salva o idioma escolhido no localStorage
  useEffect(() => {
    localStorage.setItem("language", language);
  }, [language]);

  // Expõe as funções e valores necessários
  const value = {
    language,
    setLanguage,
    t,
    languages: languageOptions,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageContext;
