var http = require('http');
var fs = require('fs');
const {VM} = require('vm2');
 var PNG = require('pngjs').PNG;


function parseUrlEncoded(ue) {
    if (!ue)return {};
    var keys = ue.split('&');var kvpairs = {};for(var ke of keys){if(ke==='')continue;var [k,v] = ke.split('=');kvpairs[k]=decodeURI(v).replace(/\+/g,' ');}
    return kvpairs;
  }
 function blah(req,res) {
    fs.readFile('.' + req.url, function(err, data) {
        if (err){
            fs.readFile('.' + req.url + '/index.html', function(err, data) {
                if (err) {
                    res.writeHead(404, {'Content-Type': 'text/html'});
                    res.write(`the file was not found.`);
                    res.end()
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
 
http.createServer(function (req, res) {
  if (req.url != "/api/parse") blah(req,res);
  else {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString(); // convert Buffer to string
    });
    req.on('end', () => {
        var {base,code} = parseUrlEncoded(body);code=atob(code);
        base=base.replace('data:image/png;base64,', '').replace(/ /g,'+');
        var data=atob(base);
        var frame = PNG.sync.read(data);
        for (let i = 0; i < frame.data.length; i++) {
            let sr = frame.data[i * 4 + 0];
            let sg = frame.data[i * 4 + 1];
            let sb = frame.data[i * 4 + 2];
            var x = i % 600;
            var y = Math.floor(i / 600);
            var {
              r,
              g,
              b
            } = go(code, {
              r: sr,
              g: sg,
              b: sb,
              x,
              y,
              i
            });
      
            sr = r;
            sg = g;
            sb = b;
      
            frame.data[i * 4 + 0] = sr;
            frame.data[i * 4 + 1] = sg;
            frame.data[i * 4 + 2] = sb;
          }
          res.writeHead(200,'OK',{'Content-Type':'text/plain'});
          res.end(PNG.sync.write(png, {colorType:4}).toString('base64'));
    });
  }
}).listen(8080);
function go(code,data) {
    const vm = new VM({
        timeout: 1000,
        sandbox: data
    });
    vm.run(code);
    var {r,g,b} = vm.run('{r,g,b}');
    return {r,g,b};
}