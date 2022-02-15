import { HasFormatter } from "../interfaces/HasFormatter";

export class Payment implements HasFormatter {
	constructor(
		readonly recipient: string,
		public details: string,
		private amount: number,
		public timeStamp: string,
		public myPartitionKey:string
	) {}
	format(): string {
		return `${this.recipient} paid $${this.amount} for ${this.details}`;
	}
}
