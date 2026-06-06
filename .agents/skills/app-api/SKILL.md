---
name: app-api
description: When I ask you to write API calls, fetch data, or create frontend `services`
---

# Read and write API calls

1. ALWAYS read `./.docs/api-docs.json` first to understand the endpoints, HTTP methods, required payloads, and response structures.
2. Use the exact paths and data types defined in that document.
3. If an endpoint requires authentication (like a Bearer token), ensure the frontend request includes it.
4. Save fetching function to `services/` as server action
