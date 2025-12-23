export const adminDashboard = (req, res) => {
  res.json({
    message: "Welcome Admin 👑",
    adminId: req.user.id
  });
};
