import { HasFormatter } from "../interfaces/HasFormatter.js";

export class Invoice implements HasFormatter {
	constructor(
		readonly client: string,
		private details: string,
		public amount: number
	) {}

    // string isnt needed because typescript can infer return type from return statement
	format(): string {
		return `${this.client} owes $${this.amount} for ${this.details}`;
	}
}

