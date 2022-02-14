const express = require("express");
const PORT = process.env.PORT || 3100;
const app = express();
// to serve front-end
app.use(express.static("../client/public"));
// needed so req.body wont be undefined
app.use(express.json())

app.post("/api/v1", (req, res) => {
	console.log(`This is req.body`);
	console.log(req.body);

	res.send("hi");
});

app.listen(PORT, () => console.log(`Listening to port ${PORT}`));
