import React from "react";
import { Statistic } from "antd";
import CountUp from "react-countup";

const formatter = (value) => (
  <CountUp 
    end={parseFloat(value).toFixed(2)} 
    separator="." 
    decimal="," 
    decimals={2} 
  />
);

const OverviewCard = ({ title, value, subValue, color }) => {
  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <p className="text-sm text-gray-500">{title}</p>
      <Statistic
        className={`text-2xl font-bold`}
        valueStyle={{ color }}
        value={value}
        formatter={formatter}
      />
      <p className={`text-sm`}>{subValue}</p>
    </div>
  );
};

export default OverviewCard;
