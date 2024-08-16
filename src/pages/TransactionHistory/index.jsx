import React, { useEffect, useState } from "react";
import { Table, Select, DatePicker, Input, Button, ConfigProvider } from "antd";
import "tailwindcss/tailwind.css";
import ptBR from "antd/lib/locale/pt_BR";
import moment from "moment";
import "moment/locale/pt-br";
import LoadingSkeleton from "../../components/LoadingSkeleton";
import PulseService from "../../services/PulseService";

moment.locale("pt-br");

const { RangePicker } = DatePicker;
const { Option } = Select;

const TransactionHistory = () => {
  const [filters, setFilters] = useState({
    dateType: "Emissão",
    dateRange: [],
    status: "Aprovada",
    type: "Todos",
    channel: "Todos",
    identifier: "",
    description: "",
    cpfCnpj: "",
  });

  const [data, setData] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const sellers = [];
        const historyData = await PulseService.getHistory(sellers);
        if (historyData.success && Array.isArray(historyData.data)) {
          setData(historyData.data);
        } else {
          console.error("Erro ao buscar dados da API:", historyData.message);
        }
      } catch (error) {
        console.error("Erro ao buscar dados da API:", error);
      }
    };
    fetchData();
  }, []);

  const columns = [
    {
      title: "Cliente",
      dataIndex: "customer",
      key: "customer",
    },
    {
      title: "Data/Hora",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => moment(text).format("DD/MM/YYYY HH:mm"),
    },
    {
      title: "Data/Pagto/Canc",
      dataIndex: "paidAt",
      key: "paidAt",
      render: (text) =>
        text ? moment(text).format("DD/MM/YYYY HH:mm") : "N/A",
    },
    {
      title: "Estado",
      dataIndex: "status",
      key: "status",
      render: (text) => {
        const statusMap = {
          APPROVED: "Aprovado",
          PENDING: "Pendente",
          REJECTED: "Rejeitado",
          CANCELLED: "Cancelado",
        };
        return statusMap[text] || text;
      },
    },
    {
      title: "Valor",
      dataIndex: "amount",
      key: "amount",
      render: (value) => `R$ ${value.toFixed(2).replace(".", ",")}`,
    },
    {
      title: "Tipo",
      dataIndex: "paymentType",
      key: "paymentType",
      render: (text) => {
        switch (text) {
          case "CREDIT":
            return "Cartão de Crédito";
          case "PIX":
            return "Pix";
          case "BANKSLIP":
            return "Boleto";
          default:
            return text;
        }
      },
    },
    {
      title: "Descrição",
      dataIndex: "description",
      key: "description",
      render: (text) => text || "N/A",
    },
  ];

  const handleFilterChange = (key, value) => {
    setFilters({
      ...filters,
      [key]: value,
    });
  };

  const handleSearch = () => {
    // Função para buscar transações com base nos filtros
  };

  if (!data) {
    return <LoadingSkeleton />;
  }

  return (
    <ConfigProvider locale={ptBR}>
      <div className="p-6">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Tipo de Data:
              </label>
              <Select
                value={filters.dateType}
                onChange={(value) => handleFilterChange("dateType", value)}
                className="w-full"
              >
                <Option value="Emissão">Emissão</Option>
                <Option value="Pagamento">Pagamento</Option>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Datas:
              </label>
              <RangePicker
                value={filters.dateRange}
                onChange={(value) => handleFilterChange("dateRange", value)}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Estado:
              </label>
              <Select
                value={filters.status}
                onChange={(value) => handleFilterChange("status", value)}
                className="w-full"
              >
                <Option value="Todos">Todos</Option>
                <Option value="Pendente">Pendente</Option>
                <Option value="Aprovada">Aprovada</Option>
                <Option value="Rejeitada">Rejeitada</Option>
                <Option value="Cancelada">Cancelada</Option>
                <Option value="A Estornar">A Estornar</Option>
                <Option value="Estornado">Estornado</Option>
                <Option value="Erro Estorno">Erro Estorno</Option>
                <Option value="Liquidado">Liquidado</Option>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Tipo:
              </label>
              <Select
                value={filters.type}
                onChange={(value) => handleFilterChange("type", value)}
                className="w-full"
              >
                <Option value="Todos">Todos</Option>
                <Option value="Boleto">Boleto</Option>
                <Option value="Cartão de Crédito">Cartão de Crédito</Option>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Identificador:
              </label>
              <Input
                value={filters.identifier}
                onChange={(e) =>
                  handleFilterChange("identifier", e.target.value)
                }
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Descrição:
              </label>
              <Input
                value={filters.description}
                onChange={(e) =>
                  handleFilterChange("description", e.target.value)
                }
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                CPF/CNPJ:
              </label>
              <Input
                value={filters.cpfCnpj}
                onChange={(e) => handleFilterChange("cpfCnpj", e.target.value)}
                className="w-full"
              />
            </div>
          </div>
          <Button
            type="primary"
            onClick={handleSearch}
            className="w-full md:w-auto"
          >
            Buscar
          </Button>
          <Table
            columns={columns}
            dataSource={data}
            pagination={{ pageSize: 10 }}
            rowKey="id"
            className="mt-4"
          />
        </div>
      </div>
    </ConfigProvider>
  );
};

export default TransactionHistory;
