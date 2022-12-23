const express = require('express');
const router = express.Router();

const { 
  create, 
  updateOne,
  deleteOne,
  getById,
  getAll 
} = require('../controllers/User');

router.put('/', create);
router.patch('/:id', updateOne);
router.delete('/:id', deleteOne);
router.get('/:id', getById);
router.get('/', getAll);

module.exports = router;