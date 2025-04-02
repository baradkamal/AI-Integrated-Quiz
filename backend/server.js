const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const path = require("path");
const connectDB = require("./config/db"); 
const userRoutes = require("./routes/userRoutes");
const questionRoutes = require("./routes/questionRoutes");
const quizRoutes = require("./routes/quizRoutes");
const userResponseroutes = require("./routes/userResponseRoutes");
const category = require("./routes/categoryRoutes");
const difficulti = require("./routes/difficultyRoutes");
const errorHandler = require("./middlewares/errorMiddleware");
const cors = require("cors");


dotenv.config({ path: path.resolve(__dirname, '../.env') });


const app = express();



app.use(bodyParser.json());
app.use(cors());


connectDB(); 

// Routes
app.use("/api", userRoutes);
app.use("/api", questionRoutes);
app.use("/api",quizRoutes);
app.use("/api", userResponseroutes);
app.use("/api", category);
app.use("/api", difficulti);



app.use(errorHandler);

// comment added for testing purposes

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
