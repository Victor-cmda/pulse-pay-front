import React from 'react';

const OverviewCard = ({ title, value, subValue, color }) => {
  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <p className="text-sm text-gray-500">{title}</p>
      <p className={`text-2xl font-bold text-${color}`}>{value}</p>
      <p className={`text-sm text-${color}`}>{subValue}</p>
    </div>
  );
};

export default OverviewCard;
