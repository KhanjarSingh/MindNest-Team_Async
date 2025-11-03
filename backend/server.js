const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')
const process = require('process')
const routes = require('./routes');
const cookieParser = require('cookie-parser');

dotenv.config()

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'));
app.use(cookieParser());
app.use(cors({
  origin: process.env.FRONTEND_URL, 
  credentials: true,                
}));


app.use('/api', routes);


app.listen(port,()=>{
    console.log(`Server is running at http://localhost:${port}`)
})