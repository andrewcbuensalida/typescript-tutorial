const express = require("express");
const uuidv4 = require("uuid");
const {
	DynamoDBClient,
	ScanCommand,
	PutItemCommand,
} = require("@aws-sdk/client-dynamodb");

const client = new DynamoDBClient({ region: "us-west-1" });

const PORT = process.env.PORT || 3100;
const app = express();
// to serve front-end
app.use(express.static("../client/public"));
// needed so req.body wont be undefined
app.use(express.json());

app.get("/api/v1", async (req, res) => {
	console.log(`fetching transactions`);
	const params = {
		TableName: "transactions",
	};
	const command = new ScanCommand(params);
	const transactions = await client.send(command);
	console.log(`This is transactions`);
	console.log(transactions.Items);

	res.status(200).json({ transactions: transactions.Items });
});

app.post("/api/v1", async (req, res) => {
	const myPartitionKey = uuidv4.v4();

	var params = {
		TableName: "transactions",
		Item: {
			myPartitionKey: { S: myPartitionKey },
			type: { S: req.body.type },
			tofrom: { S: req.body.tofrom },
			details: { S: req.body.details },
			amount: { N: req.body.amount.toString() },
			timeStamp: { S: req.body.timeStamp },
		},
	};
	const command = new PutItemCommand(params);

	try {
		await client.send(command);
		res.status(200).json({ ok: true, message: "Transaction saved!" });
	} catch (err) {
		console.error(err);
		res.status(400).json({ ok: false, message: "Transaction failed!" });
	}
});

app.listen(PORT, () => console.log(`Listening to port ${PORT}`));
