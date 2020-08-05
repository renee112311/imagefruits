import dotenv from 'dotenv'
import mongoose from 'mongoose'
import beautifyUnique from 'mongoose-beautiful-unique-validation'

dotenv.config()

const Schema = mongoose.Schema
mongoose.connect(process.env.DBURL)
mongoose.plugin(beautifyUnique)

// 會員資料
const userSchema = new Schema({
  account: {
    type: String,
    minlength: [5, '帳號必須是 5~10 字'],
    maxlength: [10, '帳號必須是 5~10 字'],
    unique: '此帳號已存在',
    required: [true, '請輸入帳號']
  },
  password: {
    type: String,
    minlength: [1, '請輸入密碼'],
    required: [true, '請輸入密碼']
  },
  description: {
    type: String,
    maxlength: [150, '自我介紹最多 150 字']
  },
  favorite: {
    type: Array
  },
  banned: {
    type: Boolean
  }
}, {
  versionKey: false
})

// 檔案資料
const fileSchema = new Schema({
  user: {
    type: String,
    required: [true, '沒有使用者名稱']
  },
  title: {
    type: String,
    maxlength: [20, '圖片標題最多 20 字']
  },
  description: {
    type: String,
    maxlength: [150, '圖片說明最多 150 字']
  },
  album: {
    type: String,
    maxlength: [20, '相簿標題最多 20 字']
  },
  name: {
    type: String,
    required: [true, '沒有檔案名稱']
  },
  privacy: {
    type: String
  }
})

// 頭像資料
const avatarSchema = new Schema({
  user: {
    type: String,
    required: [true, '沒有使用者名稱']
  },
  name: {
    type: String,
    required: [true, '沒有檔案名稱']
  }
})

// 相簿
const albumSchema = new Schema({
  user: {
    type: String,
    required: [true, '沒有使用者名稱']
  },
  title: {
    type: String,
    required: [true, '沒有相簿標題'],
    maxlength: [20, '相簿標題最多 20 字']
  },
  description: {
    type: String,
    maxlength: [150, '相簿說明最多 150 字']
  }
})

// 輪播圖資料
const carouselimgSchema = new Schema({
  name: {
    type: String,
    required: [true, '沒有檔案名稱']
  }
})

const users = mongoose.model(process.env.COLLECTION_USER, userSchema)
const files = mongoose.model(process.env.COLLECTION_FILE, fileSchema)
const avatars = mongoose.model(process.env.COLLECTION_AVATAR, avatarSchema)
const albums = mongoose.model(process.env.COLLECTION_ALBUM, albumSchema)
const carouselimgs = mongoose.model(process.env.COLLECTION_CAROUSELIMG, carouselimgSchema)

const connection = mongoose.connection

export default {
  users,
  files,
  avatars,
  albums,
  carouselimgs,
  connection
}
