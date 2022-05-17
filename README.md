# Periodic Tables

A restaurant manager reached out and wanted an application to manage reservations and available seating at a restaurant.  

They want to create a new reservation when a customer calls so that they know how many customers will arrive at the restaurant on a given day. Upon initiating the app it should display the reservations for the current day.
After creating a reservation, the app will show all the reservations for the day of your reservation. They only want to allow reservations to be created on a day when the restaurant is open and during business hours, so that reservations are not  accidentally created for days they are closed. This particular restaurant is open everyday except Tuesday, will open at 10:30AM and disable the ability to make reservations 1 hour before close, which is at 9:30 PM

When a customer with an existing reservation arrives at the restaurant, they want to seat (assign) the customers reservation to a specific table, so that they know which tables are occupied and  which are free. They also want to be able to free up an occupied table when the guests leave, so that  new guests can be seated at that table. The manager wants each reservation to have a status of either booked, seated, or finished, so that they  can see which reservation parties are seated, and finished reservations are hidden from the dashboard.

They want the ability to search for a reservation by phone number (partial or complete), so that they can quickly access a customer's reservation when they call about their reservation. The manager wants to be able to modify a reservation if a customer calls to change or cancel their reservation, so that reservations are accurate and current.

##Demo  
 [App](https://periodic-tables-front.herokuapp.com/)
 [Server](https://periodic-tables-back.herokuapp.com/reservations)
 
## TECH USED
Click Frontend or Backend to view the App results.
| [Frontend](https://github.com/patelpr/periodic-tables/tree/main/front-end/)| [Backend](https://github.com/patelpr/periodic-tables/tree/main/back-end)|Testing|
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

