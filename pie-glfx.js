window.onload = function() {
    // try to create a WebGL canvas (will fail if WebGL isn't supported)


    //image.parentNode.removeChild(image);
    window.ctx2 = document.getElementById('c2').getContext('2d');
    // Note: instead of swapping the <canvas> tag with the <img> tag
    // as done above, we could have just transferred the contents of
    // the image directly:
    //
    //     image.src = canvas.toDataURL('image/png');
    //
    // This has two disadvantages. First, it is much slower, so it
    // would be a bad idea to do this repeatedly. If you are going
    // to be repeatedly updating a filter it's much better to use
    // the <canvas> tag directly. Second, this requires that the
    // image is hosted on the same domain as the script because
    // JavaScript has direct access to the image contents. When the
    // two tags were swapped using the previous method, JavaScript
    // actually doesn't have access to the image contents and this
    // does not violate the same origin policy.
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
PieVideo.doLoad(ctx2);

// Add filters
};