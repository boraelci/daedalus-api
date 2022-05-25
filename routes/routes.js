const facilityRoutes = require('./facilities');
const testRoutes = require('./tests');
const contaminantRoutes = require('./contaminants');
const appDataRoutes = require('./appdata');

const appRouter = (app, db) => {
  app.get('/', (req, conn) => {
    conn.sendFile(__dirname + "/facilities.html");
  });

  app.get('/facilities', (req, conn) => {
    conn.sendFile(__dirname + "/facilities.html");
  });

  app.get('/tests', (req, conn) => {
    conn.sendFile(__dirname + "/tests.html");
  });

  app.get('/contaminants', (req, conn) => {
    conn.sendFile(__dirname + "/contaminants.html");
  });

  facilityRoutes(app, db);
  testRoutes(app, db);
  contaminantRoutes(app, db);
  appDataRoutes(app, db);
};

// this line is unchanged
module.exports = appRouter;