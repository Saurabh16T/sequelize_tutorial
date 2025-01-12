const express = require('express');
const morgan = require('morgan');
// const { connectDB } = require('./connection');
const { connectDB, sequelize } = require("./connection");
// const initializeModels = require('./Model/index');
const route = require('./routes/index');

const app = express();

app.use(express.json());
app.use(morgan('dev'));

// Optionally, set up routes later
app.use('/api/route', route);

const PORT = process.env.port || 3000;
app.listen(PORT, async () => {
    console.log("🚀Server started Successfully at " + PORT);
    await connectDB();
    sequelize.sync({ force: false }).then(() => {
        console.log("✅Synced database successfully...");
    });
});

