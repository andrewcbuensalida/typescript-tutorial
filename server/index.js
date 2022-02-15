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
		IndexName: "type-timeStamp-index",
		// use this if using query instead of scan
		// KeyConditionExpression: "#type = :type",
		// ExpressionAttributeValues: {
		// 	":type": "invoice",
		// },
		// ExpressionAttributeNames: { "#type": "type" },
		FilterExpression: "#type=:type",
		ExpressionAttributeNames: { "#type": "type" },
		ExpressionAttributeValues: {
			":type": "payment",
		},
		// ProjectionExpression: "timeStamp, type",
		ScanIndexForward: false,
	};

	// use query when looking for specific transactions, because it requires a partition key, which is the myPartitionKey which is unique to each transaction
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

app.put("/api/v1", (req, res) => {
	const params = {
		TableName: "transactions",
		Key: {
			myPartitionKey: req.body.myPartitionKey,
		},
		UpdateExpression: "set details = :d",
		ExpressionAttributeValues: {
			":d": req.body.details,
		},
		ReturnValues: "ALL_NEW",
	};

	console.log("Updating the item...");
	docClient.update(params, function (err, data) {
		if (err) {
			console.error(
				"Unable to update item. Error JSON:",
				JSON.stringify(err, null, 2)
			);
			res.status(400).json({ ok: false });
		} else {
			console.log("UpdateItem succeeded:", JSON.stringify(data, null, 2));
			res.status(200).json({ ok: true, item: data.Attributes });
		}
	});
});

app.delete("/api/v1", (req, res) => {
	const params = {
		TableName: "transactions",
		Key: {
			myPartitionKey: req.body.myPartitionKey,
		},
		ReturnValue: "",
	};
	docClient.delete(params, (err, data) => {
		if (err) {
			console.error(
				"Unable to delete item. Error JSON:",
				JSON.stringify(err, null, 2)
			);
			res.status(400).json({ ok: false });
		} else {
			console.log("DeleteItem succeeded:", JSON.stringify(data, null, 2));
			res.status(200).json({ ok: true });
		}
	});
});

app.listen(PORT, () => console.log(`Listening to port ${PORT}`));
