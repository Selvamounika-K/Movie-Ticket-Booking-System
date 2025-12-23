import { useEffect, useState } from "react";
import { Layout } from "../components/Layout.jsx";
import { api } from "../utils/apiClient.js";
import { useAuth } from "../state/AuthContext.jsx";

export const MyBookings = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const load = async () => {
      if (!user) return;
      const { data } = await api.get(`/bookings/user/${user.id}`);
      setBookings(data);
    };
    load();
  }, [user]);

  return (
    <Layout>
      <h1 className="text-lg font-semibold mb-4">My bookings</h1>
      <div className="space-y-3">
        {bookings.map((b) => (
          <div key={b._id} className="card">
            <div className="flex justify-between items-center mb-1">
              <div>
                <p className="text-sm font-semibold">
                  {b.show?.movie?.title || "Movie"}
                </p>
                <p className="text-[11px] text-slate-400">
                  {b.show?.theatre?.name} •{" "}
                  {new Date(b.show?.startTime).toLocaleString()}
                </p>
              </div>
              <span
                className={[
                  "text-[11px] px-2 py-0.5 rounded-full border",
                  b.status === "CONFIRMED"
                    ? "border-emerald-500 text-emerald-400"
                    : b.status === "PENDING"
                    ? "border-amber-500 text-amber-400"
                    : "border-slate-500 text-slate-400"
                ].join(" ")}
              >
                {b.status}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mb-1">
              Seats: {b.seats.map((s) => s.seatNumber).join(", ")}
            </p>
            <p className="text-[11px] text-slate-300">
              Paid: ₹{b.totalAmount?.toFixed(0) || 0}
            </p>
          </div>
        ))}
        {bookings.length === 0 && (
          <p className="text-sm text-slate-400">No bookings yet.</p>
        )}
      </div>
    </Layout>
  );
};

