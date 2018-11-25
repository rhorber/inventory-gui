const express = require('express');
const fs = require('fs');

const router = express.Router();
const fileName = 'inventory.json';

const saveFile = function (json, res, next){
  const buffer = Buffer.from(JSON.stringify(json));
  fs.writeFile(fileName, buffer, (err) => {
    if (err) {
      next(err);
    }
    res.sendStatus(200);
    res.end();
  });
};

router.get('/inventory', function (req, res, next) {
  fs.readFile(fileName, (err, data) => {
    if (err) {
      next(err);
    }
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.write(data);
    res.end();
  });
});

router.get('/item/:id', function (req, res, next) {
  const id = parseInt(req.params.id);
  fs.readFile(fileName, (err, data) => {
    if (err) {
      next(err);
    }
    const json = JSON.parse(data.toString());
    item = json.items.find((item) => item.id == id);
    if (item === undefined) {
      res.sendStatus(200);
      res.end();
    } else {
      res.json(item);
      res.end();
    }
  });
});

router.get('/item/increment/:id', function (req, res, next) {
  const id = parseInt(req.params.id);
  fs.readFile(fileName, (err, data) => {
    if (err) {
      next(err);
    }
    const json = JSON.parse(data.toString());
    item = json.items.find((item) => item.id == id);
    if (item === undefined) {
      res.sendStatus(200);
      res.end();
    } else {
      item.stock++;
      saveFile(json, res, next);
    }
  });
});

router.get('/item/decrement/:id', function (req, res, next) {
  const id = parseInt(req.params.id);
  fs.readFile(fileName, (err, data) => {
    if (err) {
      next(err);
    }
    const json = JSON.parse(data.toString());
    item = json.items.find((item) => item.id == id);
    if (item === undefined) {
      res.sendStatus(200);
      res.end();
    } else {
      item.stock--;
      saveFile(json, res, next);
    }
  });
});

router.get('/item/resetStock/:id', function (req, res, next) {
  const id = parseInt(req.params.id);
  fs.readFile(fileName, (err, data) => {
    if (err) {
      next(err);
    }
    const json = JSON.parse(data.toString());
    item = json.items.find((item) => item.id == id);
    if (item === undefined) {
      res.sendStatus(200);
      res.end();
    } else {
      item.stock = 0;
      saveFile(json, res, next);
    }
  });
});

router.post('/item', function (req, res, next) {
  fs.readFile(fileName, (err, data) => {
    if (err) {
      next(err);
    }
    const json = JSON.parse(data.toString());
    const item = req.body;
    const newId = json.items.length + 1;
    item.id = newId;
    json.items.push(req.body);
    saveFile(json, res, next);
  });
});

router.put('/item/:id', function (req, res, next) {
  const id = parseInt(req.params.id);
  fs.readFile(fileName, (err, data) => {
    if (err) {
      next(err);
    }
    const json = JSON.parse(data.toString());
    item = json.items.find((item) => item.id == id);
    if (item === undefined) {
      res.sendStatus(200);
      res.end();
    } else {
      item.name = req.body.name;
      item.stock = req.body.stock;
      saveFile(json, res, next);
    }
  });
});

module.exports = router;
