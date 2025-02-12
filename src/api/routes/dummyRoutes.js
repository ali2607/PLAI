// src/api/routes/dummyRoutes.js

const express = require('express');
const router = express.Router();
const dummyController = require('../controllers/dummyController');

router.get('/', dummyController.getAllDummies);
router.get('/:id', dummyController.getDummyById);
router.post('/', dummyController.createDummy);
router.put('/:id', dummyController.updateDummy);
router.delete('/:id', dummyController.deleteDummy);

module.exports = router;
