import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { api } from "../utils/apiClient.js";
import { Layout } from "../components/Layout.jsx";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const formatDateTime = (value) => {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "Time TBA";
  return d.toLocaleString();
};

export const SeatSelection = () => {
  const { showId } = useParams();
  const query = useQuery();
  const maxCount = Number(query.get("count") || 1);
  const [data, setData] = useState(null);
  const [selected, setSelected] = useState([]);
  const [error, setError] = useState("");
  const [locking, setLocking] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      const { data } = await api.get(`/shows/${showId}`);
      setData(data);
    };
    load();
  }, [showId]);

  const groupedByRow = useMemo(() => {
    if (!data) return {};
    return data.seats.reduce((acc, seat) => {
      if (!acc[seat.row]) acc[seat.row] = [];
      acc[seat.row].push(seat);
      return acc;
    }, {});
  }, [data]);

  const toggleSeat = (seat) => {
    setError("");
    if (seat.status !== "AVAILABLE") return;
    if (selected.some((s) => s.id === seat.id)) {
      setSelected(selected.filter((s) => s.id !== seat.id));
    } else {
      if (selected.length >= maxCount) {
        setError(`You can select maximum ${maxCount} seats`);
        return;
      }
      setSelected([...selected, seat]);
    }
  };

  const handleLockAndContinue = async () => {
    if (!selected.length) {
      setError("Select at least one seat");
      return;
    }
    setLocking(true);
    try {
      const seatIds = selected.map((s) => s.id);
      await api.post("/seat-locks/lock", { showId, seatIds });
      const totalAmount = selected.reduce((sum, s) => sum + s.price, 0);
      const { data: bookingRes } = await api.post("/bookings", {
        showId,
        seatIds,
        totalAmount
      });
      navigate(`/payment/${bookingRes.booking._id}`, {
        state: { totalAmount, show: data.show, seats: selected }
      });
    } catch (err) {
      setError(err.response?.data?.message || "Could not lock seats");
    } finally {
      setLocking(false);
    }
  };

  const legend = (
    <div className="flex gap-4 text-[11px] text-slate-300 mb-4">
      <div className="flex items-center gap-1">
        <span className="w-4 h-4 rounded bg-slate-800 border border-slate-600" />
        Available
      </div>
      <div className="flex items-center gap-1">
        <span className="w-4 h-4 rounded bg-primary" />
        Selected
      </div>
      <div className="flex items-center gap-1">
        <span className="w-4 h-4 rounded bg-slate-500" />
        Booked / Locked
      </div>
    </div>
  );

  return (
    <Layout>
      <div className="max-w-xl mx-auto card mt-4">
        <h1 className="text-lg font-semibold mb-2">Select seats</h1>
        {data && (
          <p className="text-xs text-slate-400 mb-3">
            {data.show.movie.title} • {data.show.theatre.name} •{" "}
            {formatDateTime(data.show.startTime)}
          </p>
        )}
        {legend}
        <div className="space-y-2 mb-4">
          {Object.keys(groupedByRow).length === 0 && (
            <p className="text-xs text-slate-400">
              No seats configured for this show. Please check backend seeding or screen seats.
            </p>
          )}
          {Object.entries(groupedByRow).map(([row, seats]) => (
            <div key={row} className="flex items-center gap-2">
              <span className="w-5 text-[11px] text-slate-400">{row}</span>
              <div className="flex flex-wrap gap-1">
                {seats.map((seat) => {
                  const isSelected = selected.some((s) => s.id === seat.id);
                  const isUnavailable = seat.status !== "AVAILABLE";
                  return (
                    <button
                      key={seat.id}
                      type="button"
                      onClick={() => toggleSeat(seat)}
                      disabled={isUnavailable}
                      className={[
                        "w-7 h-7 rounded text-[10px] flex items-center justify-center border",
                        isUnavailable
                          ? "bg-slate-500 border-slate-500 text-slate-900"
                          : isSelected
                          ? "bg-primary border-primary text-white"
                          : "bg-slate-900 border-slate-600 hover:border-primary"
                      ].join(" ")}
                    >
                      {seat.seatNumber.replace(seat.row, "")}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        {error && <p className="text-xs text-red-400 mb-2">{error}</p>}
        <div className="flex items-center justify-between text-sm mb-3">
          <span className="text-slate-300">
            {selected.length} / {maxCount} selected
          </span>
          <span className="font-semibold">
            ₹{selected.reduce((sum, s) => sum + s.price, 0)}
          </span>
        </div>
        <button
          onClick={handleLockAndContinue}
          className="btn-primary w-full"
          disabled={locking}
        >
          {locking ? "Processing..." : "Proceed to payment"}
        </button>
      </div>
    </Layout>
  );
};

