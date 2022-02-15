var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export class ListTemplate {
    // can do this format if there is an access modifier
    constructor(container) {
        this.container = container;
    }
    // start|end means it could either be 'start' or 'end'
    render(item, heading, pos) {
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
        const saveUpdateBtn = document.querySelector("#saveUpdate");
        updateBtn.addEventListener("click", (e) => {
            // e.stopPropagation();
            saveUpdateBtn.innerText = "Save changes";
            saveUpdateBtn.setAttribute("data-mypartitionkey", item.myPartitionKey);
            const modalTitle = document.getElementById("exampleModalLongTitle");
            modalTitle.innerText = "Update";
            detailsArea.value = item.details;
            const modalBody = document.querySelector(".modal-body");
            modalBody.replaceChildren(detailsArea);
        });
        updateBtn.innerText = "Update";
        const deleteBtn = document.createElement("button");
        deleteBtn.addEventListener("click", (e) => __awaiter(this, void 0, void 0, function* () {
            e.stopPropagation();
            // delete transaction
            console.log(`delete`);
            const responseJSON = yield fetch("/api/v1", {
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
            const response = yield responseJSON.json();
            if (response.ok) {
                li.remove();
            }
        }));
        deleteBtn.innerText = "Delete";
        bottomRight.append(updateBtn, deleteBtn);
        bottom.append(fullDetails, bottomRight);
        li.append(bottom);
        if (pos === "start") {
            this.container.prepend(li);
        }
        else {
            this.container.append(li);
        }
    }
}
