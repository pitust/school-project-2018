/* eslint-disable no-new-func */
var http = require('http');
var fs = require('fs');
const {VM,VMScript} = require('vm2');
const vm = require('vm');
var PNG = require('pngjs').PNG;
var formidable = require('formidable');
function blah(req, res) {
  fs.readFile('.' + req.url, function(err, data) {
    if (err) {
      fs.readFile('.' + req.url + '/index.html', function(err, data) {
        if (err) {
          res.writeHead(404, {'Content-Type': 'text/html'});
          res.write(`the file was not found.`);
          res.end();
          return;
        }
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        res.end();
      });
      return;
    }
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(data);
    res.end();
  });
}
function atob(str) {
  return Buffer.from(str, 'base64').toString('ascii');
}
function atobuf(str) {
  return Buffer.from(str, 'base64');
}
const util = require('util');
const multiparty = require('multiparty');
var read = require('read-all-stream');
http.createServer(function(req, res) {
      console.log(req.url);
      if (req.url != '/api/parse') blah(req, res);
      else {
        var form = new multiparty.Form();
        var fp, fe = false, code = '', ce = false;
        form.on('part', function(part) {
          console.log('PART ce=%s fe=%s name=%s', ce, fe, part.name);
          if (part.name == 'base') {
            var path = './tmp/' + Math.random().toString();
            fp = fs.createWriteStream(path);
            part.pipe(fp);
            fp = fs.createReadStream(path);
            part.resume();
            fe = true;
          } else if (part.name == 'code') {
            read(part).then(function (data) {
              console.log(data);
              code = data;
              part.resume();
              ce = true;
              if (ce && fe) {
                smart(fp, code, res);
              }
            });
          }
          if (ce && fe) {
            smart(fp, code, res);
          }
        })
        form.parse(req);
        /*form.parse(req, function (err, fields, files) {
            console.log(files)
    */
      }
    }).listen(8080);
function smart(part_img, code_,res) {
  console.log('SMART');
  part_img.pipe(new PNG()).on('parsed', function() {
    console.log('START');
    console.log(code_ + ';return {r,g,b};')
    let code = new Function('r','g','b','x','y',code_+';return {r,g,b};');
    const accel = 1;
    var t = new Date();
    for (let i = 0; i < this.width; i+=accel) {
      for (let j = 0; j < this.height; j+=accel) {
        var n = i + j * this.width;
        let sr = this.data[n * 4 + 0];
        let sg = this.data[n * 4 + 1];
        let sb = this.data[n * 4 + 2];
        var {r, g, b} = code(sr, sg, sb, i, j);
        this.data[n * 4 + 0] = r;
        this.data[n * 4 + 1] = g;
        this.data[n * 4 + 2] = b;
      }
      console.log(
        'PIXEL: %s/%s (%s%%)', i+1,this.width,
        Math.floor(i / (this.width / 100)))
    }
    res.writeHead(200, 'OK', {'Content-Type': 'image/png'});
    var buffer = PNG.sync.write(this, {colorType:2});
    res.end(buffer);
    console.log("END");
  });
}
function outb(byte,res) {
    var b1 = byte.toString(16);
    var b2v = b1.length==1?'0':'' + b1;
    res.write(b2v);
}
function go(code, dat) {
  code.runInNewContext(dat);
  return dat;
}