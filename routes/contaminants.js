const contaminantRoutes = (app, db) => {

    // CONTAMINANT
    app.get('/getcontaminants', (req, conn) => {
      
      const query = 'SELECT * FROM contaminant;';
  
      db.query(query)
          .then(res => {
              const rows = res.rows;
              conn.send(rows);
          })
          .catch(err => {
              conn.status(504).send("Database offline");
          });
    });
  
    app.post('/updatecontaminant', (req, conn) => {
      let contname = req.body.contname;
      const query = `SELECT * FROM contaminant WHERE contname = \'${contname}\';`;
      db.query(query)
          .then(res => {
              const rows = res.rows;
              if (rows.length < 1) {
                conn.status(400).send(`Contaminant name (${contname}) does not exist`);
              }
              else {
                let cont = rows[0];
                let update = `UPDATE contaminant SET `;
                const prevLen = update.length;
                for (let key in req.body) {
                  let value = req.body[key];
                  if (value != cont[key]) {       
                    if (key == 'threshold') { update += `${key} = ${value}, `; }
                    else {
                      value.replace("'", "''");
                      update += `${key} = \'${value}\', `;
                    }             
                  }
                }
                const curLen = update.length;
                if (curLen > prevLen) {
                  update = update.substring(0, curLen-2);
                  update += ` WHERE contname = \'${contname}\';`;
                
                  db.query(update)
                  .then(res => {
                      conn.status(200).send(`Updated contaminant: ${contname}`);
                  })
                  .catch(err => {
                      console.log(err);
                      conn.status(400).send(`Failed to update contaminant: ${contname}`);
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
  
    app.post('/addcontaminant', (req, conn) => {
      let insert = "INSERT INTO contaminant VALUES ";
      insert += "(";
      for (let key in req.body) {
        let value = req.body[key];
        if (key == 'threshold') { insert += `${value}, `; }
        else {
          value.replace("'", "''");
          insert += `\'${value}\', `;
        }
      }
      insert = insert.substring(0, insert.length-2);
      insert += ");"
      db.query(insert)
          .then(res => {
              conn.status(200).send("Added new contaminant");
          })
          .catch(err => {
              console.log(err);
              conn.status(400).send("Failed to add new contaminant")
          });
    });

    // SAFETY MEASURE
    app.get('/getsafetymeasures', (req, conn) => {
      
        const query = 'SELECT * FROM safetymeasure;';
    
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

    app.post('/updatesafetymeasure', (req, conn) => {
        let contname = req.body.contname;
        let lower = req.body.lower;
        let upper = req.body.upper;
        const query = `SELECT * FROM safetymeasure WHERE contname = \'${contname}\' AND lower = ${lower} AND upper = ${upper};`;
        db.query(query)
            .then(res => {
                const rows = res.rows;
                if (rows.length < 1) {
                  conn.status(400).send(`Safety measure (${contname}, ${lower}, ${upper}) does not exist`);
                }
                else {
                  let cont = rows[0];
                  let update = `UPDATE safetymeasure SET `;
                  const prevLen = update.length;
                  for (let key in req.body) {
                    let value = req.body[key];
                    if (value != cont[key]) { 
                      if (key == 'lower' || key == 'upper') { update += `${key} = ${value}, `; }
                      else {
                        value.replace("'", "''");
                        update += `${key} = \'${value}\', `;
                      }
                    }
                  }
                  const curLen = update.length;
                  if (curLen > prevLen) {
                    update = update.substring(0, curLen-2);
                    update += ` WHERE contname = \'${contname}\' AND lower = ${lower} AND upper = ${upper};`;
                  
                    db.query(update)
                    .then(res => {
                        conn.status(200).send(`Updated safety measure (${contname}, ${lower}, ${upper})`);
                    })
                    .catch(err => {
                        console.log(err);
                        conn.status(400).send(`Failed to update safety measure: (${contname}, ${lower}, ${upper})`);
                    });
                  }
                  else { conn.status(300).send("No change"); }
                }
            })
            .catch(err => {
                console.log(err);
                conn.status(504).send("Database GET safety measure query failed");
            });
      });
    
      app.post('/addsafetymeasure', (req, conn) => {
        let insert = "INSERT INTO safetymeasure VALUES ";
        insert += "(";
        for (let key in req.body) {
          let value = req.body[key];
          if (key == 'lower' || key == 'upper') { insert += `${value}, `; }
          else {
            value.replace("'", "''");
            insert += `\'${value}\', `;
          }
        }
        insert = insert.substring(0, insert.length-2);
        insert += ");"
        db.query(insert)
            .then(res => {
                conn.status(200).send("Added new safety measure");
            })
            .catch(err => {
                console.log(err);
                conn.status(400).send("Failed to add new safety measure")
            });
      });

      app.post('/deletecontaminant', (req, conn) => {
        let contname = req.body.contname;
        if (!contname || contname.length > 20) {
          conn.status(400).send("Contaminant name too short or too long");
        }
        else {
          const selectQuery = `SELECT * FROM contaminant WHERE contname = \'${contname}\';`
          db.query(selectQuery)
          .then(res => {
              if (res.rows.length < 1) {
                conn.status(400).send("No contaminant found")
              }
              else if (res.rows.length > 1) {
                conn.status(400).send("Multiple contaminants with the same name")
              }
              else {
                const deleteQuery = `DELETE FROM contaminant WHERE contname = \'${contname}\';`;
                db.query(deleteQuery)
                    .then(res => {
                        conn.status(200).send(`Deleted contaminant: ${contname}`);
                    })
              }
          })
        }
      });

      app.post('/deletesafetymeasure', (req, conn) => {
        let contname = req.body.contname;
        let lower = req.body.lower;
        let upper = req.body.upper;
        const deleteQuery = `DELETE FROM safetymeasure WHERE contname = \'${contname}\' AND lower = ${lower} AND upper = ${upper};`;
        db.query(deleteQuery)
            .then(res => {
                conn.status(200).send(`Deleted safety measure: (${contname}, ${lower}, ${upper})`);
            })
            .catch(err => {
                console.log(err);
                conn.status(400).send(`Failed to delete safety measure: (${contname}, ${lower}, ${upper})`)
        });
      });
  };
  
  module.exports = contaminantRoutes;