# LoopTrace ♻️
### Give E-Waste a Traceable Next Life

**LoopTrace connects households, e-waste collectors, and recyclers in one traceable workflow—from photo-assisted pickup requests to recorded recycler handoff and processing updates.**

E-waste disposal is more than a collection problem. Once an item leaves a household, people can lose visibility into who handled it, where it went, and what was recorded along the way. LoopTrace brings those operational steps into one platform and links custody events with SHA-256 hashes so inconsistencies in the stored history can be detected.

> **Our goal:** make responsible e-waste handoff easier to coordinate and the digital custody journey easier to inspect—not to claim that software alone proves physical recycling.

## Why LoopTrace?

- **Identify:** Submit an e-waste photo for Gemini-powered image analysis and supported safety information.
- **Coordinate:** Match requests with approved, available collectors that support the requested category, ordered by distance.
- **Track:** Record pickup, weight, recycler handoff, receipt, and processing-status transitions.
- **Inspect:** Review request details and a database-backed, hash-linked custody timeline.
- **Protect:** Use role-based access controls and private S3 photo storage with temporary, authorized retrieval URLs.

## The problem

E-waste can pass through fragmented collection channels. Households may be unsure how to dispose of electronics, collectors need requests that fit their availability and supported categories, and downstream handoffs can be difficult to follow. A simple “collected” status does not tell the whole story.

LoopTrace connects these steps while distinguishing **what the application records** from **what it can independently prove**.

## How it works

1. **Household submits a request.** Add item details, category, location, and an optional photo. Browser GPS is supported when available, with manual coordinates as a fallback.
2. **AI assists identification.** The backend sends the uploaded image to Google Gemini and parses supported category, description, safety guidance, hazards, recoverable materials, and confidence fields.
3. **Collector matching.** The system considers approved, available collectors that accept the requested category and orders eligible matches by Haversine distance. If no eligible collector is available, the request can remain unmatched for rematching.
4. **Collection is recorded.** The assigned collector accepts the request, confirms pickup, and records actual pickup weight.
5. **Custody is handed over.** The collector selects an eligible recycler and records the handoff, including a note when the handoff weight materially differs from pickup weight.
6. **Recycler updates the outcome.** The recycler confirms receipt and can record processing and completion status through the implemented workflow.
7. **The journey can be inspected.** Authorized users can review request status, actors, timestamps, available AI fields, photo access, custody events, and chain-verification results.

## Features by role

| Role / area | Capabilities |
| --- | --- |
| **Household** | Register and sign in, submit photo-assisted requests, provide GPS or manual location, use manual category fallback, track requests, view impact totals |
| **Collector** | View assigned requests, accept eligible work, confirm pickup, record actual weight, hand off to a recycler |
| **Recycler** | View assigned handoffs, confirm receipt, update processing and completion status |
| **Super Admin** | Manage participants and applications, approve or reject participants, update statuses, view eligible collectors/recyclers, manually assign pickups, view dashboard data |
| **Traceability** | Record custody events with actor, timestamp, sequence, previous hash, and event hash; verify the stored SHA-256 chain |
| **Security and storage** | BCrypt password hashing, JWT authentication, server-side role and ownership checks, private S3 objects, temporary presigned photo URLs |

## What makes LoopTrace different?

- **A connected workflow:** household request → collector pickup → recycler handoff → recycler receipt and processing updates.
- **Practical matching:** category compatibility, collector availability, and geographic distance inform eligible matches.
- **A verifiable digital history:** SHA-256-linked custody events make inconsistencies in the stored chain detectable during verification.
- **Evidence-aware claims:** the project separates application-recorded events from independent proof of physical recycling.


## Architecture

```text
Household ──┐
Collector ──┤
Recycler ───┼──> React + Vite Frontend
Super Admin ┘             |
                          v
                 Spring Boot REST API
                          |
             ┌────────────┼────────────┐
             v            v            v
        PostgreSQL    Google Gemini  Amazon S3
             |
             v
     SHA-256 Custody Tracking

Security: Spring Security + JWT
Deployment : AWS EC2
```


## Technology Stack

| Technology | Purpose |
|---|---|
| **Java 17** | Backend development |
| **Spring Boot 4.1.1** | REST APIs and business logic |
| **Spring Security + JWT** | Authentication and role-based authorization |
| **PostgreSQL + Flyway** | Database running in a Docker container on **AWS EC2**; schema migrations |
| **AWS EC2** | Backend deployment |
| **Amazon S3** | Private image storage |
| **Google Gemini** | AI-powered e-waste image analysis |
| **SHA-256** | Tamper-evident custody tracking |
| **React 19 + Vite** | Frontend development |
| **Tailwind CSS** | Responsive UI styling |

## Data integrity and custody verification

Each custody event records fields such as the request ID, sequence, step, actor, optional weight/photo key, timestamp, previous hash, and its own SHA-256 hash. Verification recomputes event hashes, checks links from the `GENESIS` value, and requires the first event to be `REQUEST_CREATED`.

