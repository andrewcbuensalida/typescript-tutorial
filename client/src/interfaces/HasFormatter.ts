export interface HasFormatter{
	myPartitionKey: string;
	timeStamp: string;
    format():string
}