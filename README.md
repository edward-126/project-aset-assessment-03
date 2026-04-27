# TR SeatFlow

TR SeatFlow is a cinema booking application built with Next.js, TypeScript,
MongoDB, and shadcn/ui. It supports movie browsing, showtime seat maps,
automatic group allocation, manual seat selection, temporary holds, booking
confirmation and cancellation, and a lightweight admin area.

## Tech Stack

- Next.js 16 App Router
- React 19
- TypeScript
- MongoDB with Mongoose
- Tailwind CSS
- shadcn/ui
- Vitest

## Getting Started

Install dependencies:

```bash
npm install
```

Seed the application data:

```bash
npm run seed:screens
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Main Routes

- `/` - TR SeatFlow landing page with featured showtimes
- `/movies` - active movie list
- `/showtimes` - active showtime list
- `/showtimes/[showtimeId]` - showtime seat map and booking request
- `/booking/[bookingId]` - booking summary and lifecycle actions
- `/admin/login` - admin gate
- `/admin` - admin dashboard
- `/admin/movies`, `/admin/screens`, `/admin/showtimes`, `/admin/bookings`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Lint code with ESLint
- `npm run test:run` - Run tests once
- `npm run seed:screens` - Seed movies, screens, and showtimes

## Admin Access

Default local credentials are:

- Username: `admin`
- Password: `admin-123`

Set `ADMIN_USERNAME` and `ADMIN_PASSWORD` to override these values.
