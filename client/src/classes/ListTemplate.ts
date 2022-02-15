import { HasFormatter } from "../interfaces/HasFormatter";

export class ListTemplate {
	// can do this format if there is an access modifier
	constructor(private container: HTMLUListElement) {}

	// start|end means it could either be 'start' or 'end'
	render(item: HasFormatter, heading: string, pos: "start" | "end") {
		const li = document.createElement("li");
		li.addEventListener("click", () => {
			//modal to see transaction bigger
			console.log(`hello`);
		});
		li.classList.add("transaction");
		const top = document.createElement("div");
		top.classList.add("topTransaction");
		const h4 = document.createElement("h4");
		h4.innerText = heading;
		const h4Time = document.createElement("h4");
		const localTime = new Date(item.timeStamp).toLocaleString();

		h4Time.innerText = localTime;
		top.append(h4);
		top.append(h4Time);
		li.append(top);

		const bottom = document.createElement("div");
		bottom.classList.add("bottomTransaction");
		const p = document.createElement("p");
		p.innerText = item.format();
		const bottomRight = document.createElement("div");
		bottomRight.classList.add("bottomRightTransaction");
		const updateBtn = document.createElement("button");
		updateBtn.addEventListener("click", (e) => {
			e.stopPropagation();

			// modal to update description
			console.log(`update`);
		});
		updateBtn.innerText = "Update";
		const deleteBtn = document.createElement("button");
		deleteBtn.addEventListener("click", (e) => {
			e.stopPropagation();
			// delete transaction
			console.log(`delete`);
		});
		deleteBtn.innerText = "Delete";
		bottomRight.append(updateBtn, deleteBtn);
		bottom.append(p, bottomRight);
		li.append(bottom);

		if (pos === "start") {
			this.container.prepend(li);
		} else {
			this.container.append(li);
		}
	}
}
