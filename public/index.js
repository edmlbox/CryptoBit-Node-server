var express = require("express");
var app = express();
var bitcoin = require("bitcoinjs-lib");
var bigi = require("bigi");
var buffer = require("buffer");
var randomize = require("randomatic");

const fetch = require("node-fetch");
var bodyParser = require("body-parser");
var nodemailerImport = require("./nodemail.js");
const MongoClient = require("mongodb").MongoClient;
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

app.get("/testConnection", (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.send("Server is Running");
});

//This section rsponsible for sending emails from geth go ethereum
//Nodemailer
let testImport = nodemailerImport.one;
app.use(express.json());

app.get("/mail", (req, res) => {
  res.send("nodeMail");
});
app.post("/sendMail", function(request, response) {
  response.setHeader("Access-Control-Allow-Origin", "*");
  let body = [];
  request
    .on("data", chunk => {
      body.push(chunk);
    })
    .on("end", () => {
      body = Buffer.concat(body).toString();
      var bodyObj = JSON.parse(body);

      SendMailBody(bodyObj);
      response.send(bodyObj);
    });

  function SendMailBody(bodyObj) {
    let img_different_width = bodyObj.img.replace("500x500", "300x300");
    let svgImage =
      '<img src="data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIj8+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBoZWlnaHQ9IjUxMnB4IiB2ZXJzaW9uPSIxLjEiIHZpZXdCb3g9Ii04OCAwIDUxMiA1MTIiIHdpZHRoPSI1MTJweCI+CjxnIGlkPSJzdXJmYWNlMSI+CjxwYXRoIGQ9Ik0gMzM2LjU1ODU5NCAyODguOTgwNDY5IEwgMTY4LjI4MTI1IDM1MS4zMDg1OTQgTCAwIDI4OC45ODA0NjkgTCAxNjguMjgxMjUgMCBaIE0gMzM2LjU1ODU5NCAyODguOTgwNDY5ICIgc3R5bGU9IiBzdHJva2U6bm9uZTtmaWxsLXJ1bGU6bm9uemVybztmaWxsOnJnYigxMDAlLDI5LjQxMTc2NSUsMCUpO2ZpbGwtb3BhY2l0eToxOyIvPgo8cGF0aCBkPSJNIDMyOS4yMTA5MzggMzIzLjY5OTIxOSBMIDE2OC4yODEyNSA1MTIgTCA3LjM1MTU2MiAzMjMuNjk5MjE5IEwgMTY4LjI4MTI1IDM4My4zMDA3ODEgWiBNIDMyOS4yMTA5MzggMzIzLjY5OTIxOSAiIHN0eWxlPSIgc3Ryb2tlOm5vbmU7ZmlsbC1ydWxlOm5vbnplcm87ZmlsbDpyZ2IoMTAwJSwyOS40MTE3NjUlLDAlKTtmaWxsLW9wYWNpdHk6MTsiLz4KPHBhdGggZD0iTSAxNjguMjgxMjUgMzgzLjMwMDc4MSBMIDMyOS4yMTA5MzggMzIzLjY5OTIxOSBMIDE2OC4yODEyNSA1MTIgWiBNIDE2OC4yODEyNSAzODMuMzAwNzgxICIgc3R5bGU9IiBzdHJva2U6bm9uZTtmaWxsLXJ1bGU6bm9uemVybztmaWxsOnJnYig3Ny42NDcwNTklLDEyLjk0MTE3NiUsMCUpO2ZpbGwtb3BhY2l0eToxOyIvPgo8cGF0aCBkPSJNIDMzNi41NTg1OTQgMjg4Ljk4MDQ2OSBMIDE2OC4yODEyNSAzNTEuMzA4NTk0IEwgMTY4LjI4MTI1IDAgWiBNIDMzNi41NTg1OTQgMjg4Ljk4MDQ2OSAiIHN0eWxlPSIgc3Ryb2tlOm5vbmU7ZmlsbC1ydWxlOm5vbnplcm87ZmlsbDpyZ2IoNzcuNjQ3MDU5JSwxMi45NDExNzYlLDAlKTtmaWxsLW9wYWNpdHk6MTsiLz4KPC9nPgo8L3N2Zz4K" />';
    const msg = {
      to: bodyObj.email,
      from: "Ethereum@ethereum.org",
      subject: "Request for payment",
      html:
        '<div style="display: inline-block; text-align:center;padding:1rem;border:5px solid gray;"><div style="display:flex;justify-content: space-between;"><span style="font-size: 2em;border-bottom: 2px solid #e91e6385;display: inline-table;">' +
        bodyObj.value1 +
        (bodyObj.value1 ? "<span style='margin-left:.5em'>USD </span>" : "") +
        '</span><span style="font-size: 2em;border-bottom: 2px solid #e91e6385;margin-left: auto;display: inline-table;">' +
        bodyObj.value2 +
        (bodyObj.value2 ? "<span style='margin-left:.5em'>ETH</span>" : "") +
        '</span></div><div style="text-align:center;margin-top: 1em;font-weight: bold;text-transform: uppercase;font-size: .87em;' +
        'letter-spacing: .011em;font-size:1.2em; color: #3F51B5;">Ethereum address to send founds:</div><div style="background-color: #fff6aa;font-size:1.4em;padding: .5em;display: block;letter-spacing: 0.5px;border-radius: 5px;text-align: center;">' +
        bodyObj.eth +
        "</div><img src=" +
        img_different_width +
        '><div ><span style="font-size:13px; margin-top: -30px;">This QR code can be scanned to get the address</span></div></div>'
    };
    testImport(msg.from, bodyObj.email, msg.subject, msg.html);
  }
});
//Nodemailer end



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

const PORT = process.env.PORT || 8081;
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

app.get("/:bitcoinAddress", (req, res) => {
  var bitcoinAddressToCheck = req.params.bitcoinAddress;
  res.setHeader("Access-Control-Allow-Origin", "*");
  console.log(bitcoinAddressToCheck);

  fetch("https://blockchain.info/rawaddr/" + bitcoinAddressToCheck)
    .then(res => res.text())
    .then(bbbb => res.send(bbbb));
});


//GethDesk Route

app.use('/gethdesk', express.static(__dirname + '/public'));