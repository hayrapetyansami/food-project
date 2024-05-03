const express = require("express");
const multer = require("multer")
const sqlite3 = require("sqlite3");
const cors = require("cors");

const app = express();
const PORT = 8888;

app.use(cors());
app.use(express.static("static"));
app.use(express.json());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/') // specify your destination folder here
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
});

const upload = multer({ storage: storage });

const DB = new sqlite3.Database("./db.db");

app.post("/data", (req, res) => {
  const { name, phone } = req.body;

  const insertQuery = "INSERT INTO users (name, phone) VALUES (?, ?);";
  DB.run(insertQuery, [name, phone], (err) => {
    if (err) {
      res.status(500).send("DB ERROR");
    } else {
      res.status(200).send("ALL IS OKAY IN DB");
    }
  });
});

app.post("/upload", upload.single("image"), (req, res) => {
  const { title, description, price } = req.body;
  const image = req.file.originalname;

  const insertQuery = "INSERT INTO menu (title, description, price, image) VALUES (?, ?, ?, ?);";
  DB.run(insertQuery, [title, description, price, image], (err) => {
    if (err) {
      console.log(req.body);
      console.log(req.file);
      res.status(500).send("DB ERROR");
    } else {
      res.status(200).send("All is okay");
    }
  });
});

app.get("/users", (req, res) => {
  const selectQuery = "SELECT * FROM users";
  DB.all(selectQuery, (err, rows) => {
    if (err) {
      res.status(500).send("ERROR IN GET USERS");
    } else {
      res.status(200).send(rows);
    }
  });
});

app.get("/menu", (req, res) => {
  const selectQuery = "SELECT * FROM menu";
  DB.all(selectQuery, (err, rows) => {
    if (err) {
      res.status(500).send("ERROR IN GET USERS");
    } else {
      res.status(200).send(rows);
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});