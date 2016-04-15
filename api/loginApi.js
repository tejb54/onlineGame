/**
 * Created by Tobias on 2016-04-15.
 */

module.exports = function (app,connection) {

    app.post('/api/login', function(req, res){

        console.log(req.body.user + ' ' + req.body.password);

        connection.acquire(function(err, con) {
            con.query('SELECT * FROM Pallettown.User WHERE Username = ? AND Password = ?;',
                [req.body.user,req.body.password],
                function(err, result) {
                if(err)
                {
                    res.json({
                        message: "failed to get data"
                    });
                }
                else
                {
                    res.json(result);
                }
                con.release();
            });
        });
    });
};