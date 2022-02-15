const express = require("express");
const uuidv4 = require("uuid");
var AWS = require("aws-sdk");

AWS.config.update({
	region: "us-west-1",
});

var docClient = new AWS.DynamoDB.DocumentClient();

const PORT = process.env.PORT || 3100;
const app = express();
// to serve front-end
app.use(express.static("../client/public"));
// needed so req.body wont be undefined
app.use(express.json());

app.get("/api/v1", (req, res) => {
	console.log(`fetching transactions`);
	const params = {
		TableName: "transactions",
	};

	docClient.scan(params, function (err, data) {
		if (err) {
			console.error(
				"Unable to read item. Error JSON:",
				JSON.stringify(err, null, 2)
			);
		} else {
			console.log("GetItem succeeded:", JSON.stringify(data, null, 2));
			res.status(200).json({ transactions: data.Items });
		}
	});
});

app.post("/api/v1", (req, res) => {
	const myPartitionKey = uuidv4.v4();

	var params = {
		TableName: "transactions",
		Item: {
			myPartitionKey: myPartitionKey,
			type: req.body.type,
			tofrom: req.body.tofrom,
			details: req.body.details,
			amount: req.body.amount.toString(),
			timeStamp: req.body.timeStamp,
		},
	};

	console.log("Adding a new item...");
	docClient.put(params, function (err, data) {
		if (err) {
			console.error(
				"Unable to add item. Error JSON:",
				JSON.stringify(err, null, 2)
			);
			res.status(400).json({ ok: false, message: "Transaction failed!" });
		} else {
			console.log("Added item:", JSON.stringify(data, null, 2));
			res.status(200).json({
				ok: true,
				message: "Transaction saved!",
				myPartitionKey,
			});
		}
	});
});

app.put("/api/v1", async (req, res) => {
	console.log(`This is req.body`);
	console.log(req.body);

	const params = {
		TableName: "transactions",
		Key: {
			myPartitionKey: { S: req.body.myPartitionKey },
		},
		UpdateExpression: "set details = :d",
		ExpressionAttributeValues: {
			":d": req.body.details,
		},
	};
	const command = new UpdateItemCommand(params);
	try {
		const responseJSON = await client.send(command);
		res.status(200).json({ ok: true });
	} catch (err) {
		console.log(err);
		res.status(400).json({ ok: false });
	}
});

app.listen(PORT, () => console.log(`Listening to port ${PORT}`));
