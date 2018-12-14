var express = require("express");
var app = express();
var bitcoin = require("bitcoinjs-lib");
var bigi = require("bigi");
var buffer = require("buffer");
var randomize = require("randomatic");
require("@google-cloud/debug-agent").start();
const fetch = require("node-fetch");
var bodyParser = require("body-parser");
const Datastore = require("@google-cloud/datastore");
const crypto = require("crypto");
const MongoClient = require("mongodb").MongoClient;
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
const datastore = Datastore();

function insertVisit(visit) {
  return datastore.save({
    key: datastore.key("boss"),
    data: visit
  });
}

function getVisits() {
  const query = datastore
    .createQuery("boss")
    .order("timestamp", { descending: true })
    .limit(100);

  return datastore.runQuery(query).then(results => {
    const entities = results[0];
    return entities.map(
      entity => `Time: ${entity.timestamp}, AddrHash: ${entity.userIp}`
    );
  });
}

app.get("/testConnection", (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.send("Server is Running");
});

app.post("/evil/:userOBJ", (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  const visit = {
    timestamp: new Date(),
    userIp: req.params.userOBJ
  };

  insertVisit(visit)
    .then(() => getVisits())
    .then(visits => {
      res
        .status(200)
        .set("Content-Type", "text/plain")
        .send("ok")
        .end();
    })
    .catch(next);
});

var abcd = "";

app.get("/randomNumber", (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.send(sendRand());
});

app.post("/coinmarket/icons/:icoIdArr", (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");

  var extract_array = JSON.parse(req.params.icoIdArr);
  var getArray = extract_array.ids_array;

  fetch(
    "https://pro-api.coinmarketcap.com/v1/cryptocurrency/info?id=" + getArray,
    {
      method: "GET",
      headers: {
        "X-CMC_PRO_API_KEY": "36edf5e6-af79-4d70-8469-ae008eb34cf2"
      }
    }
  )
    .then(res => res.json())
    .then(json => res.send(json));
});

app.post("/backup", (req, res) => {
  let body = [];
  req
    .on("data", chunk => {
      body.push(chunk);
    })
    .on("end", () => {
      body = Buffer.concat(body).toString();
      var bodyObj = JSON.parse(body);
      console.log(bodyObj);
      res.download("text");
    });

  res.header("Access-Control-Allow-Origin", "*");
});

app.post("/pincode", (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  let body = [];
  req
    .on("data", chunk => {
      body.push(chunk);
    })
    .on("end", () => {
      body = Buffer.concat(body).toString();
      var bodyObj = JSON.parse(body);
      console.log(bodyObj);
      const url =
        "mongodb://mariah:159753zaq@ds115553.mlab.com:15553/cryptobit";
      MongoClient.connect(
        url,
        (err, client) => {
          client
            .db("cryptobit")
            .collection("col999")
            .findOneAndUpdate(
              { email: bodyObj.email },
              { $set: { lockPassword: bodyObj.pincode } },
              (err, result) => {
                if (result.lastErrorObject.n == 1) {
                  res.send(result);
                }
              }
            );
        }
      );
    });
});

app.get("/coinmarket", (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  fetch(
    "https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?start=1&limit=100&convert=USD",
    {
      method: "GET",
      headers: {
        "X-CMC_PRO_API_KEY": "36edf5e6-af79-4d70-8469-ae008eb34cf2"
      }
    }
  )
    .then(res => res.json())
    .then(json => res.send(json));
});

//Login and Register
app.post("/register", (req, res) => {
  let body = [];
  req
    .on("data", chunk => {
      body.push(chunk);
    })
    .on("end", () => {
      body = Buffer.concat(body).toString();
      var bodyObj = JSON.parse(body);
      console.log(bodyObj);
      registerInDatabase(bodyObj, res);
    });

  res.header("Access-Control-Allow-Origin", "*");
});
app.post("/update", (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");

  let body = [];
  req
    .on("data", chunk => {
      body.push(chunk);
    })
    .on("end", () => {
      body = Buffer.concat(body).toString();
      var bodyObj = JSON.parse(body);
      console.log(bodyObj);

      const url =
        "mongodb://mariah:159753zaq@ds115553.mlab.com:15553/cryptobit";
      MongoClient.connect(
        url,
        (err, client) => {
          client
            .db("cryptobit")
            .collection("col999")
            .updateOne(
              { email: bodyObj.email, password: bodyObj.password },
              { $set: { "storage.addr": bodyObj.addr } }
            );
        }
      );

      res.send(bodyObj);
    });
});
app.post("/login", (req, res) => {
  let body = [];
  req
    .on("data", chunk => {
      body.push(chunk);
    })
    .on("end", () => {
      body = Buffer.concat(body).toString();
      var bodyObj = JSON.parse(body);
      console.log(bodyObj);

      findInData(bodyObj, req, res);
    });

  res.header("Access-Control-Allow-Origin", "*");
});

function findInData(bodyObj, req, res) {
  const url = "mongodb://mariah:159753zaq@ds115553.mlab.com:15553/cryptobit";
  MongoClient.connect(
    url,
    (err, client) => {
      client
        .db("cryptobit")
        .collection("col999")
        .findOne(
          {
            email: bodyObj.email
          },
          (err, result) => {
            console.log(result);

            if (!result) {
              return;
            }
            if (result) {
              if (result.email === bodyObj.email) {
                if (result.password === bodyObj.password) {
                  res.send({
                    findResult: result
                  });
                  return;
                } else {
                  return;
                }
              }
            }
          }
        );
    }
  );
}

app.post("/blockchain/:bitcoinAddress", (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");

  var adr = req.params.bitcoinAddress;

  fetch("https://blockchain.info/rawaddr/" + adr)
    .then(res => res.json())
    .then(json => res.send(json));
});

app.post("/", (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  var body = "";

  req.on("data", function(data) {
    body += data;
    var parsebody = JSON.parse(body);

    var pri_key = [parsebody.key]; //
    //
    var keys = new bitcoin.ECPair(bigi.fromHex(pri_key[0]));
    delete parsebody.key;
    console.log(parsebody);

    parsebody.pubkeys = [];
    parsebody.signatures = parsebody.tosign.map(function(tosign, n) {
      parsebody.pubkeys.push(keys.getPublicKeyBuffer().toString("hex"));
      return keys
        .sign(new buffer.Buffer(tosign, "hex"))
        .toDER()
        .toString("hex");
    });
    res.send(JSON.stringify(parsebody));
  });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log("Press Ctrl+C to quit.");
});

//return random for wallet names
function sendRand() {
  var rand = randomize("Aa0", 20);
  return rand;
}

function registerInDatabase(dataxxx, res) {
  const url = "mongodb://mariah:159753zaq@ds115553.mlab.com:15553/cryptobit";
  MongoClient.connect(
    url,
    (err, client) => {
      console.log("isConnected" + client.isConnected());

      client
        .db("cryptobit")
        .collection("col999")
        .findOne(
          {
            email: dataxxx.email
          },
          (error, response) => {
            if (response) {
              res.send({
                status: "exist"
              });
            } else {
              client
                .db("cryptobit")
                .collection("col999")
                .insertOne({
                  email: dataxxx.email,
                  password: dataxxx.password,
                  storage: dataxxx.storage
                });

              res.send({
                dataxxx
              });
            }
          }
        );
    }
  );
}
