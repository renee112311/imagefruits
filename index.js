import express from 'express'
import session from 'express-session'
import connectMongo from 'connect-mongo'
import multer from 'multer'
import FTPStorage from 'multer-ftp'
import md5 from 'md5'
import dotenv from 'dotenv'
import bodyParser from 'body-parser'
import cors from 'cors'
import path from 'path'
import fs from 'fs'

import db from './db.js'

dotenv.config()

const MongoStore = connectMongo(session)
const app = express()

app.use(bodyParser.json())

app.use(cors({
  origin (origin, callback) {
    // 直接開網頁時，不是ajax，origin是undefined
    if (origin === undefined) {
      callback(null, true)
    } else {
      if (process.env.ALLOW_CORS === 'true') {
        // 開發環境，允許
        callback(null, true)
      } else if (origin.includes('github')) {
        // 非開發環境，但是從 github 過來，允許
        callback(null, true)
      } else {
        // 不是開發也不是從 github 過來，拒絕
        callback(new Error('Not allowed'), false)
      }
    }
  },
  credentials: true
}))

app.use(session({
  secret: 'fruits',
  store: new MongoStore({
    mongooseConnection: db.connection,
    collection: process.env.COLLECTION_SESSION
  }),
  // session 有效期間
  cookie: {
    // 1000 毫秒 = 一秒鐘
    // 1000 毫秒 * 60 = 一分鐘
    // 1000 毫秒 * 60 * 30 = 三十分鐘
    maxAge: 1000 * 60 * 30
  },
  saveUninitialized: false,
  rolling: true,
  resave: true
}))

