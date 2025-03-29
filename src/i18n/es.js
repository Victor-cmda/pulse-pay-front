export default {
  common: {
    search: "Buscar endpoints...",
    copy: "Copiar",
    content: "Contenido",
    needHelp: "¿Necesitas ayuda?",
    talkToSupport: "Hablar con Soporte",
    clearFilters: "Limpiar filtros",
    noEndpointsFound: "No se encontraron endpoints",
    noEndpointsFoundDesc:
      "No pudimos encontrar ningún endpoint con los criterios de búsqueda actuales.",
    authentication: {
      bearer: "Bearer Token",
      basic: "Autenticación Básica",
      none: "Ninguna",
    },
    headers: {
      authorization:
        "Token Bearer obtenido a través del endpoint de autenticación",
      sellerId: "ID del vendedor en formato GUID",
      contentType: "application/json",
    },
  },
  header: {
    title: "Documentación de la API",
    subtitle: "Guía completa para integrar con nuestras APIs de pagos",
  },
  introduction: {
    title: "Introducción",
    description: "Visión general de la API y cómo empezar",
    overview: {
      path: "Visión General",
      description: "Información general sobre la API PulsePay",
      title: "¿Qué es la API PulsePay?",
      content:
        "La API PulsePay es una solución completa para procesamiento de pagos que permite integrar múltiples formas de pago en su sistema, sitio web o aplicación. Nuestra API es RESTful, usa JSON para formateo de datos y sigue los estándares modernos de autenticación OAuth 2.0.",
    },
    gettingStarted: {
      path: "Primeros Pasos",
      description: "Guía paso a paso para comenzar a utilizar la API",
      title: "Primeros Pasos",
      content:
        "Esta guía le ayudará a configurar y comenzar a usar la API PulsePay para procesar pagos en su aplicación.",
    },
    authentication: {
      path: "Autenticación",
      description: "Visión general del proceso de autenticación",
      title: "Visión General de Autenticación",
      content:
        "La API PulsePay utiliza el estándar OAuth 2.0 para autenticación, garantizando seguridad en las interacciones con los endpoints. Necesitará obtener un token de acceso JWT que deberá incluirse en todas las solicitudes.",
    },
  },
  features: {
    easyIntegration: {
      title: "Fácil Integración",
      content:
        "Diseño intuitivo que permite implementación rápida en cualquier plataforma o lenguaje de programación.",
    },
    advancedSecurity: {
      title: "Seguridad Avanzada",
      content:
        "Transacciones protegidas con cifrado, autenticación OAuth y conformidad con estándares PCI.",
    },
    multipleMethods: {
      title: "Múltiples Métodos",
      content:
        "Soporte para diversos métodos de pago, incluyendo PIX, boletos bancarios y transferencias.",
    },
  },
  mainFeatures: {
    title: "Características principales",
    pixPayments: "Generación de pagos PIX instantáneos",
    bankSlips: "Emisión de boletos bancarios",
    pixKeyValidation: "Validación de claves PIX",
    paymentNotifications: "Notificaciones de estado de pago en tiempo real",
    transactionStatus: "Consulta de estado de transacciones",
    sandboxEnvironment: "Entorno de sandbox para pruebas",
  },
  gettingStartedSteps: {
    requestCredentials: {
      title: "Solicite sus credenciales",
      content:
        "Contacte a nuestro equipo comercial para obtener su Client ID y Client Secret. Estas credenciales son necesarias para autenticar sus solicitudes a la API.",
    },
    testSandbox: {
      title: "Haga pruebas en el entorno Sandbox",
      content:
        "Utilice nuestras APIs de prueba para validar su integración antes de ir a producción. El entorno sandbox permite simular transacciones sin procesarlas realmente.",
      sandboxUrl: "URL Sandbox:",
    },
    authenticate: {
      title: "Autentíquese",
      content:
        "Use el endpoint /oauth/v2/token para generar un token de acceso. El token JWT generado debe incluirse en todas las solicitudes subsiguientes.",
    },
    integrate: {
      title: "Integre con su aplicación",
      content:
        "Siga la documentación de referencia para implementar los endpoints necesarios. Puede comenzar con flujos simples como generación de PIX o boletos.",
    },
    goToProduction: {
      title: "Vaya a producción",
      content:
        "Después de completar sus pruebas, actualice sus credenciales para el entorno de producción. Asegúrese de que todas las implementaciones han sido probadas adecuadamente.",
      productionUrl: "URL Producción:",
    },
  },
  sdksInDevelopment: {
    title: "SDKs en Desarrollo",
    message:
      "Nuestras bibliotecas SDK y plugins de integración están actualmente en desarrollo.",
    additionalInfo:
      "Estamos trabajando para poner a disposición SDKs para los principales lenguajes de programación y plugins para plataformas populares de comercio electrónico. Mientras tanto, puede utilizar nuestra API REST directamente con las instrucciones en esta documentación.",
    updates:
      "Siga nuestras actualizaciones para saber cuándo estarán disponibles los SDKs.",
  },
  authentication: {
    title: "Flujo de Autenticación",
    steps: {
      step1:
        "Envíe sus credenciales (Client ID y Client Secret) al endpoint /oauth/v2/token usando autenticación Basic.",
      step2:
        "Reciba un token JWT válido que se utilizará para autenticar las solicitudes subsiguientes.",
      step3:
        "Incluya el token en el encabezado Authorization de todas las solicitudes en el formato Bearer {token}.",
      step4:
        "Incluya el ID del vendedor en el encabezado SellerId en todas las solicitudes.",
    },
    tokenSecurity: {
      title: "Seguridad del Token",
      validity: "El token JWT tiene validez de 1 hora (3.600 segundos).",
      storeSecurely: "Almacene de forma segura su Client ID y Client Secret.",
      renewAutomatically:
        "Renueve el token automáticamente antes de que expire para evitar fallos en las solicitudes.",
      neverShare:
        "Nunca comparta sus tokens o credenciales en código del lado del cliente.",
    },
    example: {
      title: "Ejemplo de Autenticación",
      description: "Vea un ejemplo de cómo obtener el token de autenticación:",
    },
    endpoints: {
      generateToken: {
        description:
          "Genera un token de acceso OAuth 2.0 mediante credenciales de cliente",
        authentication: "Basic Auth (Client ID y Client Secret)",
        headers: {
          authorization:
            "Autenticación Basic con Client ID y Client Secret codificados en Base64",
        },
        responses: {
          success: "Token generado con éxito",
          unauthorized: "Credenciales inválidas o ausentes",
        },
        requestExample: `curl -X POST https://pulsepay.technocenterinformatica.com.br/sandbox/oauth/v2/token \\
  -H "Authorization: Basic eW91cl9jbGllbnRfaWQ6eW91cl9jbGllbnRfc2VjcmV0" \\
  -H "Content-Type: application/json"`,
      },
    },
  },
  concepts: {
    title: "Conceptos y Términos",
    description:
      "Términos y conceptos importantes para entender la API de pagos",
    pix: {
      title: "PIX",
      description:
        "Sistema de pagos instantáneos desarrollado por el Banco Central de Brasil. Permite transferencias y pagos en segundos, a cualquier hora del día, todos los días del año.",
    },
    bankSlip: {
      title: "Boleto Bancario",
      description:
        "Método de pago brasileño donde el cliente recibe un documento con código de barras que puede ser pagado en bancos, corresponsales bancarios, cajeros automáticos o banca por internet.",
    },
    pixKey: {
      title: "Clave PIX",
      description:
        "Identificador usado para recibir pagos PIX. Puede ser CPF/CNPJ, correo electrónico, número de teléfono o una clave aleatoria.",
    },
    oauth: {
      title: "OAuth 2.0",
      description:
        "Protocolo de autorización que permite que las aplicaciones obtengan acceso limitado a cuentas de usuarios en un servicio HTTP. Nuestra API utiliza tokens JWT para autenticación.",
    },
    bearerToken: {
      title: "Bearer Token",
      description:
        "Tipo de token de acceso OAuth 2.0 donde el portador (bearer) del token tiene acceso a los recursos protegidos.",
    },
    sellerId: {
      title: "SellerId",
      description:
        "Identificador único del vendedor o comerciante en la plataforma. Este valor debe enviarse en todas las solicitudes en el encabezado.",
    },
  },
  sdks: {
    title: "SDKs e Integraciones",
    description:
      "Bibliotecas y herramientas para facilitar la integración con nuestra API",
    csharp: {
      title: "SDK para C#",
      description:
        "Biblioteca oficial para integración con .NET Core y .NET Framework",
      link: "Ver documentación",
    },
    php: {
      title: "SDK para PHP",
      description: "Biblioteca oficial para integración con PHP 7.4+",
      link: "Ver documentación",
    },
    javascript: {
      title: "SDK para JavaScript",
      description: "Biblioteca oficial para Node.js y navegadores",
      link: "Ver documentación",
    },
  },
  support: {
    title: "Soporte y Contacto",
    description: "Obtenga ayuda con la integración y uso de nuestra API",
    technicalSupport: {
      title: "Soporte Técnico",
      description:
        "Nuestro equipo de soporte técnico está disponible para ayudar con cuestiones de integración y problemas técnicos.",
    },
    completeDocumentation: {
      title: "Documentación Completa",
      description:
        "Acceda a nuestra documentación completa, incluyendo guías paso a paso y tutoriales detallados.",
    },
  },
  apiEndpoints: {
    parameters: "Parámetros de URL",
    headers: "Encabezados",
    body: "Cuerpo",
    required: "Sí",
    notRequired: "No",
    properties: "Propiedades:",
    requestExample: "Ejemplo de Solicitud",
    responses: "Respuestas",
  },
  payments: {
    title: "Pagos",
    description: "Endpoints para generación y consulta de pagos",
    endpoints: {
      pixPayment: {
        description: "Genera un pago vía PIX",
        body: {
          amount: "Monto del pago",
          description: "Descripción del pago",
          expirationDate: "Fecha de expiración del pago (formato ISO 8601)",
          callbackUrl: "URL para recibir notificaciones de estado del pago",
        },
        responses: {
          success: "Pago procesado con éxito",
          badRequest: "Solicitud inválida",
          unauthorized: "Autenticación fallida",
        },
        requestExample: `curl -X POST https://pulsepay.technocenterinformatica.com.br/sandbox/pix \\
  -H "Authorization: Bearer your_access_token" \\
  -H "SellerId: 3fa85f64-5717-4562-b3fc-2c963f66afa6" \\
  -H "Content-Type: application/json" \\
  -d '{
    "amount": 100.50,
    "description": "Pago de servicio",
    "expirationDate": "2023-12-31T23:59:59Z",
    "callbackUrl": "https://your-callback-url.com/notifications"
  }'`,
      },
      boletoPayment: {
        description: "Emite un boleto bancario para pago",
        body: {
          amount: "Valor del boleto",
          description: "Descripción del pago",
          customerName: "Nombre del cliente/pagador",
          customerDocument: "CPF/CNPJ del cliente/pagador",
          dueDate: "Fecha de vencimiento del boleto (formato ISO 8601)",
          callbackUrl: "URL para recibir notificaciones de estado del pago",
        },
        responses: {
          success: "Boleto generado con éxito",
          badRequest: "Solicitud inválida",
          unauthorized: "Autenticación fallida",
        },
        requestExample: `curl -X POST https://pulsepay.technocenterinformatica.com.br/sandbox/boleto \\
  -H "Authorization: Bearer your_access_token" \\
  -H "SellerId: 3fa85f64-5717-4562-b3fc-2c963f66afa6" \\
  -H "Content-Type: application/json" \\
  -d '{
    "amount": 299.99,
    "description": "Pago de producto",
    "customerName": "Cliente Ejemplo",
    "customerDocument": "12345678900",
    "dueDate": "2023-12-31",
    "callbackUrl": "https://your-callback-url.com/notifications"
  }'`,
      },
      boletoPdf: {
        description:
          "Obtiene el PDF de un boleto bancario generado previamente",
        parameters: {
          id: "ID del boleto bancario",
        },
        responses: {
          success: "PDF del boleto retornado con éxito",
          notFound: "Boleto no encontrado",
          badRequest: "Solicitud inválida",
        },
        requestExample: `curl -X GET https://pulsepay.technocenterinformatica.com.br/sandbox/boleto/3fa85f64-5717-4562-b3fc-2c963f66afa6/pdf \\
  -H "Authorization: Bearer your_access_token" \\
  -H "SellerId: 3fa85f64-5717-4562-b3fc-2c963f66afa6" \\
  --output boleto.pdf`,
      },
    },
  },
  payouts: {
    title: "Transferencias",
    description:
      "Endpoints para validación de llaves PIX y realización de transferencias",
    validatePixKey: {
      title: "Validar Llave PIX",
      description: "Valida una llave PIX antes de hacer una transferencia",
      body: {
        pixKeyType: "Tipo de la llave PIX (CPF, CNPJ, EMAIL, PHONE, RANDOM)",
        pixKeyValue: "Valor de la llave PIX",
      },
      responses: {
        success: "Llave PIX validada con éxito",
        badRequest: "Llave PIX inválida",
        serverError: "Error interno",
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
      title: "Crear Transferencia",
      description: "Crea una nueva transferencia PIX a un destinatario",
      body: {
        amount: "Valor a ser transferido",
        description: "Descripción de la transferencia",
        pixKeyType: "Tipo de la llave PIX (CPF, CNPJ, EMAIL, PHONE, RANDOM)",
        pixKeyValue: "Valor de la llave PIX",
        recipientName: "Nombre del destinatario",
        recipientDocument: "CPF/CNPJ del destinatario",
        externalReference: "Referencia externa para control del cliente",
      },
      responses: {
        created: "Transferencia creada con éxito",
        badRequest: "Solicitud inválida",
        conflict: "Conflicto",
        serverError: "Error interno",
      },
      requestExample: `curl -X POST https://pulsepay.technocenterinformatica.com.br/sandbox/payment \\
  -H "Authorization: Bearer your_access_token" \\
  -H "SellerId: 3fa85f64-5717-4562-b3fc-2c963f66afa6" \\
  -H "Content-Type: application/json" \\
  -d '{
    "amount": 100.50,
    "description": "Pago para Proveedor XYZ",
    "pixKeyType": "CPF",
    "pixKeyValue": "12345678900",
    "recipientName": "Nombre del Destinatario",
    "recipientDocument": "123.456.789-00",
    "externalReference": "REF-001"
  }'`,
    },
    getPayment: {
      title: "Consultar Transferencia",
      description:
        "Obtiene el estado y detalles de una transferencia específica",
      parameters: {
        id: "ID único del pago",
      },
      responses: {
        success: "Consulta realizada con éxito",
        notFound: "Pago no encontrado",
        serverError: "Error interno",
      },
      requestExample: `curl -X GET https://pulsepay.technocenterinformatica.com.br/sandbox/payment/3fa85f64-5717-4562-b3fc-2c963f66afa6 \\
  -H "Authorization: Bearer your_access_token" \\
  -H "SellerId: 3fa85f64-5717-4562-b3fc-2c963f66afa6"`,
    },
  },
  transactions: {
    title: "Transacciones",
    description: "Endpoints para consulta y gestión de transacciones",
    endpoints: {
      getTransactions: {
        description: "Lista todas las transacciones del vendedor",
        parameters: {
          startDate: "Fecha de inicio para filtrar (formato ISO 8601)",
          endDate: "Fecha de fin para filtrar (formato ISO 8601)",
          status:
            "Estado de las transacciones (Pending, Completed, Failed, etc)",
          page: "Página para paginación (predeterminado: 1)",
          pageSize: "Tamaño de página para paginación (predeterminado: 20)",
        },
        responses: {
          success: "Lista de transacciones retornada con éxito",
          badRequest: "Solicitud inválida",
          serverError: "Error interno",
        },
        requestExample: `curl -X GET "https://pulsepay.technocenterinformatica.com.br/sandbox/transactions?startDate=2023-12-01T00:00:00Z&endDate=2023-12-31T23:59:59Z&status=Completed&page=1&pageSize=20" \\
  -H "Authorization: Bearer your_access_token" \\
  -H "SellerId: 3fa85f64-5717-4562-b3fc-2c963f66afa6"`,
      },
      getTransaction: {
        description: "Consulta los detalles de una transacción específica",
        parameters: {
          id: "ID único de la transacción",
        },
        responses: {
          success: "Transacción encontrada con éxito",
          notFound: "Transacción no encontrada",
          serverError: "Error interno",
        },
        requestExample: `curl -X GET https://pulsepay.technocenterinformatica.com.br/sandbox/transaction/3fa85f64-5717-4562-b3fc-2c963f66afa6 \\
  -H "Authorization: Bearer your_access_token" \\
  -H "SellerId: 3fa85f64-5717-4562-b3fc-2c963f66afa6"`,
      },
    },
  },
  webhooks: {
    title: "Webhooks",
    description: "Endpoints para configuración y gestión de webhooks",
    endpoints: {
      getWebhooks: {
        description: "Lista todos los webhooks configurados",
        responses: {
          success: "Lista de webhooks retornada con éxito",
          serverError: "Error interno",
        },
        requestExample: `curl -X GET https://pulsepay.technocenterinformatica.com.br/sandbox/webhooks \\
  -H "Authorization: Bearer your_access_token" \\
  -H "SellerId: 3fa85f64-5717-4562-b3fc-2c963f66afa6"`,
      },
      createWebhook: {
        description: "Crea una nueva configuración de webhook",
        body: {
          url: "URL para envío de notificaciones",
          events: "Lista de eventos para los cuales el webhook será accionado",
          isActive: "Indica si el webhook está activo",
        },
        responses: {
          created: "Webhook creado con éxito",
          badRequest: "Solicitud inválida",
          serverError: "Error interno",
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
        description: "Envía un evento de prueba a un webhook",
        parameters: {
          id: "ID único del webhook",
        },
        body: {
          eventType: "Tipo del evento a ser probado",
        },
        responses: {
          success: "Evento de prueba enviado con éxito",
          notFound: "Webhook no encontrado",
          serverError: "Error interno",
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
