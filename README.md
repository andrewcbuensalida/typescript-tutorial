https://www.youtube.com/watch?v=fPYbNXzXP6M&list=PL4cUxeGkcC9gUgr39Q_yD6v-bSyMwKPUI&index=21

workflow: go into client folder, tsc -w so that typescript auto converts .ts files to .js. 


to connect to dynamodb https://www.youtube.com/watch?v=QLkkexbQ0qs

to connect, have to be logged into aws cli, and have to know the public and private key to the IAM user. 

dynamodb is stupid because you cant even sort a query unless you supply a partition key, which is an attribute you want to filter. actually, if you just set the partition key for the index as the table name, youll be able to sort.