// 檔案存放
let storage
if (process.env.DEV) {
  storage = multer.diskStorage({
    destination (req, file, cb) {
      cb(null, 'images/')
    },
    filename (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname))
    }
  })
} else {
  storage = new FTPStorage({
    basepath: '/',
    ftp: {
      host: process.env.FTP_HOST,
      secure: false,
      user: process.env.FTP_USER,
      password: process.env.FTP_PASSWORD
    },
    destination (req, file, options, cb) {
      cb(null, options.basepath + Date.now() + path.extname(file.originalname))
    }
  })
}
// 宣告上傳檔案
const upload = multer({
  storage,
  fileFilter (req, file, cb) {
    if (!file.mimetype.includes('image')) {
      cb(new multer.MulterError('LIMIT_FORMAT'), false)
    } else {
      cb(null, true)
    }
  },
  limits: {
    fileSize: 2000 * 2000
  }
})
// 宣告上傳頭貼
const upload2 = multer({
  storage,
  fileFilter (req, file, cb) {
    if (!file.mimetype.includes('image')) {
      cb(new multer.MulterError('LIMIT_FORMAT'), false)
    } else {
      cb(null, true)
    }
  },
  limits: {
    fileSize: 300 * 300
  }
})
// 宣告上傳輪播圖
const uploadCSI = multer({
  storage,
  fileFilter (req, file, cb) {
    if (!file.mimetype.includes('image')) {
      cb(new multer.MulterError('LIMIT_FORMAT'), false)
    } else {
      cb(null, true)
    }
  },
  limits: {
    fileSize: 4000 * 4000
  }
})
app.listen(process.env.PORT, () => {
  console.log('已啟動')
})
// 註冊
app.post('/users', async (req, res) => {
  if (!req.headers['content-type'].includes('application/json')) {
    res.status(400)
    res.send({ success: false, message: '格式錯誤' })
    return
  }
  if (req.body.password.length === 0) {
    return
  }
  try {
    await db.users.create({
      account: req.body.account,
      password: md5(req.body.password),
      description: req.body.description,
      favorite: req.body.favorite,
      banned: req.body.banned
    })
    res.status(200)
    res.send({ success: true, message: '' })
  } catch (error) {
    if (error.name === 'ValidationError') {
      const key = Object.keys(error.errors)[0]
      const message = error.errors[key].message
      console.log(error)
      res.status(400)
      res.send({ success: false, message })
    } else {
      console.log(error)
      res.status(500)
      res.send({ success: false, message: '伺服器錯誤' })
    }
  }
})
// 登入
app.post('/login', async (req, res) => {
  if (!req.headers['content-type'].includes('application/json')) {
    res.status(400)
    res.send({ success: false, message: '格式錯誤' })
    return
  }
  try {
    const result = await db.users.find({
      account: req.body.account,
      password: md5(req.body.password)
    })
    if (result.length > 0) {
      req.session.user = result[0].account
      console.log(req.session.user)
      res.status(200)
      res.send({ success: true, message: '' })
    } else {
      res.status(404)
      res.send({ success: false, message: '帳號密碼錯誤' })
    }
  } catch (error) {
    if (error.name === 'ValidationError') {
      const key = Object.keys(error.errors)[0]
      const message = error.errors[key].message
      res.status(400)
      res.send({ success: false, message })
    } else {
      console.log(error)
      res.status(500)
      res.send({ success: false, message: '伺服器錯誤' })
    }
  }
})
// 編輯會員
app.patch('/users/edit/:id', async (req, res) => {
  if (!req.headers['content-type'].includes('application/json')) {
    res.status(400)
    res.send({ success: false, message: '格式不符' })
    return
  }
  // 沒有登入
  if (!req.session.user) {
    console.log(req.session.user)
    res.status(401)
    res.send({ success: false, message: '無權限' })
    return
  }
  try {
    let result = await db.users.find({ _id: req.params.id })
    if (result[0].account !== req.session.user && req.session.user !== 'admin') {
      res.status(403)
      res.send({ success: false, message: '無權限' })
      return
    }
    result = await db.users.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.status(200)
    res.send({ success: true, message: '', result })
  } catch (error) {
    if (error.name === 'CastError') {
      res.status(400)
      res.send({ success: false, message: 'ID格式錯誤' })
    } else if (error.name === 'ValidationError') {
      const key = Object.keys(error.errors)[0]
      const message = error.errors[key].message
      res.status(400)
      res.send({ success: false, message })
    } else {
      console.log(error)
      res.status(500)
      res.send({ success: false, message: '伺服器錯誤' })
    }
  }
})
// 抓取會員
app.get('/users/:user', async (req, res) => {
  try {
    const result = await db.users.find({ account: req.params.user })
    res.status(200)
    res.send({ success: true, message: '', result })
  } catch (error) {
    if (error.name === 'CastError') {
      res.status(400)
      res.send({ success: false, message: '格式錯誤' })
    } else if (error.name === 'ValidationError') {
      const key = Object.keys(error.errors)[0]
      const message = error.errors[key].message
      res.status(400)
      res.send({ success: false, message })
    } else {
      res.status(500)
      res.send({ success: false, message: '伺服器錯誤' })
    }
  }
})

// 維持登入
app.get('/heartbeat', async (req, res) => {
  let islogin = false
  if (req.session.user !== undefined) {
    islogin = true
  }
  res.status(200)
  res.send(islogin)
})

// 登出
app.delete('/logout', async (req, res) => {
  req.session.destroy(error => {
    if (error) {
      res.status(500)
      res.send({ success: false, message: '伺服器錯誤' })
    } else {
      res.clearCookie()
      res.status(200)
      res.send({ success: true, message: '' })
    }
  })
})

