const express = require("express");
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const morgan = require("morgan");

const authRouter = require("./routes/auth-routes");
const userRouter = require("./routes/user-routes");
const swapRouter = require("./routes/swapRequest-routes");
const feedbackRouter = require("./routes/feedback-routes");
const searchRouter = require("./routes/search-routes");
const adminRouter = require("./routes/admin-routes");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());
app.use(helmet());
app.use(morgan("dev"));

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/swap", swapRouter);
app.use("/api/feedback", feedbackRouter);
app.use("/api/search", searchRouter);
app.use("/api/admin", adminRouter);

module.exports = app;
