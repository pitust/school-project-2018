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
  computeFrame: function(dv=true) {
    $('.wait').fadeIn(0);
    if(dv)this.ctx1.drawImage(this.video, 0, 0, 600, 400);
    sendXHR({base:this.c1.toDataURL('image/png'),code})
    this.ctx2.putImageData(frame, 0, 0);

    $('#c2').fadeTo(0, 1);
    $('.wait').fadeOut(0);
  }
};

function go(__code__, {r, g, b, x, y}) {
  eval(__code__);
  return {r, g, b};
}
function sendXHR(data) {
  function onProgress(e) {
    var percentComplete = e.position / e.totalSize * 100;
    console.log('%s%%', percentComplete);
  }

  function onError(e) {
    alert('Error while loading:' + e.target.status + '.');
  }
  function urlencodeFormData(dt) {
    var s = '';
    function encode(s) {
      return encodeURIComponent(s).replace(/%20/g, '+');
    }
    for (var k in dt) {
      var pair = [k,dt[k]];
      if (typeof pair[1] == 'string') {
        s += (s ? '&' : '') + encode(pair[0]) + '=' + encode(pair[1]);
      }
    }
    return s;
  }

  var xhr = new XMLHttpRequest();
  xhr.onprogress = onProgress;
  xhr.open('GET', '/api/parse', false);
  xhr.onerror = onError;

  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
  xhr.send(urlencodeFormData(data));
  if (xhr.status === 200) {
    return xhr.responseText;
  }
  return null;
}
function readURL(input) {
  if (input.files && input.files[0]) {
      var reader = new FileReader();

      reader.onload = function (e) {
        var ie = document.createElement('img');
        ie.src=reader.result;
          PieVideo.ctx1.drawImage(ie,0,0,600,400);
          $('#c2').fadeTo(200, 0.7);
          setTimeout(PieVideo.computeFrame.bind(PieVideo,false),230);
      }

      reader.readAsDataURL(input.files[0]);
  }
}
function doUpload() {
  var fi = document.createElement('input');
  fi.type='file';
  fi.accept='image/*';
  fi.click();
  fi.onchange=() => {
    readURL(fi);
  }
}