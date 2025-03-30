// src/pages/Endpoints/components/content/WebhooksContent.jsx
// Based on Getnet API documentation style at https://developers.getnet.com.br/api#tag/Notificacoes-1.1
import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { AlertCircle, Info } from "lucide-react";

const WebhooksContent = ({ t }) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-3">
          {t.webhooks?.title || "Webhooks"}
        </h3>
        <p className="text-slate-700 dark:text-slate-300 mb-6">
          Webhooks allow your application to receive real-time notifications
          about events related to payments, transfers, and other actions.
          Instead of constantly querying our API for updates, PulsePay will send
          HTTP POST requests to a URL that you configure in the system interface
          whenever an event occurs.
        </p>
      </div>

      {/* How webhooks work */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">How Webhooks Work</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-6 h-6 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center text-indigo-800 dark:text-indigo-300 text-xs font-semibold">
              1
            </div>
            <p className="text-sm text-slate-700 dark:text-slate-300">
              Register a webhook URL in your PulsePay account through the{" "}
              <strong>Settings screen</strong> in the admin dashboard.
            </p>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-6 h-6 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center text-indigo-800 dark:text-indigo-300 text-xs font-semibold">
              2
            </div>
            <p className="text-sm text-slate-700 dark:text-slate-300">
              Configure your server to receive POST requests at the registered
              URL.
            </p>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-6 h-6 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center text-indigo-800 dark:text-indigo-300 text-xs font-semibold">
              3
            </div>
            <p className="text-sm text-slate-700 dark:text-slate-300">
              When an event occurs (such as an approved payment or a completed
              transfer), PulsePay will automatically send a notification to your
              URL.
            </p>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-6 h-6 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center text-indigo-800 dark:text-indigo-300 text-xs font-semibold">
              4
            </div>
            <p className="text-sm text-slate-700 dark:text-slate-300">
              Your server should process the notification and respond with an
              HTTP 200 code to confirm receipt.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Notification format */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Notification Format</CardTitle>
          <CardDescription>
            All notifications are sent as HTTP POST requests with the following
            JSON payload format:
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-slate-950 text-slate-300 p-4 rounded-lg overflow-x-auto mb-4">
            <pre className="text-xs font-mono whitespace-pre-wrap">
              {`{
  "Id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "PaymentId": "PIX123456789",
  "TransactionId": "TX987654321",
  "OrderId": "ORDER123456",
  "Status": "PAID",
  "Amount": 100.50,
  "requires_same_owner": true,
  "PaidAt": "2025-01-15T14:30:45Z"
}`}
            </pre>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium text-slate-900 dark:text-white text-sm">
              Payload fields:
            </h4>
            <ul className="space-y-2">
              <li className="grid grid-cols-12 gap-2 text-sm">
                <div className="col-span-3 font-mono text-xs text-indigo-700 dark:text-indigo-400">
                  Id
                </div>
                <div className="col-span-9 text-slate-700 dark:text-slate-300">
                  Unique notification identifier (GUID)
                </div>
              </li>
              <li className="grid grid-cols-12 gap-2 text-sm">
                <div className="col-span-3 font-mono text-xs text-indigo-700 dark:text-indigo-400">
                  PaymentId
                </div>
                <div className="col-span-9 text-slate-700 dark:text-slate-300">
                  Payment identifier
                </div>
              </li>
              <li className="grid grid-cols-12 gap-2 text-sm">
                <div className="col-span-3 font-mono text-xs text-indigo-700 dark:text-indigo-400">
                  TransactionId
                </div>
                <div className="col-span-9 text-slate-700 dark:text-slate-300">
                  Transaction identifier
                </div>
              </li>
              <li className="grid grid-cols-12 gap-2 text-sm">
                <div className="col-span-3 font-mono text-xs text-indigo-700 dark:text-indigo-400">
                  OrderId
                </div>
                <div className="col-span-9 text-slate-700 dark:text-slate-300">
                  Order identifier in your application
                </div>
              </li>
              <li className="grid grid-cols-12 gap-2 text-sm">
                <div className="col-span-3 font-mono text-xs text-indigo-700 dark:text-indigo-400">
                  Status
                </div>
                <div className="col-span-9 text-slate-700 dark:text-slate-300">
                  Current transaction status (e.g., PAID, PENDING, FAILED)
                </div>
              </li>
              <li className="grid grid-cols-12 gap-2 text-sm">
                <div className="col-span-3 font-mono text-xs text-indigo-700 dark:text-indigo-400">
                  Amount
                </div>
                <div className="col-span-9 text-slate-700 dark:text-slate-300">
                  Transaction amount
                </div>
              </li>
              <li className="grid grid-cols-12 gap-2 text-sm">
                <div className="col-span-3 font-mono text-xs text-indigo-700 dark:text-indigo-400">
                  requires_same_owner
                </div>
                <div className="col-span-9 text-slate-700 dark:text-slate-300">
                  Indicates whether the transaction requires the payer and
                  recipient to be the same person
                </div>
              </li>
              <li className="grid grid-cols-12 gap-2 text-sm">
                <div className="col-span-3 font-mono text-xs text-indigo-700 dark:text-indigo-400">
                  PaidAt
                </div>
                <div className="col-span-9 text-slate-700 dark:text-slate-300">
                  Date and time when the payment was confirmed (ISO 8601 format)
                </div>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Possible statuses */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Possible Statuses</CardTitle>
          <CardDescription>
            The Status field can contain one of the following values:
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-slate-800/50">
                <tr className="text-xs text-slate-500 dark:text-slate-400 text-left">
                  <th className="px-4 py-2 font-medium">Status</th>
                  <th className="px-4 py-2 font-medium">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="text-sm">
                  <td className="px-4 py-2 font-mono text-xs text-green-600 dark:text-green-400">
                    PAID
                  </td>
                  <td className="px-4 py-2 text-slate-700 dark:text-slate-300">
                    Payment approved and confirmed
                  </td>
                </tr>
                <tr className="text-sm">
                  <td className="px-4 py-2 font-mono text-xs text-amber-600 dark:text-amber-400">
                    PENDING
                  </td>
                  <td className="px-4 py-2 text-slate-700 dark:text-slate-300">
                    Payment pending processing or confirmation
                  </td>
                </tr>
                <tr className="text-sm">
                  <td className="px-4 py-2 font-mono text-xs text-red-600 dark:text-red-400">
                    FAILED
                  </td>
                  <td className="px-4 py-2 text-slate-700 dark:text-slate-300">
                    Payment failed or was declined
                  </td>
                </tr>
                <tr className="text-sm">
                  <td className="px-4 py-2 font-mono text-xs text-blue-600 dark:text-blue-400">
                    PROCESSING
                  </td>
                  <td className="px-4 py-2 text-slate-700 dark:text-slate-300">
                    Payment is being processed
                  </td>
                </tr>
                <tr className="text-sm">
                  <td className="px-4 py-2 font-mono text-xs text-slate-600 dark:text-slate-400">
                    CANCELLED
                  </td>
                  <td className="px-4 py-2 text-slate-700 dark:text-slate-300">
                    Payment was canceled
                  </td>
                </tr>
                <tr className="text-sm">
                  <td className="px-4 py-2 font-mono text-xs text-purple-600 dark:text-purple-400">
                    REFUNDED
                  </td>
                  <td className="px-4 py-2 text-slate-700 dark:text-slate-300">
                    Payment was refunded
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Event Types - NEW SECTION */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Event Types</CardTitle>
          <CardDescription>
            PulsePay supports the following webhook event types. Your
            application should be prepared to handle each of these events.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Payment Events */}
          <div>
            <h4 className="font-medium text-slate-900 dark:text-white text-sm mb-3">
              Payment Events
            </h4>

            {/* payment.created */}
            <div className="mb-4">
              <div className="flex items-center mb-2">
                <div className="bg-indigo-100 dark:bg-indigo-900/30 px-2 py-1 rounded text-xs font-mono text-indigo-800 dark:text-indigo-300 mr-2">
                  payment.created
                </div>
                <span className="text-sm text-slate-700 dark:text-slate-300">
                  Triggered when a new payment is created
                </span>
              </div>
              <div className="bg-slate-950 text-slate-300 p-4 rounded-lg overflow-x-auto mb-2">
                <pre className="text-xs font-mono whitespace-pre-wrap">
                  {`{
  "id": "a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6",
  "customer_id": "c1d2e3f4-g5h6-i7j8-k9l0-m1n2o3p4q5r6",
  "transaction_id": "a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6",
  "amount": 100.50,
  "status": "Pending",
  "payment_status": "created",
  "type": "payment",
  "description": "Test payment",
  "created_at": "2025-03-30T12:34:56.789Z"
}`}
                </pre>
              </div>
            </div>

            {/* payment.completed */}
            <div className="mb-4">
              <div className="flex items-center mb-2">
                <div className="bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded text-xs font-mono text-green-800 dark:text-green-300 mr-2">
                  payment.completed
                </div>
                <span className="text-sm text-slate-700 dark:text-slate-300">
                  Triggered when a payment is successfully completed
                </span>
              </div>
              <div className="bg-slate-950 text-slate-300 p-4 rounded-lg overflow-x-auto mb-2">
                <pre className="text-xs font-mono whitespace-pre-wrap">
                  {`{
  "id": "a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6",
  "customer_id": "c1d2e3f4-g5h6-i7j8-k9l0-m1n2o3p4q5r6",
  "transaction_id": "a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6",
  "amount": 100.50,
  "status": "Completed",
  "payment_status": "completed",
  "type": "payment",
  "description": "Test payment",
  "created_at": "2025-03-30T12:34:56.789Z",
  "completed_at": "2025-03-30T12:36:56.789Z"
}`}
                </pre>
              </div>
            </div>

            {/* payment.failed */}
            <div className="mb-4">
              <div className="flex items-center mb-2">
                <div className="bg-red-100 dark:bg-red-900/30 px-2 py-1 rounded text-xs font-mono text-red-800 dark:text-red-300 mr-2">
                  payment.failed
                </div>
                <span className="text-sm text-slate-700 dark:text-slate-300">
                  Triggered when a payment attempt fails
                </span>
              </div>
              <div className="bg-slate-950 text-slate-300 p-4 rounded-lg overflow-x-auto mb-2">
                <pre className="text-xs font-mono whitespace-pre-wrap">
                  {`{
  "id": "a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6",
  "customer_id": "c1d2e3f4-g5h6-i7j8-k9l0-m1n2o3p4q5r6",
  "transaction_id": "a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6",
  "amount": 100.50,
  "status": "Failed",
  "payment_status": "failed",
  "type": "payment",
  "description": "Test payment",
  "created_at": "2025-03-30T12:34:56.789Z",
  "failed_at": "2025-03-30T12:36:56.789Z",
  "fail_reason": "Test failure"
}`}
                </pre>
              </div>
            </div>
          </div>

          {/* Payout Events */}
          <div>
            <h4 className="font-medium text-slate-900 dark:text-white text-sm mb-3">
              Payout Events
            </h4>

            {/* payout.completed */}
            <div className="mb-4">
              <div className="flex items-center mb-2">
                <div className="bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded text-xs font-mono text-blue-800 dark:text-blue-300 mr-2">
                  payout.completed
                </div>
                <span className="text-sm text-slate-700 dark:text-slate-300">
                  Triggered when a payout is successfully completed
                </span>
              </div>
              <div className="bg-slate-950 text-slate-300 p-4 rounded-lg overflow-x-auto mb-2">
                <pre className="text-xs font-mono whitespace-pre-wrap">
                  {`{
  "id": "a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6",
  "customer_id": "c1d2e3f4-g5h6-i7j8-k9l0-m1n2o3p4q5r6",
  "transaction_id": "a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6",
  "amount": 100.50,
  "status": "Completed",
  "payout_status": "completed",
  "type": "payout",
  "description": "Test payout",
  "created_at": "2025-03-30T12:34:56.789Z",
  "completed_at": "2025-03-30T12:36:56.789Z"
}`}
                </pre>
              </div>
            </div>

            {/* payout.failed */}
            <div className="mb-4">
              <div className="flex items-center mb-2">
                <div className="bg-orange-100 dark:bg-orange-900/30 px-2 py-1 rounded text-xs font-mono text-orange-800 dark:text-orange-300 mr-2">
                  payout.failed
                </div>
                <span className="text-sm text-slate-700 dark:text-slate-300">
                  Triggered when a payout attempt fails
                </span>
              </div>
              <div className="bg-slate-950 text-slate-300 p-4 rounded-lg overflow-x-auto mb-2">
                <pre className="text-xs font-mono whitespace-pre-wrap">
                  {`{
  "id": "a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6",
  "customer_id": "c1d2e3f4-g5h6-i7j8-k9l0-m1n2o3p4q5r6",
  "transaction_id": "a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6",
  "amount": 100.50,
  "status": "Failed",
  "payout_status": "failed",
  "type": "payout",
  "description": "Test payout",
  "created_at": "2025-03-30T12:34:56.789Z",
  "failed_at": "2025-03-30T12:36:56.789Z",
  "fail_reason": "Test payout failure"
}`}
                </pre>
              </div>
            </div>
          </div>

          {/* Refund Events */}
          <div>
            <h4 className="font-medium text-slate-900 dark:text-white text-sm mb-3">
              Refund Events
            </h4>

            {/* refund.completed */}
            <div className="mb-4">
              <div className="flex items-center mb-2">
                <div className="bg-purple-100 dark:bg-purple-900/30 px-2 py-1 rounded text-xs font-mono text-purple-800 dark:text-purple-300 mr-2">
                  refund.completed
                </div>
                <span className="text-sm text-slate-700 dark:text-slate-300">
                  Triggered when a refund is successfully completed
                </span>
              </div>
              <div className="bg-slate-950 text-slate-300 p-4 rounded-lg overflow-x-auto mb-2">
                <pre className="text-xs font-mono whitespace-pre-wrap">
                  {`{
  "id": "a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6",
  "refund_id": "RF-a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6",
  "transaction_id": "a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6",
  "amount": 100.50,
  "status": "Completed",
  "type": "refund",
  "reason": "wrong_document",
  "created_at": "2025-03-30T12:34:56.789Z",
  "completed_at": "2025-03-30T12:36:56.789Z"
}`}
                </pre>
              </div>
            </div>

            {/* refund.failed */}
            <div className="mb-4">
              <div className="flex items-center mb-2">
                <div className="bg-rose-100 dark:bg-rose-900/30 px-2 py-1 rounded text-xs font-mono text-rose-800 dark:text-rose-300 mr-2">
                  refund.failed
                </div>
                <span className="text-sm text-slate-700 dark:text-slate-300">
                  Triggered when a refund attempt fails
                </span>
              </div>
              <div className="bg-slate-950 text-slate-300 p-4 rounded-lg overflow-x-auto mb-2">
                <pre className="text-xs font-mono whitespace-pre-wrap">
                  {`{
  "id": "a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6",
  "refund_id": "RF-a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6",
  "transaction_id": "a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6",
  "amount": 100.50,
  "status": "Failed",
  "type": "refund",
  "reason": "wrong_document",
  "created_at": "2025-03-30T12:34:56.789Z",
  "failed_at": "2025-03-30T12:36:56.789Z",
  "fail_reason": "Bank rejected the refund"
}`}
                </pre>
              </div>
            </div>
          </div>

          <div className="flex gap-3 p-4 rounded-lg bg-blue-50 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
            <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium mb-1">Implementation Tip</p>
              <p className="text-sm">
                When implementing your webhook handler, make sure to check both
                the <code>type</code> field and the event-specific status field
                (e.g., <code>payment_status</code>, <code>payout_status</code>)
                to determine the appropriate action to take.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Best practices */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">
            Best Practices for Implementation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-3 p-4 rounded-lg bg-blue-50 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
            <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium mb-1">Idempotency Handling</p>
              <p className="text-sm">
                The same notification may be sent more than once. Implement a
                mechanism to ensure that the same notification is not processed
                twice. The <code>Id</code> field can be used to identify
                duplicate notifications.
              </p>
            </div>
          </div>

          <div className="flex gap-3 p-4 rounded-lg bg-amber-50 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium mb-1">Quick Response</p>
              <p className="text-sm">
                Your endpoint should respond quickly with an HTTP 200 code to
                confirm receipt of the notification. The notification processing
                should be done asynchronously to avoid blocking the response.
              </p>
            </div>
          </div>

          <ul className="space-y-3 pl-5 list-disc">
            <li className="text-sm text-slate-700 dark:text-slate-300">
              <span className="font-medium">Security:</span> Configure your
              endpoint to verify the authenticity of received notifications.
              Implement basic authentication or signature validation.
            </li>
            <li className="text-sm text-slate-700 dark:text-slate-300">
              <span className="font-medium">Fault tolerance:</span> Have a retry
              mechanism in case your server is unavailable. PulsePay will try to
              resend the notification several times before giving up.
            </li>
            <li className="text-sm text-slate-700 dark:text-slate-300">
              <span className="font-medium">Logs:</span> Maintain detailed logs
              of received notifications to facilitate troubleshooting.
            </li>
            <li className="text-sm text-slate-700 dark:text-slate-300">
              <span className="font-medium">Testing:</span> Use the webhook test
              endpoint to validate your webhook implementation before going to
              production.
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Implementation example */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Implementation Example</CardTitle>
          <CardDescription>
            Here's an example of how to implement an endpoint to receive
            notifications in Node.js:
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-slate-950 text-slate-300 p-4 rounded-lg overflow-x-auto mb-4">
            <pre className="text-xs font-mono whitespace-pre-wrap">
              {`// Example using Express.js
const express = require('express');
const app = express();
app.use(express.json());

// Endpoint to receive notifications
app.post('/webhook/pulsepay', (req, res) => {
  // Ensure quick response
  res.status(200).send('OK');
  
  // Process notification asynchronously
  processNotification(req.body);
});

async function processNotification(notification) {
  try {
    // Check if notification has already been processed (idempotency)
    const alreadyProcessed = await checkIfAlreadyProcessed(notification.Id);
    if (alreadyProcessed) {
      console.log(\`Notification \${notification.Id} already processed.\`);
      return;
    }
    
    // Record the notification in the database
    await saveNotification(notification);
    
    // Process according to status
    switch (notification.Status) {
      case 'PAID':
        await updateOrderStatus(notification.OrderId, 'paid');
        // Send confirmation email to customer, etc.
        break;
      case 'FAILED':
        await updateOrderStatus(notification.OrderId, 'payment_failed');
        // Notify customer about payment failure
        break;
      // Other statuses...
    }
    
    // Mark as processed
    await markAsProcessed(notification.Id);
    
  } catch (error) {
    console.error('Error processing notification:', error);
    // Implement retry mechanism or alert
  }
}

app.listen(3000, () => {
  console.log('Webhook server running on port 3000');
});`}
            </pre>
          </div>
        </CardContent>
      </Card>

      {/* Webhook Configuration */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">
            Configuring Webhooks in PulsePay
          </CardTitle>
          <CardDescription>
            Webhook configuration is done through the Settings screen of the
            PulsePay system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-3 p-4 rounded-lg bg-blue-50 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
              <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium mb-1">Configuration via Interface</p>
                <p className="text-sm">
                  To configure webhooks, access the <strong>Settings</strong>{" "}
                  screen in the PulsePay control panel. There you can:
                </p>
                <ul className="list-disc pl-5 mt-2 text-sm">
                  <li>Register a new URL to receive notifications</li>
                  <li>Select the events you want to monitor</li>
                  <li>Enable or disable notifications</li>
                  <li>Test if your URL is correctly receiving notifications</li>
                </ul>
              </div>
            </div>

            <div className="flex justify-center mt-6">
              <img
                src="../../public/webhook-configuration.png"
                alt="Webhook configuration screen"
                className="rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm"
              />
            </div>

            <p className="text-sm text-slate-700 dark:text-slate-300 text-center mt-2">
              Example of the webhook configuration screen in PulsePay
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WebhooksContent;
