import { HasFormatter } from "../interfaces/HasFormatter";

export class ListTemplate {
	// can do this format if there is an access modifier
	constructor(private container: HTMLUListElement) {}

	// start|end means it could either be 'start' or 'end'
	render(item: HasFormatter, heading: string, pos: "start" | "end") {
		const li = document.createElement("li");
		li.addEventListener("click", () => {
			//modal to see transaction bigger
			console.log(`Transaction clicked`);
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
		const description = document.createElement("p");
		description.innerText = item.format();
		const bottomRight = document.createElement("div");
		bottomRight.classList.add("bottomRightTransaction");
		const updateBtn = document.createElement("button");
		updateBtn.setAttribute("type", "button");
		updateBtn.classList.add("btn", "btn-warning");
		updateBtn.setAttribute("data-toggle", "modal");
		updateBtn.setAttribute("data-target", "#exampleModalCenter");

		updateBtn.addEventListener("click", (e) => {
			// e.stopPropagation();
			const saveUpdateBtn = document.querySelector(
				"#saveUpdate"
			) as HTMLButtonElement;
			saveUpdateBtn.innerText = "Save changes";
			saveUpdateBtn.setAttribute(
				"data-mypartitionkey",
				item.myPartitionKey
			);
			const modalTitle = document.getElementById(
				"exampleModalLongTitle"
			) as HTMLHeadingElement;
			modalTitle.innerText = "Update";
			const descriptionArea = document.createElement("textarea");
			descriptionArea.value = item.details;
			const modalBody = document.querySelector(
				".modal-body"
			) as HTMLDivElement;
			modalBody.replaceChildren(descriptionArea);
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
		bottom.append(description, bottomRight);
		li.append(bottom);

		if (pos === "start") {
			this.container.prepend(li);
		} else {
			this.container.append(li);
		}
	}
}
