/* eslint-disable no-new-func */
var http = require('http');
var fs = require('fs');
const {VM, VMScript} = require('vm2');
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
      if (req.url == '/examples'){examplesURL(req,res);return;}
      if (req.url.startsWith('/api/icon/')){apiIcon(req,res);return;}
      if (req.url.startsWith('/api/data/')){apiData(req,res);return;}

      if (req.url != '/api/parse') blah(req, res);
      else {
        var form = new multiparty.Form();
        var fp, fe = false, code = '', ce = false, vars = '', ve = true;
        form.on('part', function(part) {
          console.log('PART ce=%s fe=%s name=%s', ce, fe, part.name);
          if (part.name == 'base') {
            var path = './tmp/' + Math.random().toString() + '.png';
            fp = fs.createWriteStream(path);
            part.pipe(fp);
            part.on('end',() => {
              fp = fs.createReadStream(path);
              part.resume();
              fe = true;
              if (ce && fe && ve) {
                smart(fp, `${code}`, res);
              }
            })
          } else if (part.name == 'code') {
            read(part).then(function(data) {
              console.log(data);
              code = data;
              part.resume();
              ce = true;
              if (ce && fe && ve) {
                smart(fp, `${code};`, res);
              }
            });
          }
          if (ce && fe && ve) {
            smart(fp, `${code};`, res);
          }
        })
        form.parse(req);
        /*form.parse(req, function (err, fields, files) {
            console.log(files)
    */
      }
    }).
    listen(8080);
var examples = [
  {
    title:'Example 1. Monochrome',
    desc:'Simple monochrome',
    id:'eg1-monochrom'
  },
  {
    title:'Example 2. Colordepth upscaler',
    desc:'Assignment: Make reverse',
    id:'eg2-colordepth'
  }
]
function examplesURL(req, res) {
  fs.readFile('./examples.html', 'utf8',function(erry, dataeg) {
    if(erry)throw erry;
    fs.readFile('./example-data.html', 'utf8',function(err, datasrc) {
      if(err)throw err;
      var gen = gengen(datasrc);
      console.log(datasrc);
      var o = '';
      for (let {title,desc,id} of examples) {
        o += gen({TN:title,TD:desc,T:id});
      }
      res.writeHead(200, 'OK', {'Content-Type': 'text/html'});
      res.end(dataeg.replace('$TR',o));
    });
  });
}
function apiIcon(req, res) {
  var [,,,E3] = req.url.split('/');
  var f = fs.createReadStream('./' + E3 + '.png');
  res.writeHead(200, 'OK', {'Content-Type': 'image/png'});
  f.pipe(res);
}
function apiData(req, res) {
  var [,,,E3] = req.url.split('/');
  res.writeHead(200, 'OK', {'Content-Type': 'text/xml'});
  var f = fs.createReadStream('./' + E3 + '.xml');
  f.pipe(res);
}
function gengen(src) {
  return function(obj) {
    var o = src;
    for (var k in obj) {
      o = o.replace(new RegExp('\\$'+k,'g'),obj[k]);
    }
    return o;
  }
}
function smart(part_img, code_, res) {
  console.log('SMART');
  part_img.pipe(new PNG()).on('parsed', function() {
    console.log('START');
    let code =
        new Function('r', 'g', 'b', 'x', 'y', code_+'return {r,g,b};');
    const accel = 1;
    var t = new Date();
    for (let i = 0; i < this.width; i += accel) {
      for (let j = 0; j < this.height; j += accel) {
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
          'PIXEL: %s/%s (%s%%)', i + 1, this.width,
          Math.floor(i / (this.width / 100)))
    }
    res.writeHead(200, 'OK', {'Content-Type': 'image/png'});
    var buffer = PNG.sync.write(this, {colorType: 2});
    res.end(buffer);
    console.log('END');
  });
}
function outb(byte, res) {
  var b1 = byte.toString(16);
  var b2v = b1.length == 1 ? '0' : '' + b1;
  res.write(b2v);
}
function go(code, dat) {
  code.runInNewContext(dat);
  return dat;
}