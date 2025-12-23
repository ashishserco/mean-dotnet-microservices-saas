# Security Design

## 1. Authentication & Authorization

### OAuth2 & JWT
- **Stateless Auth**: We use JSON Web Tokens (JWT) for authentication.
- **Flow**:
    1. User logs in with credentials.
    2. `User Service` validates and issues a signed JWT (Access Token).
    3. Client stores JWT (HttpOnly Cookie or Secure Storage).
    4. Client sends JWT in `Authorization: Bearer <token>` header for subsequent requests.

### Role-Based Access Control (RBAC)
Roles are embedded in the JWT payload:
- **Employee**: Can view own profile, enroll in benefits, submit claims.
- **HR Admin**: Can view all employees, approve/reject claims, manage benefits catalog.
- **Platform Admin**: System configuration, tenant management.

**Middleware Implementation**:
Each service has a middleware that:
1. Verifies JWT signature.
2. Decodes payload.
3. Checks `roles` array against required permission for the endpoint.

## 2. Secure API Patterns
- **HTTPS Everywhere**: All traffic encrypted in transit.
- **Input Validation**: Strict validation using libraries like `Joi` (Node) or `FluentValidation` (.NET) to prevent Injection attacks.
- **Rate Limiting**: Implemented at the Gateway level to prevent DoS.
- **CORS**: Strictly configured to allow only trusted domains.

## 3. Data Security
- **Encryption at Rest**: MongoDB encrypted storage engine.
- **Tenant Isolation**:
    - **Logical Isolation**: `tenantId` field in every document.
    - **Query Injection**: Middleware automatically injects `tenantId` into every DB query to ensure users never see data from other tenants.

## 4. AI Governance
- **PII Redaction**: Before sending data to OpenAI, the `AI Service` scrubs Personally Identifiable Information (PII) to ensure privacy compliance.
- **Audit Logging**: Every AI interaction is logged with the prompt, response, and user ID for audit trails.
