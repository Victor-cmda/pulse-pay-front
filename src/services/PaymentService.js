import { Client as PayClient, PaymentRequestDto } from "./PulsePayApiService";

const baseUrl = "http://localhost:5000";
const payClient = new PayClient(baseUrl);

const processPayment = async (type, amount, currency, orderId, customerId) => {
  const paymentRequest = new PaymentRequestDto({
    type,
    amount,
    currency,
    orderId,
    customerId,
  });

  try {
    await payClient.process(paymentRequest);
    return { success: true, message: "Payment processed successfully" };
  } catch (error) {
    return {
      success: false,
      message: `Payment processing failed: ${error.message}`,
    };
  }
};

const PaymentService = {
  processPayment,
};

export default PaymentService;
