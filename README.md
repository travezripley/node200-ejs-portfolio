# Level 1: EJS and Routing Workshop

## First Project in the NODE200 * Module @ San Diego Code School

# Stay tuned today, KTRAV Channel 13 We will be bringin you, your local headlines with: 

# Author - Michel Roberts JR.

# Modified by Travis Ripley, * Started Thursday May 2nd, 2019 9:30am

## Right after this commercial break:

## Objective

In this workshop we'll build a personal portfolio website with a contact form using [EJS](http://ejs.co/). You will host it on Heroku so you can start placing links to your best projects on it.

### Exit Criteria
- Personal Portfolio Website
    - Home page: Should include links to your github and some of your previous projects
    - Contact Page: Should accept first name, last name, and email
    - Thank You Page: Should Thank the contact directly by name
- Contact Info Delivery using either
    - SendGrid or MailChimp (secure email delivery services)
    - Google Sheets API (send it straight to a spreadsheet so you can track them better)
    - Twilio (send it directly to your phone via text)
- Needs to be graded by an Instructor at a live link on Heroku.

## Overview

Sometimes websites don't need to have large and complex user interfaces. Many small business websites may just need a home page and a contact form. For these kinds of pages React would be overkill yet simple HTML may not be dynamic enough. For example a contact form should have a matching "Thank You" page with that contact's name.

And so we have another tool to add to our arsenal, HTML Templates. Put simply, they allow us to plug data into our HTML, usually in a language and syntax that very closely resembles HTML.

We're going to be learning with the EJS (Embedded JavaScript) template language for it's easy implementation and it's closeness to HTML.

In the example below you can see that regular html isn't going to cut it. Mainly because not everyone's name is Scott.

#### Static HTML
```html
<div>
  <h3>Thank you</h3>
  <h4>Scott</h4>
</div>
```

Now imagine instead we had some data from the contact form.

#### Some data as a JS Object
```js
var contact = {
  firstName: 'Sarah',
  lastName: 'Person',
  email: 'sarah_person@work.com'
}
```

