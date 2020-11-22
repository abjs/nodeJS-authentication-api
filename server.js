const express           = require('express');
const morgan            = require('morgan');
const bodyparser        = require('body-parser');
const createError       = require('http-errors');
const auth              = require('./routes/auth');
// const client            = require('./helpers/init_redis')

const { verifyAccessToken } =require('./helpers/jwt_Helper')
require('dotenv').config();
require('./helpers/init_mogodb')
const app = express();



// client.set('foo', 'bar');

// //delete the one
// client.del('foo')
// //delete full date base
// client.flushdb( function (err, succeeded) {
//   console.log(succeeded); // will be true if successfull
// });

// client.get('foo',(err,value)=>{
//   if(err){console.log(err.message);}
//   console.log(value)
// })




app.use(bodyparser.urlencoded({extended: true}));
app.use(bodyparser.json());

const port = process.env.PORT || 3000;
if (process.env.NODE_ENV === 'development');
{
    app.use(morgan('dev'))

}

//Home route

app.get('/',verifyAccessToken, async (req, res, next) => {
  // console.log(req.headers['authorization']);
  // console.log(req.payload);
  res.send("Home route"); 
})

app.use('/hack/api/v.1/auth', auth);
// error handle
app.use( async (req, res, next) => {
  // const error  = new Error("Not Found");
  // error.status = 404;
  // next(error);
  next(createError.NotFound("This route does not exist."));
})
app.use((err, req, res, next) => {
  res.status(err.status || 500)
  res.send({
    error: {
      status: err.status || 500,
      message: err.message
    }
  })
})



app.listen(port, () => {
  console.log("lisenig port", port);
});
