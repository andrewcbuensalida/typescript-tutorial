import { HasFormatter } from "../interfaces/HasFormatter";

export class Invoice implements HasFormatter {
	constructor(
		readonly client: string,
		public details: string,
		private amount: number,
		public timeStamp: string,
		public myPartitionKey: string
	) {}

	// string isnt needed because typescript can infer return type from return statement
	format(): string {
		return `${this.client} owes ${this.amount} sol for ${this.details}`;
	}
}

