import Show from "../models/Show.model.js";
import Seat from "../models/Seat.model.js";
import ShowSeat from "../models/ShowSeat.model.js";

/**
 * CREATE SHOW
 * POST /api/shows
 */
export const addShow = async (req, res) => {
  try {
    // If showDate not provided, extract from startTime
    if (!req.body.showDate && req.body.startTime) {
      const startTime = new Date(req.body.startTime);
      req.body.showDate = new Date(startTime.getFullYear(), startTime.getMonth(), startTime.getDate());
    }

    // Validate: Never allow creating shows for past dates
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const showDate = new Date(req.body.showDate);
    showDate.setHours(0, 0, 0, 0);
    
    if (showDate < today) {
      return res.status(400).json({ message: "Cannot create shows for past dates" });
    }

    const show = await Show.create(req.body);

    // create show seats by copying seats from the screen
    const seats = await Seat.find({ screen: show.screen });

    if (seats && seats.length) {
      const bulk = [];
      for (const seat of seats) {
        bulk.push({
          show: show._id,
          seat: seat._id,
          status: "AVAILABLE"
        });
      }

      const existing = await ShowSeat.find({ show: show._id }).select("seat");
      const existingIds = new Set(existing.map((e) => e.seat.toString()));
      const toInsert = bulk.filter((b) => !existingIds.has(b.seat.toString()));

      if (toInsert.length) {
        await ShowSeat.insertMany(toInsert);
      }
    }

    res.status(201).json(show);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

/**
 * LIST SHOWS FOR A MOVIE (optionally by city and date)
 * Supports:
 * - GET /api/shows?movieId=&cityId=&showDate=
 * - GET /api/movies/:movieId/shows?cityId=&showDate=
 */
export const getShowsByMovie = async (req, res) => {
  try {
    const movieId = req.params.movieId || req.query.movieId;
    const cityId = req.query.cityId || req.params.cityId;
    const showDate = req.query.showDate;

    if (!movieId) {
      return res.status(400).json({ message: "movieId is required" });
    }

    // Build query
    const query = { movie: movieId };
    
    // ALWAYS exclude past dates - only show today and future dates
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    query.showDate = { $gte: today };
    
    // Filter by specific date if provided (compare date part only, ignore time)
    if (showDate) {
      const dateStart = new Date(showDate);
      dateStart.setHours(0, 0, 0, 0);
      const dateEnd = new Date(showDate);
      dateEnd.setHours(23, 59, 59, 999);
      query.showDate = { 
        $gte: dateStart >= today ? dateStart : today, 
        $lte: dateEnd 
      };
    }

    const shows = await Show.find(query)
      .populate("movie")
      .populate({
        path: "theatre",
        ...(cityId ? { match: { city: cityId } } : {})
      })
      .populate("screen")
      .sort({ showDate: 1, startTime: 1 });

    const filteredShows = cityId ? shows.filter((s) => s.theatre !== null) : shows;

    res.json(filteredShows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * GET SHOW DETAILS + SEATS FOR LAYOUT
 * GET /api/shows/:showId
 */
export const getShowById = async (req, res) => {
  try {
    const { showId } = req.params;

    const show = await Show.findById(showId)
      .populate("movie")
      .populate("theatre")
      .populate("screen");

    if (!show) {
      return res.status(404).json({ message: "Show not found" });
    }

    // Validate: Never allow accessing past shows
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const showDate = new Date(show.showDate);
    showDate.setHours(0, 0, 0, 0);
    
    if (showDate < today) {
      return res.status(400).json({ message: "Cannot access shows for past dates" });
    }

    // Try to get existing show-seat mapping
    let showSeats = await ShowSeat.find({ show: showId })
      .populate("seat")
      .lean();

    // If no mapping exists (older data), bootstrap ShowSeat from Screen seats
    if (!showSeats.length && show.screen) {
      const screenSeats = await Seat.find({ screen: show.screen._id || show.screen });
      if (screenSeats.length) {
        await ShowSeat.insertMany(
          screenSeats.map((seat) => ({
            show: show._id,
            seat: seat._id,
            status: "AVAILABLE"
          }))
        );
        showSeats = await ShowSeat.find({ show: showId })
          .populate("seat")
          .lean();
      }
    }

    res.json({
      show,
      seats: showSeats.map((ss) => ({
        id: ss.seat._id,
        seatNumber: ss.seat.seatNumber,
        row: ss.seat.row,
        seatType: ss.seat.seatType,
        price: ss.seat.price,
        status: ss.status
      }))
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
