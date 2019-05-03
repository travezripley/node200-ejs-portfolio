const express = require("express");
const request = require("request");
const morgan = require("morgan");
const bodyParser = require("body-parser");
require("dotenv").config();


const Mailchimp = require('mailchimp-api-v3');
const mailchimp = new Mailchimp(process.env.MAILCHIMP_API_KEY);


const app = express();

const PORT = process.env.PORT || 8080;

app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/static", express.static("public"));

app.set("views", "./views");

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/contact", (req, res) => {
  res.render("contact");
});

app.post("/thanks", (req, res) => {

  console.log(req.body);

  const { firstName, lastName, email } = req.body;

  const data = {
      members: [
        {
          email_address: email,
          status: "subscribed",
          merge_fields: {
            FNAME: firstName,
            LNAME: lastName
          }
        }
      ]
  }
  const postData = JSON.stringify(data);

  mailchimp.post('/lists/a06f7fee47/members', data)
  .then(function(results) {
  
  })
  .catch(function (err) {

  })

  res.render("thanks", { contact: req.body });
});

app.listen(PORT, () => {
  console.log("listening at http://localhost:8080");
});

module.exports = app;
