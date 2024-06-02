import React, { useState } from "react";
import PaymentService from "../../services/PaymentService";
import QRCode from "qrcode.react";

const GeneratePix = () => {
  const [formData, setFormData] = useState({
    type: "",
    amount: 0,
    currency: "",
    orderId: "",
    customerId: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [paymentResponse, setPaymentResponse] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const result = await PaymentService.processPayment(formData);
      debugger;
      setPaymentResponse(result);
      console.log("Form data submitted: ", result);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center">
      <div className="card w-full max-w-lg bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Payment Form</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">Type</span>
              </label>
              <input
                type="text"
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="input input-bordered"
                required
              />
            </div>
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">Amount</span>
              </label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                className="input input-bordered"
                required
              />
            </div>
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">Currency</span>
              </label>
              <input
                type="text"
                name="currency"
                value={formData.currency}
                onChange={handleChange}
                className="input input-bordered"
                required
              />
            </div>
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">Order ID</span>
              </label>
              <input
                type="text"
                name="orderId"
                value={formData.orderId}
                onChange={handleChange}
                className="input input-bordered"
                required
              />
            </div>
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">Customer ID</span>
              </label>
              <input
                type="text"
                name="customerId"
                value={formData.customerId}
                onChange={handleChange}
                className="input input-bordered"
                required
              />
            </div>
            {error && <div className="text-red-500">{error}</div>}
            <div className="form-control mt-6">
              <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </form>
          {paymentResponse && (
            <div className="mt-6">
              <h3 className="text-xl font-bold">QR Code</h3>
              <QRCode value={paymentResponse.details.additional_data.qr_code} size={256} />
              <p>Status: {paymentResponse.details.status}</p>
              <p>Description: {paymentResponse.details.description}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GeneratePix;
