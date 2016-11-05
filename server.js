var express = require('express');
var multer  = require('multer');
var ext = require('file-extension');
var aws = require('aws-sdk');
var multerS3 = require('multer-s3');

var config = require('./config');

var s3 = new aws.S3({
  accessKeyId: config.aws.accessKey,
  secretAccessKey: config.aws.secretKey
});

var storage = multerS3({
  s3: s3,
  bucket: 'mazcoti-01',
  acl: 'public-read',
  metadata: function (req, file, cb) {
    cb(null, { fieldName: file.fieldname })
  },
  key: function (req, file, cb) {
    cb(null, +Date.now() + '.' + ext(file.originalname))
  }
});
 
var upload = multer({ storage: storage }).single('picture');

var app = express();

app.set('view engine', 'pug');

app.use(express.static('public'));

app.get('/', function (req, res) {
	res.render('index', { title: 'Mazcoti' });
})


app.get('/signup', function (req, res) {
	res.render('index', { title: 'Mazcoti - Signup' });
})

app.get('/signin', function (req, res) {
	res.render('index', { title: 'Mazcoti - Signin' });
})

app.get('/api/pictures', function (req, res, next) {
	var pictures = [
    {
    	user: {
    		username: 'eduartua',
    		avatar: 'https://scontent-dft4-2.xx.fbcdn.net/v/t1.0-9/392475_3916005135048_429295491_n.jpg?oh=86a721c6c1e222352e45470f85d1ad14&oe=5843D62C'
    	},
    	url: 'office.jpg',
    	likes: 0,
    	liked: false,
      createdAt: new Date().getTime()
    },
    {
    	user: {
    		username: 'eduartua',
    		avatar: 'https://scontent-dft4-2.xx.fbcdn.net/v/t1.0-9/392475_3916005135048_429295491_n.jpg?oh=86a721c6c1e222352e45470f85d1ad14&oe=5843D62C'
    	},
    	url: 'office.jpg',
    	likes: 1,
    	liked: true,
      createdAt: new Date().setDate(new Date().getDate() - 10)
    }
  ];
  
  setTimeout(() => res.send(pictures), 2000);
});

app.post('/api/pictures', function (req, res) {
  upload(req, res, function (err) {
    if (err) {
      return res.status(500).send(`Error uploading file: ${err.message}`);
    }
    res.send(`File uploaded: ${req.file.location}`);
  })
})

app.get('/api/user/:username', function (req, res) {
  const user = {
    username: 'eduartua',
    avatar: 'https://pbs.twimg.com/profile_images/644354966547656704/hEvyBmxT.jpg',
    pictures: [
      {
        id: 1,
        src: 'https://i.ytimg.com/vi/ykn-HyZejqY/maxresdefault.jpg',
        likes: 3
      },
      {
        id: 2,
        src: 'http://www.hdfinewallpapers.com/HDWallpapers/Big/Cat/Cute_Kitten_Sleeping_Like_Funny_Pets_Images.jpg',
        likes: 10
      },
      {
        id: 3,
        src: 'http://bestpetpics.com/wp-content/uploads/2015/03/Cute-Pets.jpg',
        likes: 23
      },
      {
        id: 4,
        src: 'https://s-media-cache-ak0.pinimg.com/originals/83/35/a3/8335a3c583e5b7ffeb01606ec141c612.jpg',
        likes: 0
      },
      {
        id: 5,
        src: 'https://s-media-cache-ak0.pinimg.com/originals/bf/4e/f9/bf4ef957937fd5b4c8e6f52be33db155.jpg',
        likes: 1
      },
      {
        id: 6,
        src: 'https://img.buzzfeed.com/buzzfeed-static/static/2014-12/5/14/enhanced/webdr10/enhanced-buzz-7500-1417807367-5.jpg',
        likes: 29
      }
    ]
  }

  res.send(user);
})

app.get('/:username', function (req, res) {
   res.render('index', {title: `Mazcoti - ${req.params.username}` })
})

app.get('/:username/:id', function (req, res) {
   res.render('index', {title: `Mazcoti - ${req.params.username}` })
})

app.listen(4000, function (err) {
	if (err) return console.log('Hubo un error'), process.exit(1);

	console.log('Mazcoti escuchando en el puerto 4000');
})