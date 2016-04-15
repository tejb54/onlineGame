module.exports = function (app,connection) {

    app.get('/api/items', function(req, res){
        connection.acquire(function(err, con) {
            con.query('SELECT * FROM Pallettown.Item;', function(err, result) {
                con.release();
                res.json(result);
            });
        });
    });

    app.get('api/items/:id',function (req, res) {
        console.log('get item wit id: ');
    });
};