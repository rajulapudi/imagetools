var express = require('express');
const path = require('path');
var sizeOf = require('image-size')
const multer = require('multer');
var Jimp = require('jimp');
const imagemin = require('imagemin');
const imageminJpegtran = require('imagemin-jpegtran');
const imageminPngquant = require('imagemin-pngquant');
const fs = require('fs');
const imageminWebp = require('imagemin-webp');
const sharp = require('sharp');
const SVGO = require('svgo');

let svgo = new SVGO({
  plugins: [{
    cleanupAttrs: true,
  }, {
    removeDoctype: true,
  }, {
    removeXMLProcInst: true,
  }, {
    removeComments: true,
  }, {
    removeMetadata: true,
  }, {
    removeTitle: true,
  }, {
    removeDesc: true,
  }, {
    removeUselessDefs: true,
  }, {
    removeEditorsNSData: true,
  }, {
    removeEmptyAttrs: true,
  }, {
    removeHiddenElems: true,
  }, {
    removeEmptyText: true,
  }, {
    removeEmptyContainers: true,
  }, {
    removeViewBox: true,
  }, {
    cleanupEnableBackground: true,
  }, {
    convertStyleToAttrs: true,
  }, {
    convertColors: true,
  }, {
    convertPathData: true,
  }, {
    convertTransform: true,
  }, {
    removeUnknownsAndDefaults: true,
  }, {
    removeNonInheritableGroupAttrs: true,
  }, {
    removeUselessStrokeAndFill: true,
  }, {
    removeUnusedNS: true,
  }, {
    cleanupIDs: true,
  }, {
    cleanupNumericValues: true,
  }, {
    moveElemsAttrsToGroup: true,
  }, {
    moveGroupAttrsToElems: true,
  }, {
    collapseGroups: true,
  }, {
    removeRasterImages: true,
  }, {
    mergePaths: true,
  }, {
    convertShapeToPath: true,
  }, {
    sortAttrs: true,
  }, {
    removeDimensions: true,
  }],
  floatPrecision: 0
});
var router = express.Router();
const uploadsFolder = path.join(__dirname, '../', 'uploads');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsFolder);
  },
  filename: function (req, file, cb) {
    cb(
      null,
      Date.now() + file.originalname.replace(/\s+/g, '-').toLowerCase()
    );
  }
});
const fileFilter = (req, file, cb) => {
  const isImage = file.mimetype.startsWith('image/');
  if (isImage) {
    cb(null, true);
  } else {
    // rejects storing a file
    cb(null, false);
  }
};
const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter
});


const minifyImages = async (image) => {
  await imagemin([image], {
    destination: path.join(__dirname, '../uploads/'),
    plugins: [
      imageminJpegtran(),
      imageminPngquant({
        quality: [0.6, 0.8]
      })
    ]
  });
};

const convertToWebp = async (image) => {
  return new Promise(async (resolve, reject) => {
    let file = await imagemin([image], {
      destination: path.join(__dirname, '../uploads/'),
      plugins: [imageminWebp({ quality: 80, method: 6 })]
    });
    resolve(file);
  });
};

const imageResize = async (file, extension, width, height) => {
  return new Promise(async (resolve, reject) => {
    await Jimp.read(
      path.join(__dirname, '..', `uploads/${file}.${extension}`),
      (err, img) => {
        if (err) {
          reject('error');
        }
        img
          .clone()
          .resize(Number(width), Number(height))
          .write(`uploads/${file}-mod.${extension}`, (err) => {
            if (!err) {
              let dimensions = sizeOf(path.join(__dirname, `../uploads/${file}-mod.${extension}`))
              let { size } = fs.statSync(path.join(__dirname, `../uploads/${file}-mod.${extension}`))
              let result = {
                url: `/upload/${file}-mod.${extension}`,
                extension: extension,
                dimensions: dimensions,
                fileName: `${file}-mod.${extension}`,
                size: size
              }
              console.log(result);
              resolve(result);
            }
          })
      }
    );
  });
};


router.post('/upload', upload.single('image'), async (req, res) => {
  if (!req.file) {
    res.status(401).json({ error: 'Please provide an image' });
  }
  let extension = req.file.filename.split('.').pop();
  let file = req.file.filename.replace(/\.[^/.]+$/, '');
  let dimensions = sizeOf(path.join(__dirname, `../uploads/${file}.${extension}`))
  const { size } = fs.statSync(path.join(__dirname, `../uploads/${file}.${extension}`))

  res.send({
    success: 1,
    file: {
      url: `/upload/${file}.${extension}`,
      extension: extension,
      dimensions: dimensions,
      fileName: `${file}.${extension}`,
      size: size
    }
  })

});

router.post('/resize', async (req, res) => {
  let width = req.body.width
  let height = req.body.height
  let file = req.body.image.replace(/\.[^/.]+$/, '');
  let extension = req.body.image.split('.').pop();
  imageResize(file, extension, width, height).then((result) => {
    res.send({
      success: 1,
      file: result
    })
  }).catch((err) => {
    console.log(err)
    res.send('error')
  })
})
router.post('/webp', (req, res) => {
  let file = req.body.image.replace(/\.[^/.]+$/, '');
  let extension = req.body.image.split('.').pop();
  convertToWebp(path.join(__dirname, `../uploads/${file}.${extension}`)).then(() => {
    let dimensions = sizeOf(path.join(__dirname, `../uploads/${file}.webp`))
    let { size } = fs.statSync(path.join(__dirname, `../uploads/${file}.webp`))
    res.send({
      success: 1,
      file: {
        url: `/upload/${file}.webp`,
        extension: 'webp',
        dimensions: dimensions,
        fileName: `${file}.webp`,
        size: size
      }
    })
  }).catch(err => {
    res.send(err)
  })

})
router.post('/compress', (req, res) => {
  let file = req.body.image.replace(/\.[^/.]+$/, '');
  let extension = req.body.image.split('.').pop();
  if (extension === 'svg') {
    fs.readFile(path.join(__dirname, `../uploads/${file}.${extension}`), 'utf8', function (err, data) {
      if (err) {
        throw err;
      }
      svgo.optimize(data, { path: path.join(__dirname, `../uploads/${file}.${extension}`) }).then(function (result) {
        fs.writeFileSync(path.join(__dirname, `../uploads/${file}-mod.${extension}`), result.data)
        let dimensions = sizeOf(path.join(__dirname, `../uploads/${file}-mod.${extension}`))
        let { size } = fs.statSync(path.join(__dirname, `../uploads/${file}-mod.${extension}`))

        res.send({
          success: 1,
          file: {
            url: `/upload/${file}-mod.${extension}`,
            extension: extension,
            dimensions: dimensions,
            fileName: `${file}-mod.${extension}`,
            size: size
          }
        })
      });
    });
  } else {
    Jimp.read(path.join(__dirname, `../uploads/${file}.${extension}`), (err, image) => {
      if (!err) {
        image.clone().write(`uploads/${file}-mod.${extension}`, () => {
          minifyImages(`uploads/${file}-mod.${extension}`).then(() => {
            let dimensions = sizeOf(path.join(__dirname, `../uploads/${file}-mod.${extension}`))
            let { size } = fs.statSync(path.join(__dirname, `../uploads/${file}-mod.${extension}`))
            res.send({
              success: 1,
              file: {
                url: `/upload/${file}-mod.${extension}`,
                extension: extension,
                dimensions: dimensions,
                fileName: `${file}-mod.${extension}`,
                size: size
              }
            })
          }).catch(err => {
            res.send(err)
          })

        })
      } else {
        res.send(err)
      }

    })
  }

})

module.exports = router;
