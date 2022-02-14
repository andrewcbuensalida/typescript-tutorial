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
form.addEventListener("submit", (e) => __awaiter(void 0, void 0, void 0, function* () {
    e.preventDefault();
    const { value: type } = document.querySelector("#type");
    const { value: tofrom } = document.querySelector("#tofrom");
    const { value: details } = document.querySelector("#details");
    const { valueAsNumber: amount } = document.querySelector("#amount");
    yield fetch("/api/v1", {
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
        const invoice = new Invoice(tofrom, details, amount);
        list.render(invoice, type, "end");
    }
    else {
        const payment = new Payment(tofrom, details, amount);
        list.render(payment, type, "end");
    }
}));
