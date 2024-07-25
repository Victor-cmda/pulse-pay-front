import React from "react";
import "./styles.css";

const LoadingSkeleton = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-30">
      <div className="loader relative w-20 h-24">
        <div className="loader__bar absolute bottom-0 w-2.5 h-1/2 bg-white transform origin-bottom shadow-sm"></div>
        <div className="loader__bar absolute bottom-0 w-2.5 h-1/2 bg-white transform origin-bottom shadow-sm"></div>
        <div className="loader__bar absolute bottom-0 w-2.5 h-1/2 bg-white transform origin-bottom shadow-sm"></div>
        <div className="loader__bar absolute bottom-0 w-2.5 h-1/2 bg-white transform origin-bottom shadow-sm"></div>
        <div className="loader__bar absolute bottom-0 w-2.5 h-1/2 bg-white transform origin-bottom shadow-sm"></div>
        <div className="loader__ball absolute bottom-2.5 left-0 w-2.5 h-2.5 bg-white rounded-full"></div>
      </div>
    </div>
  );
};

export default LoadingSkeleton;