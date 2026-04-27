# TR SeatFlow

TR SeatFlow is a cinema seat allocation and booking prototype developed for **Advanced Software Engineering Assessment 3**.

The project demonstrates a plan-driven software engineering approach, with emphasis on requirements, modelling, implementation, testing, and traceability.

Live App: https://project-aset-assessment-03.vercel.app/  

---

## Project Summary

TR SeatFlow is a web-based cinema booking system that allows users to browse movies, view showtimes, request seats, and complete a booking through a controlled booking flow.

The main focus of the project is the **seat allocation logic**. The system allocates seats based on group size, availability, adjacency, and viewing preference while preventing double booking.

---

## Main Features

- Movie and showtime browsing
- Visual seat map
- Automatic seat allocation
- Manual seat change option
- Temporary seat hold
- Booking confirmation
- Booking cancellation
- Booking summary page
- Lightweight admin area for managing prototype data

---

## Seat Allocation Approach

The system uses a deterministic allocation strategy.

When a user requests seats, the system prioritises:

1. Contiguous seats where possible
2. Reduced seat-map fragmentation
3. Seats closer to the horizontal centre
4. Seats within the preferred viewing zone
5. Split allocation only when a contiguous block is not available

This makes the allocation behaviour predictable, testable, and suitable for a plan-driven system.

---

## Technology Stack

- Next.js
- TypeScript
- MongoDB
- Mongoose
- Tailwind CSS
- shadcn/ui
- Vitest
- Vercel

---

## Running the Project Locally

Clone the repository:

```bash
git clone https://github.com/edward-126/project-aset-assessment-03.git
cd project-aset-assessment-03
````

Install dependencies:

```bash
npm install
```

Create a `.env.local` file:

```env
MONGODB_URI=your_mongodb_connection_string
ADMIN_USERNAME=your_admin_username
ADMIN_PASSWORD=your_admin_password
```

Run the development server:

```bash
npm run dev
```

Open:

```txt
http://localhost:3000
```

---

## Available Scripts

```bash
npm run dev
```

Runs the development server.

```bash
npm run build
```

Builds the project for production.

```bash
npm run lint
```

Runs linting checks.

```bash
npm test
```

Runs the test suite.

---

## Author

Thilina Rathnayaka
