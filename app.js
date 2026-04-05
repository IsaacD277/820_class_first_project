const express = require('express');
const app = express();
const sequelize = require('./common/database');
const orderRoutes = require('./orders/routes');

sequelize.sync();

app.use(express.json());

app.get('/', (req, res) => {
    res.json({
        status: 'Running',
        version: 'v0.0.4',
        timestamp: new Date().toISOString()
    });
});

app.use('/orders', orderRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));