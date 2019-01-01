let PieVideo = {
    timerCallback: function() {
      if (this.video.paused || this.video.ended) {
        return;
      }
      this.computeFrame();
      let self = this;
    },
  
    doLoad: function(ctx2) {
      this.video = document.getElementById("video");
      this.c1 = document.getElementById("c1");
      this.ctx1 = this.c1.getContext("2d");
      this.ctx2=ctx2;
      let self = this;
      this.filters = [];
      this.topLimit=20;
      this.worq=[];
      this.wid=1;
        
    },
    computeFrame: function() {
      var t = new Date;
      let worker;
      let cid=this.wid++;
      $('#c2').fadeTo(200,0.7);
      $('.wait').fadeIn(0);
       worker = new Worker('worker.js');
      this.ctx1.drawImage(this.video, 0, 0, 600, 400);
      let frame = this.ctx1.getImageData(0, 0, 600, 400);
          let l = frame.data.length / 4;
      worker.onmessage = ({data})=> {
        var id = new ImageData(600, 400);
        this.worq.push(worker);this.topLimit++;
        id.data=data;
        this.ctx2.putImageData(id, 0, 0);
        
      $('#c2').fadeTo(0,1);
      $('.wait').fadeOut(0);
        worker.termiante();
      }
          worker.postMessage({l,d:frame.data,cd:frame.data,code,id:cid})

      return;
    }
  };
