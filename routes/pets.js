const express = require('express');
const Joi = require('@hapi/joi');

const Pets = require('../models/pets');
const { validateBody, validateQuery } = require('../middlewares/route');

const router = express.Router();


router.post(
    '/create',
    validateBody(Joi.object().keys({
      name: Joi.string().required().description('Pets name'),
      age: Joi.number().integer().required().description('Pets age'),
      colour: Joi.string().required().description('Pets colour')
    }),
    {
      stripUnknown: true,
    }),
    async (req, res, next) => {
      try {
        const pet = new Pets(req.body);
        await pet.save();
        res.status(200).json(pet);
      } catch (e) {
        next(e);
      }
    }
  );

  router.get(
    '/get',
    validateQuery(Joi.object().keys({
      name: Joi.string().required().description('Pets name')
    }),
    {
      stripUnknown: true,
    }),
    async (req, res, next) => {
      try {
          console.log(req.query)
        const pet = await Pets.findOne({name: req.query.name});
        console.log(pet);
        res.status(201).json(pet);
      } catch (e) {
        next(e);
      }
    }
  );


  router.get(
    '/delete',
    validateQuery(Joi.object().keys({
      name: Joi.string().required().description('Pets name')
    }),
    {
      stripUnknown: true,
    }),
    async (req, res, next) => {
      try {
        await Pets.deleteOne({name: req.query.name});
        res.status(201).json({message: `${req.query.name} deleted successfully`});
      } catch (e) {
        next(e);
      }
    }
  );

module.exports = router;