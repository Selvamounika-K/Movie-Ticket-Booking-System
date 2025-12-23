import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import City from "../models/City.model.js";
import Theatre from "../models/Theatre.model.js";
import Screen from "../models/Screen.model.js";
import Seat from "../models/Seat.model.js";
import Movie from "../models/Movie.model.js";
import Show from "../models/Show.model.js";
import ShowSeat from "../models/ShowSeat.model.js";

const run = async () => {
  try {
    await connectDB();

    // Clear existing data
    await Promise.all([
      City.deleteMany({}),
      Theatre.deleteMany({}),
      Screen.deleteMany({}),
      Seat.deleteMany({}),
      Movie.deleteMany({}),
      Show.deleteMany({}),
      ShowSeat.deleteMany({})
    ]);

    const city = await City.create({ name: "Hyderabad" });

    const theatre = await Theatre.create({
      name: "Inox GVK One",
      city: city._id,
      address: "GVK One Mall, Banjara Hills"
    });

    const screen = await Screen.create({
      name: "Screen 1",
      theatre: theatre._id,
      totalSeats: 40
    });

    // Create seats (4 rows x 10 seats)
    const seatDocs = [];
    const rows = ["A", "B", "C", "D"];
    for (const [rowIndex, row] of rows.entries()) {
      for (let i = 1; i <= 10; i++) {
        const seatNumber = `${row}${i}`;
        const basePrice = 200;
        const seatType =
          rowIndex < 2 ? "PREMIUM" : "REGULAR"; // front rows premium
        const price = seatType === "PREMIUM" ? basePrice + 50 : basePrice;
        seatDocs.push({
          screen: screen._id,
          seatNumber,
          row,
          seatType,
          price
        });
      }
    }
    const createdSeats = await Seat.insertMany(seatDocs);

    const movies = await Movie.insertMany([
      {
        title: "Interstellar",
        language: "English",
        genre: ["Sci-Fi", "Drama"],
        duration: 169,
        rating: 8.6,
        posterUrl: "https://www.themoviedb.org/t/p/original/nCbkOyOMTEwlEV0LtCOvCnwEONA.jpg",
        description:
          "A team of explorers travel beyond this galaxy to discover whether mankind has a future among the stars."
      },
      {
        title: "Inception",
        language: "English",
        genre: ["Sci-Fi", "Thriller"],
        duration: 148,
        rating: 8.8,
        posterUrl: "https://www.themoviedb.org/t/p/original/edv5CZvWj09upOsy2Y6IwDhK8bt.jpg",
        description:
          "A skilled thief leads a team into dreams to steal secrets from deep within the subconscious."
      },
      {
        title: "Avengers: Endgame",
        language: "English",
        genre: ["Action", "Adventure", "Sci-Fi"],
        duration: 181,
        rating: 8.4,
        posterUrl: "https://www.themoviedb.org/t/p/original/ulzhLuWrPK07P1YkdWQLZnQh1JL.jpg",
        description: "The Avengers assemble once more to undo the devastation caused by Thanos."
      },
      {
        title: "RRR",
        language: "Telugu",
        genre: ["Action", "Drama"],
        duration: 187,
        rating: 8.0,
        posterUrl: "https://www.themoviedb.org/t/p/original/wE0I6efAW4cDDmZQWtwZMOW44EJ.jpg",
        description:
          "A fictional story about two legendary revolutionaries and their journey away from home."
      },
      
      {
        title: "3 Idiots",
        language: "Hindi",
        genre: ["Comedy", "Drama"],
        duration: 170,
        rating: 8.4,
        posterUrl: "https://www.themoviedb.org/t/p/original/66A9MqXOyVFCssoloscw79z8Tew.jpg",
        description: "Three friends navigate college life while questioning the meaning of success."
      },
      {
        title: "KGF: Chapter 2",
        language: "Kannada",
        genre: ["Action", "Drama"],
        duration: 168,
        rating: 8.2,
        posterUrl: "https://www.themoviedb.org/t/p/original/khNVygolU0TxLIDWff5tQlAhZ23.jpg",
        description: "Rocky consolidates his power as enemies plot his downfall."
      }
    ]);

    // Create shows for today and next 7 days for each movie
    const shows = [];
    for (const movie of movies) {
      for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
        const showDate = new Date();
        showDate.setDate(showDate.getDate() + dayOffset);
        showDate.setHours(0, 0, 0, 0); // Set to start of day

        // Create 3 shows per day: 10:00, 14:00, 18:00
        const timeSlots = [10, 14, 18];
        for (const hour of timeSlots) {
          const startTime = new Date(showDate);
          startTime.setHours(hour, 0, 0, 0);
          const endTime = new Date(startTime);
          endTime.setHours(hour + 3, 0, 0, 0);

          shows.push({
            movie: movie._id,
            theatre: theatre._id,
            screen: screen._id,
            showDate,
            startTime,
            endTime,
            price: 200,
            priceMultiplier: 1
          });
        }
      }
    }

    const createdShows = await Show.insertMany(shows);

    // Create show seats for all shows
    for (const show of createdShows) {
      const showSeatDocs = createdSeats.map((seat) => ({
        show: show._id,
        seat: seat._id,
        status: "AVAILABLE"
      }));
      await ShowSeat.insertMany(showSeatDocs);
    }

    console.log("Seed data created successfully");
  } catch (err) {
    console.error("Seeding error:", err);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

run();

