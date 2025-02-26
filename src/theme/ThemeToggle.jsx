// ThemeToggle.jsx
import React, { useEffect, useState } from "react";
import { SunIcon, MoonIcon } from "@heroicons/react/24/solid";

const ThemeToggle = () => {
  // Estado para armazenar o tema atual (light ou dark)
  const [theme, setTheme] = useState(() => {
    // Verificar se existe um tema salvo no localStorage
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme");
      if (savedTheme) {
        return savedTheme;
      }
      // Se não houver tema salvo, verificar preferência do sistema
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }
    return "light"; // Tema padrão
  });

  // Aplicar o tema ao carregar o componente e quando o tema mudar
  useEffect(() => {
    const root = document.documentElement;
    const dataTheme = theme === "dark" ? "dark" : "light";

    // Aplicar data-theme para o DaisyUI
    root.setAttribute("data-theme", dataTheme);

    // Adicionar ou remover a classe 'dark' para o Tailwind
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    // Salvar preferência no localStorage
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Função para alternar entre temas
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <button
      onClick={toggleTheme}
      className="btn btn-circle btn-ghost"
      aria-label={
        theme === "light" ? "Ativar modo escuro" : "Ativar modo claro"
      }
    >
      {theme === "light" ? (
        <MoonIcon className="h-5 w-5" />
      ) : (
        <SunIcon className="h-5 w-5" />
      )}
    </button>
  );
};

export default ThemeToggle;
