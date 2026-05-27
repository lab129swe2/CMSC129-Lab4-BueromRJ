function requireAuth(_req, res) {
  res.status(401).json({ error: "Unauthorized" });
}

module.exports = { requireAuth };