Now in the template, using [EJS' special syntax](http://ejs.co/#docs), we can add the variable data to the markup.

#### Dynamic EJS
```html
<div>
  <h3>Thank you</h3>
  <h4><%= contact.firstName %></h4>
</div>
```

When this data is combined with this template we should always get the same final output. This final output is what is sent to the browser.

#### Final HTML Output
```html
<div>
    <h3>Thank you</h3>
    <h4>Sarah</h4>
</div>
```

Again, this whole process is completed on the server, so that the final output is what is sent to the browser.

## Getting Started

We're building this from scratch again

### Basic Setup

First create a new directory in the `~/projects/` directory.

```sh
cd ~/projects
mkdir node200-ejs-portfolio
```

Then change directories into the new folder

```sh
cd node200-ejs-portfolio
```

From within the project directory run `git init`
This will create a local git repository.

Then create a new repo in github.
![](https://i.imgur.com/9umk18I.png)

Then run this command to point your local repo to the github repo. Without this there would be nowhere to `git push` to.
![](https://i.imgur.com/6LyCILM.png)

Now that git is setup we can run `npm init` to create the package.json file required in all node projects.

It should look something like this.
![](https://i.imgur.com/UTahz6e.png)

Lastly we need to install all the dependencies for the project.
We'll need express and ejs libraries

```sh
npm install express morgan body-parser ejs --save
```

Now let's get coding!
```sh
code .
```

First thing we need to create a simple express server.

![](https://i.imgur.com/pkvlAXM.png)

Let's also create a `views/` folder to put all our templates in and some empty template files. Express defaults to looking for templates in this directory.

#### File Structure
```sh
  startnow-node200-ejs-portfolio
  |- package.json
  |- server.js
  |- views/
    |- index.ejs
    |- contact.ejs
    |- thanks.ejs
```

Now update the the `index.ejs` file with some HTML.

#### index.ejs
```html
<html>
  <head>
    <title> Tom's Portfolio </title>
  </head>
  <body>
    <div>
      I am Tom
    </div>
  </body>
</html>
```

We should have something to show on the page at this point.

Run `node server.js`
Check it out at http://localhost:8080

![](https://i.imgur.com/Ft0Gndv.png)

Now lets' see how templates work.
First update the template to dynamically use a first and last name.

#### index.ejs
```html
<div>
  I am <%= person.firstName %> <%= person.lastName %>
</div>
```

And now let's pass data into the template using your name.
#### server.js
```js
app.get('/', (req, res) => {
  const data = {
    person: {
      firstName: 'Tom',
      lastName: 'Scott',
    }
  }

  // Notice now the data is the second argument passed to the template render method
  res.render('index', data);
});
```

Now we should see your full name

![](https://i.imgur.com/87DzUGW.png)

That's really it.
By updating the view engine setting to `'ejs'` and by using `res.render` we can now create dynamic HTML.

## Routing

So far we have used one method for routing in Express, however there are two ways you can manage routing. You are probably starting to become familiar with the first method which looks like this:

```javascript
var express = require('express')
var app = express()

// GET method route
app.get('/', function (req, res) {
  res.send('GET request to the homepage')
})

// POST method route
app.post('/', function (req, res) {
  res.send('POST request to the homepage')
})
// Catch and handle everything else
app.get('*', function (req, res) {
  res.send('Whoops, page not found 404').status(404);
})
```

But, you can also use the router module provided by Express.  The Router in Express is like a mini Express app (with middleware logic) that can be embedded inside of an Express app. Let's take a look at an example. 

In a file called `profile.js` could setup a router:

```javascript
var express = require('express')
var router = express.Router()

// middleware that is specific to this router
router.use(function timeLog (req, res, next) {
  console.log('Time: ', Date.now())
  next()
})
// define the home page route
router.get('/', function (req, res) {
  res.send('Hello world')
})
// define the about route
router.get('/about', function (req, res) {
  res.send('About me')
})
module.exports = router
```

Then, load the router module in your existing Express server app using:

```javascript
var profile = require('./profile')

// ...
// then define the route that will use your custom router
app.use('/profile', profile)

```

One benefit to the second method is that it cleans up your application making it simpler to maintain. The second reason is so that you can easily add custom middleware for just one set of routes. Another great reason to use this method is it supports chaining, so it could simplify your code and logic.  Here is an example of chaining:

```javascript
// ...

router.route('/')
  .get(function (req, res) {
    res.send('My home page')
	}))
  .post(function (req, res) {
    // code to handle ...
    res.send('A project was added')
	}))
  .put(function (req, res) {
    // code to handle ...
    res.send('A project was added')
	}))
  .delete(function (req, res) {
    // code to handle ...
    res.send('A project was deleted')
	}))
```

Note: this allows the url resource to be defined once, and then different `verbs` that need to be handled can be chained together.

For your portfolio project you may wish to keep it simple with the first method, or try your hand at using the Express Router.

## Building a Contact Form

Now let's work on a basic contact form and thank you page.

We'll add a form element with an action and method attribute as well as some inputs with name attributes.

Lastly we'll add a submit-type input. This button will automatically submit the form.
Because we have set the method to POST, the form will submit at the action url in url-encoded format as opposed to the usual JSON.

#### contact.ejs
```html
<html>
  <head>
    <title>Contact Tom</title>
  </head>
  <body>
    <div>
      <form action="/thanks" method="POST">
        <label for="firstName">First Name:</label>
        <input id="firstName" name="firstName" type="text">

        <label for="lastName">Last Name:</label>
        <input id="lastName" name="lastName" type="text">

        <label for="email">Email:</label>
        <input id="email" name="email" type="text">

        <input type="submit" />
      </form>
    </div>
  </body>
</html>
```

Let's update the thanks.ejs page as well.

### thanks.ejs
```html
<html>
  <head>
    <title>Tom Thanks You</title>
  </head>
  <body>
    <div>
      Thank you <%= contact.firstName %> <%= contact.lastName %>.
    </div>
  </body>
</html>
```

Now let's update the server.js to render the contact form and the matching thank you page when contact info is posted.

### server.js
```js
app.get('/contact', (req, res) => {
  res.render('contact');
});

app.post('/thanks', (req, res) => {
  res.render('thanks', { contact: req.body })
});
```

And we're done.
We've used HTML Templates to generate HTML on the server using EJS.

### What's Left

Now using that contact info, before rendering try using a third party service like SendGrid or MailChimp to send your self the contact information.

Third Party Options
  - [Send Grid](https://sendgrid.com/docs/API_Reference/api_v3.html)
  - [Mail Chimp](https://developer.mailchimp.com/)
  - [Google Sheets](https://developers.google.com/sheets/api/samples/writing)
  - [Twilio (SMS Texts)](https://www.twilio.com/docs/api/rest)

And this page will isn't very impressive looking. Try using all your skills to make this page something you are proud to present.

#### Note: Feel free to completely change the html stucture and adding styles and scripts.

Resources
   - [Bootstrap](http://getbootstrap.com/) - Style Framework
   - [Awwwards](https://www.awwwards.com/) - Great for Inspiration

### Submission

Finally, commit your work to GitHub and setup continous integration using CircleCi for this project (or try using CodeShip). Then add and host the project on Heroku. When you have a link to the live running application [Submit your project](https://goo.gl/forms/wx8DLSus7s88lk043)

### Bonus
- Create a separate ejs file to contain the header (partial view) and file for a footer (partial view), so you can remove duplicate html from your pages. This will make it easier and safer to maintain with less code being copied between pages.
- Add a portfolio page, with links to each of your heroku hosted projects. Use templates and data, so in the future you will only need to update your data, to maintain the page.
- Now that you have a few pages, add a navigation menu, if you have not done so already.
- Add a few tests so that when the CI runs you can ensure you have not introduced any bugs.

#Thank you for taking the time to look at my projects,



#Also please follow my progress on youtube: 
https://www.youtube.com/channel/UCXv4p-lDYeWXPlnoRFYCSUg

-Travez