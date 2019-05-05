const express = require("express");
const request = require("request");
const morgan = require("morgan");
const bodyParser = require("body-parser");
require("dotenv").config();

const Mailchimp = require("mailchimp-api-v3");
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
    email_address: email,
    status: "subscribed",
    merge_fields: {
      FNAME: firstName,
      LNAME: lastName
    }
  };

  mailchimp
    .post("lists/a06f7fee47/members", data)
    .then(result => {
      res.render("thanks", { contact: req.body });
    })
    .catch(err => console.log(err));

  // const options = {
  //   url: "https://us20.api.mailchimp.com/3.0/lists/a06f7fee47/members ",
  //   method: "POST",
  //   headers: {
  //     Authorization: process.env.MAILCHIMP_API_KEY
  //   },
  //   body: JSON.stringify(data)
  // };

  // request(options, (err, response, body) => {
  //   if (err) {
  //     console.log("error 1", err );
  //   } else {
  //     if (response.statusCode === 200) {
  //       res.render("thanks", { contact: req.body });
  //     } else {
  //       console.log("error2", response.statusCode);
  //     }
  //   }
  // });
});

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