// 上傳
app.post('/file', async (req, res) => {
  if (req.session.user === undefined) {
    res.status(401)
    res.send({ success: false, message: '未登入' })
    return
  }
  if (!req.headers['content-type'].includes('multipart/form-data')) {
    res.status(400)
    res.send({ success: false, message: '格式錯誤' })
    return
  }
  upload.array('image', 5)(req, res, async error => {
    if (error instanceof multer.MulterError) {
      let message = ''
      if (error.code === 'LIMIT_FILE_SIZE') {
        message = '檔案太大'
      } else {
        message = '格式不符'
      }
      res.status(400)
      res.send({ success: false, message })
    } else if (error) {
      console.log(error)
      res.status(500)
      res.send({ success: false, message: '伺服器錯誤' })
    } else {
      try {
        const resultall = []
        for (let i = 0; i < req.files.length; i++) {
          let name = ''
          if (process.env.FTP === 'true') {
            name = path.basename(req.files[i].path)
          } else {
            name = req.files[i].filename
          }
          console.log(req.files[i])
          console.log(path.basename(req.files[i].path))
          console.log(req.body.title[i])
          const result = await db.files.create(
            {
              user: req.session.user,
              title: req.body.title[i],
              description: req.body.description[i],
              album: req.body.album[i],
              privacy: req.body.privacy[i],
              name:path.basename(req.files[i].path)
            }
          )
          resultall.push(result)
          console.log(result)
        }
        console.log(resultall)
        res.status(200)
        res.send({ success: true, message: '', name: resultall, _id: resultall })
      } catch (error) {
        if (error.name === 'ValidationError') {
          // 資料格式錯誤
          const key = Object.keys(error.errors)[0]
          const message = error.errors[key].message
          res.status(400)
          res.send({ success: false, message })
        } else {
          // 伺服器錯誤
          console.log(error)
          res.status(500)
          res.send({ success: false, message: '伺服器錯誤' })
        }
      }
    }
  })
})

// 某作者的檔案
app.get('/author/:author', async (req, res) => {
  try {
    const result = await db.files.find({ user: req.params.author })
    res.status(200)
    res.send({ success: true, message: '', result })
  } catch (error) {
    res.status(500)
    res.send({ success: false, message: '伺服器錯誤' })
  }
})

// 所有公開的檔案
app.get('/', async (req, res) => {
  try {
    const result = await db.files.find()
    res.status(200)
    res.send({ success: true, message: '', result })
  } catch (error) {
    res.status(500)
    res.send({ success: false, message: '伺服器錯誤' })
  }
})

// 回傳公開檔案路徑
app.get('/file/:name', async (req, res) => {
  if (process.env.DEV) {
    const path = process.cwd() + '/images/' + req.params.name
    const exists = fs.existsSync(path)
    if (exists) {
      res.status(200)
      res.sendFile(path)
    } else {
      res.status(404)
      res.send({ success: false, message: '找不到圖片' })
    }
  } else {
    res.redirect('http://' + process.env.FTP_HOST + '/' + process.env.FTP_USER + '/' + req.params.name)
  }
})

// 編輯檔案
app.patch('/file/:id', async (req, res) => {
  if (!req.headers['content-type'].includes('application/json')) {
    res.status(400)
    res.send({ success: false, message: '格式不符' })
    return
  }
  // 沒有登入
  if (!req.session.user) {
    res.status(401)
    res.send({ success: false, message: '無權限' })
    return
  }
  try {
    let result = await db.files.findById(req.params.id)
    if (result.user !== req.session.user) {
      res.status(403)
      res.send({ success: false, message: '無權限' })
      return
    }
    result = await db.files.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.status(200)
    res.send({ success: true, message: '', result })
  } catch (error) {
    if (error.name === 'CastError') {
      res.status(400)
      res.send({ success: false, message: 'ID格式錯誤' })
    } else if (error.name === 'ValidationError') {
      const key = Object.keys(error.errors)[0]
      const message = error.errors[key].message
      res.status(400)
      res.send({ success: false, message })
    } else {
      res.status(500)
      res.send({ success: false, message: '伺服器錯誤' })
    }
  }
})

// 刪除檔案
app.delete('/file/:id', async (req, res) => {
  // 沒有登入
  if (!req.session.user) {
    res.status(401)
    res.send({ success: false, message: '無權限' })
    return
  }
  try {
    let result = await db.files.findById(req.params.id)
    if (result.user !== req.session.user && req.session.user !== 'admin') {
      res.status(403)
      res.send({ success: false, message: '無權限' })
      return
    }
    result = await db.files.findByIdAndDelete(req.params.id)
    if (result === null) {
      res.status(404)
      res.send({ success: true, message: '找不到資料' })
    } else {
      res.status(200)
      res.send({ success: true, message: '', result })
    }
  } catch (error) {
    if (error.name === 'CastError') {
      res.status(400)
      res.send({ success: false, message: 'ID格式錯誤' })
    } else {
      res.status(500)
      res.send({ success: false, message: '伺服器錯誤' })
    }
  }
})

