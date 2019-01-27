window.onload = function() {
  var c3 = document.createElement('canvas');
  c3.width = '400';
  c3.height = '400';
  function filter({r, g, b, x, y, i}) {
    if (0 == x % 100 || 0 == y % 100) {
      return {r: 0, g: 255, b: 0};
    }

    return {r, g, b};
  }
  const constraints = {video: true};

  const video = document.querySelector('video');

  navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
    video.srcObject = stream;
  });
  PieVideo.doLoad();
};
function dropHandler(ev) {
  console.log('File(s) dropped');

  // Prevent default behavior (Prevent file from being opened)
  ev.preventDefault();

  if (ev.dataTransfer.items) {
    // Use DataTransferItemList interface to access the file(s)
    for (let i = 0; i < ev.dataTransfer.items.length; i++) {
      // If dropped items aren't files, reject them
      if (ev.dataTransfer.items[i].kind === 'file') {
        var file = ev.dataTransfer.items[i].getAsFile();
        behave(file);
      }
    }
  } else {
    // Use DataTransfer interface to access the file(s)
    for (let i = 0; i < ev.dataTransfer.files.length; i++) {
      behave(ev.dataTransfer.files[i]);
    }
  }
}
function dragOverHandler(ev) {
  console.log('File(s) in drop zone');

  // Prevent default behavior (Prevent file from being opened)
  ev.preventDefault();
}

function behave(file) {
  if (file.name.endsWith('.png')) {
    $('#del').fadeTo(200, 0.7);
    setTimeout(PieVideo.computeFrame.bind(PieVideo, false, file), 230);
  } else if (file.name.endsWith('.ies')) {
    var fr = new FileReader();
    fr.onloadend = () => {
      var dp = new DOMParser();
      var dom = dp.parseFromString(fr.result, 'text/xml');
      Graph.workspace.clear();
      Blockly.Xml.domToWorkspace(dom.firstChild, Graph.workspace);
    };
    fr.readAsText(file);
  }
}