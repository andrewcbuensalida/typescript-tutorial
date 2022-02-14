import { Invoice } from "./classes/Invoice.js";
import { Payment } from "./classes/Payment.js";
import { ListTemplate } from "./classes/ListTemplate.js";
import { HasFormatter } from "./interfaces/HasFormatter.js";

const ul = document.querySelector(".item-list") as HTMLUListElement;
const list = new ListTemplate(ul);

const form = document.querySelector(".new-item-form") as HTMLFormElement;

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
		body: JSON.stringify({ type, tofrom, details, amount }),
	});

	if (type === "invoice") {
		const invoice: HasFormatter = new Invoice(tofrom, details, amount);
		list.render(invoice, type, "end");
	} else {
		const payment: HasFormatter = new Payment(tofrom, details, amount);
		list.render(payment, type, "end");
	}
});
