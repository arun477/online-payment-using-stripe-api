// dependencies
const express = require('express');
const keys = require('./config/keys');
const stripe = require('stripe')(keys.stripeSecretKey);
const bodyParser = require('body-parser');

// initialize the app
const app = express();


// set static folders
app.use(express.static(`${__dirname}/public`));


// set view engine
app.set('view engine','ejs');

// middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));



// index route
app.get('/', (req,res)=>{
	res.render("index", {
		stripePublishableKey:keys.stripePublishableKey
	});
});

// charge route
app.post('/charge',(req,res)=>{
	const amount = 2500;
	
	stripe.customers.create({
		email: req.body.stripeEmail,
		source: req.body.stripeToken
	})
	.then((customer)=>{
		stripe.charges.create({
			amount,
			description:'Web Development Ebook',
			currency:'usd',
			customer: customer.id
		})
		.then(charge => res.render('success'))
	})
})

// define port
const port = process.env.PORT || 3000;

app.listen(port, ()=>console.log(`Server Listening on port ${port}`))