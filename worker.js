var i = 1;
onmessage=({data})=>{
    var id = i++;
    console.log('start #%d',id);
    var odata = data.cd;
    for (let i = 0; i < data.l; i++) {
    let sr = data.d[i * 4 + 0];
    let sg = data.d[i * 4 + 1];
    let sb = data.d[i * 4 + 2];
    var x = i % 600;
    var y = Math.floor(i / 600);
      var {r,g,b} = go(data.code,{r:sr,g:sg,b:sb,x,y,i});
      
      sr = r;
      sg = g;
      sb = b;
    
    odata[i * 4 + 0] = sr;
    odata[i * 4 + 1] = sg;
    odata[i * 4 + 2] = sb;
    fetch('/log/' + i.toString());
  }
  
  postMessage(odata);
}
function go(__code__,{r,g,b,x,y}) {
    eval(__code__);
    return {r,g,b};
}