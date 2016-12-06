var context;
var source = null;
var myAudioBuffer = null;

var sourceNode = null;
var mediaSourceNode = null;
var analyser = null;

var vis_view;
var vis_value;

var demo_buffer;

window.onload=function(){

  var control = document.getElementById("fileChooseInput");
  control.addEventListener("change", fileChanged, false);
  
  var musciAudio = document.getElementById("Play");
	musciAudio.addEventListener("click", playFile, false);
    
	// create audio context
  window.AudioContext = window.AudioContext || window.webkitAudioContext;
  context = new AudioContext();
  
  var demoAudio = document.getElementById("demoAudio");
	demoAudio.addEventListener("click", playFile, false);

	
	// analyzer
  analyser = context.createAnalyser();
  analyser.fftSize = 2048;
	analyser.smoothingTimeConstant = 0;		

	var demoReq = new XMLHttpRequest();
    demoReq.open("Get","demo.mp3",true);
    demoReq.responseType = "arraybuffer";
    demoReq.onload = function(){
        context.decodeAudioData(demoReq.response, function(buffer){demo_buffer = buffer;});
    }
    demoReq.send();
}


function fileChanged(e){
	var file = e.target.files[0];
	var fileReader = new FileReader();
	fileReader.onload = fileLoaded;
	fileReader.readAsArrayBuffer(file);
}
  
  
function fileLoaded(e){
	context.decodeAudioData(e.target.result, function(buffer) {
	  myAudioBuffer = buffer;
	});
	console.log("File has been loaded.")
}


function playFile() {
    if (filePlayOn) {
    	turnOffFileAudio();
    	return;
    }

    sourceNode = context.createBufferSource();

    sourceNode.buffer = demo_buffer;
    sourceNode.connect(context.destination);
    sourceNode.start(0);

	sourceNode.connect(analyser);

	// visualize audio animation
    animation_id = setInterval(animation_function, context.sampleRate/analyser.fftSize);

	filePlayOn = true;
	
	var demoAudio = document.getElementById("demoAudio");
	demoAudio.innerHTML = 'Stop'
}


function turnOffFileAudio() {
	var demoAudio = document.getElementById("demoAudio");
	demoAudio.innerHTML = 'Play'
	sourceNode.stop(0);
  sourceNode = null;
  filePlayOn = false;

	stopAnimation();
}


function stopAnimation() { 
    clearInterval(animation_id);
}
