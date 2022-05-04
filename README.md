# Periodic Tables

A restaurant manager reached out and wanted an application to manage reservations and available seating at a restaurant.  

They want to create a new reservation when a customer calls so that they know how many customers will arrive at the restaurant on a given day. Upon initiating the app it should display the reservations for the current day.
After creating a reservation, the app will show all the reservations for the day of your reservation. They only want to allow reservations to be created on a day when the restaurant is open and during business hours, so that reservations are not  accidentally created for days they are closed. This particular restaurant is open everyday except Tuesday, will open at 10:30AM and disable the ability to make reservations 1 hour before close, which is at 9:30 PM

When a customer with an existing reservation arrives at the restaurant, they want to seat (assign) the customers reservation to a specific table, so that they know which tables are occupied and  which are free. They also want to be able to free up an occupied table when the guests leave, so that  new guests can be seated at that table. The manager wants each reservation to have a status of either booked, seated, or finished, so that they  can see which reservation parties are seated, and finished reservations are hidden from the dashboard.

They want the ability to search for a reservation by phone number (partial or complete), so that they can quickly access a customer's reservation when they call about their reservation. The manager wants to be able to modify a reservation if a customer calls to change or cancel their reservation, so that reservations are accurate and current.

## TECH USED
Click Frontend or Backend to view the App results.
| [Frontend](https://periodic-tables-front.herokuapp.com/)| [Backend](https://periodic-tables-back.herokuapp.com/reservations)|Testing|
|--|--|--|
| React  | Node.js |Jest|
|React-Router|Express|Puppeteer|
|React-Hooks|Knex ||
|Javascript|Cors||
|HTML / JSX|Dotenv||
|CSS|||
|Bootstrap|||

## INSTALLATION

    git clone https://github.com/patelpr/periodic-tables.git periodic-tables
    cd periodic-tables/back-end
    touch .env
Please input your postgreSQL database URI string in the .env file as:  

    DATABASE_URL=enter-your-production-database-url-here
    DATABASE_URL_DEVELOPMENT=enter-your-development-database-url-here
    DATABASE_URL_TEST=enter-your-test-database-url-here
    DATABASE_URL_PREVIEW=enter-your-preview-database-url-here

then from the command line run

    cd .. && npm i && npm run start:dev
Voila!

## DATA
### ROUTES

| Method | Endpoint | Description |
|--|--|--|
|GET|/reservations|Get list of all reservations|
|POST|/reservations|Create a new reservation|
|PUT |/reservations/:reservation_id/status | Update Status of Table |
|GET|/reservations/:reservation_id|Get reservation by ID|
|PUT|/reservations/:reservation_id|Update reservation by ID|
|GET|/tables/free|List non-occupied tables|
|PUT|/tables/:table_id/seat|Update Table to Occupied|
|DELETE|/tables/:table_id/seat|Update Table to Free|
|GET|/tables|Get list of all tables|

### RESERVATIONS

The `reservations` table represents reservations to the restaurant. Each reservation has the following fields:

- `reservation_id`: (Primary Key)
- `first_name`: (String) The first name of the customer.
- `last_name`: (String) The last name of the customer.
- `mobile_number`: (String) The customer's cell number.
- `reservation_date`: (Date) The date of the reservation.
- `reservation_time`: (Time) The time of the reservation.
- `people`: (Integer) The size of the party.
- `Status`: (String) The reservation status can be _booked, seated, finished, or cancelled_ and defaults to _booked._

An example record looks like the following:

```json
  {
    "first_name": "Rick",
    "last_name": "Sanchez",
    "mobile_number": "202-555-0164",
    "reservation_date": "2020-12-31",
    "reservation_time": "20:00:00",
    "people": 6,
    "status": "booked"
  }
```

### TABLES

The `tables` table represents the tables that are available in the restaurant. Each table has the following fields:

- `table_id`: (Primary Key)
- `table_name`: (String) The name of the table.
- `capacity`: (Integer) The maximum number of people that the table can seat.
- `reservation_id`: (Foreign Key) The reservation - if any - that is currently seated at the table.

An example record looks like the following:

```json
  {
    "table_name": "Bar #1",
    "capacity": 1,
    "reservation_id": 8,
  }
```





