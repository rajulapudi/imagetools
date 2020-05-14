var express = require('express');
var router = express.Router();
const path = require('path');
var serveIndex = require('serve-index');

const uploadsFolder = path.join(__dirname, '../', 'uploads');


router.get('/', serveIndex(uploadsFolder, { icons: true }));

module.exports = router;
