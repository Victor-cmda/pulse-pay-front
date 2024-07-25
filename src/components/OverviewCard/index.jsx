import React from "react";

const OverviewCard = ({ title, value, subValue, color }) => {
  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <p className="text-sm text-gray-500">{title}</p>
      <p className={`text-2xl font-bold`} style={(color = { color })}>
        {value}
      </p>
      <p className={`text-sm`}>{subValue}</p>
    </div>
  );
};

export default OverviewCard;
