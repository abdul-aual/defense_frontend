# Rentwise — Frontend

## Design and Implementation of a Web-Based Vehicle Rental Management System

Rentwise is a web-based vehicle rental management system developed as a university defense project. The frontend provides a responsive and user-friendly interface for customers, administrators, and super administrators to interact with the vehicle rental platform.

The frontend is built using **React, TypeScript, and Vite** and communicates with the Rentwise backend through RESTful APIs.

---

## Project Overview

Rentwise allows customers to search for available rental vehicles, select rental dates, provide pickup information, make bookings, view booking history, and cancel eligible bookings.

The administrative side provides vehicle management, maintenance scheduling, customer management, booking management, and administrator management features.

### Main Objectives

* Provide an easy-to-use vehicle rental interface
* Allow customers to search for available vehicles
* Provide date-restricted vehicle searching and booking
* Manage vehicle information and availability
* Support customer booking and cancellation
* Provide booking history for customers
* Provide administrative vehicle and booking management
* Implement role-based access for administrators and super administrators
* Maintain synchronization between bookings and vehicle availability

---

# Features

## Customer Features

### Vehicle Search

Customers can search for vehicles using:

* Vehicle Type
* City
* Pickup Point
* Start Date
* End Date
* Time-related booking information

Currently supported vehicle types:

* Car
* SUV
* HiAce

Currently supported cities:

* Dhaka
* Rangpur
* Chattogram

---

### Smart Date Selection

The frontend restricts rental dates according to the project requirements.

* Past dates cannot be selected
* Customers can select dates from today up to the next 10 days
* Dates beyond the allowed range are disabled
* End date cannot be earlier than start date
* If the start date is moved after the current end date, the end date is automatically adjusted
* Valid dates from the next month can still be selected when they fall within the allowed range

This prevents invalid booking requests before they reach the backend.

---

### Search Preference Persistence

Rentwise stores the customer's last successful search in browser `localStorage`.

Therefore:

* Returning customers can see their previous search criteria
* Previous vehicle type and city can be restored
* Previous dates are restored only when they are still valid
* A new user receives the default search values

The search information is stored using:

```text
rentwiseSearch
```

---

## Vehicle Search Results

After searching, customers can view available vehicles along with information such as:

* Vehicle name
* Vehicle type
* Registration number
* AC type
* Number of seats
* Fuel type
* Suitcase capacity
* Daily rental price
* City
* Vehicle image
* Availability information

Customers can select **Book Now** to proceed to the booking page.

---

# Customer Booking

The booking page displays the selected vehicle and customer's selected rental information.

The rental duration is calculated inclusively.

For example:

```text
Start Date: 20 December
End Date:   22 December

Rental Days = 3
```

The total rent is calculated using:

```text
Total Rent = Daily Rent × Number of Rental Days
```

---

## Authentication-Aware Booking

If a customer tries to book without logging in:

1. The frontend validates the pickup point
2. The pending booking information is temporarily stored
3. The customer is redirected to the login page
4. After successful login, the customer is returned to the booking page
5. The booking is not automatically submitted
6. The customer can review the booking and submit it manually

Pending booking information is stored using:

```text
rentwisePendingBooking
```

This prevents customers from losing their selected vehicle and booking information during login.

---

# Customer Profile

The customer profile provides:

* Customer information
* Profile update functionality
* Booking History
* Booking cancellation
* Logout functionality

---

## Booking History

Booking History is displayed inside a responsive modal rather than directly below the profile page.

Each booking displays:

* Vehicle name
* Registration number
* Vehicle type
* City
* Pickup point
* Rental period
* Rental duration
* Daily rental price
* Total rent
* Booking status
* Booking type

Supported booking statuses include:

```text
Booked
Completed
Cancelled
```

Customers can cancel their own active `Booked` bookings.

---

# Admin Features

Administrators can manage the rental system through the Admin Dashboard.

The administrative interface includes features for:

* Vehicle Management
* Vehicle Information
* Vehicle Maintenance
* Booking Management
* Customer Information
* Administrator Management

---

# Vehicle Management

Administrators can add vehicles with information including:

* Vehicle name
* Vehicle type
* Registration number
* AC type
* Total seats
* Fuel type
* Suitcase capacity
* Daily rent price
* City
* Vehicle image

Supported vehicle types:

```text
car
SUV
HiAce
```

Supported fuel types:

```text
Petrol
Diesel
CNG
Electric
```

Supported AC types:

```text
AC
Non-AC
```

Vehicle images support:

