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
    authentication: {
      bearer: "Bearer Token",
      basic: "Basic Auth",
      none: "Nenhuma",
    },
    headers: {
      authorization: "Bearer token obtido via endpoint de autenticação",
      sellerId: "ID do vendedor no formato GUID",
      contentType: "application/json",
    },
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
    endpoints: {
      generateToken: {
        description:
          "Gera um token de acesso OAuth 2.0 através de credenciais do cliente",
        authentication: "Basic Auth (Client ID e Client Secret)",
        headers: {
          authorization:
            "Basic authentication com Client ID e Client Secret codificados em Base64",
        },
        responses: {
          success: "Token gerado com sucesso",
          unauthorized: "Credenciais inválidas ou ausentes",
        },
        requestExample: `curl -X POST https://pulsepay.technocenterinformatica.com.br/sandbox/oauth/v2/token \\
  -H "Authorization: Basic eW91cl9jbGllbnRfaWQ6eW91cl9jbGllbnRfc2VjcmV0" \\
  -H "Content-Type: application/json"`,
      },
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
  payments: {
    title: "Pagamentos",
    description: "Endpoints para geração e consulta de pagamentos",
    endpoints: {
      pixPayment: {
        description: "Gera um pagamento via PIX",
        body: {
          amount: "Valor do pagamento",
          description: "Descrição do pagamento",
          expirationDate: "Data de expiração do pagamento (formato ISO 8601)",
          callbackUrl: "URL para receber notificações de status do pagamento",
        },
        responses: {
          success: "Pagamento processado com sucesso",
          badRequest: "Requisição inválida",
          unauthorized: "Autenticação falhou",
        },
        requestExample: `curl -X POST https://pulsepay.technocenterinformatica.com.br/sandbox/pix \\
  -H "Authorization: Bearer your_access_token" \\
  -H "SellerId: 3fa85f64-5717-4562-b3fc-2c963f66afa6" \\
  -H "Content-Type: application/json" \\
  -d '{
    "amount": 100.50,
    "description": "Pagamento de serviço",
    "expirationDate": "2023-12-31T23:59:59Z",
    "callbackUrl": "https://your-callback-url.com/notifications"
  }'`,
      },
      boletoPayment: {
        description: "Emite um boleto bancário para pagamento",
        body: {
          amount: "Valor do boleto",
          description: "Descrição do pagamento",
          customerName: "Nome do cliente/pagador",
          customerDocument: "CPF/CNPJ do cliente/pagador",
          dueDate: "Data de vencimento do boleto (formato ISO 8601)",
          callbackUrl: "URL para receber notificações de status do pagamento",
        },
        responses: {
          success: "Boleto gerado com sucesso",
          badRequest: "Requisição inválida",
          unauthorized: "Autenticação falhou",
        },
        requestExample: `curl -X POST https://pulsepay.technocenterinformatica.com.br/sandbox/boleto \\
  -H "Authorization: Bearer your_access_token" \\
  -H "SellerId: 3fa85f64-5717-4562-b3fc-2c963f66afa6" \\
  -H "Content-Type: application/json" \\
  -d '{
    "amount": 299.99,
    "description": "Pagamento de produto",
    "customerName": "Cliente Exemplo",
    "customerDocument": "12345678900",
    "dueDate": "2023-12-31",
    "callbackUrl": "https://your-callback-url.com/notifications"
  }'`,
      },
      boletoPdf: {
        description: "Obtém o PDF de um boleto bancário gerado anteriormente",
        parameters: {
          id: "ID do boleto bancário",
        },
        responses: {
          success: "PDF do boleto retornado com sucesso",
          notFound: "Boleto não encontrado",
          badRequest: "Requisição inválida",
        },
        requestExample: `curl -X GET https://pulsepay.technocenterinformatica.com.br/sandbox/boleto/3fa85f64-5717-4562-b3fc-2c963f66afa6/pdf \\
  -H "Authorization: Bearer your_access_token" \\
  -H "SellerId: 3fa85f64-5717-4562-b3fc-2c963f66afa6" \\
  --output boleto.pdf`,
      },
    },
  },
  payouts: {
    title: "Transferências",
    description:
      "Endpoints para validação de chaves PIX e realização de transferências",
    validatePixKey: {
      title: "Validar Chave PIX",
      description: "Valida uma chave PIX antes de fazer uma transferência",
      body: {
        pixKeyType: "Tipo da chave PIX (CPF, CNPJ, EMAIL, PHONE, RANDOM)",
        pixKeyValue: "Valor da chave PIX",
      },
      responses: {
        success: "Chave PIX validada com sucesso",
        badRequest: "Chave PIX inválida",
        serverError: "Erro interno",
      },
      requestExample: `curl -X POST https://pulsepay.technocenterinformatica.com.br/sandbox/validate \\
  -H "Authorization: Bearer your_access_token" \\
  -H "SellerId: 3fa85f64-5717-4562-b3fc-2c963f66afa6" \\
  -H "Content-Type: application/json" \\
  -d '{
    "pixKeyType": "CPF",
    "pixKeyValue": "12345678900"
  }'`,
    },
    createPayment: {
      title: "Criar Transferência",
      description: "Cria uma nova transferência PIX para um destinatário",
      body: {
        amount: "Valor a ser transferido",
        description: "Descrição da transferência",
        pixKeyType: "Tipo da chave PIX (CPF, CNPJ, EMAIL, PHONE, RANDOM)",
        pixKeyValue: "Valor da chave PIX",
        recipientName: "Nome do destinatário",
        recipientDocument: "CPF/CNPJ do destinatário",
        externalReference: "Referência externa para controle do cliente",
      },
      responses: {
        created: "Transferência criada com sucesso",
        badRequest: "Requisição inválida",
        conflict: "Conflito",
        serverError: "Erro interno",
      },
      requestExample: `curl -X POST https://pulsepay.technocenterinformatica.com.br/sandbox/payment \\
  -H "Authorization: Bearer your_access_token" \\
  -H "SellerId: 3fa85f64-5717-4562-b3fc-2c963f66afa6" \\
  -H "Content-Type: application/json" \\
  -d '{
    "amount": 100.50,
    "description": "Pagamento para Fornecedor XYZ",
    "pixKeyType": "CPF",
    "pixKeyValue": "12345678900",
    "recipientName": "Nome do Destinatário",
    "recipientDocument": "123.456.789-00",
    "externalReference": "REF-001"
  }'`,
    },
    getPayment: {
      title: "Consultar Transferência",
      description: "Obtém o status e detalhes de uma transferência específica",
      parameters: {
        id: "ID único do pagamento",
      },
      responses: {
        success: "Consulta realizada com sucesso",
        notFound: "Pagamento não encontrado",
        serverError: "Erro interno",
      },
      requestExample: `curl -X GET https://pulsepay.technocenterinformatica.com.br/sandbox/payment/3fa85f64-5717-4562-b3fc-2c963f66afa6 \\
  -H "Authorization: Bearer your_access_token" \\
  -H "SellerId: 3fa85f64-5717-4562-b3fc-2c963f66afa6"`,
    },
  },
  transactions: {
    title: "Transações",
    description: "Endpoints para consulta e gerenciamento de transações",
    endpoints: {
      getTransactions: {
        description: "Lista todas as transações do vendedor",
        parameters: {
          startDate: "Data de início para filtro (formato ISO 8601)",
          endDate: "Data de fim para filtro (formato ISO 8601)",
          status: "Status das transações (Pending, Completed, Failed, etc)",
          page: "Página para paginação (padrão: 1)",
          pageSize: "Tamanho da página para paginação (padrão: 20)",
        },
        responses: {
          success: "Lista de transações retornada com sucesso",
          badRequest: "Requisição inválida",
          serverError: "Erro interno",
        },
        requestExample: `curl -X GET "https://pulsepay.technocenterinformatica.com.br/sandbox/transactions?startDate=2023-12-01T00:00:00Z&endDate=2023-12-31T23:59:59Z&status=Completed&page=1&pageSize=20" \\
  -H "Authorization: Bearer your_access_token" \\
  -H "SellerId: 3fa85f64-5717-4562-b3fc-2c963f66afa6"`,
      },
      getTransaction: {
        description: "Consulta os detalhes de uma transação específica",
        parameters: {
          id: "ID único da transação",
        },
        responses: {
          success: "Transação encontrada com sucesso",
          notFound: "Transação não encontrada",
          serverError: "Erro interno",
        },
        requestExample: `curl -X GET https://pulsepay.technocenterinformatica.com.br/sandbox/transaction/3fa85f64-5717-4562-b3fc-2c963f66afa6 \\
  -H "Authorization: Bearer your_access_token" \\
  -H "SellerId: 3fa85f64-5717-4562-b3fc-2c963f66afa6"`,
      },
    },
  },
  webhooks: {
    title: "Webhooks",
    description: "Endpoints para configuração e gerenciamento de webhooks",
    endpoints: {
      getWebhooks: {
        description: "Lista todos os webhooks configurados",
        responses: {
          success: "Lista de webhooks retornada com sucesso",
          serverError: "Erro interno",
        },
        requestExample: `curl -X GET https://pulsepay.technocenterinformatica.com.br/sandbox/webhooks \\
  -H "Authorization: Bearer your_access_token" \\
  -H "SellerId: 3fa85f64-5717-4562-b3fc-2c963f66afa6"`,
      },
      createWebhook: {
        description: "Cria uma nova configuração de webhook",
        body: {
          url: "URL para envio das notificações",
          events: "Lista de eventos para os quais o webhook será acionado",
          isActive: "Indica se o webhook está ativo",
        },
        responses: {
          created: "Webhook criado com sucesso",
          badRequest: "Requisição inválida",
          serverError: "Erro interno",
        },
        requestExample: `curl -X POST https://pulsepay.technocenterinformatica.com.br/sandbox/webhooks \\
  -H "Authorization: Bearer your_access_token" \\
  -H "SellerId: 3fa85f64-5717-4562-b3fc-2c963f66afa6" \\
  -H "Content-Type: application/json" \\
  -d '{
    "url": "https://example.com/webhook",
    "events": ["payment.created", "payment.completed"],
    "isActive": true
  }'`,
      },
      testWebhook: {
        description: "Envia um evento de teste para um webhook",
        parameters: {
          id: "ID único do webhook",
        },
        body: {
          eventType: "Tipo do evento a ser testado",
        },
        responses: {
          success: "Evento de teste enviado com sucesso",
          notFound: "Webhook não encontrado",
          serverError: "Erro interno",
        },
        requestExample: `curl -X POST https://pulsepay.technocenterinformatica.com.br/sandbox/webhook/3fa85f64-5717-4562-b3fc-2c963f66afa6/test \\
  -H "Authorization: Bearer your_access_token" \\
  -H "SellerId: 3fa85f64-5717-4562-b3fc-2c963f66afa6" \\
  -H "Content-Type: application/json" \\
  -d '{
    "eventType": "payment.completed"
  }'`,
      },
    },
  },
};
