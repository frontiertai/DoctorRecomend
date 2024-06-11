const express = require('express');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const { spawn } = require('child_process');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

// サービスアカウントキーのパス
const serviceAccount = require('/Users/frontier_tai/Desktop/Nextjs/DoctorRecomend/server/doctorrecomend-firebase-adminsdk-sth3q-7dd1e5316a.json');

// Firebase Admin SDKの初期化
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const app = express();

app.use(cors());
app.use(bodyParser.json());

// uploadsディレクトリが存在しない場合は作成
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

// 静的ファイルの提供
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.post('/api/predict', upload.single('file'), (req, res) => {
  const filePath = req.file.path;
  const python = spawn('python', [path.join(__dirname, 'yolo/yolov5_script.py'), filePath]);

  let stdoutData = '';
  let stderrData = '';

  python.stdout.on('data', (data) => {
    stdoutData += data.toString();
  });

  python.stderr.on('data', (data) => {
    stderrData += data.toString();
  });

  python.on('close', (code) => {
    console.log(`stderr: ${stderrData}`);  // デバッグ用ログ
    if (code === 0) {
      try {
        const result = JSON.parse(stdoutData);
        res.json(result);
      } catch (error) {
        res.status(500).send("Error parsing JSON response");
      }
    } else {
      res.status(500).send(stderrData);
    }
  });
});

app.post('/api/run-python', (req, res) => {
  const python = spawn('python', [path.join(__dirname, 'judgment/hospital.py')]);

  let stdoutData = '';
  let stderrData = '';

  python.stdout.on('data', (data) => {
    stdoutData += data.toString();
  });

  python.stderr.on('data', (data) => {
    stderrData += data.toString();
  });

  python.on('close', (code) => {
    console.log(`stderr: ${stderrData}`);  // デバッグ用ログ
    if (code === 0) {
      try {
        const result = JSON.parse(stdoutData);
        res.json(result);
      } catch (error) {
        res.status(500).send("Error parsing JSON response");
      }
    } else {
      res.status(500).send(stderrData);
    }
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
