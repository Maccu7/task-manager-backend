const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();
const sequelize = require('./db');
const User = require('./models/user');
const Task = require('./models/task');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// PostgreSQL Connection (Sequelize)
sequelize.authenticate()
  .then(() => {
    console.log('Connected to PostgreSQL');
    // Sync models
    return sequelize.sync();
  })
  .then(() => {
    console.log('Database synced');
  })
  .catch((err) => console.error('PostgreSQL connection error:', err));

const taskRoutes = require('./routes/tasks');
const authRoutes = require('./routes/auth');

app.use('/api/tasks', taskRoutes);
app.use('/api/auth', authRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
