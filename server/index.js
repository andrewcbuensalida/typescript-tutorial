const express = require("express");
require("dotenv").config();
const PORT = process.env.PORT || 3100;
const app = express();

app.get("/hello", (req, res) => res.send("hi"));

app.listen(PORT, () => console.log(`Listening to port ${PORT}`));
