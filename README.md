# USARC Safety Project Daedalus API README

Frontend app: https://github.com/boraelci/daedalus <br />
Backend api: https://github.com/boraelci/daedalus-api

## Running the App
To run the app, run server.js located in daedalus-api/ by running "node server.js" on the command line. 

Server.js starts a server socket on port 8080 on the localhost. It then connects to the POSTGRESQL database, and then waits for clients to connect to the server. Once the client connects to the server socket, the server routes the user to the facilities page. 

From this page, the user can either navigate to the test and contaminant pages, or the user can interact with the POSTGRESQL data. The backend API allows users to alter, create, search, and delete database information. Currently, the application is designed to only affect one data element at a time; there is no bulk insert functionality.

## Facility Model
Each facility data follows a model, containing the following information in order:

- Facility ID: Number, cannot be changed by user
- RPUID: Number
- Site Name: String
- Site CD: String
- RPSUI: String
- STACO: String
- Latitude Coordinates: String
- Longitude Coordinates: String
- Street Name: String
- City Name: String
- State Name: String
- Zip Code: String
- County Name: String
- Full Address: String
- Site Reporting:
- Installation Name: String

## Tests Model
Each piece of testing data follows a model, containing the following information in order:

- Test ID: Number, cannot be changed by user
- Facility ID: Number, foreign key to Facility Table
- Date: DateTime
- Contaminant Name: String
- Result: String

## Contaminant Model
Each contaminant follows a model, containing the following information in order:

- Contaminant Name: String, cannot be changed by user
- Safe Text: String
- Warning Text: String





## API Pages
The backend pages are all located within daedalus-api/routes. There are three main pages, each with the ability to add new data via a form:

- **The Facility Page** is the page that pulls facility data from the backend for the user. This data does not contain any reference to contaminant levels or testing data; instead, it merely contains information about the site’s location and name. This page also contains an add facility button, allowing users to fill out facility information for a new data element. **NOTE**: The database requires a unique facilityID for every facility.
- **The Testing Page** is the page that pulls testing data from the backend for the user. This page concerns the actual contaminant testing being done, and serves to link the facility data and the contaminant data while also providing a contaminant result to the user. This page also contains an add test button, allowing users to fill out testing information for a new data element. **NOTE**: The database requires a unique testID for every test. The facility ID and contaminant name provided with the testing data must already exist in the database, or the new test will not be able to be added.
- **The Contaminant Page** is the page that pulls contaminant data from the backend for the user. This page merely contains the contaminant name, and the warning text to be displayed for the given contaminant. This page also contains an add contaminant button, allowing users to fill out contaminant information for a new data element. **NOTE**: All contaminants need a unique name that cannot already exist in the database. Also, while the backend supports multiple contaminants, the frontend currently only supports lead contamination data.





## Credits
Project Daedalus was developed by Team Daedalus, the members are: Bora Elci, David Cendejas, Jorge Mederos, and Kerim Kurttepeli. Special thanks to Wonny Kim, John Waldie and Khalil Jackson.

## License
MIT © 2022 Bora Elci, David Cendejas, Jorge Mederos, and Kerim Kurttepeli
