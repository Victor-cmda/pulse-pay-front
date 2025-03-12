export default {
  common: {
    search: "Buscar endpoints...",
    copy: "Copiar",
    content: "Conteúdo",
    needHelp: "Precisa de ajuda?",
    talkToSupport: "Falar com o Suporte",
    clearFilters: "Limpar filtros",
    noEndpointsFound: "Nenhum endpoint encontrado",
    noEndpointsFoundDesc:
      "Não encontramos nenhum endpoint com os critérios de busca atuais.",
  },
  header: {
    title: "Documentação da API",
    subtitle: "Guia completo para integrar com nossas APIs de pagamentos",
  },
  introduction: {
    title: "Introdução",
    description: "Visão geral da API e como começar",
    overview: {
      path: "Visão Geral",
      description: "Informações gerais sobre a API PulsePay",
      title: "O que é a API PulsePay?",
      content:
        "A API PulsePay é uma solução completa para processamento de pagamentos que permite integrar múltiplas formas de pagamento ao seu sistema, site ou aplicativo. Nossa API é RESTful, usa JSON para formatação de dados e segue padrões modernos de autenticação OAuth 2.0.",
    },
    gettingStarted: {
      path: "Começando",
      description: "Guia passo a passo para começar a utilizar a API",
      title: "Começando a usar",
      content:
        "Este guia ajudará você a configurar e começar a usar a API PulsePay para processar pagamentos em sua aplicação.",
    },
    authentication: {
      path: "Autenticação",
      description: "Visão geral do processo de autenticação",
      title: "Visão Geral da Autenticação",
      content:
        "A API PulsePay utiliza o padrão OAuth 2.0 para autenticação, garantindo segurança nas interações com os endpoints. Você precisará obter um token de acesso JWT que deverá ser incluído em todas as requisições.",
    },
  },
  features: {
    easyIntegration: {
      title: "Fácil Integração",
      content:
        "Design intuitivo que permite implementação rápida em qualquer plataforma ou linguagem de programação.",
    },
    advancedSecurity: {
      title: "Segurança Avançada",
      content:
        "Transações protegidas com criptografia, autenticação OAuth e conformidade com padrões PCI.",
    },
    multipleMethods: {
      title: "Múltiplos Métodos",
      content:
        "Suporte a diversos métodos de pagamento, incluindo PIX, boletos bancários e transferências.",
    },
  },
  mainFeatures: {
    title: "Principais recursos",
    pixPayments: "Geração de pagamentos PIX instantâneos",
    bankSlips: "Emissão de boletos bancários",
    pixKeyValidation: "Validação de chaves PIX",
    paymentNotifications: "Notificações de status de pagamento em tempo real",
    transactionStatus: "Consulta de status de transações",
    sandboxEnvironment: "Ambiente de sandbox para testes",
  },
  gettingStartedSteps: {
    requestCredentials: {
      title: "Solicite suas credenciais",
      content:
        "Entre em contato com nosso time comercial para obter seu Client ID e Client Secret. Estas credenciais são necessárias para autenticar suas solicitações à API.",
    },
    testSandbox: {
      title: "Faça testes no ambiente Sandbox",
      content:
        "Use nossas APIs de teste para validar sua integração antes de ir para produção. O ambiente sandbox permite simular transações sem processá-las realmente.",
      sandboxUrl: "URL Sandbox:",
    },
    authenticate: {
      title: "Autentique-se",
      content:
        "Use o endpoint /oauth/v2/token para gerar um token de acesso. O token JWT gerado deve ser incluído em todas as solicitações subsequentes.",
    },
    integrate: {
      title: "Integre com sua aplicação",
      content:
        "Siga a documentação de referência para implementar os endpoints necessários. Você pode começar com fluxos simples como geração de PIX ou boletos.",
    },
    goToProduction: {
      title: "Vá para produção",
      content:
        "Após completar seus testes, atualize suas credenciais para o ambiente de produção. Certifique-se de que todas as implementações foram testadas adequadamente.",
      productionUrl: "URL Produção:",
    },
  },
  sdksInDevelopment: {
    title: "SDKs em Desenvolvimento",
    message:
      "Nossas bibliotecas SDK e plugins para integração estão atualmente em desenvolvimento.",
    additionalInfo:
      "Estamos trabalhando para disponibilizar SDKs para as principais linguagens de programação e plugins para plataformas de e-commerce populares. Enquanto isso, você pode utilizar diretamente nossa API REST com as instruções desta documentação.",
    updates:
      "Acompanhe nossas atualizações para saber quando os SDKs estarão disponíveis.",
  },
  authentication: {
    title: "Fluxo de Autenticação",
    steps: {
      step1:
        "Envie suas credenciais (Client ID e Client Secret) para o endpoint /oauth/v2/token usando autenticação Basic.",
      step2:
        "Receba um token JWT válido que será usado para autenticar as requisições subsequentes.",
      step3:
        "Inclua o token no cabeçalho Authorization de todas as requisições no formato Bearer {token}.",
      step4:
        "Inclua o ID do vendedor no cabeçalho SellerId em todas as requisições.",
    },
    tokenSecurity: {
      title: "Segurança do Token",
      validity: "O token JWT tem validade de 1 hora (3.600 segundos).",
      storeSecurely: "Armazene de forma segura seu Client ID e Client Secret.",
      renewAutomatically:
        "Renove o token automaticamente antes que expire para evitar falhas nas requisições.",
      neverShare:
        "Nunca compartilhe seus tokens ou credenciais em código do lado do cliente.",
    },
    example: {
      title: "Exemplo de Autenticação",
      description: "Veja um exemplo de como obter o token de autenticação:",
    },
  },
  concepts: {
    title: "Conceitos e Termos",
    description:
      "Termos e conceitos importantes para entender a API de pagamentos",
    pix: {
      title: "PIX",
      description:
        "Sistema de pagamentos instantâneos desenvolvido pelo Banco Central do Brasil. Permite transferências e pagamentos em segundos, a qualquer hora do dia, todos os dias do ano.",
    },
    bankSlip: {
      title: "Boleto Bancário",
      description:
        "Método de pagamento brasileiro onde o cliente recebe um documento com código de barras que pode ser pago em bancos, correspondentes bancários, caixas eletrônicos ou internet banking.",
    },
    pixKey: {
      title: "Chave PIX",
      description:
        "Identificador usado para receber pagamentos PIX. Pode ser CPF/CNPJ, e-mail, número de telefone ou uma chave aleatória.",
    },
    oauth: {
      title: "OAuth 2.0",
      description:
        "Protocolo de autorização que permite que aplicativos obtenham acesso limitado a contas de usuários em um serviço HTTP. Nossa API utiliza tokens JWT para autenticação.",
    },
    bearerToken: {
      title: "Bearer Token",
      description:
        "Tipo de token de acesso OAuth 2.0 onde o portador (bearer) do token tem acesso aos recursos protegidos.",
    },
    sellerId: {
      title: "SellerId",
      description:
        "Identificador único do vendedor ou lojista na plataforma. Este valor deve ser enviado em todas as requisições no cabeçalho.",
    },
  },
  sdks: {
    title: "SDKs e Integrações",
    description:
      "Bibliotecas e ferramentas para facilitar a integração com nossa API",
    csharp: {
      title: "SDK para C#",
      description:
        "Biblioteca oficial para integração com .NET Core e .NET Framework",
      link: "Ver documentação",
    },
    php: {
      title: "SDK para PHP",
      description: "Biblioteca oficial para integração com PHP 7.4+",
      link: "Ver documentação",
    },
    javascript: {
      title: "SDK para JavaScript",
      description: "Biblioteca oficial para Node.js e browsers",
      link: "Ver documentação",
    },
  },
  support: {
    title: "Suporte e Contato",
    description: "Obtenha ajuda com a integração e uso de nossa API",
    technicalSupport: {
      title: "Suporte Técnico",
      description:
        "Nossa equipe de suporte técnico está disponível para ajudar com questões de integração e problemas técnicos.",
    },
    completeDocumentation: {
      title: "Documentação Completa",
      description:
        "Acesse nossa documentação completa, incluindo guias passo a passo e tutoriais detalhados.",
    },
  },
  apiEndpoints: {
    parameters: "Parâmetros de URL",
    headers: "Headers",
    body: "Body",
    required: "Sim",
    notRequired: "Não",
    properties: "Propriedades:",
    requestExample: "Exemplo de Requisição",
    responses: "Respostas",
  },
};
