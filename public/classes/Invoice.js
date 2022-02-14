export class Invoice {
    constructor(client, details, amount) {
        this.client = client;
        this.details = details;
        this.amount = amount;
    }
    // string isnt needed because typescript can infer return type from return statement
    format() {
        return `${this.client} owes $${this.amount} for ${this.details}`;
    }
}
