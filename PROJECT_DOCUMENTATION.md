# CareQueue --- Project Documentation

## 1. Project Title

**CareQueue: Hospital Queue & Appointment System**

## 2. Project Objective

Build and deploy a simple hospital appointment system using a 3-tier
architecture on Google Cloud Platform.

The project demonstrates how a frontend, backend, and database can be
deployed as separate logical layers and connected using cloud networking
and load-balancing services.

## 3. Problem Statement

Hospitals receive appointment requests from patients. A basic digital
system can collect patient details and store appointment requests in a
centralized database.

The application allows a user to submit:

-   Patient name
-   Phone number
-   Hospital department

The request is stored with an initial appointment status of `waiting`.

## 4. Architecture Design

### 4.1 Presentation Tier

The presentation tier contains the frontend website.

Components:

-   Frontend files
-   Nginx
-   Compute Engine frontend Managed Instance Group
-   External HTTP Load Balancer

Responsibilities:

-   Display the appointment form
-   Collect patient information
-   Send appointment requests
-   Display the success response

### 4.2 Application Tier

The application tier contains the backend service.

Components:

-   Python Flask application
-   Docker container
-   Compute Engine backend Managed Instance Group
-   Internal HTTP Load Balancer

Responsibilities:

-   Receive API requests
-   Process appointment data
-   Connect to the database
-   Return responses
-   Provide the health endpoint

### 4.3 Data Tier

The data tier uses Cloud SQL for PostgreSQL.

Responsibilities:

-   Store appointment records
-   Maintain appointment information
-   Provide persistent data storage

No database names, usernames, IP addresses, passwords, project IDs, or
other environment-specific values are included in this document.

## 5. Network Design

### VPC Network

The VPC provides the private networking environment for the application
components.

### Subnets

Separate application and load-balancer networking components were
configured according to the deployment design. Specific CIDR ranges are
intentionally omitted from this public documentation.

### Cloud NAT

Cloud NAT allows private backend instances to access required outbound
services without requiring external IP addresses on the backend
instances.

## 6. Load Balancer Design

### External Load Balancer

The external load balancer provides public access to the frontend
application.

``` text
Internet → External Load Balancer → Frontend MIG
```

### Internal Load Balancer

The internal load balancer provides private communication from the
frontend tier to the backend tier.

``` text
Frontend Nginx → Internal Load Balancer → Backend MIG
```

The frontend uses the relative API path:

``` text
/api/appointments
```

## 7. Backend Container

The backend runs in a Docker container and exposes the application on
its configured application port.

Health endpoint:

``` text
/api/health
```

Example health test:

``` bash
curl http://localhost:<BACKEND_PORT>/api/health
```

Expected response:

``` json
{"status":"healthy"}
```

## 8. Database Design

The application stores appointment data in an appointments table.

The table contains fields representing:

-   Patient name
-   Phone number
-   Department
-   Appointment status
-   Creation timestamp

The default status observed for submitted records is:

``` text
waiting
```

A database verification query can be run in the selected application
database:

``` sql
SELECT * FROM appointments;
```

Do not include screenshots containing real patient details, passwords,
credentials, or private infrastructure information in a public
repository.

## 9. Appointment Request Flow

1.  The user submits the form.
2.  The frontend sends a POST request to `/api/appointments`.
3.  Nginx forwards the API request to the internal load balancer.
4.  The internal load balancer selects a healthy backend instance.
5.  Flask processes the request.
6.  The backend inserts the appointment into PostgreSQL.
7.  The frontend displays the confirmation response.

## 10. Testing and Verification

The following tests were completed:

-   Frontend access through the external load balancer
-   Backend health endpoint
-   Frontend-to-backend communication
-   Appointment submission
-   Database record verification

These tests confirmed that the main application flow was functioning.

## 11. Security and Production Considerations

Recommended improvements:

1.  Enable HTTPS.
2.  Use a custom domain.
3.  Restrict firewall rules.
4.  Remove unused instances and resources.
5.  Use least-privilege IAM roles.
6.  Store credentials in Secret Manager.
7.  Add authentication for hospital staff.
8.  Validate and sanitize all input.
9.  Add structured logging and monitoring.
10. Use a production application server.
11. Configure backups and recovery testing.
12. Avoid publishing sensitive infrastructure details.


## 12. Project Status

### Completed

-   Frontend deployment
-   Backend Docker deployment
-   Cloud SQL connection
-   VPC and subnet configuration
-   Cloud NAT configuration
-   Backend Managed Instance Group
-   Frontend Managed Instance Group
-   External load balancer
-   Internal load balancer
-   Health checks
-   Appointment submission
-   Database verification

### Recommended Next Phase

-   Harden firewall rules
-   Configure HTTPS
-   Add monitoring
-   Add an admin dashboard
-   Improve automated deployment
-   Remove unused resources

## 13. Repository

Add your public repository URL here. Do not include private URLs,
credentials, access tokens, or infrastructure secrets.
