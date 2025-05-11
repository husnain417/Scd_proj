require('dotenv').config();
const http = require('http');
const connectDB = require('./utils/dbConn');
const { port } = require('./utils/env');
const express = require('express');
const { setupMiddleware } = require('./middleware/middleware');
const userRoutes = require('./routes/userRoutes');
const accountRoutes = require('./routes/accountRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const beneficiaryRoutes = require('./routes/beneficiaryRoutes')
const path = require('path');
const cors = require('cors');


const app = express();

setupMiddleware(app); 

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));
app.set('view engine', 'ejs');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(userRoutes);
app.use(accountRoutes);
app.use(transactionRoutes);
app.use(beneficiaryRoutes);

app.use((req, res) => {
  res.status(404).render('404', { title: 'Error' });
});

const startServer = async () => {
  await connectDB();

  http.createServer(app).listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
};

startServer();

module.exports = app;
