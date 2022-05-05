const express = require('express');
const { isValidObjectId } = require('mongoose');

const router = express.Router();

const { Contact, schemas } = require('../../models/contact')


router.get('/', async (req, res, next) => {
  try {
    const contacts = await Contact.find();
    res.json({
      status: 'success',
      code: 200,
      data: { result: contacts }
    });
  } catch (error) {
    next(error)
  }
});

router.get('/:contactId', async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const result = await Contact.findById(contactId);
    if (!result) {
      res.status(404).json({
        status: 'error',
        code: 404,
        message: 'Not found'
      });
      return;
    }
    res.json({
      status: 'success',
      code: 200,
      data: {
        result
      }
    });
  } catch (error) {
    next(error)
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { error } = schemas.add.validate(req.body);
    if (error) {
      res.status(400).json({
        status: 'error',
        code: 400,
        message: 'missing required name field'
      });
      return;
    }
    const result = await Contact.create(req.body);
    res.status(201).json({
      status: 'success',
      code: 201,
      data: {
        result
      }
    })
  } catch (error) {
    next(error);
  }
  res.json({ message: 'template message' })
})

router.delete('/:contactId', async (req, res, next) => {
  try {
    const { error } = schemas.add.validate(req.body);
    if (error) {
      res.status(400).json({
        status: 'error',
        code: 400,
        message: 'missing required name field'
      });
      return;
    }

    const { contactId } = req.params;
    const result = await Contact.findByIdAndRemove(contactId, req.body);
    if (!result) {
      res.status(404).json({
        status: 'error',
        code: 404,
        message: 'Not found'
      });
      return;
    }
    res.json({
      status: 'success',
      code: 200,
      message: "contact deleted",
      data: {
        result
      }
    });
  } catch (error) {
    next(error)
  }
  res.json({ message: 'template message' })
});

router.put('/:contactId', async (req, res, next) => {
  try {
    const { error } = schemas.add.validate(req.body);
    if (error) {
      res.status(400).json({
        status: 'error',
        code: 400,
        message: 'missing required name field'
      });
      return;
    }
    const { contactId } = req.params;
    const isValide = isValidObjectId(contactId)
    if (!isValide) {
      res.status(404).json({
        status: 'error',
        code: 404,
        message: 'not found'
      });
      return;
    }
    const result = await Contact.findByIdAndUpdate (contactId, req.body);
    res.json({
      status: 'success',
      code: 200,
      data: {
        result
      }
    });
  } catch (error) {
    next(error)
  }
  res.json({ message: 'template message' })
})

router.patch('/:contactId/favorite', async (req, res, next) => {
  try {
    const { error } = schemas.updateFavorite.validate(req.body);
    if (error) {
      res.status(400).json({
        status: 'error',
        code: 400,
        message: 'missing field favorite'
      });
      return;
    }
    const { contactId } = req.params;
    const isValide = isValidObjectId(contactId)
    if (!isValide) {
      res.status(404).json({
        status: 'error',
        code: 404,
        message: 'not found'
      });
      return;
    }
    const result = await Contact.findByIdAndUpdate (contactId, req.body);
    res.json({
      status: 'success',
      code: 200,
      data: {
        result
      }
    });
  } catch (error) {
    next(error)
  }
  res.json({ message: 'template message' })
})


module.exports = router;
