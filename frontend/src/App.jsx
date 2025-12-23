import { Routes, Route, Navigate } from "react-router-dom";
import { Login } from "./pages/Login.jsx";
import { Register } from "./pages/Register.jsx";
import { Movies } from "./pages/Movies.jsx";
import { DateSelection } from "./pages/DateSelection.jsx";
import { TheatreShows } from "./pages/TheatreShows.jsx";
import { TicketCount } from "./pages/TicketCount.jsx";
import { SeatSelection } from "./pages/SeatSelection.jsx";
import { Payment } from "./pages/Payment.jsx";
import { Success } from "./pages/Success.jsx";
import { MyBookings } from "./pages/MyBookings.jsx";
import { ProtectedRoute } from "./components/ProtectedRoute.jsx";

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/movies" element={<Movies />} />
        <Route path="/movies/:movieId/dates" element={<DateSelection />} />
        <Route path="/movies/:movieId/theatres" element={<TheatreShows />} />
        <Route path="/shows/:showId/tickets" element={<TicketCount />} />
        <Route path="/shows/:showId/seats" element={<SeatSelection />} />
        <Route path="/payment/:bookingId" element={<Payment />} />
        <Route path="/success/:bookingId" element={<Success />} />
        <Route path="/bookings" element={<MyBookings />} />
      </Route>

      <Route path="*" element={<Navigate to="/register" replace />} />
    </Routes>
  );
};

export default App;

