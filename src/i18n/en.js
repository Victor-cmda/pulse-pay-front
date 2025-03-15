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
        "Support for various payment methods, including PIX, bank slips and transfers.",
    },
  },
  mainFeatures: {
    title: "Main features",
    pixPayments: "Generation of instant PIX payments",
    bankSlips: "Issuance of bank slips",
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
        "Follow the reference documentation to implement the necessary endpoints. You can start with simple flows like PIX generation or bank slips.",
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
  },
  concepts: {
    title: "Concepts and Terms",
    description: "Important terms and concepts to understand the payment API",
    pix: {
      title: "PIX",
      description:
        "Instant payment system developed by the Central Bank of Brazil. It allows transfers and payments in seconds, any time of day, every day of the year.",
    },
    bankSlip: {
      title: "Bank Slip",
      description:
        "Brazilian payment method where the customer receives a document with a barcode that can be paid at banks, banking correspondents, ATMs or internet banking.",
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
  payouts: {
    title: "Transfers",
    description: "Endpoints for PIX key validation and money transfers",
    validatePixKey: {
      title: "Validate PIX Key",
      description: "Validates a PIX key before making a transfer",
    },
    createPayment: {
      title: "Create Transfer",
      description: "Creates a new PIX transfer to a recipient",
    },
    getPayment: {
      title: "Query Transfer",
      description: "Get the status and details of a specific transfer",
    },
  },
};
