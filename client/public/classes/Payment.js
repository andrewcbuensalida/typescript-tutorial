export class Payment {
    constructor(recipient, details, amount, timeStamp, myPartitionKey) {
        this.recipient = recipient;
        this.details = details;
        this.amount = amount;
        this.timeStamp = timeStamp;
        this.myPartitionKey = myPartitionKey;
    }
    format() {
        return `${this.recipient} paid $${this.amount} for ${this.details}`;
    }
}
