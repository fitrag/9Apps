const cors = require("cors");
const express = require("express");
const PORT = process.env.PORT || 3000;
const app = express();

const nineapps = require("./data/nineapps");

app.use(cors());

app.use("/api", nineapps);
app.use("/", (req, res) => {
  res.json({
    message: "REst API 9Apps",
    author: "Fadila Fitra Kusuma Jaya",
    website: "https://fitlabdev.com",
  });
});

app.listen(PORT, () => {
  console.log("Server berjalan di port http://localhost:" + PORT);
});
