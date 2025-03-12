import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Unauthorized = () => {
  return (
    <div className="container mx-auto flex flex-col items-center justify-center min-h-[calc(100vh-8rem)]">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl text-red-600 dark:text-red-400">
            Acesso Não Autorizado
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4">
          <p className="text-center text-slate-700 dark:text-slate-300">
            Você não tem permissões de administrador para acessar esta página.
          </p>
          <Link to="/dashboard">
            <Button>Voltar para o Dashboard</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};

export default Unauthorized;