const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const PORT = process.env.PORT || 5000
const userRoutes = require('./Routes/buyerRoutes/authRoutes');
const sellerRoutes = require('./Routes/sellerRoutes/authRoute');
const sellerProductRoutes = require('./Routes/sellerRoutes/productRoutes');
const sellerOrderRoutes = require('./Routes/sellerRoutes/orderRoutes');
const buyerProductRoutes = require('./Routes/buyerRoutes/productRoutes');
const buyerCartRoutes = require('./Routes/buyerRoutes/cartRoutes')
const buyerOrderRoutes = require('./routes/buyerRoutes/orderRoutes')
const commonRoutes = require('./routes/common/commonRoutes')

const app = express();
app.use(express.json());

// config file used to save db password and port
dotenv.config({ path: "./config.env" })

// database credentials
const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD)

const options = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
}

// connect to database
mongoose
    .connect(DB, options)
    .then(() =>
        console.log('DB connection successful!')
    )
    .catch(err =>
        console.log(err)
    )

// base route
app.get('/', (req, res) => {
    res.send({
        status: 'success',
        message: 'msg from the basic route'
    });
})

// routes
app.use('/', commonRoutes)
app.use('/buyer', userRoutes, buyerProductRoutes, buyerCartRoutes, buyerOrderRoutes)
app.use('/seller', sellerRoutes, sellerProductRoutes, sellerOrderRoutes)

// start server
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
});