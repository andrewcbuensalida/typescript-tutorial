import { Invoice } from "./classes/Invoice.js";
import { Payment } from "./classes/Payment.js";
import { ListTemplate } from "./classes/ListTemplate.js";
const ul = document.querySelector(".item-list");
const list = new ListTemplate(ul);
const form = document.querySelector(".new-item-form");
form.addEventListener("submit", (e) => {
    e.preventDefault();
    const type = document.querySelector("#type");
    const tofrom = document.querySelector("#tofrom");
    const details = document.querySelector("#details");
    const amount = document.querySelector("#amount");
    if (type.value === "invoice") {
        const invoice = new Invoice(tofrom.value, details.value, amount.valueAsNumber);
        list.render(invoice, "something", "end");
    }
    else {
        const payment = new Payment(tofrom.value, details.value, amount.valueAsNumber);
        list.render(payment, type.value, "end");
    }
});
