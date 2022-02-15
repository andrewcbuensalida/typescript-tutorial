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

function emptyTransactions() {
	console.log(`Emptying transactions`);
	const ul = document.querySelector(".item-list") as HTMLUListElement;
	while (ul.firstChild) {
		ul.removeChild(ul.lastChild as Node);
	}
}
async function getTransactions(typeFilter: string) {
	console.log(`Fetching transactions`);
	emptyTransactions();
	const resultJSON: Response = await fetch(`/api/v1/${typeFilter}`);
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
getTransactions("all");

form.addEventListener("submit", async (e: Event) => {
	e.preventDefault();

	const type = document.querySelector("#type") as HTMLSelectElement;
	const tofrom = document.querySelector("#tofrom") as HTMLInputElement;
	const details = document.querySelector("#details") as HTMLInputElement;
	const amount = document.querySelector("#amount") as HTMLInputElement;
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
		body: JSON.stringify({
			type: type.value,
			tofrom: tofrom.value,
			details: details.value,
			amount: amount.value,
			timeStamp,
			table: "transactions",
		}),
	});
	const result = await resultJSON.json();

	const messageDiv = document.querySelector("#message") as HTMLDivElement;
	messageDiv.innerText = result.message;

	if (result.ok) {
		addTransaction(
			type.value,
			tofrom.value,
			details.value,
			amount.valueAsNumber,
			timeStamp,
			result.myPartitionKey
		);
		// clear form
		tofrom.value = "";
		details.value = "";
		amount.value = "";
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

const typeFilter = document.querySelector("#typeFilter") as HTMLSelectElement;
typeFilter.addEventListener("change", () => {
	getTransactions(typeFilter.value);
});
