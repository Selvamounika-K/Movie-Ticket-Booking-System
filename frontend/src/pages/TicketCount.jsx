import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Layout } from "../components/Layout.jsx";

export const TicketCount = () => {
  const { showId } = useParams();
  const [count, setCount] = useState(1);
  const navigate = useNavigate();

  const handleNext = () => {
    navigate(`/shows/${showId}/seats?count=${count}`);
  };

  return (
    <Layout>
      <div className="max-w-sm mx-auto card mt-8">
        <h1 className="text-lg font-semibold mb-4">Select tickets</h1>
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm">Tickets</span>
          <select
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="bg-slate-950 border border-slate-700 rounded-md px-3 py-1 text-sm"
          >
            {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
        <button onClick={handleNext} className="btn-primary w-full">
          Continue to seats
        </button>
      </div>
    </Layout>
  );
};

