import { HasFormatter } from "../interfaces/HasFormatter";
import { Invoice } from "./Invoice";
import { Payment } from "./Payment";
 

export class ListTemplate {
	// can do this format if there is an access modifier
	constructor(private container: HTMLUListElement) {}

	// start|end means it could either be 'start' or 'end'
	render(item: Invoice|Payment, heading: string, pos: "start" | "end") {
		const li = document.createElement("li");
		const top = document.createElement("div")
		top.classList.add('topInvoice')
		const h4 = document.createElement("h4");
		h4.innerText = heading;
		const h4Time = document.createElement("h4");
		h4Time.innerText = item.timeStamp
		top.append(h4)
		top.append(h4Time)
		li.append(top);
		const p = document.createElement("p");
		p.innerText = item.format();
		li.append(p);

		if (pos === "start") {
			this.container.prepend(li);
		} else {
			this.container.append(li);
		}
	}
}
