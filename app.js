
const express = require('express');
const bodyParser =  require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB");

const articleSchema = ({
  title: String,
  content : String
});

const Articles = mongoose.model('articles',articleSchema);


/////////////////////////////////////Requests  Targetting  All Articles////////////////////////////////////

app.route("/articles")

.get(function (req,res) {
  Articles.find({},function (err,foundArticles) {
    if (err) {
res.sender(err);
    }else {
       res.send(foundArticles);
    }
  })

})
.post(function (req,res){
  const title = req.body.title;
  const description = req.body.content;
  const article = new Articles({
    title:title,
    content: description
  })
  article.save(function(err){
    if (err) {
      res.send(err);
    }else {
      res.send("Saved successfully");
    }
  });
})
.delete(function (req,res) {
  Articles.deleteMany(function (err) {
    if (!err) {
      res.send("suceessfully deleted all articles");
    }else {
      res.send(err);
    }
  });
});

/////////////////////////////////////Requests Targetting Specific Articles////////////////////////////////////

app.route("/articles/:articleTitle")

.get(function (req,res) {
  const title = req.params.articleTitle;
    Articles.findOne({title:title},function (err,foundArticle) {
      if (!err) {
        res.send(foundArticle);
      }else {
        res.send("No matching articles found");
      }
    });
})

.put(function(req, res) {
  Articles.update(
    {
    title: req.params.articleTitle
  },
  {
    title: req.body.title,
    content:req.body.content
  },function (err) {
    if (!err) {
      res.send("Succesfully updated article");
    }else {
      res.send("Not updated");
    }
  });
})

.patch(function (req,res) {
  console.log(req.body);
  Articles.updateOne(
    {
    title: req.params.articleTitle
  },
  {
    $set:req.body
  },function (err) {
    if (!err) {
      res.send("Succesfully updated article");
    }else {
      res.send("Not updated");
    }
  });
})

.delete(function (req,res) {
  Articles.deleteOne({title:req.params.articleTitle},function (err) {
    if (!err) {
      res.send("suceessfully deleted the  article");
    }else {
      res.send(err);
    }
  });
});




app.listen(3000, function() {
  console.log("Server started on port 3000");
});
