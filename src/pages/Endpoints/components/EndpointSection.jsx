// src/pages/Endpoints/components/EndpointSection.jsx
import React from "react";
import EndpointCard from "./EndpointCard";
import ContentCard from "./ContentCard";

const EndpointSection = ({ section, t }) => {
  return (
    <div id={section.id} className="scroll-mt-10">
      <h2 className="text-2xl font-bold mb-4 text-slate-800 dark:text-white">
        {section.title}
      </h2>
      <p className="text-slate-600 dark:text-slate-400 mb-6">
        {section.description}
      </p>

      <div className="space-y-6">
        {section.endpoints.map((endpoint) =>
          endpoint.content ? (
            // Renderiza cartões de conteúdo informativo
            <ContentCard key={endpoint.id} endpoint={endpoint} t={t} />
          ) : (
            // Renderiza endpoints técnicos da API
            <EndpointCard key={endpoint.id} endpoint={endpoint} t={t} />
          )
        )}
      </div>
    </div>
  );
};

export default EndpointSection;
