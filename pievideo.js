let PieVideo = {
  timerCallback: function () {
    if (this.video.paused || this.video.ended) {
      return;
    }
    this.computeFrame();
    let self = this;
  },

  doLoad: function (ctx2) {
    this.video = document.getElementById("video");
    this.c1 = document.getElementById("c1");
    this.ctx1 = this.c1.getContext("2d");
    this.ctx2 = ctx2;
    let self = this;
    this.filters = [];
    this.topLimit = 20;
    this.worq = [];
    this.wid = 1;

  },
  computeFrame: function () {
    var t = new Date;
    let worker;
    let cid = this.wid++;
    $('#c2').fadeTo(200, 0.7);
    $('.wait').fadeIn(0);
    this.ctx1.drawImage(this.video, 0, 0, 600, 400);
    let frame = this.ctx1.getImageData(0, 0, 600, 400);
    let l = frame.data.length / 4;
    for (let i = 0; i < frame.data.l; i++) {
      let sr = data.d[i * 4 + 0];
      let sg = data.d[i * 4 + 1];
      let sb = data.d[i * 4 + 2];
      var x = i % 600;
      var y = Math.floor(i / 600);
      var {
        r,
        g,
        b
      } = go(data.code, {
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
    this.ctx2.putImageData(frame, 0, 0);

    $('#c2').fadeTo(0, 1);
    $('.wait').fadeOut(0);
    worker.termiante();
  }
};

function go(__code__,{r,g,b,x,y}) {
  eval(__code__);
  return {r,g,b};
}