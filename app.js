const express = require('express')
const app = express()
const port = 4000
const web=require('./routes/index')
const connectdb = require('./db/connectdb')
const fileUpload = require('express-fileupload')
app.use(fileUpload({useTempFiles:true}))

//to encode
app.use(express.urlencoded({extended:true}));
//connect DB
connectdb();


const session = require('express-session')
const flash = require('connect-flash');

const cookieParser = require('cookie-parser')
app.use(cookieParser())


//messages
app.use(session({
  secret: 'secret',
  cookie: { maxAge: 60000 },
  resave: false,
  saveUninitialized: false,
}));
//Flash messages
app.use(flash());


//ejs set for HTML
app.set('view engine', 'ejs')
//css
app.use(express.static('public'))
//router load
app.use('/',web)




//server start
app.listen(port, () => {
    console.log(`Server start on port localhost: ${port}`)
    //template string format
  })
 //console.log(express)