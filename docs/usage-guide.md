# Usage Guide

## 1. Prerequisites
- Node.js 18+
- Docker & Docker Compose
- .NET 7.0 SDK (optional, if running locally without Docker)
- MongoDB (or use the Docker container)
- RabbitMQ (or use the Docker container)

## 2. Running Locally (Docker Compose)
The easiest way to run the entire system is via Docker Compose.

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/your-repo/darwinx.git
    cd darwinx
    ```

2.  **Start the stack**:
    ```bash
    docker-compose up --build
    ```
    This will start:
    - MongoDB
    - RabbitMQ
    - User Service
    - Benefits Service
    - Claims Service
    - AI Service
    - Frontend (Angular)

3.  **Access the Application**:
    - Frontend: `http://localhost:4200`
    - API Gateway (Nginx/Traefik if configured, or direct ports):
        - User Service: `http://localhost:3001`
        - Benefits Service: `http://localhost:3002`
        - Claims Service: `http://localhost:5001`

## 3. Sample User Flows

### A. Employee: Submit a Claim
1.  Log in as an Employee (e.g., `user@darwinx.com` / `password`).
2.  Navigate to **My Claims**.
3.  Click **New Claim**.
4.  Fill in details: "I visited the dentist for a root canal."
5.  Submit.
6.  Watch the status change from `PENDING` to `ANALYZING` (AI working) to `REVIEW_NEEDED`.

### B. HR Admin: Approve Claim
1.  Log in as HR Admin (e.g., `admin@darwinx.com` / `password`).
2.  Navigate to **Claims Dashboard**.
3.  View the claim submitted above.
4.  See the **AI Summary**: "Dental claim. Risk Score: 10/100 (Low Risk)."
5.  Click **Approve**.

## 4. API Usage Examples

**Login**
```bash
POST /api/users/login
{
  "email": "user@support.com",
  "password": "password"
}
```

**Get Benefits**
```bash
GET /api/benefits
Authorization: Bearer <token>
```
