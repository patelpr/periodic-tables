# Periodic Tables Backend

See [../README.md](../README.md) for detailed instructions.

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





