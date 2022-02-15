var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Invoice } from "./classes/Invoice.js";
import { Payment } from "./classes/Payment.js";
import { ListTemplate } from "./classes/ListTemplate.js";
const ul = document.querySelector(".item-list");
const list = new ListTemplate(ul);
const form = document.querySelector(".new-item-form");
function getTransactions() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(`Fetching transactions`);
        const resultJSON = yield fetch("/api/v1");
        const { transactions } = yield resultJSON.json();
        transactions.forEach((transaction) => {
            const { type, tofrom, details, amount, timeStamp, myPartitionKey } = transaction;
            addTransaction(type, tofrom, details, amount, timeStamp, myPartitionKey);
        });
    });
}
getTransactions();
form.addEventListener("submit", (e) => __awaiter(void 0, void 0, void 0, function* () {
    e.preventDefault();
    const { value: type } = document.querySelector("#type");
    const { value: tofrom } = document.querySelector("#tofrom");
    const { value: details } = document.querySelector("#details");
    const { valueAsNumber: amount } = document.querySelector("#amount");
    const timeStamp = new Date().toISOString();
    const resultJSON = yield fetch("/api/v1", {
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
    const result = yield resultJSON.json();
    const messageDiv = document.querySelector("#message");
    messageDiv.innerText = result.message;
    if (result.ok) {
        addTransaction(type, tofrom, details, amount, timeStamp, result.myPartitionKey);
    }
}));
function addTransaction(type, tofrom, details, amount, timeStamp, myPartitionKey) {
    if (type === "invoice") {
        const invoice = new Invoice(tofrom, details, amount, timeStamp, myPartitionKey);
        list.render(invoice, type, "end");
    }
    else {
        const payment = new Payment(tofrom, details, amount, timeStamp, myPartitionKey);
        list.render(payment, type, "end");
    }
}
const saveUpdateBtn = document.querySelector("#saveUpdate");
saveUpdateBtn.addEventListener("click", () => __awaiter(void 0, void 0, void 0, function* () {
    saveUpdateBtn.innerText = "Saving...";
    const detailsArea = document.querySelector("textarea");
    const details = detailsArea.value;
    const responseJSON = yield fetch("/api/v1", {
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
            details,
            myPartitionKey: saveUpdateBtn.getAttribute("data-mypartitionkey"),
        }),
    });
    const response = yield responseJSON.json();
    //if successfully updated
    if (response.ok) {
        saveUpdateBtn.innerText = "Changes saved!";
    }
    else {
        saveUpdateBtn.innerText = "Try again";
    }
}));
