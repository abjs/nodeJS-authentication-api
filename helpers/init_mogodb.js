const MongoClient = require('mongodb').MongoClient;
const uri = process.env.MONGODB_URL;
console.log(uri);
// const client = new MongoClient(uri, { useNewUrlParser: true });
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });
const mongoose = require('mongoose');
mongoose
.connect(uri,{
    dbName: process.env.DBNAME,
    useNewUrlParser: true ,
    useUnifiedTopology: true ,
    useFindAndModify : true ,
    useCreateIndex : true
})
// .then(() => {
//     console.log('mongoose connected')
// })
.catch((err)=>{
    console.log(err)
})

mongoose.connection.on('connected',()=>{
    console.log('mongoose connected')
})

mongoose.connection.on('error',(err)=>{
    console.log(err.message)
})

mongoose.connection.on('disconnected',(err)=>{
    console.log('mongoose disconnected')
})

process.on('SIGINT',async ()=>{
    await mongoose.connection.close()
    process.exit(0)
})