**Important limitation:** this is a database-backed, tamper-evident event chain—not a blockchain, immutable storage, independent audit witness, or proof that physical recycling occurred. Someone with sufficient control over the application or database could still alter underlying records. Verification helps detect inconsistencies in the stored chain.

## Security and privacy

- Public registration supports `HOUSEHOLD`, `COLLECTOR`, and `RECYCLER`; it cannot create a `SUPER_ADMIN`.
- Passwords are hashed with BCrypt.
- Login issues JWT access tokens; the backend checks role and participant identity.
- Protected endpoints enforce server-side role and ownership checks, including approved collector/recycler requirements.
- Super Admin bootstrap uses `SUPER_ADMIN_EMAIL` and `SUPER_ADMIN_PASSWORD`; these values must remain server-side.
- Uploaded photos are stored as private S3 objects. The API records object metadata and returns temporary presigned GET URLs to an authorized owner or Super Admin.
- The runtime AWS identity needs permission to put and get photo objects. Public bucket access is not required.
- Keep secrets in ignored local environment files or the deployment environment—never commit them.
- Default development CORS allows `http://localhost:5173`; deployments need an explicitly configured origin policy.

## Screenshots and demo

The repository includes these frontend assets:

- [`looptrace.png`](looptrace-frontend/src/assets/looptrace.png)
- [`hero.png`](looptrace-frontend/src/assets/hero.png)

No hosted demo URL is listed because one has not been verified in the supplied project documentation. For judging, add genuine screenshots of the household request, collector pickup, recycler handoff, and custody timeline once captured from the running application.

## Getting started

### Prerequisites

- Java 17 or a compatible newer JDK
- PostgreSQL
- Node.js and npm
- A Gemini API key for live image analysis
- An AWS account, private S3 bucket, suitable IAM permissions for photo upload and retrieval, and an EC2 instance if deploying to AWS

### 1. Clone and configure

```bash
git clone https://github.com/abbasdx/looptrace.git
cd looptrace
```

Copy `.env.example` to `.env` and replace its placeholders with local values. Spring imports `.env` when present. **Do not commit `.env`.**

### 2. Start the backend

Flyway runs enabled database migrations during startup. The default backend port is `8080`.

**macOS / Linux**

```bash
./mvnw spring-boot:run
```

**Windows PowerShell**

```powershell
.\mvnw.cmd spring-boot:run
```

Run backend tests:

```powershell
.\mvnw.cmd test
```

### 3. Start the frontend

For local development, run the Vite frontend as shown below. For a cloud demonstration, the backend can be deployed on **AWS EC2**; configure the frontend API URL, security groups, environment variables, and database/S3 access for that deployment. Do not expose database ports or secrets publicly.


```powershell
cd looptrace-frontend
npm install
npm run dev
```

Vite normally serves the frontend at `http://localhost:5173`. Set `VITE_API_URL` if the API is hosted elsewhere; the documented default is `http://localhost:8080/api`.

## Environment variables

The names and defaults below reflect the supplied project documentation. Use actual values in your local environment; never paste secrets into the README.

| Variable | Required / default | Purpose |
| --- | --- | --- |
| `SPRING_DATASOURCE_URL` | Required for PostgreSQL | JDBC connection URL |
| `SPRING_DATASOURCE_USERNAME` | Required | Database username |
| `SPRING_DATASOURCE_PASSWORD` | Required | Database password |
| `LOOPTRACE_JWT_SECRET` | Required when auth is enabled | HMAC signing secret; use a strong secret of at least 32 characters |
| `LOOPTRACE_AUTH_ENABLED` | Optional; defaults to `true` | Enables JWT security |
| `LOOPTRACE_ACCESS_TOKEN_MINUTES` | Optional; defaults to `30` | JWT lifetime |
| `SUPER_ADMIN_EMAIL` | Required for configured bootstrap | Initial Super Admin email |
| `SUPER_ADMIN_PASSWORD` | Required for configured bootstrap | Initial Super Admin password |
| `GEMINI_API_KEY` | Required for live AI analysis | Gemini API credential |
| `GEMINI_MODEL_ID` | Optional | Configured Gemini model; verify the default against application configuration |
| `LOOPTRACE_S3_BUCKET` | Required for photo storage | Preferred private S3 bucket |
| `AWS_S3_BUCKET` | Optional fallback | Legacy bucket variable accepted by configuration |
| `AWS_REGION` | Optional; defaults to `ap-south-1` | S3 region |
| `LOOPTRACE_ADMIN_API_KEY` | Optional / legacy | Legacy admin interceptor key |
| `SPRING_FLYWAY_ENABLED` | Optional; defaults to `true` | Enables Flyway migrations |
| `PORT` | Optional; defaults to `8080` | Backend HTTP port |
| `VITE_API_URL` | Optional; defaults to `http://localhost:8080/api` | Frontend API base URL |

