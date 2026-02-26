# Endpoints Details

Below is a list of all used API endpoints in the project, with their use and file path.

---

## src/api/auth.ts
- **POST https://dev.authentication.payplatter.in/auth/sign-in**
  - Use: User login (function: login)
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
