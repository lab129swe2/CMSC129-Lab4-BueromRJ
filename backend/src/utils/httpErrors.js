function jsonError(res, status, message) {
  return res.status(status).json({ error: message });
}

module.exports = { jsonError };

