window.onload = function() {
var c3 = document.createElement('canvas');
c3.width="400";
c3.height="400";
function filter({r,g,b,x,y,i}) {
    if (0 == x % 100 ||0 == y % 100) {
        
        return {r:0,g:255,b:0};
    }
    
    return {r,g,b}; 
}
const constraints = {
    video: true
  };
  
  const video = document.querySelector('video');
  
  navigator.mediaDevices.getUserMedia(constraints).
    then((stream) => {video.srcObject = stream;});
PieVideo.doLoad();

};