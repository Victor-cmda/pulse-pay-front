import React from 'react';

const sales = [
  { name: 'Olivia Martin', email: 'olivia.martin@email.com', amount: '$1,999.00' },
  { name: 'Jackson Lee', email: 'jackson.lee@email.com', amount: '$39.00' },
  { name: 'Isabella Nguyen', email: 'isabella.nguyen@email.com', amount: '$299.00' },
  { name: 'William Kim', email: 'will@email.com', amount: '$99.00' },
  { name: 'Sofia Davis', email: 'sofia.davis@email.com', amount: '$39.00' },
];

const RecentSales = () => {
  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-lg font-bold mb-4">Pagamentos recentes</h2>
      <ul>
        {sales.map((sale, index) => (
          <li key={index} className="flex justify-between items-center mb-4">
            <div>
              <p className="text-sm font-semibold">{sale.name}</p>
              <p className="text-xs text-gray-500">{sale.email}</p>
            </div>
            <p className="text-sm font-bold">{sale.amount}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentSales;
