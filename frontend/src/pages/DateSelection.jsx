import { useEffect, useState } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import { api } from "../utils/apiClient.js";
import { Layout } from "../components/Layout.jsx";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export const DateSelection = () => {
  const { movieId } = useParams();
  const query = useQuery();
  const cityId = query.get("cityId");
  const [availableDates, setAvailableDates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        // Fetch shows to get available dates
        const { data } = await api.get(`/movies/${movieId}/shows`, {
          params: { cityId }
        });

        // Extract unique dates from shows, filtering out past dates
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const dates = new Set();
        data.forEach((show) => {
          if (show.showDate) {
            const showDate = new Date(show.showDate);
            showDate.setHours(0, 0, 0, 0);
            
            // Only include today and future dates
            if (showDate >= today) {
              const dateStr = showDate.toISOString().split("T")[0];
              dates.add(dateStr);
            }
          }
        });

        // Sort dates (already filtered to future dates only)
        const sortedDates = Array.from(dates)
          .sort()
          .map((d) => ({
            date: d,
            display: formatDate(d)
          }));

        setAvailableDates(sortedDates);
      } catch (err) {
        console.error("Failed to load dates:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [movieId, cityId]);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const dateOnly = new Date(date);
    dateOnly.setHours(0, 0, 0, 0);

    if (dateOnly.getTime() === today.getTime()) {
      return "Today";
    } else if (dateOnly.getTime() === tomorrow.getTime()) {
      return "Tomorrow";
    } else {
      return date.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric"
      });
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="text-center py-8 text-sm text-slate-400">Loading dates...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <h1 className="text-lg font-semibold mb-4">Select date</h1>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {availableDates.map(({ date, display }) => (
          <Link
            key={date}
            to={`/movies/${movieId}/theatres?cityId=${cityId}&showDate=${date}`}
            className="card text-center py-4 hover:border-primary transition"
          >
            <div className="text-xs text-slate-400 mb-1">
              {new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            </div>
            <div className="text-sm font-semibold">{display}</div>
          </Link>
        ))}
      </div>
      {availableDates.length === 0 && (
        <p className="text-sm text-slate-400 text-center py-8">
          No shows available for this movie in this city.
        </p>
      )}
    </Layout>
  );
};
