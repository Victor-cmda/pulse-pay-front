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
            "Generate an OAuth 2.0 access token using client credentials",
          authentication:
            t.authentication.endpoints?.generateToken?.authentication ||
            "Basic Auth (Client ID and Client Secret)",
          parameters: [],
          headers: [
            {
              name: "Authorization",
              required: true,
              type: "string",
              description:
                t.authentication.endpoints?.generateToken?.headers
                  ?.authorization ||
                "Basic authentication with Client ID and Client Secret encoded in Base64",
            },
          ],
          responses: [
            {
              status: 200,
              description:
                t.authentication.endpoints?.generateToken?.responses?.success ||
                "Token generated successfully",
              example: {
                accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                expiresIn: 3600,
              },
            },
            {
              status: 401,
              description:
                t.authentication.endpoints?.generateToken?.responses
                  ?.unauthorized || "Invalid or missing credentials",
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
      title: t.payments?.title || "Payments",
      description:
        t.payments?.description ||
        "Endpoints for generating and querying payments",
      endpoints: [
        {
          id: "pixPayment",
          method: "POST",
          path: "/pix",
          description:
            t.payments?.endpoints?.pixPayment?.description ||
            "Generate a payment via PIX",
          authentication: t.common?.authentication?.bearer || "Bearer Token",
          parameters: [],
          headers: [
            {
              name: "Authorization",
              required: true,
              type: "string",
              description:
                t.common?.headers?.authorization ||
                "Bearer token obtained via authentication endpoint",
            },
            {
              name: "SellerId",
              required: true,
              type: "string",
              description:
                t.common?.headers?.sellerId || "Seller ID in GUID format",
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
                  "Payment amount",
              },
              {
                name: "description",
                type: "string",
                required: true,
                description:
                  t.payments?.endpoints?.pixPayment?.body?.description ||
                  "Payment description",
              },
              {
                name: "expirationDate",
                type: "string",
                required: false,
                description:
                  t.payments?.endpoints?.pixPayment?.body?.expirationDate ||
                  "Payment expiration date (ISO 8601 format)",
              },
              {
                name: "callbackUrl",
                type: "string",
                required: false,
                description:
                  t.payments?.endpoints?.pixPayment?.body?.callbackUrl ||
                  "URL to receive payment status notifications",
              },
            ],
          },
          responses: [
            {
              status: 200,
              description:
                t.payments?.endpoints?.pixPayment?.responses?.success ||
                "Payment processed successfully",
              example: {
                message: "Payment processed successfully",
                details: {
                  paymentId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                  qrCode:
                    "00020101021226890014br.gov.bcb.pix2557brcode.example.com/pix/v2/cobv/9d36b84fc70b428ca84f8cc95e9ac3a4...",
                  status: "Pending",
                  transactionId: "06001000000013274929612867402",
                  orderId: "2ab8ace1-21e4-4f01-86fe-ee433ff811c1",
                  expirationQrCode: "2023-12-31T23:59:59Z",
                },
              },
            },
            {
              status: 400,
              description:
                t.payments?.endpoints?.pixPayment?.responses?.badRequest ||
                "Invalid request",
              example: { error: "Invalid request parameters" },
            },
            {
              status: 401,
              description:
                t.payments?.endpoints?.pixPayment?.responses?.unauthorized ||
                "Authentication failed",
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
      "description": "Service payment",
      "expirationDate": "2023-12-31T23:59:59Z",
    }'`,
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
                "Bearer token obtained via authentication endpoint",
            },
            {
              name: "SellerId",
              required: true,
              type: "string",
              description:
                t.common?.headers?.sellerId || "Seller ID in GUID format",
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
                  "PIX key type (CPF, CNPJ, EMAIL, PHONE, RANDOM)",
              },
              {
                name: "pixKeyValue",
                type: "string",
                required: true,
                description:
                  t.payouts?.endpoints?.validatePixKey?.body?.pixKeyValue ||
                  "PIX key value",
              },
            ],
          },
          responses: [
            {
              status: 200,
              description:
                t.payouts?.endpoints?.validatePixKey?.responses?.success ||
                "Operation completed successfully.",
              example: {
                data: {
                  keyType: "CPF",
                  keyValue: "12345678900",
                  validationId: "CA36AEB163524AF9C5675472A977A98A",
                  errorMessage: null,
                  isValid: true,
                },
                statusCode: 200,
                message: "Operation completed successfully.",
              },
            },
            {
              status: 400,
              description:
                t.payouts?.endpoints?.validatePixKey?.responses?.badRequest ||
                "Invalid PIX key",
              example: {
                statusCode: 400,
                message: "Invalid or not found PIX key",
              },
            },
            {
              status: 500,
              description:
                t.payouts?.endpoints?.validatePixKey?.responses?.serverError ||
                "Internal error",
              example: {
                statusCode: 500,
                message:
                  "An internal error occurred while processing your request.",
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
                "Bearer token obtained via authentication endpoint",
            },
            {
              name: "SellerId",
              required: true,
              type: "string",
              description:
                t.common?.headers?.sellerId || "Seller ID in GUID format",
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
                  "Amount to be transferred",
              },
              {
                name: "description",
                type: "string",
                required: true,
                description:
                  t.payouts?.endpoints?.createPayment?.body?.description ||
                  "Transfer description",
              },
              {
                name: "pixKeyType",
                type: "string",
                required: true,
                description:
                  t.payouts?.endpoints?.createPayment?.body?.pixKeyType ||
                  "PIX key type (CPF, CNPJ, EMAIL, PHONE, RANDOM)",
              },
              {
                name: "pixKeyValue",
                type: "string",
                required: true,
                description:
                  t.payouts?.endpoints?.createPayment?.body?.pixKeyValue ||
                  "PIX key value",
              },
              {
                name: "recipientName",
                type: "string",
                required: true,
                description:
                  t.payouts?.endpoints?.createPayment?.body?.recipientName ||
                  "Recipient name",
              },
              {
                name: "recipientDocument",
                type: "string",
                required: true,
                description:
                  t.payouts?.endpoints?.createPayment?.body
                    ?.recipientDocument || "Recipient CPF/CNPJ",
              },
              {
                name: "externalReference",
                type: "string",
                required: false,
                description:
                  t.payouts?.endpoints?.createPayment?.body
                    ?.externalReference ||
                  "External reference for client control",
              },
            ],
          },
          responses: [
            {
              status: 200,
              description:
                t.payouts?.endpoints?.createPayment?.responses?.created ||
                "Transfer created successfully",
              example: {
                data: {
                  id: "deafdc44-f52a-4e7f-bd54-8d4103851597",
                  amount: 100.5,
                  description: "Withdrawal requested by XYZ",
                  status: "Pending",
                  requestedAt: "2025-03-30T05:14:26.961006Z",
                  processedAt: null,
                  pixKeyType: "CPF",
                  pixKeyValue: "12345678900",
                  requestedAt: "2023-12-15T10:30:00Z",
                  validationId: "CA36AEB163524AF9C5675472A977A98A",
                  paymentId: "",
                },
                statusCode: 200,
                message: "Operation completed successfully.",
              },
            },
            {
              status: 400,
              description:
                t.payouts?.endpoints?.createPayment?.responses?.badRequest ||
                "Invalid request",
              example: {
                statusCode: 400,
                message: "Invalid payment data",
              },
            },
            {
              status: 409,
              description:
                t.payouts?.endpoints?.createPayment?.responses?.conflict ||
                "Conflict",
              example: {
                statusCode: 409,
                message:
                  "A payment with this external reference already exists",
              },
            },
            {
              status: 500,
              description:
                t.payouts?.endpoints?.createPayment?.responses?.serverError ||
                "Internal error",
              example: {
                statusCode: 500,
                message:
                  "An internal error occurred while processing your request.",
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
      "validationId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "description": "Withdrawal requested by XYZ",
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
                "Unique payment ID",
            },
          ],
          headers: [
            {
              name: "Authorization",
              required: true,
              type: "string",
              description:
                t.common?.headers?.authorization ||
                "Bearer token obtained via authentication endpoint",
            },
            {
              name: "SellerId",
              required: true,
              type: "string",
              description:
                t.common?.headers?.sellerId || "Seller ID in GUID format",
            },
          ],
          responses: [
            {
              status: 200,
              description:
                t.payouts?.endpoints?.getPayment?.responses?.success ||
                "Query completed successfully",
              example: {
                data: {
                  id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                  amount: 100.5,
                  description: "Payment to Supplier XYZ",
                  status: "Completed",
                  pixKeyType: "CPF",
                  pixKeyValue: "12345678900",
                  validationId: "CA36AEB163524AF9C5675472A977A98A",
                  paymentId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                },
                statusCode: 200,
                message: "Payment data retrieved successfully",
              },
            },
            {
              status: 404,
              description:
                t.payouts?.endpoints?.getPayment?.responses?.notFound ||
                "Payment not found",
              example: {
                statusCode: 404,
                message: "Payment not found",
              },
            },
            {
              status: 500,
              description:
                t.payouts?.endpoints?.getPayment?.responses?.serverError ||
                "Internal error",
              example: {
                statusCode: 500,
                message:
                  "An internal error occurred while processing your request.",
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
      id: "refunds",
      title: t.refunds?.title || "Refunds",
      description:
        t.refunds?.description ||
        "Endpoints for requesting and querying refunds",
      endpoints: [
        {
          id: "requestRefund",
          method: "POST",
          path: "/refunds",
          description:
            t.refunds?.endpoints?.requestRefund?.description ||
            "Request a refund for a transaction",
          authentication: t.common?.authentication?.bearer || "Bearer Token",
          parameters: [],
          headers: [
            {
              name: "Authorization",
              required: true,
              type: "string",
              description:
                t.common?.headers?.authorization ||
                "Bearer token obtained via authentication endpoint",
            },
            {
              name: "SellerId",
              required: true,
              type: "string",
              description:
                t.common?.headers?.sellerId || "Seller ID in GUID format",
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
                name: "transaction_id",
                type: "string",
                required: true,
                description:
                  t.refunds?.endpoints?.requestRefund?.body?.transaction_id ||
                  "ID of the transaction to be refunded",
              },
              {
                name: "amount",
                type: "number",
                required: true,
                description:
                  t.refunds?.endpoints?.requestRefund?.body?.amount ||
                  "Amount to be refunded (must be less than or equal to the original transaction amount)",
              },
              {
                name: "reason",
                type: "string",
                required: true,
                description:
                  t.refunds?.endpoints?.requestRefund?.body?.reason ||
                  "Reason for the refund",
              },
            ],
          },
          responses: [
            {
              status: 201,
              description:
                t.refunds?.endpoints?.requestRefund?.responses?.created ||
                "Refund requested successfully",
              example: {
                data: {
                  refund_id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                  transaction_id: "4fa85f64-5717-4562-b3fc-2c963f66afa7",
                  amount: 50.0,
                  status: "Pending",
                  reason: "Product returned by customer",
                  created_at: "2025-03-15T14:30:00Z",
                  processed_at: null,
                },
                statusCode: 201,
                message: "Refund requested successfully",
              },
            },
            {
              status: 400,
              description:
                t.refunds?.endpoints?.requestRefund?.responses?.badRequest ||
                "Invalid request",
              example: {
                statusCode: 400,
                message: "Only completed transactions can be refunded",
              },
            },
            {
              status: 404,
              description:
                t.refunds?.endpoints?.requestRefund?.responses?.notFound ||
                "Transaction not found",
              example: {
                statusCode: 404,
                message:
                  "Transaction with ID 4fa85f64-5717-4562-b3fc-2c963f66afa7 not found",
              },
            },
            {
              status: 422,
              description:
                t.refunds?.endpoints?.requestRefund?.responses?.unprocessable ||
                "Insufficient funds",
              example: {
                statusCode: 422,
                message:
                  "Insufficient balance in the Withdrawal wallet to process the refund",
              },
            },
            {
              status: 500,
              description:
                t.refunds?.endpoints?.requestRefund?.responses?.serverError ||
                "Internal error",
              example: {
                statusCode: 500,
                message:
                  "An internal error occurred while processing your request.",
              },
            },
          ],
          requestExample:
            t.refunds?.endpoints?.requestRefund?.requestExample ||
            `curl -X POST https://pulsepay.technocenterinformatica.com.br/sandbox/refunds \\
 -H "Authorization: Bearer your_access_token" \\
 -H "SellerId: 3fa85f64-5717-4562-b3fc-2c963f66afa6" \\
 -H "Content-Type: application/json" \\
 -d '{
   "transaction_id": "4fa85f64-5717-4562-b3fc-2c963f66afa7",
   "amount": 50.00,
   "reason": "Product returned by customer"
 }'`,
        },
        {
          id: "getRefund",
          method: "GET",
          path: "/refunds/{id}",
          description:
            t.refunds?.endpoints?.getRefund?.description ||
            "Query the status of a specific refund",
          authentication: t.common?.authentication?.bearer || "Bearer Token",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              type: "guid",
              description:
                t.refunds?.endpoints?.getRefund?.parameters?.id ||
                "Unique refund ID",
            },
          ],
          headers: [
            {
              name: "Authorization",
              required: true,
              type: "string",
              description:
                t.common?.headers?.authorization ||
                "Bearer token obtained via authentication endpoint",
            },
            {
              name: "SellerId",
              required: true,
              type: "string",
              description:
                t.common?.headers?.sellerId || "Seller ID in GUID format",
            },
          ],
          responses: [
            {
              status: 200,
              description:
                t.refunds?.endpoints?.getRefund?.responses?.success ||
                "Query completed successfully",
              example: {
                data: {
                  refund_id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                  transaction_id: "4fa85f64-5717-4562-b3fc-2c963f66afa7",
                  amount: 50.0,
                  status: "Completed",
                  reason: "Product returned by customer",
                  created_at: "2025-03-15T14:30:00Z",
                  processed_at: "2025-03-15T14:45:22Z",
                },
                statusCode: 200,
                message: "Refund found successfully",
              },
            },
            {
              status: 404,
              description:
                t.refunds?.endpoints?.getRefund?.responses?.notFound ||
                "Refund not found",
              example: {
                statusCode: 404,
                message:
                  "Refund with ID 3fa85f64-5717-4562-b3fc-2c963f66afa6 not found",
              },
            },
            {
              status: 500,
              description:
                t.refunds?.endpoints?.getRefund?.responses?.serverError ||
                "Internal error",
              example: {
                statusCode: 500,
                message:
                  "An internal error occurred while processing your request.",
              },
            },
          ],
          requestExample:
            t.refunds?.endpoints?.getRefund?.requestExample ||
            `curl -X GET https://pulsepay.technocenterinformatica.com.br/sandbox/refunds/3fa85f64-5717-4562-b3fc-2c963f66afa6 \\
 -H "Authorization: Bearer your_access_token" \\
 -H "SellerId: 3fa85f64-5717-4562-b3fc-2c963f66afa6"`,
        },
      ],
    },
    {
      id: "transactions",
      title: t.transactions?.title || "Transactions",
      description:
        t.transactions?.description ||
        "Endpoints for querying and managing transactions",
      endpoints: [
        {
          id: "getTransactions",
          method: "GET",
          path: "/transactions",
          description:
            t.transactions?.endpoints?.getTransactions?.description ||
            "List all seller transactions",
          authentication: t.common?.authentication?.bearer || "Bearer Token",
          parameters: [
            {
              name: "startDate",
              in: "query",
              required: false,
              type: "string",
              description:
                t.transactions?.endpoints?.getTransactions?.parameters
                  ?.startDate || "Start date for filtering (ISO 8601 format)",
            },
            {
              name: "endDate",
              in: "query",
              required: false,
              type: "string",
              description:
                t.transactions?.endpoints?.getTransactions?.parameters
                  ?.endDate || "End date for filtering (ISO 8601 format)",
            },
            {
              name: "status",
              in: "query",
              required: false,
              type: "string",
              description:
                t.transactions?.endpoints?.getTransactions?.parameters
                  ?.status ||
                "Transaction status (Pending, Completed, Failed, etc)",
            },
            {
              name: "page",
              in: "query",
              required: false,
              type: "integer",
              description:
                t.transactions?.endpoints?.getTransactions?.parameters?.page ||
                "Page for pagination (default: 1)",
            },
            {
              name: "pageSize",
              in: "query",
              required: false,
              type: "integer",
              description:
                t.transactions?.endpoints?.getTransactions?.parameters
                  ?.pageSize || "Page size for pagination (default: 20)",
            },
          ],
          headers: [
            {
              name: "Authorization",
              required: true,
              type: "string",
              description:
                t.common?.headers?.authorization ||
                "Bearer token obtained via authentication endpoint",
            },
            {
              name: "SellerId",
              required: true,
              type: "string",
              description:
                t.common?.headers?.sellerId || "Seller ID in GUID format",
            },
          ],
          responses: [
            {
              status: 200,
              description:
                t.transactions?.endpoints?.getTransactions?.responses
                  ?.success || "Transaction list returned successfully",
              example: {
                data: [
                  {
                    id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                    type: "Payment",
                    amount: 100.5,
                    status: "Completed",
                    description: "Payment to Supplier XYZ",
                    createdAt: "2023-12-15T10:30:00Z",
                    completedAt: "2023-12-15T10:32:15Z",
                  },
                  {
                    id: "4fa85f64-5717-4562-b3fc-2c963f66afa7",
                    type: "Withdrawal",
                    amount: 50.0,
                    status: "Pending",
                    description: "Withdrawal to bank account",
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
                message: "Transactions retrieved successfully",
              },
            },
            {
              status: 400,
              description:
                t.transactions?.endpoints?.getTransactions?.responses
                  ?.badRequest || "Invalid request",
              example: {
                statusCode: 400,
                message: "Invalid query parameters",
              },
            },
            {
              status: 500,
              description:
                t.transactions?.endpoints?.getTransactions?.responses
                  ?.serverError || "Internal error",
              example: {
                statusCode: 500,
                message:
                  "An internal error occurred while processing your request.",
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
            "Query the details of a specific transaction",
          authentication: t.common?.authentication?.bearer || "Bearer Token",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              type: "guid",
              description:
                t.transactions?.endpoints?.getTransaction?.parameters?.id ||
                "Unique transaction ID",
            },
          ],
          headers: [
            {
              name: "Authorization",
              required: true,
              type: "string",
              description:
                t.common?.headers?.authorization ||
                "Bearer token obtained via authentication endpoint",
            },
            {
              name: "SellerId",
              required: true,
              type: "string",
              description:
                t.common?.headers?.sellerId || "Seller ID in GUID format",
            },
          ],
          responses: [
            {
              status: 200,
              description:
                t.transactions?.endpoints?.getTransaction?.responses?.success ||
                "Transaction found successfully",
              example: {
                data: {
                  id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                  type: "Payment",
                  amount: 100.5,
                  status: "Completed",
                  description: "Payment to Supplier XYZ",
                  recipientInfo: {
                    name: "Recipient's Name",
                    document: "123.456.789-00",
                    pixKeyType: "CPF",
                    pixKeyValue: "12345678900",
                  },
                  externalReference: "REF-001",
                  createdAt: "2023-12-15T10:30:00Z",
                  completedAt: "2023-12-15T10:32:15Z",
                },
                statusCode: 200,
                message: "Transaction retrieved successfully",
              },
            },
            {
              status: 404,
              description:
                t.transactions?.endpoints?.getTransaction?.responses
                  ?.notFound || "Transaction not found",
              example: {
                statusCode: 404,
                message: "Transaction not found",
              },
            },
            {
              status: 500,
              description:
                t.transactions?.endpoints?.getTransaction?.responses
                  ?.serverError || "Internal error",
              example: {
                statusCode: 500,
                message:
                  "An internal error occurred while processing your request.",
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
        "Receive real-time notifications about payment-related events",
      endpoints: [
        {
          id: "webhooks-overview",
          method: "",
          path: "Webhooks Overview",
          description: "How to configure and receive event notifications",
          content: true,
        },
      ],
    },
  ];
}
