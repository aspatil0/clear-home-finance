# Endpoints Details

Below is a list of all used API endpoints in the project, with their use and file path.



---

## Backend Express Endpoints

### Auth Endpoints
- **POST /auth/login** — User login

### Flats Endpoints
- **POST /flats/** — Create a new flat
- **GET /flats/society/:societyId** — Get all flats for a society
- **DELETE /flats/:id** — Delete a flat by ID
- **PUT /flats/:id** — Update a flat by ID

### Invoices Endpoints
- **GET /invoices/health** — Health check for invoices router
- **GET /invoices/** — Get all invoices
- **POST /invoices/generate** — Generate invoices
- **GET /invoices/:invoiceNumber** — Get invoice by invoice number
- **PUT /invoices/:invoiceNumber/pay** — Mark invoice as paid

### Maintenance Endpoints
- **GET /maintenance/:societyId** — Get maintenance config for a society
- **POST /maintenance/:societyId** — Update maintenance config for a society

### Societies Endpoints
- **GET /societies/:id** — Get society by ID
- **PUT /societies/:id** — Update society by ID
- **POST /societies/** — Create a new society

### Users Endpoints
- *(No endpoints defined yet)*
- **POST https://dev.authentication.payplatter.in/auth/verify_token**
  - Use: Verify access token (function: verifyToken)

## src/api/flats.ts
- **GET /flats/society/{societyId}**
  - Use: Get all flats for a society (function: getFlats)
- **POST /flats**
  - Use: Create a new flat (function: createFlat)
- **DELETE /flats/{id}**
  - Use: Delete a flat (function: deleteFlat)
- **PUT /flats/{id}**
  - Use: Update a flat (function: updateFlat)

## src/api/invoices.ts
- **GET /invoices?societyId={societyId}**
  - Use: Get all invoices for a society (function: getInvoices)
- **POST /invoices/generate**
  - Use: Generate invoices for a society (function: generateInvoices)
- **GET /invoices/{id}**
  - Use: Get invoice details (function: getInvoice)
- **PUT /invoices/{invoiceNumber}/pay**
  - Use: Mark invoice as paid (function: markInvoicePaid)

## src/api/maintenance.ts
- **GET /maintenance/{societyId}**
  - Use: Get maintenance config for a society (function: getMaintenanceConfig)
- **POST /maintenance/{societyId}**
  - Use: Update maintenance config for a society (function: updateMaintenanceConfig)

## src/api/societies.ts
- **GET /societies/{id}**
  - Use: Get society details (function: getSociety)
- **PUT /societies/{id}**
  - Use: Update society details (function: updateSociety)
- **POST /societies**
  - Use: Create a new society (function: createSociety)

---

**Note:**
- All endpoints are relative to the backend API base URL, which is set via environment variables or defaults to `http://localhost:5000`.
- Some endpoints (like authentication) use a fixed external URL.
- This list covers all endpoints used in the main API files. For navigation or route usage, see the React Router configuration in `src/App.tsx`.
