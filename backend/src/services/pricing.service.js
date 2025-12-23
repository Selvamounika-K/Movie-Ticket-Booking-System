export const calculateTotalPrice = (seats, multiplier = 1) => {
  return seats.reduce((total, seat) => {
    return total + seat.price * multiplier;
  }, 0);
};
