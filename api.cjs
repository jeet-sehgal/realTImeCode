const express = require('express');
const app = express();

app.post('/exe', (req, res) => {
    res.send('POST request to /exe received');
});

app.listen(5183, () => {
    console.log('Server is running on http://localhost:5173');
});