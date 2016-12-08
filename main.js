var context;
var source = null;
var myAudioBuffer = null;

var sourceNode = null;
var mediaSourceNode = null;
var analyser = null;

var vis_view;
var vis_value;

var filePlayOn = false;

var animation_function;
var animation_id;

var demo_buffer;

window.onload=function(){

	var control = document.getElementById("fileChooseInput");
	control.addEventListener("change", fileChanged, false);
  
	var _Audio = document.getElementById("_Audio");
	_Audio.addEventListener("click", playFile, false);
    
	// create audio context
	context = new(window.AudioContext || window.webkitAudioContext)();

	// analyzer
	analyser = context.createAnalyser();
	analyser.fftSize = 256;
	analyser.smoothingTimeConstant = 0;		

	var demoReq = new XMLHttpRequest();
	demoReq.open("Get","demo.mp3",true);
	demoReq.responseType = "arraybuffer";
	demoReq.onload = function(){
		context.decodeAudioData(demoReq.response, function(buffer){demo_buffer = buffer;});
	}
	demoReq.send();
	
	animation_function = draw_3d
}

function draw_3d() {
	var frequencyData = new Uint8Array(analyser.frequencyBinCount);
	console.log(frequencyData);
	var cube, cubeMaterial, cubeGeometry;
	var scene, camera, renderer;
	
	window.addEventListener('load', function() {
			
		init();
			
		var random = function(limit){
			return Math.round(Math.random() * limit);
		};
			
		list=[];
		for (var i=0; i<50; i++) {
			var geometry = new THREE.CubeGeometry(50,50,50);
			var material = new THREE.MeshLambertMaterial({
				color: 0xff0000
			});
			
			var mesh = new THREE.Mesh(geometry, material);
			mesh.position.set(random(3000)-1500,0,random(3000)-1500);
			scene.add(mesh);
			list.push(mesh);
		}
			
		requestAnimationFrame(loop);
	});
	
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
	
	var _Audio = document.getElementById("_Audio");
	_Audio.innerHTML = 'Stop'
}


function turnOffFileAudio() {
	var _Audio = document.getElementById("_Audio");
	_Audio.innerHTML = 'Play'
	sourceNode.stop(0);
	sourceNode = null;
	filePlayOn = false;

	stopAnimation();
}


function stopAnimation() { 
	clearInterval(animation_id);
}
