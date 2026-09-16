# CareQueue --- Project Documentation

## 1. Project Title

**CareQueue: Hospital Queue & Appointment System**

## 2. Project Objective

The objective of this project is to build and deploy a simple hospital
appointment system using a 3-tier architecture on Google Cloud Platform.

The system is designed to demonstrate how a frontend, backend, and
database can be deployed as separate logical layers and connected
securely using Google Cloud networking and load-balancing services.

## 3. Problem Statement

Hospitals receive appointment requests from patients. A basic digital
system can collect patient details and store appointment requests in a
centralized database.

This project provides a simple interface where a patient can submit:

-   Patient name
-   Phone number
-   Hospital department

The request is stored in a PostgreSQL database with an initial
appointment status of `waiting`.

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
-   Send appointment requests to the backend
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
-   Return success or error responses
-   Provide the `/api/health` endpoint

### 4.3 Data Tier

The data tier uses Cloud SQL for PostgreSQL.

Configuration:

-   Cloud SQL instance: `hospital-db`
-   Database: `hospital`
-   Database engine: PostgreSQL
-   Main table: `appointments`

Responsibilities:

-   Store appointment records
-   Maintain appointment information
-   Provide persistent data storage for the backend

## 5. GCP Network Design

### 5.1 VPC Network

VPC name:

``` text
hospital-vpc
```

The VPC provides the private networking environment for the application
components.

### 5.2 Application Subnet

``` text
Name: hospital-subnet
CIDR: 10.10.0.0/24
```

This subnet is used by the application infrastructure.

### 5.3 Proxy-only Subnet

``` text
Name: hospital-proxy-subnet
CIDR: 10.20.0.0/24
```

The proxy-only subnet supports the internal load-balancing
configuration.

### 5.4 Cloud NAT

Cloud NAT allows private backend instances to access the internet for
required outbound operations, such as downloading packages or pulling
application resources, without requiring external IP addresses on the
backend instances.

## 6. Load Balancer Design

### 6.1 External Load Balancer

The external load balancer provides public access to the frontend
application.

Request path:

``` text
Internet → External Load Balancer → Frontend MIG
```

### 6.2 Internal Load Balancer

The internal load balancer provides private communication from the
frontend tier to the backend tier.

Request path:

``` text
Frontend Nginx → Internal Load Balancer → Backend MIG
```

The frontend uses a relative API path:

``` text
/api/appointments
```

Nginx proxies API requests to the internal load balancer rather than
exposing the backend directly to the public internet.

## 7. Backend Container

The backend runs in a Docker container.

Important configuration:

-   Application port: `5000`
-   Container command: `python app.py`
-   Health endpoint: `/api/health`

Example health test from the backend VM:

``` bash
curl http://localhost:5000/api/health
```

Expected response:

``` json
{"status":"healthy"}
```

The backend health endpoint is used to confirm that the application is
running and reachable.

## 8. Database Design

The application stores appointment data in the `appointments` table.

The verified records include fields representing:

-   Patient name
-   Phone number
-   Department
-   Appointment status
-   Creation timestamp

The default status observed for submitted records is:

``` text
waiting
```

A database verification query can be executed from Cloud SQL Studio
after selecting the `hospital` database:

``` sql
SELECT * FROM appointments;
```

Important: the `hospital` database must be selected instead of the
default `postgres` database. Otherwise, PostgreSQL may report that the
`appointments` relation does not exist.

## 9. Appointment Request Flow

### Step 1: User submits the form

The user enters patient information on the public website.

### Step 2: Frontend sends the request

The frontend sends a POST request to:

``` text
/api/appointments
```

### Step 3: Nginx forwards the request

Nginx identifies the `/api/` path and forwards the request to the
internal load balancer.

### Step 4: Internal load balancer selects a backend

The internal load balancer forwards the request to a healthy backend MIG
instance.

### Step 5: Flask processes the request

The Flask application receives the JSON request and processes the
appointment information.

### Step 6: Cloud SQL stores the record

The backend inserts the appointment into the PostgreSQL database.

### Step 7: Frontend displays confirmation

The backend response is returned to the browser, and the frontend
displays an appointment confirmation message.

## 10. Testing and Verification

### 10.1 Backend Health Test

Command:

``` bash
curl http://localhost:5000/api/health
```

Result:

``` json
{"status":"healthy"}
```

Conclusion: the backend container was running and responding.

### 10.2 Frontend Test

The website was opened through the external load balancer's public IP
address.

Conclusion: the frontend tier and external load balancer were
functioning.

### 10.3 Appointment Submission Test

An appointment was submitted through the browser.

Conclusion: the frontend successfully sent a request through the
internal load balancer to the backend.

### 10.4 Database Verification Test

The appointment was checked in Cloud SQL Studio using:

``` sql
SELECT * FROM appointments;
```

Conclusion: the submitted appointment was stored successfully in Cloud
SQL.

## 11. Security and Production Considerations

The current implementation is suitable for learning and demonstration.
It should not be treated as production-ready without additional
controls.

Recommended improvements:

1.  Enable HTTPS.
2.  Use a custom domain.
3.  Restrict firewall rules to required traffic sources.
4.  Remove unused standalone instances.
5.  Use least-privilege IAM roles.
6.  Protect database credentials with Secret Manager.
7.  Add authentication for hospital staff.
8.  Validate and sanitize all input.
9.  Add structured application logging.
10. Configure Cloud Monitoring alerts.
11. Use a production application server.
12. Configure backups and test recovery procedures.

## 12. Interview Explanation

### Short Explanation

"I built a 3-tier hospital appointment system on Google Cloud. The
frontend is hosted on a Compute Engine Managed Instance Group behind an
external load balancer. Nginx forwards API requests to an internal load
balancer, which routes them to a Dockerized Flask backend running in
another Managed Instance Group. The backend connects to Cloud SQL
PostgreSQL, where appointment requests are stored. I also configured a
VPC, subnets, Cloud NAT, firewall rules, and health checks."

### ELI10 Explanation

"Imagine a hospital with three departments:

-   The reception desk is the frontend.
-   The hospital staff processing desk is the backend.
-   The records room is the database.

The external load balancer sends visitors to the reception desk. The
reception desk sends appointment requests through a private internal
route to the processing desk. The processing desk saves the information
in the records room. Managed Instance Groups allow multiple copies of
the desks to be available when needed."

## 13. Project Status

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

-   Remove unused resources
-   Harden firewall rules
-   Configure HTTPS
-   Add monitoring
-   Add an admin dashboard
-   Improve documentation with screenshots
-   Add automated deployment

## 14. Repository

GitHub repository:

https://github.com/somay-siwaag/hospital-queue
