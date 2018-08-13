var express = require('express');
var app = express();
var bitcoin = require("bitcoinjs-lib");
var bigi = require("bigi");
var buffer = require('buffer');
var randomize = require('randomatic');
var QRCode = require('qrcode');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;







var abcd = '';


app.get('/randomNumber', (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.send(sendRand());
})
app.post('/coinmarket/icons/:icoIdArr',(req,res)=>{
    res.header("Access-Control-Allow-Origin", "*");
   
    var extract_array = JSON.parse(req.params.icoIdArr)
    var getArray = extract_array.ids_array;

    
    
    res.send((function(){
        var obk = {};
 
 var ccc = new XMLHttpRequest();
 ccc.onreadystatechange = function(){if(this.readyState == 4){
     var rr = this.responseText;
     obk = rr;
    
 }}
 var iconsIdnumbers = getArray;
 ccc.open('GET','https://pro-api.coinmarketcap.com/v1/cryptocurrency/info?id='+iconsIdnumbers,false);
 ccc.setRequestHeader('X-CMC_PRO_API_KEY', '36edf5e6-af79-4d70-8469-ae008eb34cf2');
 ccc.responseType = 'json';
 ccc.setRequestHeader('Accept', 'application/json');
 ccc.send();
 
         return obk;
     })())
})












app.get('/coinmarket/',(req,res)=>{
    res.header("Access-Control-Allow-Origin", "*");

    res.send((function(){
       var obk = {};

var ccc = new XMLHttpRequest();
ccc.onreadystatechange = function(){if(this.readyState == 4){
    var rr = this.responseText;
    obk = rr;
   
}}
ccc.open('GET','https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?start=1&limit=100&convert=USD',false);
ccc.setRequestHeader('X-CMC_PRO_API_KEY', '36edf5e6-af79-4d70-8469-ae008eb34cf2');
ccc.responseType = 'json';
ccc.setRequestHeader('Accept', 'application/json');
ccc.send();

        return obk;
    })())
})

app.post('/blockchain/:bitcoinAddress', (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");

    var adr = req.params.bitcoinAddress
    getInfofromBlock(adr)
   
  
    res.send(abcd);






})


app.post('/', (req, res) => {

    

    res.header("Access-Control-Allow-Origin", "*");
    var body = '';


    req.on('data', function (data) {
        body += data;
        var parsebody = JSON.parse(body);

        var pri_key = [parsebody.key];//
        //
        var keys = new bitcoin.ECPair(bigi.fromHex(pri_key[0]));
        delete parsebody.key;
        console.log(parsebody)

        parsebody.pubkeys = [];
        parsebody.signatures = parsebody.tosign.map(function (tosign, n) {
            parsebody.pubkeys.push(keys.getPublicKeyBuffer().toString("hex"));
            return keys.sign(new buffer.Buffer(tosign, "hex")).toDER().toString("hex");
        });
        res.send(JSON.stringify(parsebody));

    })


})

app.listen(3000, () => {
    console.log(3000)
})




//return random for wallet names
function sendRand() {
    var rand = randomize('Aa0', 20);
    return rand;



}

//Get blockchaininfo
function getInfofromBlock(address){
    var con = new XMLHttpRequest();
    con.onreadystatechange = function () {
        if (this.readyState == 4) {
            abcd = this.responseText;
            
           
           
        }
    }
    con.open('GET', 'https://blockchain.info/rawaddr/'+address,false);
    con.send();



}


