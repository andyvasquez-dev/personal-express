const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient

var db, collection;

const url = "mongodb+srv://dbuser:eFeiottc5GMJ2DYU@cluster0.ubwex.mongodb.net/nominations?retryWrites=true&w=majority";
const dbName = "nominations";

app.listen(3000, () => {
    MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (error, client) => {
        if(error) {
            throw error;
        }
        db = client.db(dbName);
        console.log("Connected to `" + dbName + "`!");
    });
});

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(express.static('public'))

app.get('/', (req, res) => {
  db.collection('nominations').find().toArray((err, result) => {
    if (err) return console.log(err)

    if (result.length) {
      res.render('index.ejs', {nominations:result})
    }else{
      const nominations =[{'movie':0}] // creates a roulette array and assigns the first value to 0, for the comparison in the profile .ejs file were sending data to
      res.render('index.ejs', {nominations:nominations})
    }
  })
})

//'Access-Control-Allow-Origin' : '*'
app.post('/postVotes', (req, res) => {

        db.collection('nominations')
        .findOneAndUpdate({movie: req.body.movie1}, {
          $inc:{
            votes:+1
          }
        },{
          upsert: true
        }, (err, result) => {
          if (err) return console.log(err)
          console.log(`saved ${req.body.movie1}`)
        })

        db.collection('nominations')
        .findOneAndUpdate({movie: req.body.movie2}, {
          $inc:{
            votes:+1
          }
        },{
          upsert: true
        }, (err, result) => {
          if (err) return console.log(err)
          console.log(`saved ${req.body.movie2}`)
        })

        db.collection('nominations')
        .findOneAndUpdate({movie: req.body.movie3}, {
          $inc:{
            votes:+1
          }
        },{
          upsert: true
        }, (err, result) => {
          if (err) return console.log(err)
          console.log(`saved ${req.body.movie3}`)
        })

        db.collection('nominations')
        .findOneAndUpdate({movie: req.body.movie4}, {
          $inc:{
            votes:+1
          }
        },{
          upsert: true
        }, (err, result) => {
          if (err) return console.log(err)
          console.log(`saved ${req.body.movie4}`)
        })


        db.collection('nominations')
        .findOneAndUpdate({movie: req.body.movie5}, {
          $inc:{
            votes:+1
          }
        },{
          upsert: true
        }, (err, result) => {
          if (err) return console.log(err)
          console.log(`saved ${req.body.movie5} `)
          res.json('ballot saved')
        })
})
