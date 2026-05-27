const { admin, initAdmin } = require("../firebase/admin");
const { jsonError } = require("../utils/httpErrors");

function getBearerToken(req) {
  const header = req.headers.authorization || "";
  const match = header.match(/^Bearer\s+(.+)$/i);
  return match?.[1] || null;
}

async function requireAuth(req, res, next) {
  const token = getBearerToken(req);

  if (!token) {
    return jsonError(res, 401, "Unauthorized");
  }

  try {
    initAdmin();
    const decoded = await admin.auth().verifyIdToken(token);
    req.user = { uid: decoded.uid };
    return next();
  } catch (_err) {
    return jsonError(res, 401, "Unauthorized");
  }
}

module.exports = { requireAuth };
