const MongoClient = require("mongodb").MongoClient;
const url = process.env.URL;
let all;
MongoClient.connect(url, { useNewUrlParser: true}, function(err, db) {
        if (err) throw err;
        let dbo = db.db("chemical-db");
        const mysort = {mass: 1};
        dbo.collection("chemical-list").find({}).sort(mysort).toArray(function (err, result) {
            if (err) throw err;
            all = result;
            db.close();
        });
    });
const express = require("express");
const app = express();
const fs = require("fs");
app.get("/search", function (req, res) {
    const search_value = req.query.name;
    let output = "";
    for (let i = 0; i < all.length; i++) {
        if ((all[i].name.toLowerCase().indexOf(search_value.toLowerCase()) > -1) 
        || (all[i].sign.toLowerCase().indexOf(search_value.toLowerCase()) > -1)
        || (all[i].mass.toString().toLowerCase().startsWith(search_value.toLowerCase())))
        {
            output += `<div style="
                width: 200px;
                height: 125px; 
                display: inline-block;
                border: 2px solid red;
                background: lightyellow;
                margin: 10px;
                padding: 0 0 0 15px;
            }"><p>Nguyên tố : ${all[i].name}</p><p>Kí hiệu hóa học : ${all[i].sign}</p><p>Nguyên tử khối : ${all[i].mass} đvC</p></div>`;
        }
    }
    res.send(output);
});

app.get("/", function (req, res) {
    fs.readFile("./mainfile.html", function (err, data) {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        res.end();
    });
});
app.listen(process.env.PORT || 8080, function() {
    console.log("Listening at " +  8080 );
});
