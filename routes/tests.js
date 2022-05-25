const testRoutes = (app, db) => {

    function isSameDay(d1, d2) {
      return d1.getFullYear() === d2.getFullYear() &&
        d1.getDate() === d2.getDate() &&
        d1.getMonth() === d2.getMonth();
    }

    app.get('/gettests', (req, conn) => {
      
      const query = 'SELECT * FROM test;';
  
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
  
    app.post('/updatetest', (req, conn) => {
      let testid = req.body.testid;
      const query = `SELECT * FROM test WHERE testid = \'${testid}\';`;
      db.query(query)
          .then(res => {
              const rows = res.rows;
              if (rows.length < 1) {
                conn.status(400).send(`Test ID (${testid}) does not exist.`);
              }
              else {
                let test = rows[0];
                let update = `UPDATE test SET `;
                const prevLen = update.length;
                for (let key in req.body) {
                  let value = req.body[key];
                  let original = test[key];
                  if (key == 'date') {
                    value = new Date(value).toLocaleDateString('en-US', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                    });
                    original = new Date(original).toLocaleDateString('en-US', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                    });
                  }
                  if (value != original) {                
                    if (key == 'result') { update += `${key} = ${value}, `; }
                    else {
                      // value.replace("'", "''");
                      update += `${key} = \'${value}\', `;
                    }
                  }
                }
                const curLen = update.length;
                if (curLen > prevLen) {
                  update = update.substring(0, curLen-2);
                  update += ` WHERE testid = \'${testid}\';`;
                  db.query(update)
                  .then(res => {
                      conn.status(200).send(`Updated test: ${testid}`);
                  })
                  .catch(err => {
                      console.log(err);
                      conn.status(400).send(`Failed to update test: ${testid}`);
                  });
                }
                else { conn.status(300).send("No change"); }
              }
          })
          .catch(err => {
              console.log(err);
              conn.status(504).send("Database GET test query failed");
          });
    });
  
    app.post('/addtest', (req, conn) => {
      let insert = "INSERT INTO test VALUES ";
      insert += "(";
      for (let key in req.body) {
        let value = req.body[key];
        if (key == 'result') { insert += `${value}, `; }
        else {
          value.replace("'", "''");
          insert += `\'${value}\', `;
        }
      }
      insert = insert.substring(0, insert.length-2);
      insert += ");"
      db.query(insert)
          .then(res => {
              conn.status(200).send("Added new test");
          })
          .catch(err => {
              console.log(err);
              conn.status(400).send("Failed to add new test")
          });
    });

    app.post('/deletetest', (req, conn) => {
      let testid = req.body.testid;
      if (testid.length < 1 || testid.length > 10) {
        conn.status(400).send("Error");
      }
      else {
        const selectQuery = `SELECT * FROM test WHERE testid = \'${testid}\';`
        db.query(selectQuery)
        .then(res => {
            if (res.rows.length < 1) {
              conn.status(400).send("No test found")
            }
            else if (res.rows.length > 1) {
              conn.status(400).send("Error")
            }
            else {
              const deleteQuery = `DELETE FROM test WHERE testid = \'${testid}\';`;
              db.query(deleteQuery)
                  .then(res => {
                      conn.status(200).send(`Deleted test: ${testid}`);
                  })
                  .catch(err => {
                      console.log(err);
                      conn.status(400).send(`Failed to delete test: ${testid}`)
                  });
            }
        })
        .catch(err => {
            conn.status(504).send("Error")
        });
      }
    });
  };
  
  module.exports = testRoutes;