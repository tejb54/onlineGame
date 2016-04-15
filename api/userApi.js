/**
 * Created by Tobias on 2016-04-15.
 */

module.exports = function (app,connection) {

    app.get('/api/users', function(req, res){
        connection.acquire(function(err, con) {
            con.query('SELECT * FROM Pallettown.User;', function(err, result) {
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