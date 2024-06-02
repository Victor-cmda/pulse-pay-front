import React from "react";

const CollapseOpened = ({ title, children }) => {
  return (
    <>
      <details open className="collapse collapse-arrow bg-base-200">
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

export default CollapseOpened