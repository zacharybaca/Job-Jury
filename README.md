## 

# Job-Jury

_“Don't just take the job. Hear the jury.”_

Zachary Baca

# Overview

This is a web application that will give users a platform to review their current or former place of employment. In return, this will provide other users of the platform un-biased reviews on the workplace environment.

# Goals

The problem that this application will help solve is the lack of transparency within the workplace. Users of the platform will be able to see if the company they are interested in working for aligns with their views, before they even go in for their interview.

# Specifications

## **Database Schema(s)**

### User Schema

### Company Schema

### Review Schema

## **Frontend Component Layout**

- Layout Components
    - Navbar: Includes search bar and user profile/login.
    - Footer: Standard links and "Add a Company" CTA.

- Company Components
    - CompanyCard: Small preview used in search results.
    - CompanyHeader: Large hero section with the image you mentioned and the average rating.
    - ImageUpload: A specific component for handling file selection and previewing.

- Review Components
    - ReviewList: Maps through the array of reviews.
    - ReviewForm: The Star-rating system and text areas.

- Utility Components
    - ProtectedRoute: To ensure only logged-in users can post reviews.
    - SearchBar: With live filtering for industries and locations.

# 

# API Routes

<div class="joplin-table-wrapper"><table><thead><tr><th colspan="3"><h2><a id="_73u84sd8xeko"></a><strong>Company and Reviews API Endpoints</strong></h2></th></tr><tr><th><p>📩 <strong>Method</strong></p></th><th><p>📧 <strong>Description</strong></p></th><th><p>📨 <strong>Endpoint</strong></p></th></tr></thead><tbody><tr><td><p>GET</p></td><td><p>Fetch all or filter by industry/location</p></td><td><p>/api/companies</p></td></tr><tr><td><p>POST</p></td><td><p>Create a new company (and upload image)</p></td><td><p>/api/companies</p></td></tr><tr><td><p>GET</p></td><td><p>Fetch an individual company</p></td><td><p>/api/companies/:companyId</p></td></tr><tr><td><p>PUT</p></td><td><p>Update an individual company’s information</p></td><td><p>/api/companies/:companyId</p></td></tr><tr><td><p>POST</p></td><td><p>Add a review and update the Company’s avgRating</p></td><td><p>/api/reviews/:companyId</p></td></tr><tr><td><p>GET</p></td><td><p>Fetch all reviews for an individual company</p></td><td><p>/api/reviews/:companyId</p></td></tr><tr><td><p>DELETE</p></td><td><p>Delete a review for an individual company</p></td><td><p>/api/reviews/:companyId/:reviewId</p></td></tr><tr><td><p>POST</p></td><td><p>Allows a user to up-vote a review</p></td><td><p>/api/reviews/:reviewId/vote</p></td></tr></tbody></table></div>

<div class="joplin-table-wrapper"><table><thead><tr><th colspan="3"><h2><a id="_m7t0w66qpanv"></a><strong>Authentication API Endpoints</strong></h2></th></tr><tr><th><p>📩 <strong>Method</strong></p></th><th><p>📧 <strong>Description</strong></p></th><th><p>📨 <strong>Endpoint</strong></p></th></tr></thead><tbody><tr><td><p>POST</p></td><td><p>User Signup</p></td><td><p>/api/auth/register</p></td></tr><tr><td><p>GET</p></td><td><p>Fetch a specific user</p></td><td><p>/api/users/:userId</p></td></tr><tr><td><p>DELETE</p></td><td><p>Delete a specific user</p></td><td><p>/api/users/:userId</p></td></tr><tr><td><p>PUT</p></td><td><p>Update a specific user</p></td><td><p>/api/users/:userId</p></td></tr></tbody></table></div>

<div class="joplin-table-wrapper"><table><thead><tr><th colspan="3"><h2><a id="_95jvabhc3qw4"></a><strong>Admin Only API Endpoints</strong></h2></th></tr><tr><th><p>📩 <strong>Method</strong></p></th><th><p>📧 <strong>Description</strong></p></th><th><p>📨 <strong>Endpoint</strong></p></th></tr></thead><tbody><tr><td><p>PUT</p></td><td><p>Suspend a user</p></td><td><p>/api/admin/suspend/:userId</p></td></tr><tr><td><p>PUT</p></td><td><p>Flag a review posted by a user</p></td><td><p>/api/admin/flag-review/:reviewId</p></td></tr><tr><td><p>GET</p></td><td><p>Fetch all users</p></td><td><p>/api/admin/users</p></td></tr><tr><td><p>DELETE</p></td><td><p>Delete a specific user</p></td><td><p>/api/admin/users/:userId</p></td></tr></tbody></table></div>

## **Technology Stack & Third-Party Libraries**

**Base Technology Stack**

- Database
    - MongoDB
    - Mongoose Middleware for Database Querying
    - Cloudinary for Image Storage
    - Multer for Image Storage and Retrieval
- Frontend Framework and Application State Management
    - ReactJS
    - Context API for State Management
- Backend Framework
    - NodeJS for Server Environment
    - ExpressJS for Server Creation and Manipulation
- Security and Authentication
    - JWT with HTTP-Only Cookies for Authentication “Core”
    - BcryptJS for Password Hashing
    - Express-Validator for Password Requirements Validation
    - Express-Rate-Limit to Prevent Spam
    - HelmetJS to Improve Security
    - CORS to Improve Security
    - DOTEnv for Environment Variables and Secrets
