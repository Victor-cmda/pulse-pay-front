// src/pages/Endpoints/utils/endpointData.js

export function getEndpointsData(t) {
  return [
    {
      id: "introduction",
      title: t.introduction.title,
      description: t.introduction.description,
      endpoints: [
        {
          id: "overview",
          method: "",
          path: t.introduction.overview.path,
          description: t.introduction.overview.description,
          content: true,
        },
        {
          id: "getting-started",
          method: "",
          path: t.introduction.gettingStarted.path,
          description: t.introduction.gettingStarted.description,
          content: true,
        },
        {
          id: "authentication-overview",
          method: "",
          path: t.introduction.authentication.path,
          description: t.introduction.authentication.description,
          content: true,
        },
      ],
    },
    {
      id: "authentication",
      title: t.authentication.title,
      description: t.authentication.description,
      endpoints: [
        {
          id: "generateToken",
          method: "POST",
          path: "/oauth/v2/token",
          description:
            "Gera um token de acesso OAuth 2.0 através de credenciais do cliente",
          authentication: "Basic Auth (Client ID e Client Secret)",
          parameters: [],
          headers: [
            {
              name: "Authorization",
              required: true,
              type: "string",
              description:
                "Basic authentication com Client ID e Client Secret codificados em Base64",
            },
          ],
          responses: [
            {
              status: 200,
              description: "Token gerado com sucesso",
              example: {
                access_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                token_type: "Bearer",
                expires_in: 3600,
              },
            },
            {
              status: 401,
              description: "Credenciais inválidas ou ausentes",
              example: { message: "Invalid credentials" },
            },
          ],
          requestExample: `curl -X POST https://api.example.com/oauth/v2/token \\
  -H "Authorization: Basic eW91cl9jbGllbnRfaWQ6eW91cl9jbGllbnRfc2VjcmV0" \\
  -H "Content-Type: application/json"`,
        },
      ],
    },
    {
      id: "payments",
      title: "Pagamentos",
      description: "Endpoints para geração e consulta de pagamentos",
      endpoints: [
        {
          id: "pixPayment",
          method: "POST",
          path: "/pix",
          description: "Gera um pagamento via PIX",
          authentication: "Bearer Token",
          parameters: [],
          headers: [
            {
              name: "Authorization",
              required: true,
              type: "string",
              description: "Bearer token obtido via endpoint de autenticação",
            },
            {
              name: "SellerId",
              required: true,
              type: "string",
              description: "ID do vendedor no formato GUID",
            },
            {
              name: "Content-Type",
              required: true,
              type: "string",
              description: "application/json",
            },
          ],
          body: {
            type: "object",
            properties: [
              {
                name: "amount",
                type: "number",
                required: true,
                description: "Valor do pagamento",
              },
              {
                name: "description",
                type: "string",
                required: true,
                description: "Descrição do pagamento",
              },
              {
                name: "expirationDate",
                type: "string",
                required: false,
                description:
                  "Data de expiração do pagamento (formato ISO 8601)",
              },
              {
                name: "callbackUrl",
                type: "string",
                required: false,
                description:
                  "URL para receber notificações de status do pagamento",
              },
            ],
          },
          responses: [
            {
              status: 200,
              description: "Pagamento processado com sucesso",
              example: {
                message: "Pagamento processado com sucesso",
                details: {
                  paymentId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                  qrCode:
                    "00020101021226890014br.gov.bcb.pix2557brcode.example.com/pix/v2/cobv/9d36b84fc70b428ca84f8cc95e9ac3a4...",
                },
              },
            },
            {
              status: 400,
              description: "Requisição inválida",
              example: { error: "Invalid request parameters" },
            },
            {
              status: 401,
              description: "Autenticação falhou",
              example: { error: "Unauthorized access" },
            },
          ],
          requestExample: `curl -X POST https://api.example.com/pix \\
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
        {
          id: "boletoPayment",
          method: "POST",
          path: "/boleto",
          description: "Emite um boleto bancário para pagamento",
          authentication: "Bearer Token",
          parameters: [],
          headers: [
            {
              name: "Authorization",
              required: true,
              type: "string",
              description: "Bearer token obtido via endpoint de autenticação",
            },
            {
              name: "SellerId",
              required: true,
              type: "string",
              description: "ID do vendedor no formato GUID",
            },
            {
              name: "Content-Type",
              required: true,
              type: "string",
              description: "application/json",
            },
          ],
          body: {
            type: "object",
            properties: [
              {
                name: "amount",
                type: "number",
                required: true,
                description: "Valor do boleto",
              },
              {
                name: "description",
                type: "string",
                required: true,
                description: "Descrição do pagamento",
              },
              {
                name: "customerName",
                type: "string",
                required: true,
                description: "Nome do cliente/pagador",
              },
              {
                name: "customerDocument",
                type: "string",
                required: true,
                description: "CPF/CNPJ do cliente/pagador",
              },
              {
                name: "dueDate",
                type: "string",
                required: true,
                description: "Data de vencimento do boleto (formato ISO 8601)",
              },
              {
                name: "callbackUrl",
                type: "string",
                required: false,
                description:
                  "URL para receber notificações de status do pagamento",
              },
            ],
          },
          responses: [
            {
              status: 200,
              description: "Boleto gerado com sucesso",
              example: {
                message: "Boleto bancário gerado com sucesso",
                details: {
                  bankSlipId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                  barcode:
                    "34191.79001 01043.510047 91020.150008 5 88790000029999",
                  pdfUrl:
                    "https://api.example.com/boleto/3fa85f64-5717-4562-b3fc-2c963f66afa6/pdf",
                },
              },
            },
            {
              status: 400,
              description: "Requisição inválida",
              example: { error: "Invalid request parameters" },
            },
            {
              status: 401,
              description: "Autenticação falhou",
              example: { error: "Unauthorized access" },
            },
          ],
          requestExample: `curl -X POST https://api.example.com/boleto \\
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
        {
          id: "boletoPdf",
          method: "GET",
          path: "/boleto/{id}/pdf",
          description: "Obtém o PDF de um boleto bancário gerado anteriormente",
          authentication: "Bearer Token",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              type: "string",
              description: "ID do boleto bancário",
            },
          ],
          headers: [
            {
              name: "Authorization",
              required: true,
              type: "string",
              description: "Bearer token obtido via endpoint de autenticação",
            },
            {
              name: "SellerId",
              required: true,
              type: "string",
              description: "ID do vendedor no formato GUID",
            },
          ],
          responses: [
            {
              status: 200,
              description: "PDF do boleto retornado com sucesso",
              example: "PDF Document (binary)",
            },
            {
              status: 404,
              description: "Boleto não encontrado",
              example: { message: "Bank slip not found" },
            },
            {
              status: 400,
              description: "Requisição inválida",
              example: { error: "Error message" },
            },
          ],
          requestExample: `curl -X GET https://api.example.com/boleto/3fa85f64-5717-4562-b3fc-2c963f66afa6/pdf \\
  -H "Authorization: Bearer your_access_token" \\
  -H "SellerId: 3fa85f64-5717-4562-b3fc-2c963f66afa6" \\
  --output boleto.pdf`,
        },
        {
          id: "notifyPix",
          method: "GET",
          path: "/notify-pix",
          description: "Recebe notificação de pagamento PIX",
          authentication: "None",
          parameters: [
            {
              name: "transaction_id",
              in: "query",
              required: true,
              type: "string",
              description: "ID da transação PIX",
            },
            {
              name: "status",
              in: "query",
              required: true,
              type: "string",
              description: "Status da transação (approved, rejected, etc)",
            },
            {
              name: "amount",
              in: "query",
              required: true,
              type: "integer",
              description: "Valor do pagamento em centavos",
            },
          ],
          responses: [
            {
              status: 200,
              description: "Notificação recebida com sucesso",
              example: {
                message: "Notification received successfully",
              },
            },
          ],
          requestExample: `curl -X GET "https://api.example.com/notify-pix?transaction_id=3fa85f64-5717-4562-b3fc-2c963f66afa6&status=approved&amount=10050"`,
        },
      ],
    },
    {
      id: "payouts",
      title: "Transferências",
      description:
        "Endpoints para validação de chaves PIX e realização de transferências",
      endpoints: [
        {
          id: "validatePixKey",
          method: "POST",
          path: "/validate",
          description:
            "Valida uma chave PIX antes de realizar uma transferência",
          authentication: "Bearer Token",
          parameters: [],
          headers: [
            {
              name: "Authorization",
              required: true,
              type: "string",
              description: "Bearer token obtido via endpoint de autenticação",
            },
            {
              name: "SellerId",
              required: true,
              type: "string",
              description: "ID do vendedor no formato GUID",
            },
            {
              name: "Content-Type",
              required: true,
              type: "string",
              description: "application/json",
            },
          ],
          body: {
            type: "object",
            properties: [
              {
                name: "pixKeyType",
                type: "string",
                required: true,
                description:
                  "Tipo da chave PIX (CPF, CNPJ, EMAIL, PHONE, RANDOM)",
              },
              {
                name: "pixKeyValue",
                type: "string",
                required: true,
                description: "Valor da chave PIX",
              },
            ],
          },
          responses: [
            {
              status: 200,
              description: "Chave PIX validada com sucesso",
              example: {
                data: {
                  keyType: "CPF",
                  keyValue: "12345678900",
                  bankName: "Banco Exemplo",
                  accountHolderName: "Nome do Titular",
                  documentType: "CPF",
                  documentValue: "123.456.789-00",
                  isValid: true,
                },
                statusCode: 200,
                message: "Chave PIX validada com sucesso",
              },
            },
            {
              status: 400,
              description: "Chave PIX inválida",
              example: {
                statusCode: 400,
                message: "Chave PIX inválida ou não encontrada",
              },
            },
            {
              status: 500,
              description: "Erro interno",
              example: {
                statusCode: 500,
                message:
                  "Ocorreu um erro interno ao processar sua solicitação.",
              },
            },
          ],
          requestExample: `curl -X POST https://api.example.com/validate \\
  -H "Authorization: Bearer your_access_token" \\
  -H "SellerId: 3fa85f64-5717-4562-b3fc-2c963f66afa6" \\
  -H "Content-Type: application/json" \\
  -d '{
    "pixKeyType": "CPF",
    "pixKeyValue": "12345678900"
  }'`,
        },
        {
          id: "createPayment",
          method: "POST",
          path: "/payment",
          description: "Realiza uma transferência PIX para outra conta",
          authentication: "Bearer Token",
          parameters: [],
          headers: [
            {
              name: "Authorization",
              required: true,
              type: "string",
              description: "Bearer token obtido via endpoint de autenticação",
            },
            {
              name: "SellerId",
              required: true,
              type: "string",
              description: "ID do vendedor no formato GUID",
            },
            {
              name: "Content-Type",
              required: true,
              type: "string",
              description: "application/json",
            },
          ],
          body: {
            type: "object",
            properties: [
              {
                name: "amount",
                type: "number",
                required: true,
                description: "Valor a ser transferido",
              },
              {
                name: "description",
                type: "string",
                required: true,
                description: "Descrição da transferência",
              },
              {
                name: "pixKeyType",
                type: "string",
                required: true,
                description:
                  "Tipo da chave PIX (CPF, CNPJ, EMAIL, PHONE, RANDOM)",
              },
              {
                name: "pixKeyValue",
                type: "string",
                required: true,
                description: "Valor da chave PIX",
              },
              {
                name: "recipientName",
                type: "string",
                required: true,
                description: "Nome do destinatário",
              },
              {
                name: "recipientDocument",
                type: "string",
                required: true,
                description: "CPF/CNPJ do destinatário",
              },
              {
                name: "externalReference",
                type: "string",
                required: false,
                description: "Referência externa para controle do cliente",
              },
            ],
          },
          responses: [
            {
              status: 201,
              description: "Transferência criada com sucesso",
              example: {
                data: {
                  id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                  amount: 100.5,
                  description: "Pagamento para Fornecedor XYZ",
                  status: "Pending",
                  pixKeyType: "CPF",
                  pixKeyValue: "12345678900",
                  recipientName: "Nome do Destinatário",
                  recipientDocument: "123.456.789-00",
                  externalReference: "REF-001",
                  createdAt: "2023-12-15T10:30:00Z",
                },
                statusCode: 201,
                message: "Pagamento criado com sucesso",
              },
            },
            {
              status: 400,
              description: "Requisição inválida",
              example: {
                statusCode: 400,
                message: "Dados de pagamento inválidos",
              },
            },
            {
              status: 409,
              description: "Conflito",
              example: {
                statusCode: 409,
                message: "Já existe um pagamento com essa referência externa",
              },
            },
            {
              status: 500,
              description: "Erro interno",
              example: {
                statusCode: 500,
                message:
                  "Ocorreu um erro interno ao processar sua solicitação.",
              },
            },
          ],
          requestExample: `curl -X POST https://api.example.com/payment \\
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
        {
          id: "getPayment",
          method: "GET",
          path: "/payment/{id}",
          description: "Consulta o status de uma transferência",
          authentication: "Bearer Token",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              type: "guid",
              description: "ID único do pagamento",
            },
          ],
          headers: [
            {
              name: "Authorization",
              required: true,
              type: "string",
              description: "Bearer token obtido via endpoint de autenticação",
            },
            {
              name: "SellerId",
              required: true,
              type: "string",
              description: "ID do vendedor no formato GUID",
            },
          ],
          responses: [
            {
              status: 200,
              description: "Consulta realizada com sucesso",
              example: {
                data: {
                  id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                  amount: 100.5,
                  description: "Pagamento para Fornecedor XYZ",
                  status: "Completed",
                  pixKeyType: "CPF",
                  pixKeyValue: "12345678900",
                  recipientName: "Nome do Destinatário",
                  recipientDocument: "123.456.789-00",
                  externalReference: "REF-001",
                  createdAt: "2023-12-15T10:30:00Z",
                  completedAt: "2023-12-15T10:32:15Z",
                },
                statusCode: 200,
                message: "Dados do pagamento recuperados com sucesso",
              },
            },
            {
              status: 404,
              description: "Pagamento não encontrado",
              example: {
                statusCode: 404,
                message: "Pagamento não encontrado",
              },
            },
            {
              status: 500,
              description: "Erro interno",
              example: {
                statusCode: 500,
                message:
                  "Ocorreu um erro interno ao processar sua solicitação.",
              },
            },
          ],
          requestExample: `curl -X GET https://api.example.com/payment/3fa85f64-5717-4562-b3fc-2c963f66afa6 \\
  -H "Authorization: Bearer your_access_token" \\
  -H "SellerId: 3fa85f64-5717-4562-b3fc-2c963f66afa6"`,
        },
      ],
    },
    {
      id: "transactions",
      title: "Transações",
      description: "Endpoints para consulta e gerenciamento de transações",
      endpoints: [
        {
          id: "getTransactions",
          method: "GET",
          path: "/transactions",
          description: "Lista todas as transações do vendedor",
          authentication: "Bearer Token",
          parameters: [
            {
              name: "startDate",
              in: "query",
              required: false,
              type: "string",
              description: "Data de início para filtro (formato ISO 8601)",
            },
            {
              name: "endDate",
              in: "query",
              required: false,
              type: "string",
              description: "Data de fim para filtro (formato ISO 8601)",
            },
            {
              name: "status",
              in: "query",
              required: false,
              type: "string",
              description:
                "Status das transações (Pending, Completed, Failed, etc)",
            },
            {
              name: "page",
              in: "query",
              required: false,
              type: "integer",
              description: "Página para paginação (padrão: 1)",
            },
            {
              name: "pageSize",
              in: "query",
              required: false,
              type: "integer",
              description: "Tamanho da página para paginação (padrão: 20)",
            },
          ],
          headers: [
            {
              name: "Authorization",
              required: true,
              type: "string",
              description: "Bearer token obtido via endpoint de autenticação",
            },
            {
              name: "SellerId",
              required: true,
              type: "string",
              description: "ID do vendedor no formato GUID",
            },
          ],
          responses: [
            {
              status: 200,
              description: "Lista de transações retornada com sucesso",
              example: {
                data: [
                  {
                    id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                    type: "Payment",
                    amount: 100.5,
                    status: "Completed",
                    description: "Pagamento para Fornecedor XYZ",
                    createdAt: "2023-12-15T10:30:00Z",
                    completedAt: "2023-12-15T10:32:15Z",
                  },
                  {
                    id: "4fa85f64-5717-4562-b3fc-2c963f66afa7",
                    type: "Withdrawal",
                    amount: 50.0,
                    status: "Pending",
                    description: "Saque para conta bancária",
                    createdAt: "2023-12-16T14:20:00Z",
                    completedAt: null,
                  },
                ],
                pagination: {
                  currentPage: 1,
                  pageSize: 20,
                  totalCount: 2,
                  totalPages: 1,
                },
                statusCode: 200,
                message: "Transações recuperadas com sucesso",
              },
            },
            {
              status: 400,
              description: "Requisição inválida",
              example: {
                statusCode: 400,
                message: "Parâmetros de consulta inválidos",
              },
            },
            {
              status: 500,
              description: "Erro interno",
              example: {
                statusCode: 500,
                message:
                  "Ocorreu um erro interno ao processar sua solicitação.",
              },
            },
          ],
          requestExample: `curl -X GET "https://api.example.com/transactions?startDate=2023-12-01T00:00:00Z&endDate=2023-12-31T23:59:59Z&status=Completed&page=1&pageSize=20" \\
  -H "Authorization: Bearer your_access_token" \\
  -H "SellerId: 3fa85f64-5717-4562-b3fc-2c963f66afa6"`,
        },
        {
          id: "getTransaction",
          method: "GET",
          path: "/transaction/{id}",
          description: "Consulta os detalhes de uma transação específica",
          authentication: "Bearer Token",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              type: "guid",
              description: "ID único da transação",
            },
          ],
          headers: [
            {
              name: "Authorization",
              required: true,
              type: "string",
              description: "Bearer token obtido via endpoint de autenticação",
            },
            {
              name: "SellerId",
              required: true,
              type: "string",
              description: "ID do vendedor no formato GUID",
            },
          ],
          responses: [
            {
              status: 200,
              description: "Transação encontrada com sucesso",
              example: {
                data: {
                  id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                  type: "Payment",
                  amount: 100.5,
                  status: "Completed",
                  description: "Pagamento para Fornecedor XYZ",
                  recipientInfo: {
                    name: "Nome do Destinatário",
                    document: "123.456.789-00",
                    pixKeyType: "CPF",
                    pixKeyValue: "12345678900",
                  },
                  externalReference: "REF-001",
                  createdAt: "2023-12-15T10:30:00Z",
                  completedAt: "2023-12-15T10:32:15Z",
                },
                statusCode: 200,
                message: "Transação recuperada com sucesso",
              },
            },
            {
              status: 404,
              description: "Transação não encontrada",
              example: {
                statusCode: 404,
                message: "Transação não encontrada",
              },
            },
            {
              status: 500,
              description: "Erro interno",
              example: {
                statusCode: 500,
                message:
                  "Ocorreu um erro interno ao processar sua solicitação.",
              },
            },
          ],
          requestExample: `curl -X GET https://api.example.com/transaction/3fa85f64-5717-4562-b3fc-2c963f66afa6 \\
  -H "Authorization: Bearer your_access_token" \\
  -H "SellerId: 3fa85f64-5717-4562-b3fc-2c963f66afa6"`,
        },
      ],
    },
    {
      id: "webhooks",
      title: "Webhooks",
      description: "Endpoints para configuração e gerenciamento de webhooks",
      endpoints: [
        {
          id: "getWebhooks",
          method: "GET",
          path: "/webhooks",
          description: "Lista todos os webhooks configurados",
          authentication: "Bearer Token",
          parameters: [],
          headers: [
            {
              name: "Authorization",
              required: true,
              type: "string",
              description: "Bearer token obtido via endpoint de autenticação",
            },
            {
              name: "SellerId",
              required: true,
              type: "string",
              description: "ID do vendedor no formato GUID",
            },
          ],
          responses: [
            {
              status: 200,
              description: "Lista de webhooks retornada com sucesso",
              example: {
                data: [
                  {
                    id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                    url: "https://example.com/webhook",
                    events: ["payment.created", "payment.completed"],
                    isActive: true,
                    createdAt: "2023-01-15T10:30:00Z",
                  },
                  {
                    id: "4fa85f64-5717-4562-b3fc-2c963f66afa7",
                    url: "https://example.com/webhook2",
                    events: ["withdrawal.created", "withdrawal.completed"],
                    isActive: false,
                    createdAt: "2023-02-20T14:15:00Z",
                  },
                ],
                statusCode: 200,
                message: "Webhooks recuperados com sucesso",
              },
            },
            {
              status: 500,
              description: "Erro interno",
              example: {
                statusCode: 500,
                message:
                  "Ocorreu um erro interno ao processar sua solicitação.",
              },
            },
          ],
          requestExample: `curl -X GET https://api.example.com/webhooks \\
  -H "Authorization: Bearer your_access_token" \\
  -H "SellerId: 3fa85f64-5717-4562-b3fc-2c963f66afa6"`,
        },
        {
          id: "createWebhook",
          method: "POST",
          path: "/webhooks",
          description: "Cria uma nova configuração de webhook",
          authentication: "Bearer Token",
          parameters: [],
          headers: [
            {
              name: "Authorization",
              required: true,
              type: "string",
              description: "Bearer token obtido via endpoint de autenticação",
            },
            {
              name: "SellerId",
              required: true,
              type: "string",
              description: "ID do vendedor no formato GUID",
            },
            {
              name: "Content-Type",
              required: true,
              type: "string",
              description: "application/json",
            },
          ],
          body: {
            type: "object",
            properties: [
              {
                name: "url",
                type: "string",
                required: true,
                description: "URL para envio das notificações",
              },
              {
                name: "events",
                type: "array",
                required: true,
                description:
                  "Lista de eventos para os quais o webhook será acionado",
              },
              {
                name: "isActive",
                type: "boolean",
                required: false,
                description: "Indica se o webhook está ativo",
              },
            ],
          },
          responses: [
            {
              status: 201,
              description: "Webhook criado com sucesso",
              example: {
                data: {
                  id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                  url: "https://example.com/webhook",
                  events: ["payment.created", "payment.completed"],
                  isActive: true,
                  createdAt: "2023-12-15T10:30:00Z",
                },
                statusCode: 201,
                message: "Webhook criado com sucesso",
              },
            },
            {
              status: 400,
              description: "Requisição inválida",
              example: {
                statusCode: 400,
                message: "Dados de webhook inválidos",
              },
            },
            {
              status: 500,
              description: "Erro interno",
              example: {
                statusCode: 500,
                message:
                  "Ocorreu um erro interno ao processar sua solicitação.",
              },
            },
          ],
          requestExample: `curl -X POST https://api.example.com/webhooks \\
  -H "Authorization: Bearer your_access_token" \\
  -H "SellerId: 3fa85f64-5717-4562-b3fc-2c963f66afa6" \\
  -H "Content-Type: application/json" \\
  -d '{
    "url": "https://example.com/webhook",
    "events": ["payment.created", "payment.completed"],
    "isActive": true
  }'`,
        },
        {
          id: "testWebhook",
          method: "POST",
          path: "/webhook/{id}/test",
          description: "Envia um evento de teste para um webhook",
          authentication: "Bearer Token",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              type: "guid",
              description: "ID único do webhook",
            },
          ],
          headers: [
            {
              name: "Authorization",
              required: true,
              type: "string",
              description: "Bearer token obtido via endpoint de autenticação",
            },
            {
              name: "SellerId",
              required: true,
              type: "string",
              description: "ID do vendedor no formato GUID",
            },
            {
              name: "Content-Type",
              required: true,
              type: "string",
              description: "application/json",
            },
          ],
          body: {
            type: "object",
            properties: [
              {
                name: "eventType",
                type: "string",
                required: true,
                description: "Tipo do evento a ser testado",
              },
            ],
          },
          responses: [
            {
              status: 200,
              description: "Evento de teste enviado com sucesso",
              example: {
                statusCode: 200,
                message: "Evento de teste enviado com sucesso",
              },
            },
            {
              status: 404,
              description: "Webhook não encontrado",
              example: {
                statusCode: 404,
                message: "Webhook não encontrado",
              },
            },
            {
              status: 500,
              description: "Erro interno",
              example: {
                statusCode: 500,
                message:
                  "Ocorreu um erro interno ao processar sua solicitação.",
              },
            },
          ],
          requestExample: `curl -X POST https://api.example.com/webhook/3fa85f64-5717-4562-b3fc-2c963f66afa6/test \\
  -H "Authorization: Bearer your_access_token" \\
  -H "SellerId: 3fa85f64-5717-4562-b3fc-2c963f66afa6" \\
  -H "Content-Type: application/json" \\
  -d '{
    "eventType": "payment.completed"
  }'`,
        },
      ],
    },
  ];
}
