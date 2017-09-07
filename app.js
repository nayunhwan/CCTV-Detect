var video = document.getElementById('video');
var canvas = document.getElementById('motion');
var score = document.getElementById('score');
var captured = document.getElementById('captured');
var _canvas;

var isLoading = false;

function initSuccess() {
	DiffCamEngine.start();
}

function initError() {
	alert('Something went wrong.');
}

function capture(payload) {
	score.textContent = payload.score;
  if (!isLoading && payload.hasMotion) {
    isLoading = true;
    analyzeImage();
    console.log('test');
  }
}

DiffCamEngine.init({
	video: video,
	motionCanvas: canvas,
	initSuccessCallback: initSuccess,
	initErrorCallback: initError,
	captureCallback: capture
});

function dataURLtoBlob(dataurl) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {type: 'application/octet-stream'});
}

function getBlob() {
  _canvas = document.createElement("canvas");
  var context = _canvas.getContext('2d')
  context.drawImage(video, 0, 0, _canvas.width, _canvas.height);
  var dataURL = _canvas.toDataURL('image/jpeg', 1.0);
  return dataURLtoBlob(dataURL);
}

function analyzeImage() {
  console.log('analyze');
  var blob = getBlob();
  var url = 'https://api.projectoxford.ai/vision/v1.0/analyze?visualFeatures=Description,Faces&language=en';
  var apiKey = 'c8a88151c9c84934aef42a17c161eb5f';
  $.ajax({
    url: url,
    type: 'POST',
    beforeSend: function(xhrObj){
        xhrObj.setRequestHeader("Content-Type", "application/octet-stream");
        xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", apiKey);
    },
    data: blob,
    processData: false,
    error: function(data) {
      console.log(data);
    },
    success: function(data) {
      isLoading = false;
      console.log(data);
    }
  });
}

$(function() {
  $('button').click(function(){
    analyzeImage()
  });
});
