// src/pages/Endpoints/hooks/useEndpointsFilter.js
export function useEndpointsFilter(endpoints, searchTerm) {
    if (!searchTerm.trim()) {
      return endpoints;
    }
    
    const searchLower = searchTerm.toLowerCase();
    
    // Filtra os endpoints com base no termo de pesquisa
    return endpoints
      .map((section) => {
        const filteredEndpointsInSection = section.endpoints.filter(
          (endpoint) =>
            endpoint.content || // Sempre inclui itens de conteúdo
            endpoint.path.toLowerCase().includes(searchLower) ||
            endpoint.description.toLowerCase().includes(searchLower) ||
            (endpoint.method && endpoint.method.toLowerCase().includes(searchLower))
        );
  
        return {
          ...section,
          endpoints: filteredEndpointsInSection,
          visible: filteredEndpointsInSection.length > 0,
        };
      })
      .filter((section) => section.visible);
  }