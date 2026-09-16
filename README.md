# CareQueue --- Hospital Queue & Appointment System

CareQueue is a beginner-friendly **3-tier hospital appointment
application** deployed on Google Cloud Platform (GCP).

The application allows users to submit hospital appointment requests
through a web interface. Requests travel through a public load balancer,
reach the frontend tier, are forwarded through a private internal load
balancer to the backend tier, and are stored in a managed PostgreSQL
database.


## Project Overview

-   Frontend hosted on a Compute Engine Managed Instance Group
-   Nginx for serving frontend files
-   Flask backend running inside Docker
-   Backend Managed Instance Group
-   External HTTP Load Balancer for public access
-   Internal HTTP Load Balancer for frontend-to-backend communication
-   Cloud SQL for PostgreSQL
-   VPC network and subnets
-   Cloud NAT for outbound access from private backend instances
-   Firewall rules and health checks

## Architecture

``` text
User / Browser
      |
      v
External HTTP Load Balancer
      |
      v
Frontend Managed Instance Group
(Nginx + Frontend Files)
      |
      | /api/* reverse proxy
      v
Internal HTTP Load Balancer
      |
      v
Backend Managed Instance Group
(Flask + Docker)
      |
      v
Cloud SQL for PostgreSQL
```

## Technologies Used

  Layer              Technology
  ------------------ -------------------------------------------
  Frontend           HTML, CSS, JavaScript
  Web server         Nginx
  Backend            Python Flask
  Containerization   Docker
  Database           Cloud SQL for PostgreSQL
  Compute            Google Compute Engine
  Scaling            Managed Instance Groups
  Networking         VPC, subnets, Cloud NAT, firewall rules
  Load balancing     External and internal HTTP Load Balancers
  Source control     Git and GitHub

## Application Flow

1.  A user opens the public website.
2.  The external load balancer forwards the request to a frontend VM.
3.  Nginx serves the frontend website.
4.  The frontend sends appointment data to `/api/appointments`.
5.  Nginx forwards API requests to the internal load balancer.
6.  The internal load balancer routes the request to a healthy backend
    VM.
7.  The Flask backend processes the request.
8.  The backend stores the appointment in Cloud SQL PostgreSQL.
9.  A success response is returned to the frontend.

## API Endpoints

  Method   Endpoint              Purpose
  -------- --------------------- ---------------------------
  GET      `/api/health`         Checks backend health
  POST     `/api/appointments`   Creates a new appointment

## Validation Completed

-   The frontend website opened through the external load balancer.
-   The backend health endpoint returned a healthy response.
-   Frontend-to-backend communication through the internal load balancer
    worked.
-   Appointment submission succeeded through the public website.
-   The submitted appointment was verified in Cloud SQL.
-   The saved appointment contained the expected information and an
    initial `waiting` status.

## Local Development

Clone the repository:

``` bash
git clone <YOUR_REPOSITORY_URL>
cd <YOUR_PROJECT_FOLDER>
```

Run the frontend and backend using the project's local configuration and
required environment variables.

Never commit passwords, API keys, database credentials, service-account
keys, secret `.env` files, or personal/patient information.

## Security Considerations

Before production use:

-   Configure HTTPS with a managed SSL certificate.
-   Restrict firewall rules to necessary sources.
-   Use least-privilege IAM permissions.
-   Store secrets in Secret Manager.
-   Add authentication and authorization.
-   Validate and sanitize user input.
-   Configure logging, monitoring, and alerting.
-   Remove unused cloud resources.
-   Use a production WSGI server such as Gunicorn.
-   Configure database backups and recovery procedures.

## Learning Outcomes

This project demonstrates:

-   3-tier architecture
-   Frontend, backend, and database communication
-   Internal and external load balancing
-   Managed Instance Groups
-   Cloud SQL integration
-   Private backend networking
-   Cloud NAT usage
-   Firewall configuration
-   Health checks
-   Application and database verification

## Author

Add your preferred public profile or repository link here.
