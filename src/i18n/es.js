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
};
