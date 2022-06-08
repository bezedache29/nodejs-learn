const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors({"origin": 'http://localhost:3000'}));
const authRoute = require('./routes/auth');
const postRoute = require('./routes/posts')
require('./models/dbConfig')

app.use(express.json())

app.use('/api/user', authRoute)
app.use('/api/posts', postRoute)

app.listen('8000', () => console.log('server start'))