const mongoose = require('mongoose');
mongoose
.connect(process.env.MONGODB_URL,{
    dbName: process.env.MONGODB_DBNAME,
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