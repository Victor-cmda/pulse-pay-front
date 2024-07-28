import React from "react";
import { Table } from "antd";
import 'tailwindcss/tailwind.css';
import 'daisyui/dist/full.css';
import { Container } from "../../components";

const data = [
  {
    key: '1',
    date: '2024-07-28',
    description: 'Compra no supermercado',
    amount: 100.00,
    status: 'Completed',
  },
  {
    key: '2',
    date: '2024-07-27',
    description: 'Pagamento de aluguel',
    amount: 500.00,
    status: 'Pending',
  },
  {
    key: '3',
    date: '2024-07-26',
    description: 'Serviço de streaming',
    amount: 30.00,
    status: 'Completed',
  },
  // Add more data as needed
];

const columns = [
  {
    title: 'Data',
    dataIndex: 'date',
    key: 'date',
    render: text => <span className="text-gray-700">{text}</span>,
  },
  {
    title: 'Descrição',
    dataIndex: 'description',
    key: 'description',
    render: text => <span className="text-gray-700">{text}</span>,
  },
  {
    title: 'Valor',
    dataIndex: 'amount',
    key: 'amount',
    render: text => <span className="text-gray-700">{text.toFixed(2)}</span>,
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    render: text => (
      <span
        className={`px-2 py-1 rounded-full ${
          text === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
        }`}
      >
        {text}
      </span>
    ),
  },
];

const TransactionHistory = () => {
  return (
    <div className="p-6">
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Histórico de Transações</h2>
        <Table
          columns={columns}
          dataSource={data}
          pagination={false}
          className="w-full"
        />
      </div>
    </div>
  );
};

export default TransactionHistory;