Use an IAM role or the AWS SDK default credential chain. A configured bucket alone is insufficient: the runtime identity also needs permission to put and get the application’s photo objects.

## API overview

Unless marked public, endpoints require `Authorization: Bearer <JWT>`. Backend role and ownership checks apply. Confirm request bodies and response schemas in the controllers/DTOs before integrating another client.

### Public and authentication

| Method | Endpoint | Access |
| --- | --- | --- |
| `POST` | `/api/auth/register` | Public; cannot register `SUPER_ADMIN` |
| `POST` | `/api/auth/login` | Public |
| `GET` | `/api/collectors` | Public reference data |
| `GET` | `/api/recyclers` | Public reference data |
| `GET` | `/api/impact` | Public impact totals |

### Household and shared request workflow

| Method | Endpoint | Access |
| --- | --- | --- |
| `POST` | `/api/analyze` | Authenticated; multipart field `image` |
| `POST` | `/api/requests` | `HOUSEHOLD` |
| `GET` | `/api/requests` | Authenticated; results filtered by role |
| `GET` | `/api/requests/{id}` | Owner, assigned operational role, or Super Admin |
| `POST` | `/api/requests/{id}/rematch` | Authorized owner / operational user |
| `GET` | `/api/requests/{id}/custody` | Authorized owner / operational user |
| `GET` | `/api/requests/{id}/custody/verify` | Authorized owner / operational user |
| `GET` | `/api/photos/presigned?key=...` | Photo owner or Super Admin |

### Collector and recycler transitions

| Method | Endpoint | Access |
| --- | --- | --- |
| `POST` | `/api/requests/{id}/accept` | Assigned `COLLECTOR` |
| `POST` | `/api/requests/{id}/pickup` | Assigned `COLLECTOR` |
| `POST` | `/api/requests/{id}/handoff` | Assigned `COLLECTOR` |
| `POST` | `/api/requests/{id}/recycler/receive` | Assigned `RECYCLER` |
| `PATCH` | `/api/requests/{id}/recycler/status` | Assigned `RECYCLER` |

### Super Admin

All `/api/admin/**` endpoints require `SUPER_ADMIN`:

```text
GET    /api/admin/dashboard
GET    /api/admin/participants
GET    /api/admin/participants/{id}
POST   /api/admin/participants
PATCH  /api/admin/participants/{id}/status
DELETE /api/admin/participants/{id}
GET    /api/admin/applications
POST   /api/admin/applications/{id}/approve
POST   /api/admin/applications/{id}/reject
GET    /api/admin/eligible-collectors
GET    /api/admin/eligible-recyclers
POST   /api/admin/pickups/{id}/assign
```

## Implementation status

### Implemented according to the supplied project notes

- Role-aware frontend routes and role-specific dashboards for household, collector, recycler, and Super Admin.
- Spring Security JWT authentication, BCrypt password hashing, participant-linked collector/recycler accounts, and server-side ownership checks.
- PostgreSQL persistence and Flyway migrations V1–V3.
- Household request creation with location and optional photo metadata.
- Gemini image-analysis request/response parsing, category normalization, safety guidance, and bounded retries for transient provider errors.
- Category-compatible, available collector matching ordered by Haversine distance, with duplicate-assignment guards.
- Collector acceptance, pickup weight, recycler handoff, recycler receipt, processing, and completion transitions.
- Custody event recording and SHA-256 chain verification.
- Impact totals endpoint and frontend impact view.

### Environment-dependent or partial

- Live photo upload and retrieval depend on a correctly configured private S3 bucket and IAM permissions. Upload and retrieval must be tested in the target environment.
- Gemini analysis requires a valid API key and an available configured model.
- Browser GPS depends on browser permission and device support; manual coordinates are the fallback.
- The custody chain detects stored-chain inconsistencies but does not independently prove physical handling or recycling.
- The default CORS policy targets `http://localhost:5173`; deployment origins require configuration.

### Not demonstrated by the supplied project notes

- A verified hosted public demo, production deployment on AWS EC2, observability, notification delivery, route optimization, or load/performance results.
- Independent recycler certificates, external audit attestations, or physical-material verification.

## Roadmap

- Add notifications for assignment, pickup, handoff, and recycler status changes.
- Add recycler documentation and review workflows for stronger operational evidence.
- Add externalized audit storage and monitoring for higher-assurance custody reporting.
- Expand matching and impact reporting as real operational data grows.
- Deploy and verify the application on AWS EC2 with deployment-specific CORS, secure secret management, restricted security groups, and production observability.

## Contributing

1. Fork the repository.
2. Create a focused feature branch.
3. Run backend tests and the frontend build.
4. Open a pull request describing the change and how it was verified.


*LoopTrace is designed to improve coordination and visibility in the e-waste journey. Real-world recycling outcomes still depend on the people, facilities, and processes behind each recorded handoff.*
