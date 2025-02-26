import React, { useState, useEffect } from "react";
import {
  Bell,
  CheckCircle,
  AlertCircle,
  DollarSign,
  Shield,
  Trash2,
  Check,
  Info,
  ChevronLeft,
  ChevronRight,
  Clock,
} from "lucide-react";
import { Link } from "react-router-dom";

const Notifications = () => {
  // Mock de notificações para demonstração
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedNotification, setSelectedNotification] = useState(null);

  // Gera notificações para demonstração
  useEffect(() => {
    // Simulação de carregamento de dados
    setTimeout(() => {
      const mockNotifications = [
        {
          id: 1,
          title: "Pagamento recebido",
          message: "Você recebeu um pagamento de R$ 150,00 de Maria Silva.",
          time: "2 horas atrás",
          date: "2025-01-15T14:30:00",
          type: "payment",
          read: false,
          actionLink: "/wallet",
        },
        {
          id: 2,
          title: "Novo login detectado",
          message:
            "Um novo acesso foi detectado em seu dispositivo em São Paulo, SP. Se não foi você, entre em contato com o suporte.",
          time: "1 dia atrás",
          date: "2025-01-14T10:15:00",
          type: "security",
          read: true,
          actionLink: "/security",
        },
        {
          id: 3,
          title: "Promoção exclusiva",
          message:
            "Aproveite taxas reduzidas até o final do mês para todas as transações.",
          time: "3 dias atrás",
          date: "2025-01-12T09:45:00",
          type: "promotion",
          read: true,
          actionLink: "/promotions",
        },
        {
          id: 4,
          title: "Saque concluído",
          message:
            "Seu saque de R$ 500,00 foi processado com sucesso e estará disponível em sua conta bancária em até 1 dia útil.",
          time: "4 dias atrás",
          date: "2025-01-11T16:20:00",
          type: "payment",
          read: false,
          actionLink: "/withdraw/history",
        },
        {
          id: 5,
          title: "Atualização de termos",
          message:
            "Nossos termos de serviço foram atualizados. Por favor, revise as alterações.",
          time: "1 semana atrás",
          date: "2025-01-08T11:30:00",
          type: "system",
          read: true,
          actionLink: "/terms",
        },
        {
          id: 6,
          title: "Alerta de segurança",
          message:
            "Detectamos uma tentativa de acesso suspeita à sua conta. Sua conta está segura, mas recomendamos a alteração da sua senha.",
          time: "1 semana atrás",
          date: "2025-01-07T22:15:00",
          type: "security",
          read: false,
          actionLink: "/security/password",
        },
        {
          id: 7,
          title: "Transação pendente",
          message:
            "Sua transferência de R$ 300,00 está aguardando aprovação do destinatário.",
          time: "2 semanas atrás",
          date: "2025-01-01T12:45:00",
          type: "payment",
          read: true,
          actionLink: "/transactions",
        },
        {
          id: 8,
          title: "Bem-vindo ao PulsePay",
          message:
            "Obrigado por se juntar ao PulsePay! Explore todos os recursos disponíveis para você.",
          time: "1 mês atrás",
          date: "2024-12-25T08:30:00",
          type: "system",
          read: true,
          actionLink: "/dashboard",
        },
      ];

      setNotifications(mockNotifications);
      setLoading(false);
    }, 1000);
  }, []);

  // Filtra notificações com base na aba ativa
  const getFilteredNotifications = () => {
    if (activeTab === "all") return notifications;
    if (activeTab === "unread")
      return notifications.filter((notification) => !notification.read);
    return notifications.filter(
      (notification) => notification.type === activeTab
    );
  };

  // Paginação
  const filteredNotifications = getFilteredNotifications();
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredNotifications.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.max(
    1,
    Math.ceil(filteredNotifications.length / itemsPerPage)
  );

  // Marcar notificação como lida
  const markAsRead = (id) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  // Marcar todas notificações como lidas
  const markAllAsRead = () => {
    setNotifications(
      notifications.map((notification) => ({ ...notification, read: true }))
    );
  };

  // Excluir notificação
  const deleteNotification = (id) => {
    setNotifications(
      notifications.filter((notification) => notification.id !== id)
    );
    if (selectedNotification && selectedNotification.id === id) {
      setSelectedNotification(null);
    }
  };

  // Excluir todas notificações visíveis
  const deleteAllVisible = () => {
    const visibleIds = filteredNotifications.map((n) => n.id);
    setNotifications(
      notifications.filter(
        (notification) => !visibleIds.includes(notification.id)
      )
    );
    setSelectedNotification(null);
  };

  // Renderiza ícone com base no tipo de notificação
  const renderNotificationIcon = (type) => {
    switch (type) {
      case "payment":
        return <DollarSign className="w-5 h-5 text-green-500" />;
      case "security":
        return <Shield className="w-5 h-5 text-red-500" />;
      case "system":
        return <Info className="w-5 h-5 text-blue-500" />;
      case "promotion":
        return <AlertCircle className="w-5 h-5 text-purple-500" />;
      default:
        return <Bell className="w-5 h-5 text-slate-500" />;
    }
  };

  // Formata a data da notificação
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("pt-BR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-6 pb-16">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white">
            Notificações
          </h1>
          <div className="flex space-x-2">
            {filteredNotifications.some((n) => !n.read) && (
              <button
                onClick={markAllAsRead}
                className="btn btn-sm bg-indigo-50 hover:bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:hover:bg-indigo-800/50 dark:text-indigo-300 border-none"
              >
                <Check className="w-4 h-4 mr-1" />
                Marcar todas como lidas
              </button>
            )}
            {filteredNotifications.length > 0 && (
              <button
                onClick={deleteAllVisible}
                className="btn btn-sm bg-red-50 hover:bg-red-100 text-red-700 dark:bg-red-900/30 dark:hover:bg-red-800/50 dark:text-red-300 border-none"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Excluir todas
              </button>
            )}
          </div>
        </div>

        {/* Abas de filtro */}
        <div className="flex overflow-x-auto hide-scrollbar mb-6 pb-2">
          <button
            className={`px-4 py-2 mr-2 rounded-full whitespace-nowrap ${
              activeTab === "all"
                ? "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300 font-medium"
                : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
            }`}
            onClick={() => {
              setActiveTab("all");
              setCurrentPage(1);
            }}
          >
            Todas
          </button>
          <button
            className={`px-4 py-2 mr-2 rounded-full whitespace-nowrap ${
              activeTab === "unread"
                ? "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300 font-medium"
                : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
            }`}
            onClick={() => {
              setActiveTab("unread");
              setCurrentPage(1);
            }}
          >
            Não lidas
          </button>
          <button
            className={`px-4 py-2 mr-2 rounded-full whitespace-nowrap ${
              activeTab === "payment"
                ? "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300 font-medium"
                : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
            }`}
            onClick={() => {
              setActiveTab("payment");
              setCurrentPage(1);
            }}
          >
            Pagamentos
          </button>
          <button
            className={`px-4 py-2 mr-2 rounded-full whitespace-nowrap ${
              activeTab === "security"
                ? "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300 font-medium"
                : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
            }`}
            onClick={() => {
              setActiveTab("security");
              setCurrentPage(1);
            }}
          >
            Segurança
          </button>
          <button
            className={`px-4 py-2 mr-2 rounded-full whitespace-nowrap ${
              activeTab === "system"
                ? "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300 font-medium"
                : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
            }`}
            onClick={() => {
              setActiveTab("system");
              setCurrentPage(1);
            }}
          >
            Sistema
          </button>
          <button
            className={`px-4 py-2 mr-2 rounded-full whitespace-nowrap ${
              activeTab === "promotion"
                ? "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300 font-medium"
                : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
            }`}
            onClick={() => {
              setActiveTab("promotion");
              setCurrentPage(1);
            }}
          >
            Promoções
          </button>
        </div>

        {loading ? (
          // Estado de carregamento
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-slate-600 dark:text-slate-300">
              Carregando notificações...
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Lista de notificações */}
            <div className="lg:col-span-2">
              {currentItems.length > 0 ? (
                <div className="bg-white dark:bg-slate-800 rounded-lg shadow overflow-hidden">
                  <div className="divide-y divide-slate-200 dark:divide-slate-700">
                    {currentItems.map((notification) => (
                      <div
                        key={notification.id}
                        className={`flex p-4 cursor-pointer transition-colors ${
                          !notification.read
                            ? "bg-indigo-50 dark:bg-indigo-900/10"
                            : "hover:bg-slate-50 dark:hover:bg-slate-700/50"
                        } ${
                          selectedNotification?.id === notification.id
                            ? "border-l-4 border-indigo-600 dark:border-indigo-500"
                            : ""
                        }`}
                        onClick={() => {
                          if (!notification.read) {
                            markAsRead(notification.id);
                          }
                          setSelectedNotification(notification);
                        }}
                      >
                        <div className="flex-shrink-0 mr-4">
                          <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                            {renderNotificationIcon(notification.type)}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3
                              className={`text-sm font-medium ${
                                !notification.read
                                  ? "text-indigo-700 dark:text-indigo-400"
                                  : "text-slate-800 dark:text-white"
                              }`}
                            >
                              {notification.title}
                            </h3>
                            <div className="flex items-center">
                              <span className="text-xs text-slate-500 dark:text-slate-400 ml-2">
                                {notification.time}
                              </span>
                              {!notification.read && (
                                <span className="ml-2 h-2 w-2 rounded-full bg-indigo-600 dark:bg-indigo-400"></span>
                              )}
                            </div>
                          </div>
                          <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2">
                            {notification.message}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Paginação */}
                  {totalPages > 1 && (
                    <div className="p-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
                      <span className="text-sm text-slate-500 dark:text-slate-400">
                        Página {currentPage} de {totalPages}
                      </span>
                      <div className="flex space-x-2">
                        <button
                          className={`btn btn-sm btn-circle ${
                            currentPage === 1 ? "btn-disabled" : "btn-ghost"
                          }`}
                          onClick={() =>
                            setCurrentPage((prev) => Math.max(1, prev - 1))
                          }
                          disabled={currentPage === 1}
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                          className={`btn btn-sm btn-circle ${
                            currentPage === totalPages
                              ? "btn-disabled"
                              : "btn-ghost"
                          }`}
                          onClick={() =>
                            setCurrentPage((prev) =>
                              Math.min(totalPages, prev + 1)
                            )
                          }
                          disabled={currentPage === totalPages}
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-8 text-center">
                  <Bell className="w-12 h-12 text-slate-400 dark:text-slate-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-800 dark:text-white mb-2">
                    Nenhuma notificação encontrada
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300">
                    {activeTab === "all"
                      ? "Você não tem notificações para exibir."
                      : activeTab === "unread"
                      ? "Você não tem notificações não lidas."
                      : `Você não tem notificações do tipo "${activeTab}".`}
                  </p>
                </div>
              )}
            </div>

            {/* Painel de detalhes */}
            <div className="lg:col-span-1">
              {selectedNotification ? (
                <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center mr-3">
                        {renderNotificationIcon(selectedNotification.type)}
                      </div>
                      <h3 className="text-lg font-medium text-slate-800 dark:text-white">
                        {selectedNotification.title}
                      </h3>
                    </div>
                    <button
                      className="text-slate-400 hover:text-red-500 dark:text-slate-500 dark:hover:text-red-400 transition-colors"
                      onClick={() =>
                        deleteNotification(selectedNotification.id)
                      }
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="flex items-center text-xs text-slate-500 dark:text-slate-400 mb-4">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>{formatDate(selectedNotification.date)}</span>
                  </div>

                  <div className="prose prose-slate dark:prose-invert max-w-none mb-6">
                    <p className="text-slate-600 dark:text-slate-300">
                      {selectedNotification.message}
                    </p>
                  </div>

                  {selectedNotification.actionLink && (
                    <div className="mt-4">
                      <Link
                        to={selectedNotification.actionLink}
                        className="btn btn-primary w-full"
                      >
                        Ver detalhes
                      </Link>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6 text-center">
                  <Info className="w-12 h-12 text-slate-400 dark:text-slate-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-800 dark:text-white mb-2">
                    Nenhuma notificação selecionada
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300">
                    Selecione uma notificação para ver os detalhes.
                  </p>
                </div>
              )}

              {/* Bloco de ajuda */}
              <div className="mt-6 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-4">
                <h4 className="text-sm font-medium text-indigo-800 dark:text-indigo-300 mb-2">
                  Sobre Notificações
                </h4>
                <p className="text-sm text-indigo-700 dark:text-indigo-400">
                  As notificações são armazenadas por 90 dias. Gerencie suas
                  preferências de notificação nas configurações da conta.
                </p>
                <div className="mt-3">
                  <Link
                    to="/configuration"
                    className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium"
                  >
                    Ir para configurações
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
