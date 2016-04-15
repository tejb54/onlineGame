/**
 * Created by Tobias on 2016-04-15.
 */

module.exports = function (app) {
    var connection = require('./connection.js');
    connection.init();

    var bodyParser = require('body-parser');
    // parse application/x-www-form-urlencoded
    app.use(bodyParser.urlencoded({ extended: false }))

    // parse application/json
    app.use(bodyParser.json())

    //Rest-api
    require('./itemApi.js')(app,connection);
    require('./userApi.js')(app,connection);
    require('./loginApi.js')(app,connection);

};