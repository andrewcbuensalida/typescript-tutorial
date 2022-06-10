https://www.youtube.com/watch?v=fPYbNXzXP6M&list=PL4cUxeGkcC9gUgr39Q_yD6v-bSyMwKPUI&index=21

workflow: go into client folder, tsc -w so that typescript auto converts .ts files to .js. 


to connect to dynamodb https://www.youtube.com/watch?v=QLkkexbQ0qs

to connect, have to be logged into aws cli in ubuntu, and have to know the public and private key to the IAM user. 
    sudo apt install awscli
    aws configure

Then input, this info is saved in a file in swe folder:
    AWS Access Key ID [None]: AKIAIOSFODNN7EXAMPLE
    AWS Secret Access Key [None]: wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
    Default region name [None]: us-west-1
    Default output format [None]: json

dynamodb is stupid because you cant even sort a query unless you supply a partition key, which is an attribute you want to filter. actually, if you just set the partition key for the index as the table name, youll be able to sort.


deploying ========================================================================
aws route 53, hosted zone anhonestobserver.com
create record crypto.anhonestobserver.com A record with value 50.18.72.90 which i got from compute engine up address
Install nginx if not installed yet
    sudo apt install nginx
Then edit
    sudo nano /etc/nginx/sites-available/crypto.anhonestobserver.com.conf
<!-- make sure to copy not from here -->
server {
    listen 80;
    server_name crypto.anhonestobserver.com www.crypto.anhonestobserver.com;

    location / {
        proxy_pass http://localhost:3100/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

}

Then create a symbolic link
    sudo ln -s /etc/nginx/sites-available/crypto.anhonestobserver.com.conf /etc/nginx/sites-enabled/
    sudo systemctl reload nginx
To check if syntax is alright
    sudo nginx -t
to get ssl aka https:
Install certbot
    sudo snap install --classic certbot
To register domain name, first go to route 53 and point crypto.anhonestobserver.com to ip address
    sudo certbot --nginx
Start node server
    pm2 start index.js --watch --time --name crypto
--time is for it to keep track of time
watch is so it reloads when files change, aka git pull.
to auto restart pm2 on compute engine reboot,
if you havent already, pm2 startup
if you have already, just pm2 save
ss -tnlp | grep "node /" to see what ports pm2 processes are running on.
to check logs , pm2 logs crypto --lines 50


===============================================
to uninstall aws-cli on linux
https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html


then
aws configure
then input the access key and other stuff saved in swe folder
default region: us-west-1
default output: json

then restart pm2

///////////////////////////////
For the application load balancer alb
create target group with target type instances.
Register targets.
Then create a load balancer.
Don't need elastic IP, had to create a ssl certificate for https listener, do this via acm either email validation (preferred, it'll be in spam) OR DNS record validation, then in route 53, can either do A record that's an alias to application load balancer (preferred since it automatically changes if alb DNS changes), OR CNAME that points to DNS name of alb.
////////////////////////////////
