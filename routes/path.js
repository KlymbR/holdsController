'use strict'

var express = require('express')
var router = express.Router()
var Path = require('../models/path')

// get all paths
router.get('', function (req, se) {
  Path.find({}, (err, res) => {
    if (err) {
      console.log(err)
      se.status(500).send(err)
      return err
    }
    if (!res) {
      se.sendStatus(204)
    } else {
      se.send(res)
    }
  })
})

// get a path with his id
router.get('/path', function (req, se) {
  Path.findOne({path_id: req.query.id}, (err, res) => {
    if (err) {
      console.log(err)
      se.status(500).send(err)
      return err
    }
    if (!res) {
      se.sendStatus(204)
    } else {
      se.send(res)
    }
  })
})

// update the free state of a path and change the free state of grips
router.post('/path/free', function (req, se) {
  Path.findOneAndUpdate(
    {path_id: req.body.path_id},
    {'$set': {'path_free': req.body.path_free}})
    .exec(function (err, res) {
      if (err) {
        console.log(err)
        se.status(500).send(err)
        return err
      }
      if (!res) {
        se.sendStatus(204)
      } else {
        for (let i = 0; i !== res.grips.length; i++) {
          if (req.body.path_free === true) {
            res.grips[i].grip_on = false
          } else {
            res.grips[i].grip_on = true
          }
          Path.findOneAndUpdate(
            {path_id: req.body.path_id},
            {'$set': {'grips': res.grips}})
            .exec(function (err) {
              if (err) {
                console.log(err)
                se.status(500).send(err)
                return err
              }
            })
        }
        se.sendStatus(200)
      }
    })
})

// delete a path
router.post('/path/delete', function (req, se) {
  Path.findOne(
    {path_id: req.body.path_id})
    .exec(function (err, res) {
      if (err) {
        console.log(err)
        se.status(500).send(err)
        return err
      }
      if (!res) {
        se.sendStatus(204)
      } else {
        res.remove()
        se.sendStatus(200)
      }
    })
})

// get the object of a grip
router.get('/grip', function (req, se) {
  var nb = parseInt(req.query.grip_id)
  Path.findOne(
    {path_id: req.query.path_id},
    {'grips': {$elemMatch: {grip_id: nb}}}, { 'grips.$': 1 })
    .exec(function (err, res) {
      if (err) {
        console.log(err)
        se.status(500).send(err)
        return err
      }
      if (!res) {
        se.sendStatus(204)
      } else {
        se.send(res)
      }
    })
})

// update grip data
router.post('/grip', function (req, se) {
  Path.findOneAndUpdate(
    {path_id: req.body.path_id, 'grips.grip_id': req.body.grip_id},
    {'$set': {'grips.$.grip_on': req.body.grip_on, 'grips.$.grip_data': req.body.grip_data}})
    .exec(function (err, res) {
      if (err) {
        console.log(err)
        se.status(500).send(err)
        return err
      }
      if (!res) {
        se.sendStatus(204)
      } else {
        se.sendStatus(200)
      }
    })
})

// delete a grip
router.post('/grip/delete', function (req, se) {
  Path.findOneAndUpdate(
    {path_id: req.body.path_id, 'grips.grip_id': req.body.grip_id},
    {'$set': {'grips.$': null}})
    .exec(function (err, res) {
      if (err) {
        console.log(err)
        se.status(500).send(err)
        return err
      }
      if (!res) {
        se.sendStatus(204)
      } else {
        se.sendStatus(200)
      }
    })
})

module.exports = router
