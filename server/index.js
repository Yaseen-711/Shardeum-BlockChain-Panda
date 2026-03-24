require('dotenv').config();
const express = require('express');
const cors = require('cors');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: '*' }));
app.use(express.json());

app.use('/api', apiRoutes);

// Health check
app.get('/health', (req, res) => res.send('Server is healthy'));

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
