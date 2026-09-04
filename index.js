require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));

app.get('/', (req, res) => {
  res.send('Event Registration server is running');
});
const Event = require('./models/Event');
const Registration = require('./models/Registration');

// Get all events
app.get('/api/events', async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// Get one event by ID
app.get('/api/events/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json(event);
  } catch (err) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});
// Create an event (organizer/admin use)
app.post('/api/events', async (req, res) => {
  try {
    const { title, description, date, location } = req.body;

    if (!title || !date || !location) {
      return res.status(400).json({ error: 'title, date, and location are required' });
    }

    const newEvent = new Event({ title, description, date, location });
    await newEvent.save();

    res.status(201).json(newEvent);
  } catch (err) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});
// Register for an event
app.post('/api/events/:id/register', async (req, res) => {
  try {
    const { name, email } = req.body;
    const { id } = req.params;

    if (!name || !email) {
      return res.status(400).json({ error: 'name and email are required' });
    }

    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    const registration = new Registration({ name, email, event: id });
    await registration.save();

    res.status(201).json(registration);
  } catch (err) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});
// Get all registrations for a user by email
app.get('/api/registrations/:email', async (req, res) => {
  try {
    const registrations = await Registration.find({ email: req.params.email }).populate('event');
    res.json(registrations);
  } catch (err) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});
// Cancel a registration
app.delete('/api/registrations/:id', async (req, res) => {
  try {
    const registration = await Registration.findByIdAndDelete(req.params.id);
    if (!registration) {
      return res.status(404).json({ error: 'Registration not found' });
    }
    res.json({ message: 'Registration cancelled successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));