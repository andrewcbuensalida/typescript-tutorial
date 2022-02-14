export class Invoice {
    constructor(client, details, amount, timeStamp) {
        this.client = client;
        this.details = details;
        this.amount = amount;
        this.timeStamp = timeStamp;
    }
    // string isnt needed because typescript can infer return type from return statement
    format() {
        return `${this.client} owes $${this.amount} for ${this.details}`;
    }
}
