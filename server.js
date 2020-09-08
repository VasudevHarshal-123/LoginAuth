let express = require("express");
let bodyParser = require("body-parser");
let app = express();
const mongoose = require('mongoose');
const jwtoken = require("jsonwebtoken");
const bcrypt = require('bcrypt');

const schema = require('./Schema');

//For CORS
app.use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin','*');                                 
    res.setHeader('Access-Control-Allow-Method','GET,PUT,POST,PATCH,DELETE');         
    res.setHeader('Access-Control-Allow-Headers','Content-Type,Authorization');                                                                                          
    next();
});


//Body parser
app.use(bodyParser.json());
app.use(bodyParser.text());
app.use(bodyParser.urlencoded({extended: true}));

const mongoURI = 'mongodb://localhost:27017/loginAuth'

mongoose.connect(
    mongoURI,
    { useNewUrlParser: true }
  )
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err))

  app.post("/register",(req,res)=>{
    console.log("HI");
    const RB = req.body;
    const dates = new Date();
    const formData = {
        photos:req.file,
        name:RB.name,
        email:RB.email,
        password:RB.password,
        role:0,
        date:dates
    }

    schema.findOne({
        email:RB.email
    })
    .then(user => {
        if(!user){
            bcrypt.hash(req.body.password,10,(err,hash)=>{      //10 is salt
                formData.password = hash;
                schema.create(formData)
                .then(user => {
                    res.json({status:user.email + 'Registered'})
                })
                .catch(err=>{
                    res.send('error ' + err)
                })
            })
        }
    })
    .catch(err=>{res.send('err ' + err)}
    )
});


app.post('/login', (req, res) => {
    User.findOne({
      email: req.body.email
    })
      .then(user => {
        if (user) {
          if (bcrypt.compareSync(req.body.password, user.password)) {
            const payload = {
              _id: user._id,
              first_name: user.first_name,
              last_name: user.last_name,
              email: user.email
            }
            let token = jwt.sign(payload, process.env.SECRET_KEY, {
              expiresIn: 1440
            })
            res.send(token)
          } else {
            res.json({ error: 'Wrong user or password' })
          }
        } else {
          res.json({ error: 'Wrong user or password' })
        }
      })
      .catch(err => {
        res.send('error: ' + err)
      })
  })
  
  app.get('/profile', (req, res) => {
      //Decoding the auth
    var decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
  
    User.findOne({
      _id: decoded._id
    })
      .then(user => {
        if (user) {
          res.json(user)
        } else {
          res.send('User does not exist')
        }
      })
      .catch(err => {
        res.send('error: ' + err)
      })
  })



app.listen(8080,()=>console.log('Listening to port 8080'));