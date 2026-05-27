const { createApp } = require("./app");
const path = require("path");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config({ path: path.resolve(__dirname, "..", "..", ".env") });
}

const port = process.env.PORT
  ? Number(process.env.PORT)
  : process.env.BACKEND_PORT
    ? Number(process.env.BACKEND_PORT)
    : 3001;

const app = createApp();
app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`);
});
