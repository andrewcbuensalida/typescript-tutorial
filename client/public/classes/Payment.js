export class Payment {
    constructor(recipient, details, amount, timeStamp) {
        this.recipient = recipient;
        this.details = details;
        this.amount = amount;
        this.timeStamp = timeStamp;
    }
    format() {
        return `${this.recipient} paid $${this.amount} for ${this.details}`;
    }
}
