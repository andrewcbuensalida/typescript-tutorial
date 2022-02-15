import { Invoice } from "./classes/Invoice.js";
import { Payment } from "./classes/Payment.js";
import { ListTemplate } from "./classes/ListTemplate.js";
import { HasFormatter } from "./interfaces/HasFormatter.js";

const ul = document.querySelector(".item-list") as HTMLUListElement;
const list = new ListTemplate(ul);

const form = document.querySelector(".new-item-form") as HTMLFormElement;

interface transaction {
	amount: number;
	tofrom: string;
	details: string;
	myPartitionKey: string;
	type: string;
	timeStamp: string;
}

async function getTransactions() {
	console.log(`Fetching transactions`);

	const resultJSON: Response = await fetch("/api/v1");
	const { transactions }: { transactions: transaction[] } =
		await resultJSON.json();

	transactions.forEach((transaction: transaction) => {
		const { type, tofrom, details, amount, timeStamp, myPartitionKey } =
			transaction;
		addTransaction(
			type,
			tofrom,
			details,
			amount,
			timeStamp,
			myPartitionKey
		);
	});
}
getTransactions();

form.addEventListener("submit", async (e: Event) => {
	e.preventDefault();

	const { value: type }: { value: string } = document.querySelector(
		"#type"
	) as HTMLSelectElement;
	const { value: tofrom }: { value: string } = document.querySelector(
		"#tofrom"
	) as HTMLInputElement;
	const { value: details }: { value: string } = document.querySelector(
		"#details"
	) as HTMLInputElement;
	const { valueAsNumber: amount }: { valueAsNumber: number } =
		document.querySelector("#amount") as HTMLInputElement;
	const timeStamp = new Date().toISOString();

	const resultJSON = await fetch("/api/v1", {
		method: "POST",
		// mode: "cors", // no-cors, *cors, same-origin
		// cache: "no-cache",
		// credentials: "same-origin",
		headers: {
			"Content-Type": "application/json",
		},
		// redirect: "follow",
		// referrerPolicy: "no-referrer",
		body: JSON.stringify({ type, tofrom, details, amount, timeStamp }),
	});
	const result = await resultJSON.json();

	const messageDiv = document.querySelector("#message") as HTMLDivElement;
	messageDiv.innerText = result.message;

	if (result.ok) {
		addTransaction(
			type,
			tofrom,
			details,
			amount,
			timeStamp,
			result.myPartitionKey
		);
	}
});

function addTransaction(
	type: string,
	tofrom: string,
	details: string,
	amount: number,
	timeStamp: string,
	myPartitionKey: string
) {
	if (type === "invoice") {
		const invoice: HasFormatter = new Invoice(
			tofrom,
			details,
			amount,
			timeStamp,
			myPartitionKey
		);
		list.render(invoice, type, "end");
	} else {
		const payment: HasFormatter = new Payment(
			tofrom,
			details,
			amount,
			timeStamp,
			myPartitionKey
		);
		list.render(payment, type, "end");
	}
}

const saveUpdateBtn = document.querySelector(
	"#saveUpdate"
) as HTMLButtonElement;

saveUpdateBtn.addEventListener("click", async () => {
	saveUpdateBtn.innerText = "Saving...";
	const detailsArea = document.querySelector(
		"textarea"
	) as HTMLTextAreaElement;
	const myPartitionKey = saveUpdateBtn.getAttribute("data-mypartitionkey");
	console.log(`This is myPartitionKey`);
	console.log(myPartitionKey);

	const responseJSON = await fetch("/api/v1", {
		method: "PUT",
		// mode: "cors", // no-cors, *cors, same-origin
		// cache: "no-cache",
		// credentials: "same-origin",
		headers: {
			"Content-Type": "application/json",
		},
		// redirect: "follow",
		// referrerPolicy: "no-referrer",
		body: JSON.stringify({
			details: detailsArea.value,
			myPartitionKey: myPartitionKey,
		}),
	});
	const { ok, item } = await responseJSON.json();
	console.log(`This is response`);
	console.log(item);

	//if successfully updated
	if (ok) {
		const fullDetails = document.querySelector(
			`[data-mypartitionkey='${myPartitionKey}'] p`
		) as HTMLParagraphElement;

		if (fullDetails.getAttribute("data-type") === "invoice") {
			fullDetails.innerText = `${item.tofrom} owes ${item.amount} sol for ${item.details}`;
		} else {
			fullDetails.innerText = `${item.tofrom} paid ${item.amount} sol for ${item.details}`;
		}
		saveUpdateBtn.innerText = "Changes saved!";
		setTimeout(() => {
			const modalClose = document.querySelector(
				".close"
			) as HTMLDivElement;
			modalClose.click();
		}, 500);
	} else {
		saveUpdateBtn.innerText = "Try again";
	}
});
