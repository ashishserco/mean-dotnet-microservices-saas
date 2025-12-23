# Deployment & DevOps

## 1. Containerization (Docker)
Each service has its own `Dockerfile`. We use multi-stage builds to keep images small and secure.

**Example Node.js Dockerfile Strategy**:
1.  **Build Stage**: Install all dependencies (including dev), build TypeScript.
2.  **Production Stage**: Copy only built artifacts and `package.json`. Install only production dependencies (`npm ci --only=production`). Use a distroless or alpine base image.

## 2. Orchestration (Kubernetes)
We use Kubernetes (K8s) for production deployment.

### Manifests Structure
- **Deployments**: Define the desired state (replicas, images, resources).
- **Services**: Internal load balancing (ClusterIP).
- **Ingress**: External access routing.
- **ConfigMaps/Secrets**: Configuration injection (Environment variables).

### Scaling
- **Horizontal Pod Autoscaler (HPA)**: Automatically adds pods when CPU/Memory usage exceeds 70%.

## 3. CI/CD Pipeline
We follow a standard GitOps workflow.

### Pipeline Stages
1.  **Lint & Test**: Run `eslint` and unit tests. Fail fast.
2.  **Build & Push**: Build Docker images and push to Container Registry (ACR/Docker Hub) tagged with the commit SHA.
3.  **Deploy to Dev**: Update K8s manifests in the `dev` environment.
4.  **Integration Tests**: Run API tests against the `dev` environment.
5.  **Promote to Prod**: Manual approval gate -> Deploy to `prod`.

## 4. Environment Separation
- **Development**: Local Docker Compose or Minikube.
- **Staging**: K8s namespace `darwinx-staging`.
- **Production**: K8s namespace `darwinx-prod`.
