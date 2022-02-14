import { Invoice } from "./classes/Invoice.js";
import { Payment } from "./classes/Payment.js";
import { ListTemplate } from "./classes/ListTemplate.js";
import { HasFormatter } from "./interfaces/HasFormatter.js";

const ul = document.querySelector(".item-list") as HTMLUListElement;
const list = new ListTemplate(ul);

const form = document.querySelector(".new-item-form") as HTMLFormElement;

form.addEventListener("submit", async (e: Event) => {
	e.preventDefault();

	const type = document.querySelector("#type") as HTMLSelectElement;
	const tofrom = document.querySelector("#tofrom") as HTMLInputElement;
	const details = document.querySelector("#details") as HTMLInputElement;
	const amount = document.querySelector("#amount") as HTMLInputElement;

	await fetch("/api/v1", {
		method: "POST",
		// mode: "cors", // no-cors, *cors, same-origin
		// cache: "no-cache",
		// credentials: "same-origin",
		headers: {
			"Content-Type": "application/json",
		},
		// redirect: "follow",
		// referrerPolicy: "no-referrer",
		body: JSON.stringify({ x: "hello there", y: "coool" }),
	});

	if (type.value === "invoice") {
		const invoice: HasFormatter = new Invoice(
			tofrom.value,
			details.value,
			amount.valueAsNumber
		);
		list.render(invoice, type.value, "end");
	} else {
		const payment: HasFormatter = new Payment(
			tofrom.value,
			details.value,
			amount.valueAsNumber
		);
		list.render(payment, type.value, "end");
	}
});
