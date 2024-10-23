// remember 67
const express = require('express')
const app = express()
const PORT_NUMBER = 5000

app.use("/", (req, res) => {
    res.send("Server is running.")
});

app.listen(PORT_NUMBER, console.log(`Server started on PORT ${PORT_NUMBER}`));