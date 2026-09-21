# 🚀 Event Announcement System

A serverless event announcement platform built with **HTML, CSS, JavaScript and AWS**.

Users can subscribe with their email address and receive event announcements through **Amazon SNS**. An event creator can submit event details through the web interface, which are sent through **API Gateway → AWS Lambda → SNS**.

> **Repository purpose:** This project is documented as a reproducible tutorial. It contains frontend source code, documentation, and a place for project screenshots. It does **not** contain AWS credentials, secret keys, or private account access.

## ✨ Features

- Responsive event announcement website
- Email subscription
- Event creation and broadcast
- Email notifications through Amazon SNS
- Serverless backend with AWS Lambda
- HTTP APIs using Amazon API Gateway
- Static website hosting using Amazon S3
- CORS configuration for browser-to-API requests

## 🏗️ Architecture

```text
                    USER
                     |
                     v
              +---------------+
              |   Amazon S3   |
              | Static Website|
              +-------+-------+
                      |
                 HTTP API calls
                      |
                      v
              +---------------+
              | API Gateway   |
              +-------+-------+
                      |
              +-------+-------+
              |               |
              v               v
        Subscribe Lambda  Create Event Lambda
              |               |
              +-------+-------+
                      |
                      v
                Amazon SNS
                      |
                      v
              Email Subscribers
```

## ☁️ AWS Services

| Service | Purpose |
|---|---|
| Amazon S3 | Hosts the static frontend |
| Amazon API Gateway | Exposes HTTP API endpoints |
| AWS Lambda | Runs subscription and event logic |
| Amazon SNS | Manages email subscriptions and notifications |
| AWS IAM | Controls Lambda permissions |

## 📁 Repository Structure

```text
Event-Announcement-System/
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
├── screenshots/
│   └── README.md
├── README.md
└── .gitignore
```

## 🛠️ Build From Scratch

### 1. Create an SNS topic

In the AWS Console, go to **Amazon SNS → Topics → Create topic**.

Choose:
- Type: **Standard**
- Name: `event-announcements`

Copy the Topic ARN for use in your Lambda configuration. Do not commit credentials or other private AWS information to this repository.

### 2. Add an email subscription

Go to **SNS → Topics → event-announcements → Create subscription**.

Set:
- Protocol: **Email**
- Endpoint: **your email address**

Confirm the subscription from the email sent by SNS.

### 3. Create the subscription Lambda

Go to **AWS Lambda → Create function**.

Create:

`EventSubscribeFunction`

Runtime:

`Python 3.13`

The function reads an email address from the request body and calls SNS `Subscribe`.

Required execution-role permission:

`sns:Subscribe`

Restrict the resource to your own SNS topic ARN.

### 4. Create the event Lambda

Create:

`EventCreateFunction`

Runtime:

`Python 3.13`

The function receives event information and publishes a formatted notification using SNS.

Required execution-role permission:

`sns:Publish`

Restrict the resource to your own SNS topic ARN.

Example event:

```json
{
  "title": "SRINATHON 3.0",
  "date": "6 November 2026",
  "location": "SIT Mangaluru",
  "description": "24-hour inter-college technical hackathon"
}
```

### 5. Create API Gateway

Go to **Amazon API Gateway → Create API → HTTP API**.

Create these routes:

```text
POST /subscribe
        ↓
EventSubscribeFunction

POST /create-event
        ↓
EventCreateFunction
```

Copy the API Gateway invoke URL for your own deployment.

### 6. Configure CORS

Enable CORS on the HTTP API so the browser can call the API.

For development, allow the required methods:
- POST
- OPTIONS

Allow the `Content-Type` header.

For production, restrict `Access-Control-Allow-Origin` to the actual website origin instead of using a wildcard.

### 7. Configure the frontend

Open `frontend/script.js`.

Find:

```javascript
const API_BASE_URL = "YOUR_API_GATEWAY_URL";
```

Replace the placeholder with **your own API Gateway base URL** when deploying your own copy.

The GitHub version intentionally uses a placeholder so this repository does not publish the author's live AWS endpoint.

### 8. Test locally

Run the frontend through a local web server and test:

1. Email subscription
2. SNS confirmation
3. Event creation
4. SNS notification
5. Email delivery

### 9. Create an S3 bucket

Go to **Amazon S3 → Buckets → Create bucket**.

Choose a globally unique bucket name and your desired AWS Region.

Upload:

```text
index.html
style.css
script.js
```

### 10. Enable S3 static website hosting

Open **S3 → Your Bucket → Properties**.

Find **Static website hosting**.

Enable website hosting and set:

```text
Index document: index.html
```

Save the configuration.

### 11. Configure access

For the traditional direct S3 website endpoint, configure the bucket's public-access settings and a bucket policy that permits only `s3:GetObject` for website objects.

Example:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::YOUR-BUCKET-NAME/*"
    }
  ]
}
```

Replace `YOUR-BUCKET-NAME` with your own bucket name.

> **Note:** Direct public S3 website hosting is useful for learning this architecture. For a production deployment, consider CloudFront with HTTPS and a private S3 origin.

### 12. Open the website

Go to **S3 → Your Bucket → Properties → Static website hosting** and open the website endpoint shown by S3.

## 🧪 Example API Requests

### Subscribe

```json
{
  "email": "your-email@example.com"
}
```

### Create event

```json
{
  "title": "AWS Cloud Workshop",
  "date": "25 September 2026",
  "location": "SIT Mangaluru",
  "description": "Hands-on AWS cloud computing workshop."
}
```

## 🔄 Application Flow

### Subscribe

```text
User
 ↓
S3 Website
 ↓
POST /subscribe
 ↓
API Gateway
 ↓
EventSubscribeFunction
 ↓
Amazon SNS
 ↓
Email confirmation
```

### Create Event

```text
Event creator
 ↓
S3 Website
 ↓
POST /create-event
 ↓
API Gateway
 ↓
EventCreateFunction
 ↓
Amazon SNS
 ↓
Confirmed subscribers
 ↓
Email notification
```

## 📸 Screenshots

Project screenshots belong in the `screenshots/` folder.

Recommended screenshots:

| # | Screenshot |
|---|---|
| 01 | Website homepage |
| 02 | Event cards |
| 03 | Subscribe form |
| 04 | Create event form |
| 05 | SNS topic |
| 06 | Lambda functions |
| 07 | API Gateway routes |
| 08 | S3 bucket |
| 09 | S3 static website hosting |
| 10 | Email notification |

**Important:** Before uploading AWS Console screenshots, hide account IDs, email addresses, access keys, tokens, and any other sensitive information that you do not want publicly visible.

## 🔐 Security Notes

Never commit:

- AWS access keys
- AWS secret access keys
- IAM passwords
- Private tokens
- `.env` files containing secrets

The Create Event endpoint in this learning project should be protected with authentication and authorization before being exposed to untrusted users.

## 🚀 Future Improvements

- Admin authentication
- Amazon CloudFront and HTTPS
- Custom domain
- DynamoDB event storage
- Event edit/delete functionality
- Admin dashboard
- CI/CD with GitHub Actions
- Infrastructure as Code with AWS CloudFormation
- Event search and filtering

## 🎓 What I Learned

- Serverless AWS architecture
- Amazon S3 static website hosting
- AWS Lambda
- API Gateway HTTP APIs
- Amazon SNS
- IAM least-privilege permissions
- CORS
- Event-driven architecture
- Frontend-to-cloud integration
- Cloud deployment

## 👨‍💻 Author

**Anush Kulal**

GitHub: https://github.com/Anush-kulal
