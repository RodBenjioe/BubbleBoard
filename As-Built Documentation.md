# As-Built (Current State) – BubbleBoard Web Hosting

# Overview (Current Implementation)

BubbleBoard is a web-based social media analytics dashboard. It has changed from a static placeholder website with authentication to a fully functional frontend application deployed using Vue.js and integrated with a working backend API. The system now has login and logout functionality via AWS Cognito, a deployed Lambda function exposed through API Gateway, and dynamic data rendering on the dashboard page. Due to access limitations with the Reddit API, the external data source was replaced with RandomNumberAPI as a functional backend integration proof-of-concept. The system now shows complete end-to-end flow from authenticated user to backend API to dashboard display.

# Implemented Components

**Domain & DNS**

- Domain registered in Route 53
- Hosted Zone created automatically
- DNS records configured to point the domain to CloudFront
- Domain successfully resolves in a browser

**Static Website Hosting (S3)**

- S3 bucket created for frontend hosting
- Static website hosting enabled
- index.html uploaded as the default entry point
- Bucket policy configured to allow public read access (via CloudFront origin)
- Website successfully serves content

**HTTPS & CDN (CloudFront + ACM)**

- AWS Certificate Manager certificate created and validated for the domain
- CloudFront distribution created with:
    - S3 bucket as the origin
    - Custom domain attached
    - HTTPS enforced
- Website now loads over **HTTPS** with a valid certificate
- CloudFront is serving as the public entry point instead of direct S3 access

**Authentication (AWS Cognito)**

- Cognito User Pool created
- Hosted UI configured
- Frontend login flow integrated:
    - User clicks login
    - Redirects to Cognito hosted UI
    - User authenticates
    - Redirects back to the site
- Authentication flow confirmed working using the Cognito-provided domain
- Users can successfully log in through Cognito

## Architecture (For now)

High-level Flow:

User  
↓  
Route 53  
↓  
CloudFront (HTTPS)  
↓  
S3 (Vue Build Output)  
↓  
Vue Frontend  
↓  
API Gateway  
↓  
Lambda  
↓  
RandomNumberAPI

### Components used:

Route 53: Domain registration and DNS

S3: Static website hosting for frontend files

CloudFront: CDN + HTTPS termination

AWS Certificate Manager (ACM): TLS certificate for custom domain

AWS Cognito: User authentication (hosted UI)

Vue Frontend

API Gateway

Lambda

External API

## Current Frontend State

- Vue project initialized
- Static HTML replaced with Vue build output
- Vue app successfully deployed to S3
- CloudFront cache invalidated
- Dashboard page renders dynamically
- Login + Logout fully functional
- API call made from Dashboard page
- Random number rendered successfully

## Security Posture (Current)

- HTTPS enforced via CloudFront + ACM
- Authentication handled by AWS Cognito
- No direct public write access to S3
- No backend APIs exposed yet
- No secrets embedded in frontend code

## Troubleshooting & Issues Encountered

### Cognito “Page Unavailable” / Callback Errors

- Encountered repeated errors when accessing the login page directly
- Root causes included:
    - Misconfigured callback URLs
    - Incorrect domain usage (custom domain vs Cognito default domain)
    - Mismatched redirect URIs between frontend and Cognito settings
- Resolution:
    - Recreated the Cognito User Pool
    - Reconfigured callback and sign-out URLs
    - Verified correct domain and redirect flow
    - Confirmed login works using Cognito’s hosted UI domain

### HTTPS & CloudFront Configuration Issues

- Initial site was HTTP-only via S3
- Needed to:
    - Create ACM certificate in the correct region
    - Validate domain ownership
    - Attach certificate to CloudFront
    - Update DNS to point to CloudFront instead of S3
- After propagation and configuration fixes, HTTPS began working correctly

### Frontend Auth Flow Confusion

- Initially no clear sign-out or session handling
- Focus was placed on first achieving:
    - Successful login
    - Successful redirect back to site
- Decision made to **not touch working auth** until the Vue frontend is in place

### Vue Deployment Issues

- Needed to replace static HTML with Vue build output
- Correct folder structure required in S3
- CloudFront cache invalidation necessary

### CORS Errors

- API Gateway initially blocked frontend requests
- Required enabling CORS headers

### API Endpoint URL Issues

- Incorrect endpoint used initially
- Updated to correct production endpoint

### Decision to Scrap Reddit API

- Application approval not granted
- Delayed progress
- Strategic pivot to RandomNumberAPI to maintain project momentum

## Backend API Implementation

### Lambda

- Created Lambda function
- Performs external API call to RandomNumberAPI
- Returns JSON response

### API Gateway

- REST endpoint created
- Integrated with Lambda
- CORS configured
- Successfully invoked from frontend

### External API Adjustment

- Reddit API removed due to access restrictions
- Replaced with RandomNumberAPI as proof-of-concept
- Confirms end-to-end data flow

## Validation Evidence

1.  Route 53:
    - Domain registered

- - Hosted zone records pointing to CloudFront

1.  S3:
    - Bucket overview

- - Static website hosting enabled

- - Files list showing index.html

1.  CloudFront:
    - Distribution overview

- - Alternate domain name (CNAME) set

- - Certificate attached

1.  ACM:
    - Certificate showing “Issued”

1.  Cognito:
    - User Pool overview

- - App client settings (callback URLs)

- - Hosted UI configuration page

1.  Browser:
    - Your site loading over **https://** (lock icon visible)

- - Cognito login page

- - Successful redirect back to your site after login

- - Dashboard showing random number

- - Vue app running over HTTPS

## What’s Not Implemented Yet (By Design)

- Database (DynamoDB/RDS)
- Analytics pipeline
- Tableau/Power BI embedding
- CI/CD pipeline

## Next Development Steps

1.  Implement persistent data storage (DynamoDB)
2.  Replace RandomNumberAPI with real data source
3.  Improve dashboard UI/UX
4.  Add error handling
5.  Begin analytics visualization layer
6.  Implement CI/CD Pipeline

## Current Milestone Summary

- Custom domain live
- HTTPS working
- CloudFront configured
- S3 hosting working
- Cognito authentication working
- Login flow functional
- Foundation for full app established

## Acknowledgement

I had made this documentation with the help of AI (ChatGPT, Perplexity, Claude, Gemini) and all future versions of this document will be used with the help of AI
