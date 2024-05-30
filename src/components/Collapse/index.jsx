import React from "react";

const Collapse = ({ title, children }) => {
  return (
    <>
      <details className="collapse collapse-arrow bg-base-200">
        <summary className="collapse-title text-xl font-medium">
          {title}
        </summary>
        <div className="collapse-content">
          {children}
        </div>
      </details>
    </>
  );
};

export default Collapse