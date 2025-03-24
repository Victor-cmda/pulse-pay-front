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
            t.authentication.endpoints?.generateToken?.description ||
            "Gera um token de acesso OAuth 2.0 através de credenciais do cliente",
          authentication:
            t.authentication.endpoints?.generateToken?.authentication ||
            "Basic Auth (Client ID e Client Secret)",
          parameters: [],
          headers: [
            {
              name: "Authorization",
              required: true,
              type: "string",
              description:
                t.authentication.endpoints?.generateToken?.headers
                  ?.authorization ||
                "Basic authentication com Client ID e Client Secret codificados em Base64",
            },
          ],
          responses: [
            {
              status: 200,
              description:
                t.authentication.endpoints?.generateToken?.responses?.success ||
                "Token gerado com sucesso",
              example: {
                access_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                token_type: "Bearer",
                expires_in: 3600,
              },
            },
            {
              status: 401,
              description:
                t.authentication.endpoints?.generateToken?.responses
                  ?.unauthorized || "Credenciais inválidas ou ausentes",
              example: { message: "Invalid credentials" },
            },
          ],
          requestExample:
            t.authentication.endpoints?.generateToken?.requestExample ||
            `curl -X POST https://pulsepay.technocenterinformatica.com.br/sandbox/oauth/v2/token \\
    -H "Authorization: Basic eW91cl9jbGllbnRfaWQ6eW91cl9jbGllbnRfc2VjcmV0" \\
    -H "Content-Type: application/json"`,
        },
      ],
    },
    {
      id: "payments",
      title: t.payments?.title || "Pagamentos",
      description:
        t.payments?.description ||
        "Endpoints para geração e consulta de pagamentos",
      endpoints: [
        {
          id: "pixPayment",
          method: "POST",
          path: "/pix",
          description:
            t.payments?.endpoints?.pixPayment?.description ||
            "Gera um pagamento via PIX",
          authentication: t.common?.authentication?.bearer || "Bearer Token",
          parameters: [],
          headers: [
            {
              name: "Authorization",
              required: true,
              type: "string",
              description:
                t.common?.headers?.authorization ||
                "Bearer token obtido via endpoint de autenticação",
            },
            {
              name: "SellerId",
              required: true,
              type: "string",
              description:
                t.common?.headers?.sellerId || "ID do vendedor no formato GUID",
            },
            {
              name: "Content-Type",
              required: true,
              type: "string",
              description: t.common?.headers?.contentType || "application/json",
            },
          ],
          body: {
            type: "object",
            properties: [
              {
                name: "amount",
                type: "number",
                required: true,
                description:
                  t.payments?.endpoints?.pixPayment?.body?.amount ||
                  "Valor do pagamento",
              },
              {
                name: "description",
                type: "string",
                required: true,
                description:
                  t.payments?.endpoints?.pixPayment?.body?.description ||
                  "Descrição do pagamento",
              },
              {
                name: "expirationDate",
                type: "string",
                required: false,
                description:
                  t.payments?.endpoints?.pixPayment?.body?.expirationDate ||
                  "Data de expiração do pagamento (formato ISO 8601)",
              },
              {
                name: "callbackUrl",
                type: "string",
                required: false,
                description:
                  t.payments?.endpoints?.pixPayment?.body?.callbackUrl ||
                  "URL para receber notificações de status do pagamento",
              },
            ],
          },
          responses: [
            {
              status: 200,
              description:
                t.payments?.endpoints?.pixPayment?.responses?.success ||
                "Pagamento processado com sucesso",
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
              description:
                t.payments?.endpoints?.pixPayment?.responses?.badRequest ||
                "Requisição inválida",
              example: { error: "Invalid request parameters" },
            },
            {
              status: 401,
              description:
                t.payments?.endpoints?.pixPayment?.responses?.unauthorized ||
                "Autenticação falhou",
              example: { error: "Unauthorized access" },
            },
          ],
          requestExample:
            t.payments?.endpoints?.pixPayment?.requestExample ||
            `curl -X POST https://pulsepay.technocenterinformatica.com.br/sandbox/pix \\
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
          description:
            t.payments?.endpoints?.boletoPayment?.description ||
            "Emite um boleto bancário para pagamento",
          authentication: t.common?.authentication?.bearer || "Bearer Token",
          parameters: [],
          headers: [
            {
              name: "Authorization",
              required: true,
              type: "string",
              description:
                t.common?.headers?.authorization ||
                "Bearer token obtido via endpoint de autenticação",
            },
            {
              name: "SellerId",
              required: true,
              type: "string",
              description:
                t.common?.headers?.sellerId || "ID do vendedor no formato GUID",
            },
            {
              name: "Content-Type",
              required: true,
              type: "string",
              description: t.common?.headers?.contentType || "application/json",
            },
          ],
          body: {
            type: "object",
            properties: [
              {
                name: "amount",
                type: "number",
                required: true,
                description:
                  t.payments?.endpoints?.boletoPayment?.body?.amount ||
                  "Valor do boleto",
              },
              {
                name: "description",
                type: "string",
                required: true,
                description:
                  t.payments?.endpoints?.boletoPayment?.body?.description ||
                  "Descrição do pagamento",
              },
              {
                name: "customerName",
                type: "string",
                required: true,
                description:
                  t.payments?.endpoints?.boletoPayment?.body?.customerName ||
                  "Nome do cliente/pagador",
              },
              {
                name: "customerDocument",
                type: "string",
                required: true,
                description:
                  t.payments?.endpoints?.boletoPayment?.body
                    ?.customerDocument || "CPF/CNPJ do cliente/pagador",
              },
              {
                name: "dueDate",
                type: "string",
                required: true,
                description:
                  t.payments?.endpoints?.boletoPayment?.body?.dueDate ||
                  "Data de vencimento do boleto (formato ISO 8601)",
              },
              {
                name: "callbackUrl",
                type: "string",
                required: false,
                description:
                  t.payments?.endpoints?.boletoPayment?.body?.callbackUrl ||
                  "URL para receber notificações de status do pagamento",
              },
            ],
          },
          responses: [
            {
              status: 200,
              description:
                t.payments?.endpoints?.boletoPayment?.responses?.success ||
                "Boleto gerado com sucesso",
              example: {
                message: "Boleto bancário gerado com sucesso",
                details: {
                  bankSlipId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                  barcode:
                    "34191.79001 01043.510047 91020.150008 5 88790000029999",
                  pdfUrl:
                    "https://pulsepay.technocenterinformatica.com.br/sandbox/boleto/3fa85f64-5717-4562-b3fc-2c963f66afa6/pdf",
                },
              },
            },
            {
              status: 400,
              description:
                t.payments?.endpoints?.boletoPayment?.responses?.badRequest ||
                "Requisição inválida",
              example: { error: "Invalid request parameters" },
            },
            {
              status: 401,
              description:
                t.payments?.endpoints?.boletoPayment?.responses?.unauthorized ||
                "Autenticação falhou",
              example: { error: "Unauthorized access" },
            },
          ],
          requestExample:
            t.payments?.endpoints?.boletoPayment?.requestExample ||
            `curl -X POST https://pulsepay.technocenterinformatica.com.br/sandbox/boleto \\
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
          description:
            t.payments?.endpoints?.boletoPdf?.description ||
            "Obtém o PDF de um boleto bancário gerado anteriormente",
          authentication: t.common?.authentication?.bearer || "Bearer Token",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              type: "string",
              description:
                t.payments?.endpoints?.boletoPdf?.parameters?.id ||
                "ID do boleto bancário",
            },
          ],
          headers: [
            {
              name: "Authorization",
              required: true,
              type: "string",
              description:
                t.common?.headers?.authorization ||
                "Bearer token obtido via endpoint de autenticação",
            },
            {
              name: "SellerId",
              required: true,
              type: "string",
              description:
                t.common?.headers?.sellerId || "ID do vendedor no formato GUID",
            },
          ],
          responses: [
            {
              status: 200,
              description:
                t.payments?.endpoints?.boletoPdf?.responses?.success ||
                "PDF do boleto retornado com sucesso",
              example: "PDF Document (binary)",
            },
            {
              status: 404,
              description:
                t.payments?.endpoints?.boletoPdf?.responses?.notFound ||
                "Boleto não encontrado",
              example: { message: "Bank slip not found" },
            },
            {
              status: 400,
              description:
                t.payments?.endpoints?.boletoPdf?.responses?.badRequest ||
                "Requisição inválida",
              example: { error: "Error message" },
            },
          ],
          requestExample:
            t.payments?.endpoints?.boletoPdf?.requestExample ||
            `curl -X GET https://pulsepay.technocenterinformatica.com.br/sandbox/boleto/3fa85f64-5717-4562-b3fc-2c963f66afa6/pdf \\
    -H "Authorization: Bearer your_access_token" \\
    -H "SellerId: 3fa85f64-5717-4562-b3fc-2c963f66afa6" \\
    --output boleto.pdf`,
        },
        {
          id: "notifyPix",
          method: "GET",
          path: "/notify-pix",
          description:
            t.payments?.endpoints?.notifyPix?.description ||
            "Recebe notificação de pagamento PIX",
          authentication: t.common?.authentication?.none || "None",
          parameters: [
            {
              name: "transaction_id",
              in: "query",
              required: true,
              type: "string",
              description:
                t.payments?.endpoints?.notifyPix?.parameters?.transactionId ||
                "ID da transação PIX",
            },
            {
              name: "status",
              in: "query",
              required: true,
              type: "string",
              description:
                t.payments?.endpoints?.notifyPix?.parameters?.status ||
                "Status da transação (approved, rejected, etc)",
            },
            {
              name: "amount",
              in: "query",
              required: true,
              type: "integer",
              description:
                t.payments?.endpoints?.notifyPix?.parameters?.amount ||
                "Valor do pagamento em centavos",
            },
          ],
          responses: [
            {
              status: 200,
              description:
                t.payments?.endpoints?.notifyPix?.responses?.success ||
                "Notificação recebida com sucesso",
              example: {
                message: "Notification received successfully",
              },
            },
          ],
          requestExample:
            t.payments?.endpoints?.notifyPix?.requestExample ||
            `curl -X GET "https://pulsepay.technocenterinformatica.com.br/sandbox/notify-pix?transaction_id=3fa85f64-5717-4562-b3fc-2c963f66afa6&status=approved&amount=10050"`,
        },
      ],
    },
    {
      id: "payouts",
      title: t.payouts.title,
      description: t.payouts.description,
      endpoints: [
        {
          id: "validatePixKey",
          method: "POST",
          path: "/validate",
          description: t.payouts.validatePixKey.description,
          authentication: t.common?.authentication?.bearer || "Bearer Token",
          parameters: [],
          headers: [
            {
              name: "Authorization",
              required: true,
              type: "string",
              description:
                t.common?.headers?.authorization ||
                "Bearer token obtido via endpoint de autenticação",
            },
            {
              name: "SellerId",
              required: true,
              type: "string",
              description:
                t.common?.headers?.sellerId || "ID do vendedor no formato GUID",
            },
            {
              name: "Content-Type",
              required: true,
              type: "string",
              description: t.common?.headers?.contentType || "application/json",
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
                  t.payouts?.endpoints?.validatePixKey?.body?.pixKeyType ||
                  "Tipo da chave PIX (CPF, CNPJ, EMAIL, PHONE, RANDOM)",
              },
              {
                name: "pixKeyValue",
                type: "string",
                required: true,
                description:
                  t.payouts?.endpoints?.validatePixKey?.body?.pixKeyValue ||
                  "Valor da chave PIX",
              },
            ],
          },
          responses: [
            {
              status: 200,
              description:
                t.payouts?.endpoints?.validatePixKey?.responses?.success ||
                "Chave PIX validada com sucesso",
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
              description:
                t.payouts?.endpoints?.validatePixKey?.responses?.badRequest ||
                "Chave PIX inválida",
              example: {
                statusCode: 400,
                message: "Chave PIX inválida ou não encontrada",
              },
            },
            {
              status: 500,
              description:
                t.payouts?.endpoints?.validatePixKey?.responses?.serverError ||
                "Erro interno",
              example: {
                statusCode: 500,
                message:
                  "Ocorreu um erro interno ao processar sua solicitação.",
              },
            },
          ],
          requestExample:
            t.payouts?.endpoints?.validatePixKey?.requestExample ||
            `curl -X POST https://pulsepay.technocenterinformatica.com.br/sandbox/validate \\
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
          description: t.payouts.createPayment.description,
          authentication: t.common?.authentication?.bearer || "Bearer Token",
          parameters: [],
          headers: [
            {
              name: "Authorization",
              required: true,
              type: "string",
              description:
                t.common?.headers?.authorization ||
                "Bearer token obtido via endpoint de autenticação",
            },
            {
              name: "SellerId",
              required: true,
              type: "string",
              description:
                t.common?.headers?.sellerId || "ID do vendedor no formato GUID",
            },
            {
              name: "Content-Type",
              required: true,
              type: "string",
              description: t.common?.headers?.contentType || "application/json",
            },
          ],
          body: {
            type: "object",
            properties: [
              {
                name: "amount",
                type: "number",
                required: true,
                description:
                  t.payouts?.endpoints?.createPayment?.body?.amount ||
                  "Valor a ser transferido",
              },
              {
                name: "description",
                type: "string",
                required: true,
                description:
                  t.payouts?.endpoints?.createPayment?.body?.description ||
                  "Descrição da transferência",
              },
              {
                name: "pixKeyType",
                type: "string",
                required: true,
                description:
                  t.payouts?.endpoints?.createPayment?.body?.pixKeyType ||
                  "Tipo da chave PIX (CPF, CNPJ, EMAIL, PHONE, RANDOM)",
              },
              {
                name: "pixKeyValue",
                type: "string",
                required: true,
                description:
                  t.payouts?.endpoints?.createPayment?.body?.pixKeyValue ||
                  "Valor da chave PIX",
              },
              {
                name: "recipientName",
                type: "string",
                required: true,
                description:
                  t.payouts?.endpoints?.createPayment?.body?.recipientName ||
                  "Nome do destinatário",
              },
              {
                name: "recipientDocument",
                type: "string",
                required: true,
                description:
                  t.payouts?.endpoints?.createPayment?.body
                    ?.recipientDocument || "CPF/CNPJ do destinatário",
              },
              {
                name: "externalReference",
                type: "string",
                required: false,
                description:
                  t.payouts?.endpoints?.createPayment?.body
                    ?.externalReference ||
                  "Referência externa para controle do cliente",
              },
            ],
          },
          responses: [
            {
              status: 201,
              description:
                t.payouts?.endpoints?.createPayment?.responses?.created ||
                "Transferência criada com sucesso",
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
              description:
                t.payouts?.endpoints?.createPayment?.responses?.badRequest ||
                "Requisição inválida",
              example: {
                statusCode: 400,
                message: "Dados de pagamento inválidos",
              },
            },
            {
              status: 409,
              description:
                t.payouts?.endpoints?.createPayment?.responses?.conflict ||
                "Conflito",
              example: {
                statusCode: 409,
                message: "Já existe um pagamento com essa referência externa",
              },
            },
            {
              status: 500,
              description:
                t.payouts?.endpoints?.createPayment?.responses?.serverError ||
                "Erro interno",
              example: {
                statusCode: 500,
                message:
                  "Ocorreu um erro interno ao processar sua solicitação.",
              },
            },
          ],
          requestExample:
            t.payouts?.endpoints?.createPayment?.requestExample ||
            `curl -X POST https://pulsepay.technocenterinformatica.com.br/sandbox/payment \\
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
          description: t.payouts.getPayment.description,
          authentication: t.common?.authentication?.bearer || "Bearer Token",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              type: "guid",
              description:
                t.payouts?.endpoints?.getPayment?.parameters?.id ||
                "ID único do pagamento",
            },
          ],
          headers: [
            {
              name: "Authorization",
              required: true,
              type: "string",
              description:
                t.common?.headers?.authorization ||
                "Bearer token obtido via endpoint de autenticação",
            },
            {
              name: "SellerId",
              required: true,
              type: "string",
              description:
                t.common?.headers?.sellerId || "ID do vendedor no formato GUID",
            },
          ],
          responses: [
            {
              status: 200,
              description:
                t.payouts?.endpoints?.getPayment?.responses?.success ||
                "Consulta realizada com sucesso",
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
              description:
                t.payouts?.endpoints?.getPayment?.responses?.notFound ||
                "Pagamento não encontrado",
              example: {
                statusCode: 404,
                message: "Pagamento não encontrado",
              },
            },
            {
              status: 500,
              description:
                t.payouts?.endpoints?.getPayment?.responses?.serverError ||
                "Erro interno",
              example: {
                statusCode: 500,
                message:
                  "Ocorreu um erro interno ao processar sua solicitação.",
              },
            },
          ],
          requestExample:
            t.payouts?.endpoints?.getPayment?.requestExample ||
            `curl -X GET https://pulsepay.technocenterinformatica.com.br/sandbox/payment/3fa85f64-5717-4562-b3fc-2c963f66afa6 \\
    -H "Authorization: Bearer your_access_token" \\
    -H "SellerId: 3fa85f64-5717-4562-b3fc-2c963f66afa6"`,
        },
      ],
    },
    {
      id: "transactions",
      title: t.transactions?.title || "Transações",
      description:
        t.transactions?.description ||
        "Endpoints para consulta e gerenciamento de transações",
      endpoints: [
        {
          id: "getTransactions",
          method: "GET",
          path: "/transactions",
          description:
            t.transactions?.endpoints?.getTransactions?.description ||
            "Lista todas as transações do vendedor",
          authentication: t.common?.authentication?.bearer || "Bearer Token",
          parameters: [
            {
              name: "startDate",
              in: "query",
              required: false,
              type: "string",
              description:
                t.transactions?.endpoints?.getTransactions?.parameters
                  ?.startDate ||
                "Data de início para filtro (formato ISO 8601)",
            },
            {
              name: "endDate",
              in: "query",
              required: false,
              type: "string",
              description:
                t.transactions?.endpoints?.getTransactions?.parameters
                  ?.endDate || "Data de fim para filtro (formato ISO 8601)",
            },
            {
              name: "status",
              in: "query",
              required: false,
              type: "string",
              description:
                t.transactions?.endpoints?.getTransactions?.parameters
                  ?.status ||
                "Status das transações (Pending, Completed, Failed, etc)",
            },
            {
              name: "page",
              in: "query",
              required: false,
              type: "integer",
              description:
                t.transactions?.endpoints?.getTransactions?.parameters?.page ||
                "Página para paginação (padrão: 1)",
            },
            {
              name: "pageSize",
              in: "query",
              required: false,
              type: "integer",
              description:
                t.transactions?.endpoints?.getTransactions?.parameters
                  ?.pageSize || "Tamanho da página para paginação (padrão: 20)",
            },
          ],
          headers: [
            {
              name: "Authorization",
              required: true,
              type: "string",
              description:
                t.common?.headers?.authorization ||
                "Bearer token obtido via endpoint de autenticação",
            },
            {
              name: "SellerId",
              required: true,
              type: "string",
              description:
                t.common?.headers?.sellerId || "ID do vendedor no formato GUID",
            },
          ],
          responses: [
            {
              status: 200,
              description:
                t.transactions?.endpoints?.getTransactions?.responses
                  ?.success || "Lista de transações retornada com sucesso",
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
              description:
                t.transactions?.endpoints?.getTransactions?.responses
                  ?.badRequest || "Requisição inválida",
              example: {
                statusCode: 400,
                message: "Parâmetros de consulta inválidos",
              },
            },
            {
              status: 500,
              description:
                t.transactions?.endpoints?.getTransactions?.responses
                  ?.serverError || "Erro interno",
              example: {
                statusCode: 500,
                message:
                  "Ocorreu um erro interno ao processar sua solicitação.",
              },
            },
          ],
          requestExample:
            t.transactions?.endpoints?.getTransactions?.requestExample ||
            `curl -X GET "https://pulsepay.technocenterinformatica.com.br/sandbox/transactions?startDate=2023-12-01T00:00:00Z&endDate=2023-12-31T23:59:59Z&status=Completed&page=1
            -H "Authorization: Bearer your_access_token" \\
 -H "SellerId: 3fa85f64-5717-4562-b3fc-2c963f66afa6"`,
        },
        {
          id: "getTransaction",
          method: "GET",
          path: "/transaction/{id}",
          description:
            t.transactions?.endpoints?.getTransaction?.description ||
            "Consulta os detalhes de uma transação específica",
          authentication: t.common?.authentication?.bearer || "Bearer Token",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              type: "guid",
              description:
                t.transactions?.endpoints?.getTransaction?.parameters?.id ||
                "ID único da transação",
            },
          ],
          headers: [
            {
              name: "Authorization",
              required: true,
              type: "string",
              description:
                t.common?.headers?.authorization ||
                "Bearer token obtido via endpoint de autenticação",
            },
            {
              name: "SellerId",
              required: true,
              type: "string",
              description:
                t.common?.headers?.sellerId || "ID do vendedor no formato GUID",
            },
          ],
          responses: [
            {
              status: 200,
              description:
                t.transactions?.endpoints?.getTransaction?.responses?.success ||
                "Transação encontrada com sucesso",
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
              description:
                t.transactions?.endpoints?.getTransaction?.responses
                  ?.notFound || "Transação não encontrada",
              example: {
                statusCode: 404,
                message: "Transação não encontrada",
              },
            },
            {
              status: 500,
              description:
                t.transactions?.endpoints?.getTransaction?.responses
                  ?.serverError || "Erro interno",
              example: {
                statusCode: 500,
                message:
                  "Ocorreu um erro interno ao processar sua solicitação.",
              },
            },
          ],
          requestExample:
            t.transactions?.endpoints?.getTransaction?.requestExample ||
            `curl -X GET https://pulsepay.technocenterinformatica.com.br/sandbox/transaction/3fa85f64-5717-4562-b3fc-2c963f66afa6 \\
 -H "Authorization: Bearer your_access_token" \\
 -H "SellerId: 3fa85f64-5717-4562-b3fc-2c963f66afa6"`,
        },
      ],
    },
    {
      id: "webhooks",
      title: t.webhooks?.title || "Webhooks",
      description:
        t.webhooks?.description ||
        "Endpoints para configuração e gerenciamento de webhooks",
      endpoints: [
        {
          id: "getWebhooks",
          method: "GET",
          path: "/webhooks",
          description:
            t.webhooks?.endpoints?.getWebhooks?.description ||
            "Lista todos os webhooks configurados",
          authentication: t.common?.authentication?.bearer || "Bearer Token",
          parameters: [],
          headers: [
            {
              name: "Authorization",
              required: true,
              type: "string",
              description:
                t.common?.headers?.authorization ||
                "Bearer token obtido via endpoint de autenticação",
            },
            {
              name: "SellerId",
              required: true,
              type: "string",
              description:
                t.common?.headers?.sellerId || "ID do vendedor no formato GUID",
            },
          ],
          responses: [
            {
              status: 200,
              description:
                t.webhooks?.endpoints?.getWebhooks?.responses?.success ||
                "Lista de webhooks retornada com sucesso",
              example: {
                "data": [
                  {
                    "id": "456oc8d8-13e0-4db8-92b5-8dc54a433a97",
                    "customer_id": "2985746",
                    "transaction_id": "193846",
                    "amount": "213.21",
                    "status": "paid",
                    "type": "payment",
                    "payment_status": "paid",
                    "exchange": "5.52"
                  }
                ],
                "statusCode": 200,
                "message": "Webhooks recuperados com sucesso"
              }
            },
            {
              status: 500,
              description:
                t.webhooks?.endpoints?.getWebhooks?.responses?.serverError ||
                "Erro interno",
              example: {
                statusCode: 500,
                message:
                  "Ocorreu um erro interno ao processar sua solicitação.",
              },
            },
          ],
          requestExample:
            t.webhooks?.endpoints?.getWebhooks?.requestExample ||
            `curl -X GET https://pulsepay.technocenterinformatica.com.br/sandbox/webhooks \\
 -H "Authorization: Bearer your_access_token" \\
 -H "SellerId: 3fa85f64-5717-4562-b3fc-2c963f66afa6"`,
        },
        {
          id: "createWebhook",
          method: "POST",
          path: "/webhooks",
          description:
            t.webhooks?.endpoints?.createWebhook?.description ||
            "Cria uma nova configuração de webhook",
          authentication: t.common?.authentication?.bearer || "Bearer Token",
          parameters: [],
          headers: [
            {
              name: "Authorization",
              required: true,
              type: "string",
              description:
                t.common?.headers?.authorization ||
                "Bearer token obtido via endpoint de autenticação",
            },
            {
              name: "SellerId",
              required: true,
              type: "string",
              description:
                t.common?.headers?.sellerId || "ID do vendedor no formato GUID",
            },
            {
              name: "Content-Type",
              required: true,
              type: "string",
              description: t.common?.headers?.contentType || "application/json",
            },
          ],
          body: {
            type: "object",
            properties: [
              {
                name: "url",
                type: "string",
                required: true,
                description:
                  t.webhooks?.endpoints?.createWebhook?.body?.url ||
                  "URL para envio das notificações",
              },
              {
                name: "events",
                type: "array",
                required: true,
                description:
                  t.webhooks?.endpoints?.createWebhook?.body?.events ||
                  "Lista de eventos para os quais o webhook será acionado",
              },
              {
                name: "isActive",
                type: "boolean",
                required: false,
                description:
                  t.webhooks?.endpoints?.createWebhook?.body?.isActive ||
                  "Indica se o webhook está ativo",
              },
            ],
          },
          responses: [
            {
              status: 201,
              description:
                t.webhooks?.endpoints?.createWebhook?.responses?.created ||
                "Webhook criado com sucesso",
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
              description:
                t.webhooks?.endpoints?.createWebhook?.responses?.badRequest ||
                "Requisição inválida",
              example: {
                statusCode: 400,
                message: "Dados de webhook inválidos",
              },
            },
            {
              status: 500,
              description:
                t.webhooks?.endpoints?.createWebhook?.responses?.serverError ||
                "Erro interno",
              example: {
                statusCode: 500,
                message:
                  "Ocorreu um erro interno ao processar sua solicitação.",
              },
            },
          ],
          requestExample:
            t.webhooks?.endpoints?.createWebhook?.requestExample ||
            `curl -X POST https://pulsepay.technocenterinformatica.com.br/sandbox/webhooks \\
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
          description:
            t.webhooks?.endpoints?.testWebhook?.description ||
            "Envia um evento de teste para um webhook",
          authentication: t.common?.authentication?.bearer || "Bearer Token",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              type: "guid",
              description:
                t.webhooks?.endpoints?.testWebhook?.parameters?.id ||
                "ID único do webhook",
            },
          ],
          headers: [
            {
              name: "Authorization",
              required: true,
              type: "string",
              description:
                t.common?.headers?.authorization ||
                "Bearer token obtido via endpoint de autenticação",
            },
            {
              name: "SellerId",
              required: true,
              type: "string",
              description:
                t.common?.headers?.sellerId || "ID do vendedor no formato GUID",
            },
            {
              name: "Content-Type",
              required: true,
              type: "string",
              description: t.common?.headers?.contentType || "application/json",
            },
          ],
          body: {
            type: "object",
            properties: [
              {
                name: "eventType",
                type: "string",
                required: true,
                description:
                  t.webhooks?.endpoints?.testWebhook?.body?.eventType ||
                  "Tipo do evento a ser testado",
              },
            ],
          },
          responses: [
            {
              status: 200,
              description:
                t.webhooks?.endpoints?.testWebhook?.responses?.success ||
                "Evento de teste enviado com sucesso",
              example: {
                statusCode: 200,
                message: "Evento de teste enviado com sucesso",
              },
            },
            {
              status: 404,
              description:
                t.webhooks?.endpoints?.testWebhook?.responses?.notFound ||
                "Webhook não encontrado",
              example: {
                statusCode: 404,
                message: "Webhook não encontrado",
              },
            },
            {
              status: 500,
              description:
                t.webhooks?.endpoints?.testWebhook?.responses?.serverError ||
                "Erro interno",
              example: {
                statusCode: 500,
                message:
                  "Ocorreu um erro interno ao processar sua solicitação.",
              },
            },
          ],
          requestExample:
            t.webhooks?.endpoints?.testWebhook?.requestExample ||
            `curl -X POST https://pulsepay.technocenterinformatica.com.br/sandbox/webhook/3fa85f64-5717-4562-b3fc-2c963f66afa6/test \\
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
