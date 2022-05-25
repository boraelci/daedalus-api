const facilityRoutes = (app, db) => {

  app.get('/getfacilities', (req, conn) => {
    
    const query = 'SELECT * FROM facility;';

    db.query(query)
        .then(res => {
            const rows = res.rows;
            conn.send(rows);
        })
        .catch(err => {
            console.log(err);
            conn.status(504).send("Database offline");
        });
  });

  app.post('/updatefacility', (req, conn) => {
    let facid = req.body.facid;
    const query = `SELECT * FROM facility WHERE facid = \'${facid}\';`;
    db.query(query)
        .then(res => {
            const rows = res.rows;
            if (rows.length < 1) {
              conn.status(400).send(`Facility ID (${facid}) does not exist.`);
            }
            else {
              let facility = rows[0];
              let update = `UPDATE facility SET `;
              const prevLen = update.length;
              for (let key in req.body) {
                let value = req.body[key];
                if (value != facility[key]) {                    
                  if (key == 'lat' || key == 'long') { update += `${key} = ${value}, `; }
                  else {
                    value.replace("'", "''");
                    update += `${key} = \'${value}\', `;
                  }
                }
              }
              const curLen = update.length;
              if (curLen > prevLen) {
                update = update.substring(0, curLen-2);
                update += ` WHERE facid = \'${facid}\';`;
              
                db.query(update)
                .then(res => {
                    conn.status(200).send(`Updated facility: ${facid}`);
                })
                .catch(err => {
                    console.log(err);
                    conn.status(400).send(`Failed to update facility: ${facid}`);
                });
              }
              else { conn.status(300).send("No change"); }
            }
        })
        .catch(err => {
            console.log(err);
            conn.status(504).send("Database GET facility query failed");
        });
  });

  app.post('/addfacility', (req, conn) => {
    // let insert = "INSERT INTO facility (facid, rpuid, sitename, sitecd, rpsui, staco, lat, long, street, city, state, zip, countyname, address, sitereporting, installationname) VALUES ";
    let insert = "INSERT INTO facility VALUES ";
    insert += "(";
    for (let key in req.body) {
      let value = req.body[key];
      if (key == 'lat' || key == 'long') { insert += `${value}, `; }
      else {
        value.replace("'", "''");
        insert += `\'${value}\', `;
      }
    }
    insert = insert.substring(0, insert.length-2);
    insert += ");";
    db.query(insert)
        .then(res => {
            conn.status(200).send("Added new facility");
        })
        .catch(err => {
            console.log(err);
            conn.status(400).send("Failed to add new facility")
        });
  });

  app.post('/deletefacility', (req, conn) => {
    let facid = req.body.facid;
    if (facid.length < 1 || facid.length > 10) {
      conn.status(400).send("Error");
    }
    else {
      const selectQuery = `SELECT * FROM facility WHERE facid = \'${facid}\';`
      db.query(selectQuery)
      .then(res => {
          if (res.rows.length < 1) {
            conn.status(400).send("No facility found")
          }
          else if (res.rows.length > 1) {
            conn.status(400).send("Error")
          }
          else {
            const deleteQuery = `DELETE FROM facility WHERE facid = \'${facid}\';`;
            db.query(deleteQuery)
                .then(res => {
                    conn.status(200).send(`Deleted facility: ${facid}`);
                })
                .catch(err => {
                    console.log(err);
                    conn.status(400).send(`Failed to delete facility: ${facid}`)
                });
          }
      })
      .catch(err => {
          conn.status(400).send("Error")
      });
    }
  });
};

module.exports = facilityRoutes;