// 上傳頭像
app.post('/avatar', async (req, res) => {
  if (req.session.user === undefined) {
    res.status(401)
    res.send({ success: false, message: '未登入' })
    return
  }
  if (!req.headers['content-type'].includes('multipart/form-data')) {
    res.status(400)
    res.send({ success: false, message: '格式錯誤' })
    return
  }
  upload2.single('image')(req, res, async error => {
    if (error instanceof multer.MulterError) {
      let message = ''
      if (error.code === 'LIMIT_FILE_SIZE') {
        message = '檔案太大'
      } else {
        message = '格式不符'
      }
      res.status(400)
      res.send({ success: false, message })
    } else if (error) {
      console.log(error)
      res.status(500)
      res.send({ success: false, message: '伺服器錯誤' })
    } else {
      try {
        let name = ''
        if (process.env.FTP === 'true') {
          name = path.basename(req.file.path)
        } else {
          name = req.file.filename
        }
        const result = await db.avatars.create(
          {
            user: req.session.user,
            description: req.body.description,
            name
          }
        )
        res.status(200)
        res.send({ success: true, message: '', name: path.basename(req.file.path), _id: result._id })
      } catch (error) {
        if (error.name === 'ValidationError') {
          // 資料格式錯誤
          const key = Object.keys(error.errors)[0]
          const message = error.errors[key].message
          res.status(400)
          res.send({ success: false, message })
        } else {
          // 伺服器錯誤
          console.log(error)
          res.status(500)
          res.send({ success: false, message: '伺服器錯誤' })
        }
      }
    }
  })
})

// 某作者頭像
app.get('/avatar/:author', async (req, res) => {
  try {
    const result = await db.avatars.find({ user: req.params.author })
    res.status(200)
    res.send({ success: true, message: '', result })
  } catch (error) {
    res.status(500)
    res.send({ success: false, message: '伺服器錯誤' })
  }
})

// 回傳頭像
app.get('/avatar/image/:name', async (req, res) => {
  if (process.env.DEV) {
    const path = process.cwd() + '/images/' + req.params.name
    const exists = fs.existsSync(path)
    if (exists) {
      res.status(200)
      res.sendFile(path)
    } else {
      res.status(404)
      res.send({ success: false, message: '找不到圖片' })
    }
  } else {
    res.redirect('http://' + process.env.FTP_HOST + '/' + process.env.FTP_USER + '/' + req.params.name)
  }
})

// 刪除頭像
app.delete('/avatar/:id', async (req, res) => {
  // 沒有登入
  if (!req.session.user) {
    res.status(401)
    res.send({ success: false, message: '無權限' })
    return
  }
  try {
    let result = await db.avatars.findById(req.params.id)
    if (result.user !== req.session.user && req.session.user !== 'admin') {
      res.status(403)
      res.send({ success: false, message: '無權限' })
      return
    }
    result = await db.avatars.findByIdAndDelete(req.params.id)
    if (result === null) {
      res.status(404)
      res.send({ success: true, message: '找不到資料' })
    } else {
      res.status(200)
      res.send({ success: true, message: '', result })
    }
  } catch (error) {
    if (error.name === 'CastError') {
      res.status(400)
      res.send({ success: false, message: 'ID格式錯誤' })
    } else {
      res.status(500)
      res.send({ success: false, message: '伺服器錯誤' })
    }
  }
})

// 新增相簿
app.post('/albums', async (req, res) => {
  if (!req.headers['content-type'].includes('application/json')) {
    res.status(400)
    res.send({ success: false, message: '格式錯誤' })
    return
  }

  try {
    await db.albums.create({
      user: req.body.user,
      title: req.body.title,
      description: req.body.description
    })
    res.status(200)
    res.send({ success: true, message: '' })
  } catch (error) {
    if (error.name === 'ValidationError') {
      const key = Object.keys(error.errors)[0]
      const message = error.errors[key].message
      console.log(error)
      res.status(400)
      res.send({ success: false, message })
    } else {
      console.log(error)
      res.status(500)
      res.send({ success: false, message: '伺服器錯誤' })
    }
  }
})

