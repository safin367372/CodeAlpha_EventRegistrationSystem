# CodeAlpha_EventRegistration

A backend Event Registration System built with **Node.js**, **Express.js**, and **MongoDB (Mongoose)** as part of the CodeAlpha Backend Development Internship.

##  Overview

This project allows events to be listed and viewed, and lets users register for an event, view all their registrations by email, and cancel a registration. It demonstrates a relational link between two MongoDB collections (`Event` and `Registration`) using Mongoose's `ObjectId` references and `.populate()`.

##  Tech Stack

- **Node.js** — JavaScript runtime
- **Express.js** — web server & routing
- **MongoDB Atlas** — cloud-hosted database
- **Mongoose** — MongoDB object modeling for Node.js, including schema references (`ref`) and population
- **dotenv** — environment variable management

##  Project Structure

```
codealpha-event-registration/
├── models/
│   ├── Event.js          # Mongoose schema/model for an event
│   └── Registration.js   # Mongoose schema/model for a registration, linked to an Event
├── index.js                # Express server & route handlers
├── .env                     # Environment variables (not committed to Git)
├── .gitignore
└── package.json
```

##  Setup & Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/<your-username>/CodeAlpha_EventRegistration.git
   cd CodeAlpha_EventRegistration
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the project root:
   ```
   MONGO_URI=your_mongodb_connection_string
   PORT=5001
   ```

4. **Run the server**
   ```bash
   node index.js
   ```

   You should see:
   ```
   MongoDB connected
   Server running on port 5001
   ```

##  Database Schema

**Collection: `events`**

| Field       | Type    | Description                        |
|-------------|---------|-------------------------------------|
| title       | String  | Event title (required)              |
| description | String  | Event description (optional)        |
| date        | Date    | Event date (required)               |
| location    | String  | Event location (required)           |
| createdAt   | Date    | Auto-generated timestamp            |
| updatedAt   | Date    | Auto-generated timestamp            |

**Collection: `registrations`**

| Field     | Type     | Description                                         |
|-----------|----------|------------------------------------------------------|
| name      | String   | Registrant's name (required)                        |
| email     | String   | Registrant's email (required)                        |
| event     | ObjectId | Reference to the associated `Event` document (required) |
| createdAt | Date     | Auto-generated timestamp                             |
| updatedAt | Date     | Auto-generated timestamp                             |

##  API Endpoints

### 1. List All Events

**`GET /api/events`**

Returns an array of all events in the database.

### 2. Get a Single Event

**`GET /api/events/:id`**

Returns the full details of one event by its `_id`.

**Error responses:** `404` if not found.

### 3. Create an Event *(organizer/admin use)*

**`POST /api/events`**

**Request body:**
```json
{
  "title": "Tech Fest 2026",
  "description": "Annual technical festival",
  "date": "2026-09-15",
  "location": "College Auditorium"
}
```

**Error responses:** `400` if `title`, `date`, or `location` is missing.

### 4. Register for an Event

**`POST /api/events/:id/register`**

**Request body:**
```json
{
  "name": "Safin",
  "email": "safin@example.com"
}
```

**Response (201 Created):** the created registration document, linked to the event via its `_id`.

**Error responses:**
- `400` if `name` or `email` is missing
- `404` if the event doesn't exist

### 5. View a User's Registrations

**`GET /api/registrations/:email`**

Returns all registrations for the given email, with the linked event's full details populated in place of a raw ID.

### 6. Cancel a Registration

**`DELETE /api/registrations/:id`**

**Response:** `{"message": "Registration cancelled successfully"}`

**Error responses:** `404` if the registration doesn't exist.

##  Testing the API

Using `curl`:

```bash
# Create an event
curl -X POST http://localhost:5001/api/events \
  -H "Content-Type: application/json" \
  -d '{"title": "Tech Fest 2026", "date": "2026-09-15", "location": "College Auditorium"}'

# Register for it (replace EVENT_ID with the real _id returned above)
curl -X POST http://localhost:5001/api/events/EVENT_ID/register \
  -H "Content-Type: application/json" \
  -d '{"name": "Safin", "email": "safin@example.com"}'

# View registrations for that email
curl http://localhost:5001/api/registrations/safin@example.com

# Cancel a registration (replace REGISTRATION_ID)
curl -X DELETE http://localhost:5001/api/registrations/REGISTRATION_ID
```

##  Future Improvements

- Add authentication so registrations are tied to logged-in users instead of raw email input
- Add an admin panel/route for organizers to manage events and view registrant lists
- Prevent duplicate registrations (same email registering twice for the same event)
- Add event capacity limits
- Add update/edit routes for events

##  Author

Built by Safin Mathew Sam as part of the **CodeAlpha Backend Development Internship**.

##  License

This project is for educational purposes as part of the CodeAlpha internship program.
