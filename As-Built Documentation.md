# As-Built (Current State) – BubbleBoard Web Hosting

# Overview (Current Implementation)

BubbleBoard is a web-based social media analytics dashboard. At the current stage of development, the core web infrastructure has been successfully deployed using AWS services. The app is accessible through a custom domain over HTTPS served through a CloudFront distribution backed by an S3 static website bucket, and uses AWS Cognito for user authentication. Users can access through the site, authenticate through Cognito, and be redirected back to the application. This established the foundation for secure frontend delivery and identity management prior to implementing backend data services and analytics features.

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

User → Route 53 (DNS) → CloudFront (HTTPS) → S3 (Static Site)

  ↓

  AWS Cognito (Auth)

### Components used:

Route 53: Domain registration and DNS

S3: Static website hosting for frontend files

CloudFront: CDN + HTTPS termination

AWS Certificate Manager (ACM): TLS certificate for custom domain

AWS Cognito: User authentication (hosted UI)

Frontend: Static HTML (placeholder for future Vue build)

## Current Frontend State

- Frontend is still using **static HTML** (placeholder UI)
- Deployed through S3 + CloudFront
- Login button redirects to Cognito Hosted UI
- After login, user is redirected back to the site
- No Vue build deployed yet (planned next step)

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

## What’s Not Implemented Yet (By Design)

- Vue frontend build and deployment
- Backend APIs (Lambda + API Gateway)
- Database (DynamoDB/RDS)
- Reddit API integration
- Analytics pipeline
- Tableau/Power BI embedding
- CI/CD pipeline

## Next Development Steps

1.  Initialize Vue project
2.  Replace static HTML with Vue build output
3.  Re-deploy Vue build to S3 + CloudFront
4.  Integrate Cognito auth into Vue app properly
5.  Add logout handling
6.  Begin backend API (Lambda + API Gateway)
7.  Connect Reddit API
8.  Decide and implement data storage
9.  Start building analytics views

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
