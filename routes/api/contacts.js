const express = require('express');
const { isValidObjectId } = require('mongoose');

const router = express.Router();

const { Contact, schemas } = require('../../models/contact')
const auth = require('../../middlewares/auth')

router.get('/', auth, async (req, res, next) => {
  const { _id } = req.user;
  try {
    const contacts = await Contact.find({ owner: _id })
      .populate('owner', 'email');
    res.json({
      status: 'success',
      code: 200,
      data: { result: contacts }
    });
  } catch (error) {
    next(error)
  }
});

router.get('/:contactId', auth, async (req, res, next) => {
  const { _id } = req.user;
  try {
    const { contactId } = req.params;
    const result = await Contact.findOne({ _id: contactId, owner: _id });
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

router.post('/', auth, async (req, res, next) => {
  const { _id } = req.user;
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
    const result = await Contact.create({ ...req.body, owner: _id });
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

router.delete('/:contactId',auth, async (req, res, next) => {
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

router.put('/:contactId',auth, async (req, res, next) => {
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

router.patch('/:contactId/favorite',auth, async (req, res, next) => {
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