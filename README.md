# CareQueue --- Hospital Queue & Appointment System

A beginner-friendly **3-tier hospital appointment application** deployed
on Google Cloud Platform (GCP).

The application allows a user to submit a hospital appointment request
through a web interface. The request travels through an external load
balancer, reaches the frontend tier, is proxied through an internal load
balancer to the backend tier, and is finally stored in Cloud SQL
PostgreSQL.

## Project Overview

CareQueue demonstrates how to deploy and connect the following cloud
components:

-   Frontend hosted on Compute Engine Managed Instance Group (MIG)
-   Nginx web server for serving frontend files
-   Flask backend running inside Docker
-   Backend Managed Instance Group
-   External HTTP Load Balancer for public access
-   Internal HTTP Load Balancer for frontend-to-backend communication
-   Cloud SQL PostgreSQL database
-   VPC network and subnets
-   Cloud NAT for outbound internet access from private backend
    instances
-   Firewall rules and health checks

## Architecture

``` text
User / Browser
      |
      v
External HTTP Load Balancer
      |
      v
Frontend MIG
(Nginx + Frontend Files)
      |
      | /api/* reverse proxy
      v
Internal HTTP Load Balancer
      |
      v
Backend MIG
(Flask + Docker)
      |
      v
Cloud SQL PostgreSQL
```

## Main Technologies

  Layer              Technology
  ------------------ -------------------------------------------
  Frontend           HTML, CSS, JavaScript
  Web server         Nginx
  Backend            Python Flask
  Containerization   Docker
  Database           Cloud SQL for PostgreSQL
  Compute            Google Compute Engine
  Scaling            Managed Instance Groups
  Networking         VPC, subnet, Cloud NAT, firewall rules
  Load balancing     External and internal HTTP Load Balancers
  Source control     Git and GitHub

## Core GCP Resources

  Resource                 Configuration
  ------------------------ --------------------------------------------
  GCP project              `hospital-queue-system-507208`
  Region                   `asia-south2`
  VPC                      `hospital-vpc`
  Application subnet       `hospital-subnet` --- `10.10.0.0/24`
  Proxy-only subnet        `hospital-proxy-subnet` --- `10.20.0.0/24`
  Cloud SQL instance       `hospital-db`
  Database                 `hospital`
  Backend MIG              `hospital-backend-mig`
  Frontend MIG             `hospital-frontend-mig`
  Internal load balancer   `hospital-internal-lb`
  External load balancer   `hospital-external-lb`

## Application Flow

1.  A user opens the public IP address of the external load balancer.
2.  The external load balancer forwards the request to a frontend VM in
    the frontend MIG.
3.  Nginx serves the frontend website.
4.  When the user submits an appointment, JavaScript sends a request to
    `/api/appointments`.
5.  Nginx forwards `/api/` requests to the internal load balancer.
6.  The internal load balancer forwards the request to a healthy backend
    VM.
7.  The Flask application validates and processes the request.
8.  The backend connects to Cloud SQL PostgreSQL.
9.  The appointment is saved in the `appointments` table.
10. A success response is returned to the frontend.

## Validation Completed

The following tests were completed:

-   Frontend website opened through the external load balancer.
-   Backend health endpoint returned a healthy response.
-   Internal load balancer health endpoint was reachable from the
    backend environment.
-   Appointment submission succeeded through the public website.
-   The submitted appointment was verified in Cloud SQL Studio.
-   The database record showed the expected patient, phone number,
    department, and `waiting` status.

## API Endpoints

  Method   Endpoint              Purpose
  -------- --------------------- ---------------------------
  GET      `/api/health`         Checks backend health
  POST     `/api/appointments`   Creates a new appointment

> The application currently uses the appointment creation endpoint for
> form submission. A GET endpoint for listing appointments was not
> confirmed as part of the implemented API.

## Local Development

The exact local setup depends on the files in the repository. A typical
workflow is:

``` bash
git clone https://github.com/somay-siwaag/hospital-queue.git
cd hospital-queue
```

Open the frontend files using a local web server. Run the Flask backend
using the project's backend configuration and required environment
variables.

Do not commit passwords, API keys, database credentials, or
service-account keys to GitHub.

## Security Notes

This project is intended as a learning and portfolio project. Before
production use, improve the following:

-   Configure HTTPS with a domain and managed SSL certificate.
-   Restrict firewall rules to only required source ranges.
-   Store all secrets in Secret Manager.
-   Use least-privilege IAM permissions.
-   Add authentication and authorization for administrative functions.
-   Add logging, monitoring, and alerting.
-   Remove unused or old Compute Engine instances.
-   Add input validation and stronger error handling.
-   Use a production WSGI server such as Gunicorn instead of Flask's
    development server.

## Future Improvements

-   Admin dashboard for hospital staff
-   Appointment listing and search
-   Queue number generation
-   Appointment status updates
-   Department-wise queue management
-   Authentication for staff
-   HTTPS and custom domain
-   Cloud Monitoring dashboards
-   Automated deployment using Cloud Build or GitHub Actions
-   Automated database migrations
-   Backup and recovery testing

## Learning Outcomes

This project helped demonstrate:

-   How a 3-tier architecture works
-   How frontend and backend tiers communicate
-   How to use internal and external load balancers
-   How Managed Instance Groups support scalable deployments
-   How to connect an application to Cloud SQL
-   How private backend instances use Cloud NAT
-   How health checks support load balancing
-   How to verify application data directly in a managed database

## Author

**Somay Siwag**

GitHub: https://github.com/somay-siwaag/hospital-queue
