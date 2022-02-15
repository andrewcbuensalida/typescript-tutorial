export interface HasFormatter{
	details: string;
	myPartitionKey: string;
	timeStamp: string;
    format():string
}