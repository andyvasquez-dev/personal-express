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

// app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(express.static('public'))

app.put('/postVotes', (req, res) => {
  console.log('yer');
  db.collection('nominations')
  .findOneAndUpdate({movie: req.body.movie1}, {
    $set: {
      votes:1
    }
  }, {
    sort: {_id: -1},
    upsert: true
  }, (err, result) => {
    if (err) return res.send(err)
    res.json({movie:req.body.movie1})
  })
  //
  // db.collection('nominations')
  // .findOneAndUpdate({movie: req.body.movie2, votes:}, {
  //   $set: {
  //     votes:req.body.votes + 1
  //   }
  // }, {
  //   sort: {_id: -1},
  //   upsert: true
  // }, (err, result) => {
  //   if (err) return res.send(err)
  //   res.send(result)
  // })
  //
  // db.collection('nominations')
  // .findOneAndUpdate({movie: req.body.movie3, votes:}, {
  //   $set: {
  //     votes:req.body.votes + 1
  //   }
  // }, {
  //   sort: {_id: -1},
  //   upsert: true
  // }, (err, result) => {
  //   if (err) return res.send(err)
  //   res.send(result)
  // })
  //
  // db.collection('nominations')
  // .findOneAndUpdate({movie: req.body.movie4, votes:}, {
  //   $set: {
  //     votes:req.body.votes + 1
  //   }
  // }, {
  //   sort: {_id: -1},
  //   upsert: true
  // }, (err, result) => {
  //   if (err) return res.send(err)
  //   res.send(result)
  // })
  //
  // db.collection('nominations')
  // .findOneAndUpdate({movie: req.body.movie5, votes:}, {
  //   $set: {
  //     votes:req.body.votes + 1
  //   }
  // }, {
  //   sort: {_id: -1},
  //   upsert: true
  // }, (err, result) => {
  //   if (err) return res.send(err)
  //   res.send(result)
  // })
  console.log('yer');
})

app.delete('/messages', (req, res) => {
  db.collection('messages').findOneAndDelete({name: req.body.name, msg: req.body.msg}, (err, result) => {
    if (err) return res.send(500, err)
    res.send('Message deleted!')
  })
})
