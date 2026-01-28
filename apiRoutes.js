const express = require('express');
const router = express.Router();
const data = require('../models/roomModel');

// GET (Read All)
router.get('/rooms', (req, res) => {
  const { type, price, isBooked } = req.query;

  const filteredRooms = data
    .filter(room => !type || room.type.toLowerCase() === type.toLowerCase())
    .filter(room => !price || room.price <= parseFloat(price))
    .filter(room => isBooked === undefined || room.isBooked === (isBooked === 'true'));

  if (filteredRooms.length === 0) {
    return res.status(404).json({
      status: 404,
      message: 'No rooms found matching the criteria',
    });
  }

  return res.status(200).json({
    status: 200,
    message: 'Retrieved rooms successfully',
    data: filteredRooms,
  });
});

// POST (Create)
router.post('/rooms', (req, res) => {
  const { type, price, isBooked, features } = req.body;

  if (!type || !price || isBooked === undefined) {
    return res.status(400).json({
      status: 400,
      message: 'Bad Request: Type, Price, and isBooked are required',
    });
  }

  const newRoom = {
    id: data.length + 101,
    type,
    price,
    isBooked,
    features: features || [],
  };

  data.push(newRoom);

  return res.status(201).json({
    status: 201,
    message: 'Room created successfully',
    data: newRoom,
  });
});

// PUT (Update)
router.put('/rooms/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = data.findIndex(room => room.id === id);

  if (index === -1) {
    return res.status(404).json({
      status: 404,
      message: `Room with ID ${id} not found`,
    });
  }

  data[index] = { id, ...req.body };

  return res.status(200).json({
    status: 200,
    message: 'Room updated successfully',
    data: data[index],
  });
});

// DELETE (Remove)
router.delete('/rooms/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = data.findIndex(room => room.id === id);

  if (index === -1) {
    return res.status(404).json({
      status: 404,
      message: `Room with ID ${id} not found`,
    });
  }

  data.splice(index, 1);

  return res.status(203).json({
    status: 203,
    message: 'Room deleted successfully',
  });
});

module.exports = router;