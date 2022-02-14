import { HasFormatter } from "../interfaces/HasFormatter";

export class Payment implements HasFormatter {
	constructor(
		readonly recipient: string,
		private details: string,
		public amount: number,
		public timeStamp: string
	) {}
	format(): string {
		return `${this.recipient} paid $${this.amount} for ${this.details}`;
	}
}
