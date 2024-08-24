const express = require('express')
var createError = require('http-errors');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
var session = require('express-session');
var FileStore = require('session-file-store')(session);
var fileStoreOptions = {};


const http = require('http');
const app = express()
const mysql = require('mysql');

const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Root1234@',
    database: 'attendance'
})

con.connect((err) => {
    if (err) throw err;
    console.log('connected')
})

const userApiRouter = require('./routes/api/user');
const blockApiRouter = require('./routes/api/block');
const roomApiRouter = require('./routes/api/room');
const deptApiRouter = require('./routes/api/department');
const studentApiRouter = require('./routes/api/student');
const attendanceApiRouter = require('./routes/api/attendance');

const shHomeUiRouter = require('./routes/ui/shHomeUi');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    store: new FileStore(fileStoreOptions),
    secret: 'sachin',
    resave: true,
    saveUninitialized: true,
    cookie : {
     maxAge:(1000 * 60 * 15)
   } 
 }));

app.use('/api/user/',userApiRouter);
app.use('/api/block/', blockApiRouter);
app.use('/api/room/', roomApiRouter);
app.use('/api/department/',deptApiRouter);
app.use('/api/student/',studentApiRouter);
app.use('/api/attendance/',attendanceApiRouter);

app.use('/sh/', shHomeUiRouter);

app.post('/login', (req, res) => {
    const {
        loginId,
        password,
    } = req.body;
    con.query(`select id, firstName from user where loginId = '${loginId}' and password = ${password}`, (err, result) => {
        if(err) {
            console.log(err)
        }
        if(result.length > 0) {
            req.session.isLogged = true;
            req.session.data = result[0]
            // console.log(req.session.data)
            res.status(200).send('success')
        } else {
            req.session.isLogged = false;
            req.session.data = null
            res.status(409).send('Invalid User or password !')
        }
    })
});

app.get('/dashBoard', (req,res) => {
    if (req.session.isLogged == true) {
        const name  = req.session.data.firstName;
        res.send(name)
    } else {
        res.send('please login')
    }

})

app.get('/logout',(req, res) =>{
    req.session.destroy((err) => {
        if(err) throw err;
        res.send('session destroy')
    })
})
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