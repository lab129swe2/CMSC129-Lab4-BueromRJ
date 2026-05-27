const { admin, initAdmin } = require("../firebase/admin");

async function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const match = header.match(/^Bearer\s+(.+)$/i);
  const token = match?.[1];

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    initAdmin();
    const decoded = await admin.auth().verifyIdToken(token);
    req.user = { uid: decoded.uid };
    return next();
  } catch (_err) {
    return res.status(401).json({ error: "Unauthorized" });
  }
}

module.exports = { requireAuth };
