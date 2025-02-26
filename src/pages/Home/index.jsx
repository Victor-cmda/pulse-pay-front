import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  BarChart3,
  Wallet,
  ArrowRight,
  CreditCard,
  PieChart,
  TrendingUp,
} from "lucide-react";

const Home = () => {
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const getSaudacao = () => {
    const hora = new Date().getHours();
    if (hora >= 5 && hora < 12) return "Bom dia";
    if (hora >= 12 && hora < 18) return "Boa tarde";
    return "Boa noite";
  };

  const cards = [
    {
      title: "Dashboard",
      icon: <BarChart3 className="w-6 h-6" />,
      description: "Visualize seus dados em tempo real",
      path: "/dashboard",
      color: "bg-gradient-to-r from-purple-500 to-pink-500",
    },
    {
      title: "Transações",
      icon: <Wallet className="w-6 h-6" />,
      description: "Gerencie suas movimentações",
      path: "/transactions",
      color: "bg-gradient-to-r from-cyan-500 to-blue-500",
    },
    {
      title: "Pagamentos",
      icon: <CreditCard className="w-6 h-6" />,
      description: "Realize pagamentos e transferências",
      path: "/payments",
      color: "bg-gradient-to-r from-emerald-500 to-teal-500",
    },
  ];

  return (
    <div className="min-h-[94vh] bg-gradient-to-b from-base-200 to-base-300">
      {/* Hero Section */}
      <div
        className={`container mx-auto px-4 pt-16 transition-all duration-1000 ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <div className="text-center mb-16">
          <h2 className="text-lg font-medium text-primary mb-2">
            {getSaudacao()}
          </h2>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Bem-vindo de volta, {user?.name}! 👋
          </h1>
          <p className="text-xl text-base-content/70">
            Pronto para mais um dia produtivo no PulsePay?
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="stat bg-base-100 rounded-box shadow-lg">
            <div className="stat-figure text-primary">
              <TrendingUp className="w-8 h-8" />
            </div>
            <div className="stat-title">Volume Hoje</div>
            <div className="stat-value">R$ 12.5K</div>
            <div className="stat-desc text-success">↗︎ 14% mais que ontem</div>
          </div>

          <div className="stat bg-base-100 rounded-box shadow-lg">
            <div className="stat-figure text-primary">
              <PieChart className="w-8 h-8" />
            </div>
            <div className="stat-title">Transações</div>
            <div className="stat-value">42</div>
            <div className="stat-desc">↗︎ 8 pendentes</div>
          </div>

          <div className="stat bg-base-100 rounded-box shadow-lg">
            <div className="stat-figure text-primary">
              <Wallet className="w-8 h-8" />
            </div>
            <div className="stat-title">Saldo Atual</div>
            <div className="stat-value">R$ 45.6K</div>
            <div className="stat-desc text-success">↗︎ 22% este mês</div>
          </div>
        </div>

        {/* Quick Access Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((card, index) => (
            <div
              key={index}
              className={`card shadow-xl cursor-pointer transition-all duration-300 hover:scale-105 ${card.color}`}
              onClick={() => navigate(card.path)}
            >
              <div className="card-body text-white">
                <div className="flex items-center justify-between mb-4">
                  {card.icon}
                  <ArrowRight className="w-5 h-5" />
                </div>
                <h2 className="card-title">{card.title}</h2>
                <p>{card.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="mt-12 bg-base-100 rounded-box p-6 shadow-lg">
          <h3 className="text-xl font-bold mb-4">Atividades Recentes</h3>
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Tipo</th>
                  <th>Descrição</th>
                  <th>Valor</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Pagamento</td>
                  <td>Fornecedor XYZ</td>
                  <td>R$ 1.500,00</td>
                  <td>
                    <div className="badge badge-success">Concluído</div>
                  </td>
                </tr>
                <tr>
                  <td>Recebimento</td>
                  <td>Cliente ABC</td>
                  <td>R$ 2.800,00</td>
                  <td>
                    <div className="badge badge-warning">Pendente</div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