```text
JPG
JPEG
PNG
WEBP
```

Maximum image size:

```text
5 MB
```

---

# Vehicle Management Views

The Vehicle Management interface supports:

### Add New Vehicle

Allows administrators to add a new rental vehicle.

### View Vehicle

Allows administrators to view the available vehicle information.

### Maintenance

Administrators can search for a vehicle using:

* Registration Number
* Date
* Start Time
* End Time

After selecting a vehicle, an administrator can schedule maintenance.

A vehicle under maintenance cannot be booked by customers.

---

# Booking Management

Administrators can manage bookings through the administrative interface.

The booking system supports:

* Viewing bookings
* Customer-based booking information
* Booking status management
* Completing bookings
* Cancelling bookings

The frontend communicates with the backend to keep booking and vehicle availability synchronized.

---

# Super Administrator

Rentwise supports two levels of administrative access:

### Super Admin

Super administrators have higher-level administrative privileges and can manage administrators.

### Admin

Normal administrators can perform regular administrative operations but do not have the same privileges as super administrators.

The system also supports disabling administrators instead of permanently removing them.

---

# Role-Based Access

The frontend uses authentication information provided by the backend.

Protected pages and operations require authentication.

Administrative pages require appropriate administrative privileges.

The authentication system uses:

* JWT
* Role-based authorization
* Protected routes
* Local storage token management

---

# Technology Stack

| Technology   | Purpose                       |
| ------------ | ----------------------------- |
| React        | Frontend UI                   |
| TypeScript   | Type-safe development         |
| Vite         | Development and build tool    |
| React Router | Client-side routing           |
| CSS          | Styling and responsive design |
| Fetch API    | Backend API communication     |
| LocalStorage | Token and search persistence  |

---

# Frontend Project Structure

```text
frontend/
│
├── src/
│   ├── pages/
│   │   ├── customer/
│   │   │   ├── Booking/
│   │   │   ├── Profile/
│   │   │   └── ...
│   │   │
│   │   ├── admin/
│   │   │   └── AdminDashboard/
│   │   │       ├── AdminDashboard.tsx
│   │   │       ├── AdminDashboard.css
│   │   │       └── components/
│   │   │           ├── AdminList.tsx
│   │   │           ├── AdminList.css
│   │   │           ├── AdminManagement.tsx
│   │   │           ├── AdminManagement.css
│   │   │           ├── CreateAdmin.tsx
│   │   │           ├── CreateAdmin.css
│   │   │           ├── ViewCustomer.tsx
│   │   │           └── ViewCustomer.css
│   │   │
│   │   ├── Login/
│   │   ├── SearchResults/
│   │   └── ...
│   │
│   ├── App.tsx
│   └── main.tsx
│
├── public/
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

# Important Routes

The frontend currently includes routes such as:

```text
/
 /login
 /admin-login
 /create-account
 /profile
 /admin-dashboard
 /search-results
 /booking/:vehicleId
```

---

# Installation

## 1. Clone the Repository

```bash
git clone <repository-url>
```

Navigate to the frontend directory:

```bash
cd frontend
```

---

## 2. Install Dependencies

```bash
npm install
```

---

## 3. Start Development Server

```bash
npm run dev
```

The Vite development server will normally run at:

```text
http://localhost:5173
```

---

# Production Build

To create a production build:

```bash
npm run build
```

To preview the production build:

```bash
npm run preview
```

---

# Backend Connection

The frontend communicates with the Rentwise backend running on:

```text
http://localhost:5000
```

Examples:

```text
http://localhost:5000/api/vehicle
http://localhost:5000/api/booking
```

Make sure the backend server is running before using features that require database access.

---

# Development Workflow

For local development, both servers should be running.

### Frontend

```bash
cd frontend
npm run dev
```

### Backend

```bash
cd backend
npm run dev
```

Frontend:

```text
http://localhost:5173
```

Backend:

```text
http://localhost:5000
```

---

# Team

### Team 2

**Project:** Rentwise

**Title:** Design and Implementation of a Web-Based Vehicle Rental Management System

| Name               | Student ID    |
| ------------------ | ------------- |
| Md. Abdul Aual     | CSE2301028137 |
| Jannatul Hafsa Mim | CSE2301028122 |
| Moriom Akter       | CSE2301028138 |
| Asma Banu          | CSE2301028166 |

---

# Project Status

The main customer, vehicle, booking, authentication, administrative, maintenance, and profile functionalities have been implemented for the university defense project.

---

## License

This project was developed for academic and educational purposes as part of a university defense project.