// 回傳某作者相簿
app.get('/albums/:user', async (req, res) => {
  try {
    const result = await db.albums.find({ user: req.params.user })
    res.status(200)
    res.send({ success: true, message: '', result })
  } catch (error) {
    res.status(500)
    res.send({ success: false, message: '伺服器錯誤' })
  }
})

// 編輯相簿
app.patch('/albums/:id', async (req, res) => {
  if (!req.headers['content-type'].includes('application/json')) {
    res.status(400)
    res.send({ success: false, message: '格式不符' })
    return
  }
  // 沒有登入
  if (!req.session.user) {
    res.status(401)
    res.send({ success: false, message: '無權限' })
    return
  }
  try {
    let result = await db.albums.findById(req.params.id)
    if (result.user !== req.session.user) {
      res.status(403)
      res.send({ success: false, message: '無權限' })
      return
    }
    result = await db.albums.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.status(200)
    res.send({ success: true, message: '', result })
  } catch (error) {
    if (error.name === 'CastError') {
      res.status(400)
      res.send({ success: false, message: 'ID格式錯誤' })
    } else if (error.name === 'ValidationError') {
      const key = Object.keys(error.errors)[0]
      const message = error.errors[key].message
      res.status(400)
      res.send({ success: false, message })
    } else {
      res.status(500)
      res.send({ success: false, message: '伺服器錯誤' })
    }
  }
})

// 刪除相簿
app.delete('/albums/:id', async (req, res) => {
  // 沒有登入
  if (!req.session.user) {
    res.status(401)
    res.send({ success: false, message: '無權限' })
    return
  }
  try {
    let result = await db.albums.findById(req.params.id)
    if (result.user !== req.session.user) {
      res.status(403)
      res.send({ success: false, message: '無權限' })
      return
    }
    result = await db.albums.findByIdAndDelete(req.params.id)
    if (result === null) {
      res.status(404)
      res.send({ success: true, message: '找不到資料' })
    } else {
      res.status(200)
      res.send({ success: true, message: '', result })
    }
  } catch (error) {
    if (error.name === 'CastError') {
      res.status(400)
      res.send({ success: false, message: 'ID格式錯誤' })
    } else {
      res.status(500)
      res.send({ success: false, message: '伺服器錯誤' })
    }
  }
})

// 我的收藏
app.get('/myfavorite/:id', async (req, res) => {
  try {
    const result = await db.files.findById(req.params.id)
    res.status(200)
    res.send({ success: true, message: '', result })
  } catch (error) {
    res.status(500)
    res.send({ success: false, message: '伺服器錯誤' })
  }
})

/** ******管理員後台*******/
// 抓取所有會員
app.get('/back/users/', async (req, res) => {
  try {
    const result = await db.users.find()
    res.status(200)
    console.log(req.session.user)
    res.send({ success: true, message: '', result })
  } catch (error) {
    res.status(500)
    res.send({ success: false, message: '伺服器錯誤' })
  }
})

// 停權
app.patch('/users/banned/:id', async (req, res) => {
  if (!req.headers['content-type'].includes('application/json')) {
    res.status(400)
    res.send({ success: false, message: '格式不符' })
    return
  }
  // 沒有登入
  if (!req.session.user) {
    res.status(401)
    res.send({ success: false, message: '無權限' })
    return
  }
  try {
    let result = await db.users.find({ _id: req.params.id })
    if (req.session.user !== 'admin') {
      res.status(403)
      res.send({ success: false, message: '無權限' })
      return
    }
    result = await db.users.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.status(200)
    res.send({ success: true, message: '', result })
  } catch (error) {
    if (error.name === 'CastError') {
      res.status(400)
      res.send({ success: false, message: 'ID格式錯誤' })
    } else if (error.name === 'ValidationError') {
      const key = Object.keys(error.errors)[0]
      const message = error.errors[key].message
      res.status(400)
      res.send({ success: false, message })
    } else {
      console.log(error)
      res.status(500)
      res.send({ success: false, message: '伺服器錯誤' })
    }
  }
})

