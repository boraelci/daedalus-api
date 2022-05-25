const appDataRoutes = (app, db) => {

    app.get('/appdata', (req, conn) => {
    
        const query = 'SELECT * FROM facility;';
    
        db.query(query)
            .then(res => {
                let rows = res.rows;
                for (let index in rows) {
                    // TODO: use actual test results rather than random
                    rows[index].leadSeverity = Math.floor((Math.random() * 3) + 1);
                }
                conn.status(200).send(rows);
            })
            .catch(err => {
                console.log(err);
                conn.status(504).send("Database offline");
            });
      });
    

};
module.exports = appDataRoutes;