const express = require('express');
const connectDb = require('./config/db');
const dotenv = require('dotenv');
const messageRoutes = require('./routes/messageroute');
const cors = require('cors');


dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

connectDb();

app.use(cors());
app.use(express.json());
app.use("/api", messageRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
