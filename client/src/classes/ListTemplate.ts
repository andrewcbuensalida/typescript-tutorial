import { HasFormatter } from "../interfaces/HasFormatter";

export class ListTemplate {
	// can do this format if there is an access modifier
	constructor(private container: HTMLUListElement) {}

	// start|end means it could either be 'start' or 'end'
	render(item: HasFormatter, heading: string, pos: "start" | "end") {
		const li = document.createElement("li");
		li.setAttribute("data-mypartitionkey", item.myPartitionKey);
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
		const fullDetails = document.createElement("p");

		fullDetails.innerText = item.format();
		fullDetails.setAttribute("data-mypartitionkey", item.myPartitionKey);
		fullDetails.setAttribute("data-type", heading);
		const bottomRight = document.createElement("div");
		bottomRight.classList.add("bottomRightTransaction");
		const updateBtn = document.createElement("button");
		updateBtn.setAttribute("type", "button");
		updateBtn.classList.add("btn", "btn-warning");
		updateBtn.setAttribute("data-toggle", "modal");
		updateBtn.setAttribute("data-target", "#exampleModalCenter");

		const detailsArea = document.createElement("textarea");
		const saveUpdateBtn = document.querySelector(
			"#saveUpdate"
		) as HTMLButtonElement;

		updateBtn.addEventListener("click", (e) => {
			// e.stopPropagation();

			saveUpdateBtn.innerText = "Save changes";
			saveUpdateBtn.setAttribute(
				"data-mypartitionkey",
				item.myPartitionKey
			);
			const modalTitle = document.getElementById(
				"exampleModalLongTitle"
			) as HTMLHeadingElement;
			modalTitle.innerText = "Update";

			detailsArea.value = item.details;
			const modalBody = document.querySelector(
				".modal-body"
			) as HTMLDivElement;
			modalBody.replaceChildren(detailsArea);
		});
		updateBtn.innerText = "Update";
		const deleteBtn = document.createElement("button");
		deleteBtn.addEventListener("click", async (e) => {
			e.stopPropagation();
			// delete transaction
			console.log(`delete`);
			const responseJSON = await fetch("/api/v1", {
				method: "DELETE",
				// mode: "cors", // no-cors, *cors, same-origin
				// cache: "no-cache",
				// credentials: "same-origin",
				headers: {
					"Content-Type": "application/json",
				},
				// redirect: "follow",
				// referrerPolicy: "no-referrer",
				body: JSON.stringify({
					myPartitionKey: item.myPartitionKey,
				}),
			});
			const response = await responseJSON.json();
			if (response.ok) {
				li.remove();
			}
		});
		deleteBtn.innerText = "Delete";
		bottomRight.append(updateBtn, deleteBtn);
		bottom.append(fullDetails, bottomRight);
		li.append(bottom);

		if (pos === "start") {
			this.container.prepend(li);
		} else {
			this.container.append(li);
		}
	}
}
