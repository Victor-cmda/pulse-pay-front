export default {
  common: {
    search: "Search endpoints...",
    copy: "Copy",
    content: "Content",
    needHelp: "Need help?",
    talkToSupport: "Talk to Support",
    clearFilters: "Clear filters",
    noEndpointsFound: "No endpoints found",
    noEndpointsFoundDesc:
      "We couldn't find any endpoints with the current search criteria.",
    authentication: {
      bearer: "Bearer Token",
      basic: "Basic Auth",
      none: "None",
    },
    headers: {
      authorization: "Bearer token obtained through authentication endpoint",
      sellerId: "Seller ID in GUID format",
      contentType: "application/json",
    },
  },
  header: {
    title: "API Documentation",
    subtitle: "Complete guide to integrate with our payment APIs",
  },
  introduction: {
    title: "Introduction",
    description: "API overview and how to get started",
    overview: {
      path: "Overview",
      description: "General information about the PulsePay API",
      title: "What is the PulsePay API?",
      content:
        "The PulsePay API is a complete payment processing solution that allows you to integrate multiple payment methods into your system, website or application. Our API is RESTful, uses JSON for data formatting and follows modern OAuth 2.0 authentication standards.",
    },
    gettingStarted: {
      path: "Getting Started",
      description: "Step-by-step guide to start using the API",
      title: "Getting Started",
      content:
        "This guide will help you set up and start using the PulsePay API to process payments in your application.",
    },
    authentication: {
      path: "Authentication",
      description: "Overview of the authentication process",
      title: "Authentication Overview",
      content:
        "The PulsePay API uses the OAuth 2.0 standard for authentication, ensuring security in interactions with the endpoints. You will need to obtain a JWT access token that must be included in all requests.",
    },
  },
  features: {
    easyIntegration: {
      title: "Easy Integration",
      content:
        "Intuitive design that allows quick implementation in any platform or programming language.",
    },
    advancedSecurity: {
      title: "Advanced Security",
      content:
        "Transactions protected with encryption, OAuth authentication and PCI compliance.",
    },
    multipleMethods: {
      title: "Multiple Methods",
      content:
        "Support for various payment methods, including PIX, and transfers.",
    },
  },
  mainFeatures: {
    title: "Main features",
    pixPayments: "Generation of instant PIX payments",
    pixKeyValidation: "PIX key validation",
    paymentNotifications: "Real-time payment status notifications",
    transactionStatus: "Transaction status query",
    sandboxEnvironment: "Sandbox environment for testing",
  },
  gettingStartedSteps: {
    requestCredentials: {
      title: "Request your credentials",
      content:
        "Contact our commercial team to get your Client ID and Client Secret. These credentials are necessary to authenticate your requests to the API.",
    },
    testSandbox: {
      title: "Test in the Sandbox environment",
      content:
        "Use our test APIs to validate your integration before going to production. The sandbox environment allows you to simulate transactions without actually processing them.",
      sandboxUrl: "Sandbox URL:",
    },
    authenticate: {
      title: "Authenticate",
      content:
        "Use the /oauth/v2/token endpoint to generate an access token. The generated JWT token must be included in all subsequent requests.",
    },
    integrate: {
      title: "Integrate with your application",
      content:
        "Follow the reference documentation to implement the necessary endpoints. You can start with simple flows like PIX generation.",
    },
    goToProduction: {
      title: "Go to production",
      content:
        "After completing your tests, update your credentials to the production environment. Make sure all implementations have been properly tested.",
      productionUrl: "Production URL:",
    },
  },
  sdksInDevelopment: {
    title: "SDKs in Development",
    message:
      "Our SDK libraries and integration plugins are currently in development.",
    additionalInfo:
      "We are working to make SDKs available for the main programming languages and plugins for popular e-commerce platforms. In the meantime, you can use our REST API directly with the instructions in this documentation.",
    updates: "Follow our updates to know when SDKs will be available.",
  },
  authentication: {
    title: "Authentication Flow",
    steps: {
      step1:
        "Send your credentials (Client ID and Client Secret) to the /oauth/v2/token endpoint using Basic authentication.",
      step2:
        "Receive a valid JWT token that will be used to authenticate subsequent requests.",
      step3:
        "Include the token in the Authorization header of all requests in the format Bearer {token}.",
      step4: "Include the seller ID in the SellerId header in all requests.",
    },
    tokenSecurity: {
      title: "Token Security",
      validity: "The JWT token is valid for 1 hour (3,600 seconds).",
      storeSecurely: "Store your Client ID and Client Secret securely.",
      renewAutomatically:
        "Automatically renew the token before it expires to avoid request failures.",
      neverShare: "Never share your tokens or credentials in client-side code.",
    },
    example: {
      title: "Authentication Example",
      description: "See an example of how to obtain the authentication token:",
    },
    endpoints: {
      generateToken: {
        description:
          "Generates an OAuth 2.0 access token using client credentials",
        authentication: "Basic Auth (Client ID and Client Secret)",
        headers: {
          authorization:
            "Basic authentication with Client ID and Client Secret encoded in Base64",
        },
        responses: {
          success: "Token generated successfully",
          unauthorized: "Invalid or missing credentials",
        },
        requestExample: `curl -X POST https://pulsepay.technocenterinformatica.com.br/sandbox/oauth/v2/token \\
  -H "Authorization: Basic eW91cl9jbGllbnRfaWQ6eW91cl9jbGllbnRfc2VjcmV0" \\
  -H "Content-Type: application/json"`,
      },
    },
  },
  concepts: {
    title: "Concepts and Terms",
    description: "Important terms and concepts to understand the payment API",
    pix: {
      title: "PIX",
      description:
        "Instant payment system developed by the Central Bank of Brazil. It allows transfers and payments in seconds, any time of day, every day of the year.",
    },
    pixKey: {
      title: "PIX Key",
      description:
        "Identifier used to receive PIX payments. It can be CPF/CNPJ, email, phone number or a random key.",
    },
    oauth: {
      title: "OAuth 2.0",
      description:
        "Authorization protocol that allows applications to obtain limited access to user accounts in an HTTP service. Our API uses JWT tokens for authentication.",
    },
    bearerToken: {
      title: "Bearer Token",
      description:
        "Type of OAuth 2.0 access token where the bearer of the token has access to protected resources.",
    },
    sellerId: {
      title: "SellerId",
      description:
        "Unique identifier of the seller or merchant on the platform. This value must be sent in all requests in the header.",
    },
  },
  sdks: {
    title: "SDKs and Integrations",
    description: "Libraries and tools to facilitate integration with our API",
    csharp: {
      title: "SDK for C#",
      description:
        "Official library for integration with .NET Core and .NET Framework",
      link: "View documentation",
    },
    php: {
      title: "SDK for PHP",
      description: "Official library for integration with PHP 7.4+",
      link: "View documentation",
    },
    javascript: {
      title: "SDK for JavaScript",
      description: "Official library for Node.js and browsers",
      link: "View documentation",
    },
  },
  support: {
    title: "Support and Contact",
    description: "Get help with integration and use of our API",
    technicalSupport: {
      title: "Technical Support",
      description:
        "Our technical support team is available to help with integration issues and technical problems.",
    },
    completeDocumentation: {
      title: "Complete Documentation",
      description:
        "Access our complete documentation, including step-by-step guides and detailed tutorials.",
    },
  },
  apiEndpoints: {
    parameters: "URL Parameters",
    headers: "Headers",
    body: "Body",
    required: "Yes",
    notRequired: "No",
    properties: "Properties:",
    requestExample: "Request Example",
    responses: "Responses",
  },
  payments: {
    title: "PixIn",
    description: "Endpoints for generating and querying payments",
    endpoints: {
      pixPayment: {
        description: "Generates a payment via PIX",
        body: {
          amount: "Payment amount",
          description: "Payment description",
          expirationDate: "Payment expiration date (ISO 8601 format)",
          callbackUrl: "URL to receive payment status notifications",
        },
        responses: {
          success: "Payment processed successfully",
          badRequest: "Invalid request",
          unauthorized: "Authentication failed",
        },
        requestExample: `curl -X POST https://pulsepay.technocenterinformatica.com.br/sandbox/pix \\
  -H "Authorization: Bearer your_access_token" \\
  -H "SellerId: 3fa85f64-5717-4562-b3fc-2c963f66afa6" \\
  -H "Content-Type: application/json" \\
  -d '{
    "amount": 100.50,
    "orderId": "123456789",
    "customerId": "customer-123456",
    "name": "Cliente Teste",
    "email": "cliente.teste@example.com",
    "document": "12345678900",
    "documentType": "CPF",
    "description": "Service payment",
    "expirationDate": "2023-12-31T23:59:59Z",
    "requires_same_owner": True
  }'`,
      },
    },
  },
  payouts: {
    title: "PixOut",
    description: "Endpoints for PIX key validation and money transfers",
    validatePixKey: {
      title: "Validate PIX Key",
      description: "Validates a PIX key before making a transfer",
      body: {
        pixKeyType: "PIX key type (CPF, CNPJ, EMAIL, PHONE, RANDOM)",
        pixKeyValue: "PIX key value",
      },
      responses: {
        success: "PIX key validated successfully",
        badRequest: "Invalid PIX key",
        serverError: "Internal error",
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
      title: "Create Transfer",
      description: "Creates a new PIX transfer to a recipient",
      body: {
        amount: "Amount to be transferred",
        description: "Transfer description",
        pixKeyType: "PIX key type (CPF, CNPJ, EMAIL, PHONE, RANDOM)",
        pixKeyValue: "PIX key value",
        recipientName: "Recipient name",
        recipientDocument: "Recipient CPF/CNPJ",
        externalReference: "External reference for client control",
      },
      responses: {
        created: "Transfer created successfully",
        badRequest: "Invalid request",
        conflict: "Conflict",
        serverError: "Internal error",
      },
      requestExample: `curl -X POST https://pulsepay.technocenterinformatica.com.br/sandbox/payment \\
  -H "Authorization: Bearer your_access_token" \\
  -H "SellerId: 3fa85f64-5717-4562-b3fc-2c963f66afa6" \\
  -H "Content-Type: application/json" \\
  -d '{
    "amount": 100.50,
    "description": "Payment to Supplier XYZ",
    "pixKeyType": "CPF",
    "pixKeyValue": "12345678900",
    "recipientName": "Recipient Name",
    "recipientDocument": "123.456.789-00",
    "externalReference": "REF-001"
  }'`,
    },
    getPayment: {
      title: "Query Transfer",
      description: "Get the status and details of a specific transfer",
      parameters: {
        id: "Unique payment ID",
      },
      responses: {
        success: "Query performed successfully",
        notFound: "Payment not found",
        serverError: "Internal error",
      },
      requestExample: `curl -X GET https://pulsepay.technocenterinformatica.com.br/sandbox/payment/3fa85f64-5717-4562-b3fc-2c963f66afa6 \\
  -H "Authorization: Bearer your_access_token" \\
  -H "SellerId: 3fa85f64-5717-4562-b3fc-2c963f66afa6"`,
    },
  },
  transactions: {
    title: "Transactions",
    description: "Endpoints for querying and managing transactions",
    endpoints: {
      getTransactions: {
        description: "Lists all seller's transactions",
        parameters: {
          startDate: "Start date for filtering (ISO 8601 format)",
          endDate: "End date for filtering (ISO 8601 format)",
          status: "Transactions status (Pending, Completed, Failed, etc)",
          page: "Page for pagination (default: 1)",
          pageSize: "Page size for pagination (default: 20)",
        },
        responses: {
          success: "Transaction list returned successfully",
          badRequest: "Invalid request",
          serverError: "Internal error",
        },
        requestExample: `curl -X GET "https://pulsepay.technocenterinformatica.com.br/sandbox/transactions?startDate=2023-12-01T00:00:00Z&endDate=2023-12-31T23:59:59Z&status=Completed&page=1&pageSize=20" \\
  -H "Authorization: Bearer your_access_token" \\
  -H "SellerId: 3fa85f64-5717-4562-b3fc-2c963f66afa6"`,
      },
      getTransaction: {
        description: "Queries the details of a specific transaction",
        parameters: {
          id: "Unique transaction ID",
        },
        responses: {
          success: "Transaction found successfully",
          notFound: "Transaction not found",
          serverError: "Internal error",
        },
        requestExample: `curl -X GET https://pulsepay.technocenterinformatica.com.br/sandbox/transaction/3fa85f64-5717-4562-b3fc-2c963f66afa6 \\
  -H "Authorization: Bearer your_access_token" \\
  -H "SellerId: 3fa85f64-5717-4562-b3fc-2c963f66afa6"`,
      },
    },
  },
  webhooks: {
    title: "Webhooks",
    description: "Endpoints for configuring and managing webhooks",
    endpoints: {
      getWebhooks: {
        description: "Lists all configured webhooks",
        responses: {
          success: "Webhook list returned successfully",
          serverError: "Internal error",
        },
        requestExample: `curl -X GET https://pulsepay.technocenterinformatica.com.br/sandbox/webhooks \\
  -H "Authorization: Bearer your_access_token" \\
  -H "SellerId: 3fa85f64-5717-4562-b3fc-2c963f66afa6"`,
      },
      createWebhook: {
        description: "Creates a new webhook configuration",
        body: {
          url: "URL for sending notifications",
          events: "List of events for which the webhook will be triggered",
          isActive: "Indicates if the webhook is active",
        },
        responses: {
          created: "Webhook created successfully",
          badRequest: "Invalid request",
          serverError: "Internal error",
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
        description: "Sends a test event to a webhook",
        parameters: {
          id: "Unique webhook ID",
        },
        body: {
          eventType: "Type of event to be tested",
        },
        responses: {
          success: "Test event sent successfully",
          notFound: "Webhook not found",
          serverError: "Internal error",
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
