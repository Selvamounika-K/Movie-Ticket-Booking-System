import { useLocation, useParams, Link } from "react-router-dom";
import { Layout } from "../components/Layout.jsx";

export const Success = () => {
  const { bookingId } = useParams();
  const { state } = useLocation();

  return (
    <Layout>
      <div className="max-w-md mx-auto card mt-10 text-center">
        <h1 className="text-lg font-semibold mb-2">Booking confirmed</h1>
        <p className="text-xs text-slate-300 mb-1">
          Booking ID: <span className="font-mono">{bookingId}</span>
        </p>
        {state?.show && (
          <p className="text-xs text-slate-400 mb-4">
            {state.show.movie.title} • {state.show.theatre.name} •{" "}
            {new Date(state.show.startTime).toLocaleString()}
          </p>
        )}
        <p className="text-xs text-slate-400 mb-4">
          Seats:{" "}
          {state?.seats?.map((s) => s.seatNumber).join(", ") || "Not available"}
        </p>
        <Link to="/bookings" className="btn-primary w-full inline-block text-center">
          Go to My bookings
        </Link>
      </div>
    </Layout>
  );
};

