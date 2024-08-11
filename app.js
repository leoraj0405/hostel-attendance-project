const express = require('express')
var createError = require('http-errors');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
// var session = require('express-session');
const http = require('http');
const app = express()

const userApiRouter = require('./routes/api/user');
const blockApiRouter = require('./routes/api/block');
const roomApiRouter = require('./routes/api/room');
const deptApiRouter = require('./routes/api/department');
const studentApiRouter = require('./routes/api/student');
const attendanceApiRouter = require('./routes/api/attendance');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/user/',userApiRouter);
app.use('/api/block', blockApiRouter);
app.use('/api/room/', roomApiRouter);
app.use('/api/department/',deptApiRouter);
app.use('/api/student/',studentApiRouter);
app.use('/api/attendance/',attendanceApiRouter);

app.use(function (req, res, next) {
    next(createError(404));
});

app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

var server = http.createServer(app);
var port = 2000;


server.listen(port, () => {
    console.log('listening on port 2000')
})