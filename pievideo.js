/* eslint-disable no-debugger */
let PieVideo = {
  timerCallback: function() {
    if (this.video.paused || this.video.ended) {
      return;
    }
    this.computeFrame();
    let self = this;
  },

  doLoad: function(ctx2) {
    this.video = document.getElementById('video');
    this.c1 = document.getElementById('c1');
    this.ctx1 = this.c1.getContext('2d');
    this.ctx2 = ctx2;
    this.filters = [];
    this.topLimit = 20;
    this.worq = [];
    this.wid = 1;
  },
  computeFrame: function(dv = true, alurl = '') {
    $('.wait').fadeIn(0);
    if (dv) this.ctx1.drawImage(this.video, 0, 0, 600, 400);
    if (!dv) {
      sendXHR({base: alurl, code});
    } else {
      this.c1.toBlob(function(blob) {
        sendXHR({base: blob, code});
      },'image/png')
    }
  }
};
function dPX(px, i, w) {
  var ii = i / 6;
  var x = ii % w;
  var y = Math.floor(ii / w);
  return '#' + px.substr(i, 6);
}
function getXY(i, w, h, tw, th) {
  w = parseFloat(w)
  h = parseFloat(h)
  tw = parseFloat(tw)
  th = parseFloat(th)
  i /= 6
  var x = i % w;
  var y = Math.floor(i / w);
  var wh = {w: tw / w, h: th / h};
  wh.x = wh.w * x;
  wh.y = wh.h * y;
  return wh;
}
function b64toBlob(b64Data, contentType, sliceSize) {
  contentType = contentType || '';
  sliceSize = sliceSize || 512;

  var byteCharacters = atob(b64Data);
  var byteArrays = [];

  for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    var slice = byteCharacters.slice(offset, offset + sliceSize);

    var byteNumbers = new Array(slice.length);
    for (var i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    var byteArray = new Uint8Array(byteNumbers);

    byteArrays.push(byteArray);
  }

  var blob = new Blob(byteArrays, {type: contentType});
  return blob;
}
function go(__code__, {r, g, b, x, y}) {
  eval(__code__);
  return {r, g, b};
}
function sendXHR(data) {
  function onProgress(e) {
    var percentComplete = e.position / e.tsotalSize * 100;
    console.log('%s%%', percentComplete);
  }

  var fd = new FormData()
  for (var k in data) {
    fd.append(k, data[k]);
  }
  var xhr = new XMLHttpRequest();
  xhr.onprogress = onProgress;
  xhr.open('POST', '/api/parse', true);
  xhr.responseType = 'blob';
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
      if (xhr.status == 200) {
        var url = URL.createObjectURL(xhr.response);
        Swal.fire({
              imageUrl: url,
              imageHeight: 400,
              imageAlt: 'A tall image',
              title: 'Your image has been generated',
              type: 'success',
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#3085d6',
              confirmButtonText: 'Save it!',
              cancelButtonText: 'OK!',
              showCancelButton: true
            }).
            then(saveornot => {
              if (saveornot.value == true) {
                saveAs(xhr.response, 'your-masterpiece.png');
              }
            })

        $('#c2').fadeTo(0, 1);
        $('.wait').fadeOut(0);
      } else alert('Error parsing image\n');
    }
  };
  xhr.send(fd);
  if (xhr.status === 200) {
    return xhr.response;
  }
  return null;
}
function readURL(input) {
  if (input.files && input.files[0]) {
    $('#del').fadeTo(200, 0.7);
    setTimeout(
        PieVideo.computeFrame.bind(PieVideo, false, input.files[0]), 230);
  }
}
function doUpload() {
  var fi = document.createElement('input');
  fi.type = 'file';
  fi.accept = 'image/png';
  fi.click();
  fi.onchange = () => {
    readURL(fi);
  }
}