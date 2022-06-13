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
function emptyTransactions() {
    console.log(`Emptying transactions`);
    const ul = document.querySelector(".item-list");
    while (ul.firstChild) {
        ul.removeChild(ul.lastChild);
    }
}
function getTransactions(typeFilter) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(`Fetching transactions`);
        emptyTransactions();
        const resultJSON = yield fetch(`/api/v1/${typeFilter}`);
        const { transactions } = yield resultJSON.json();
        transactions.forEach((transaction) => {
            const { type, tofrom, details, amount, timeStamp, myPartitionKey } = transaction;
            addTransaction(type, tofrom, details, amount, timeStamp, myPartitionKey);
        });
    });
}
getTransactions("all");
form.addEventListener("submit", (e) => __awaiter(void 0, void 0, void 0, function* () {
    e.preventDefault();
    const type = document.querySelector("#type");
    const tofrom = document.querySelector("#tofrom");
    const details = document.querySelector("#details");
    const amount = document.querySelector("#amount");
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
        body: JSON.stringify({
            type: type.value,
            tofrom: tofrom.value,
            details: details.value,
            amount: amount.value,
            timeStamp,
            table: "transactions",
        }),
    });
    const result = yield resultJSON.json();
    const messageDiv = document.querySelector("#message");
    messageDiv.innerText = result.message;
    if (result.ok) {
        addTransaction(type.value, tofrom.value, details.value, amount.valueAsNumber, timeStamp, result.myPartitionKey);
        // clear form
        tofrom.value = "";
        details.value = "";
        amount.value = "";
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
    const myPartitionKey = saveUpdateBtn.getAttribute("data-mypartitionkey");
    console.log(`This is myPartitionKey`);
    console.log(myPartitionKey);
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
            details: detailsArea.value,
            myPartitionKey: myPartitionKey,
        }),
    });
    const { ok, item } = yield responseJSON.json();
    console.log(`This is response`);
    console.log(item);
    //if successfully updated
    if (ok) {
        const fullDetails = document.querySelector(`[data-mypartitionkey='${myPartitionKey}'] p`);
        if (fullDetails.getAttribute("data-type") === "invoice") {
            fullDetails.innerText = `${item.tofrom} owes ${item.amount} sol for ${item.details}`;
        }
        else {
            fullDetails.innerText = `${item.tofrom} paid ${item.amount} sol for ${item.details}`;
        }
        saveUpdateBtn.innerText = "Changes saved!";
        setTimeout(() => {
            const modalClose = document.querySelector(".close");
            modalClose.click();
        }, 500);
    }
    else {
        saveUpdateBtn.innerText = "Try again";
    }
}));
const typeFilter = document.querySelector("#typeFilter");
typeFilter.addEventListener("change", () => {
    getTransactions(typeFilter.value);
});
//Testing if pm2 load balancer works
function getFooterCompany() {
    return __awaiter(this, void 0, void 0, function* () {
        const footerCompanyElement = document.getElementById("footerCompany");
        const footerCompanyJSON = yield fetch("/getFooterCompany");
        const { footerCompanyName, footerCompanyType } = yield footerCompanyJSON.json();
        footerCompanyElement.innerText = footerCompanyName + footerCompanyType;
    });
}
getFooterCompany();
