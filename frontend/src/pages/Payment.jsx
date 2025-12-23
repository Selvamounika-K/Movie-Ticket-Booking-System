import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Layout } from "../components/Layout.jsx";
import { api } from "../utils/apiClient.js";
import { useState } from "react";

export const Payment = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const state = location.state || {};
  const totalAmount = state.totalAmount || 0;

  const handlePay = async () => {
    setLoading(true);
    setError("");
    try {
      await api.post("/payments", {
        bookingId,
        amount: totalAmount,
        transactionId: `DUMMY-${Date.now()}`
      });
      navigate(`/success/${bookingId}`, { state });
    } catch (err) {
      setError(err.response?.data?.message || "Payment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-md mx-auto card mt-8">
        <h1 className="text-lg font-semibold mb-4">Payment</h1>
        <p className="text-sm mb-3">
          Amount payable: <span className="font-semibold">₹{totalAmount}</span>
        </p>
        
        {error && <p className="text-xs text-red-400 mb-2">{error}</p>}
        <button
          onClick={handlePay}
          className="btn-primary w-full"
          disabled={loading}
        >
          {loading ? "Processing..." : "Pay now"}
        </button>
      </div>
    </Layout>
  );
};