// 抓取所有檔案
app.get('/back/files/', async (req, res) => {
  try {
    const result = await db.files.find()
    res.status(200)
    res.send({ success: true, message: '', result })
  } catch (error) {
    res.status(500)
    res.send({ success: false, message: '伺服器錯誤' })
  }
})

// 上傳輪播圖
app.post('/carousel', async (req, res) => {
  if (req.session.user === undefined) {
    res.status(401)
    res.send({ success: false, message: '未登入' })
    return
  }
  if (!req.headers['content-type'].includes('multipart/form-data')) {
    res.status(400)
    res.send({ success: false, message: '格式錯誤' })
    return
  }
  uploadCSI.single('image')(req, res, async error => {
    if (error instanceof multer.MulterError) {
      let message = ''
      if (error.code === 'LIMIT_FILE_SIZE') {
        message = '檔案太大'
      } else {
        message = '格式不符'
      }
      res.status(400)
      res.send({ success: false, message })
    } else if (error) {
      console.log(error)
      res.status(500)
      res.send({ success: false, message: '伺服器錯誤' })
    } else {
      try {
        console.log(req.file.path)
        let name = ''
        if (process.env.FTP === 'true') {
          name = path.basename(req.file.path)
        } else {
          name = req.file.filename
        }
        const result = await db.carouselimgs.create(
          { name: path.basename(req.file.path) }
        )
        console.log(name)
        res.status(200)
        res.send({ success: true, message: '', name: path.basename(req.file.path), _id: result._id })
      } catch (error) {
        if (error.name === 'ValidationError') {
          // 資料格式錯誤
          console.log(error.errors)
          const key = Object.keys(error.errors)[0]
          const message = error.errors[key].message
          res.status(400)
          res.send({ success: false, message })
        } else {
          // 伺服器錯誤
          console.log(error)
          res.status(500)
          res.send({ success: false, message: '伺服器錯誤' })
        }
      }
    }
  })
})

// GET輪播圖
app.get('/carousel/img', async (req, res) => {
  try {
    const result = await db.carouselimgs.find()
    res.status(200)
    res.send({ success: true, message: '', result })
  } catch (error) {
    res.status(500)
    res.send({ success: false, message: '伺服器錯誤' })
  }
})

// 輪播圖路徑
app.get('/carousel/:name', async (req, res) => {
  if (process.env.DEV) {
    const path = process.cwd() + '/images/' + req.params.name
    const exists = fs.existsSync(path)
    if (exists) {
      res.status(200)
      res.sendFile(path)
    } else {
      res.status(404)
      res.send({ success: false, message: '找不到圖片' })
    }
  } else {
    res.redirect('http://' + process.env.FTP_HOST + '/' + process.env.FTP_USER + '/' + req.params.name)
  }
})

// 刪除輪播圖
app.delete('/carousel/:id', async (req, res) => {
  // 沒有登入
  if (!req.session.user) {
    res.status(401)
    res.send({ success: false, message: '無權限' })
    return
  }
  try {
    let result = await db.carouselimgs.findById(req.params.id)
    if (result.user !== req.session.user && req.session.user !== 'admin') {
      res.status(403)
      res.send({ success: false, message: '無權限' })
      return
    }
    result = await db.carouselimgs.findByIdAndDelete(req.params.id)
    if (result === null) {
      res.status(404)
      res.send({ success: true, message: '找不到資料' })
    } else {
      res.status(200)
      res.send({ success: true, message: '', result })
    }
  } catch (error) {
    if (error.name === 'CastError') {
      res.status(400)
      res.send({ success: false, message: 'ID格式錯誤' })
    } else {
      res.status(500)
      res.send({ success: false, message: '伺服器錯誤' })
    }
  }
})
