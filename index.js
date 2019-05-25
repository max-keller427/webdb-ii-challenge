const knex = require("knex");
const express = require("express");
const helmet = require("helmet");
const server = express();

const knexConfig = {
  client: "sqlite3",
  connection: {
    filename: "./data/lambda.sqlite3"
  },
  useNullAsDefault: true
  // debug: true
};

const db = knex(knexConfig);

server.use(express.json());
server.use(helmet());

// endpoints here

server.get("/", (req, res) => {
  db("zoos")
    .then(roles => {
      res.status(200).json(roles);
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

server.get("/:id", (req, res) => {
  db("zoos")
    .where({ id: req.params.id })
    .first()
    .then(zoo => {
      if (zoo) {
        res.status(200).json(zoo);
      } else {
        res.status(404).json({ message: "zoo does not exist" });
      }
    })
    .catch(err => {
      res.status(500).json({ message: "error accessing zoo" });
    });
});

server.post("/", (req, res) => {
  db("zoos")
    .insert(req.body, "id")
    .then(zoo => {
      console.log(req.body);
      res.status(200).json(zoo);
    })
    .catch(err => {
      res.status(500).json({ message: "error posting zoo" });
    });
});

server.put("/:id", (req, res) => {
  db("zoos")
    .where({ id: req.params.id })
    .update(req.body)
    .then(count => {
      if (count > 0) {
        res.status(200).json({
          message: `${count} ${count > 1 ? "zoos" : "zoo"} updated yaaah`
        });
      } else {
        res.status(404).json({ message: "zoo does not exist" });
      }
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

server.delete("/:id", (req, res) => {
  db("zoos")
    .where({ id: req.params.id })
    .del()
    .then(count => {
      if (count > 0) {
        res.status(200).json({
          message: `${count} ${count > 1 ? "zoos" : "zoo"} deleted oohh yaaah`
        });
      } else {
        res.status(404).json({ message: "zoo does not exist" });
      }
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

const port = 3300;
server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});
