const electron = require('electron');
const app = electron.app;
const remote = electron.remote;
const mainProcess = remote.require('./main');
const events = require('events');
const fs = require('fs');
const path = require('path');
const ipcRenderer = electron.ipcRenderer;
const shell = require("shelljs");
const Observable = require('rxjs/Observable');
const exec = require('child_process').exec;


function hasGetUserMedia() {
  return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
}

if(hasGetUserMedia()) {
} else {
  alert('getUserMedia() is not supported by your browser');
}

const audioSelect = document.querySelector('select#audioSource');
const player = document.getElementById('player');

var gotStream = function(stream) {
	window.AudioContext = window.AudioContext || window.webkitAudioContext;
    var audioContext = new AudioContext();
	
	console.log(stream);
    // Create an AudioNode from the stream.
    var mediaStreamSource = audioContext.createMediaStreamSource( stream );

	const recorder = new Recorder(mediaStreamSource, {
		onAnalysed: data => console.log(data),
	});
	
	const start = document.querySelector('#start').onclick = function(e) {
		recorder.record();
		mediaStreamSource.connect( audioContext.destination );
	};
	
	const stop = document.querySelector('#stop').onclick = function(e) {
		recorder.stop();
		mediaStreamSource.disconnect();
	};
	
	console.log(recorder);
	console.log(mediaStreamSource);
    // Connect it to the destination to hear yourself (or any other node for processing!)
    
};



navigator.mediaDevices.enumerateDevices()
  .then(gotDevices).then(getStream).catch(handleError);

audioSelect.onchange = getStream;

function gotDevices(deviceInfos) {
  for (var i = 0; i !== deviceInfos.length; ++i) {
    var deviceInfo = deviceInfos[i];
    var option = document.createElement('option');
    option.value = deviceInfo.deviceId;
    if (deviceInfo.kind === 'audioinput') {
      option.text = deviceInfo.label ||
        'microphone ' + (audioSelect.length + 1);
      audioSelect.appendChild(option);
    } else {
      // console.log('Found one other kind of source/device: ', deviceInfo);
    }
  }
}

function getStream() {
	if (window.stream) {
		window.stream.getTracks().forEach(function(track) {
			console.log(track);
			track.stop();
		});
	}

	var constraints = {
		audio: {
			deviceId: {exact: audioSelect.value}
		}
	};
	
	navigator.mediaDevices.getUserMedia(constraints)
		.then(gotStream)
		.catch(handleError);
}
  
function handleError(error) {
	console.error('Error: ', error);
}

document.getElementById('recorderStart').addEventListener('click', (event) => {
    
	
	// mainProcess.selectPackageFile();
});



function quit() {
    ipcRenderer.send('quit-app');
}