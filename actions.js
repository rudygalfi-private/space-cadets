var phases = [
	["captain"],
	["prepare"],
	["sensors","weapons","engineering","helm","shields","corebreach"],
	["shields","helm","sensors"],
	["tractorbeam"],
	["weapons"],
	["enemy"],
	["jumpdrive"],
	["damagerepair"]
];

var phaseTiming = [
	[180, 120],
	[0],
	[30],
	[0],
	[30],
	[30],
	[0],
	[30],
	[30]
];

var audioCounter = -1;

// Initialize timer to 30 seconds.
var duration = 30*1000;
var startTime = new Date().getTime();
var endTime = startTime + duration;

var inExtraTime = false;
var startExtraTime = 0;
var endExtraTime = 0;

// Display area extents
// Initialize to full window
var xMin = 0;
var xMax = window.innerWidth;
var yMin = 0;
var yMax = window.innerHeight;

function init() {
	calculateExtents();
	renderViewableArea();
	positionObjects();
	renderObjects();
}

function calculateExtents() {
	// Calculate window width and height
	var clientWidth = window.innerWidth;
	var clientHeight = window.innerHeight;
	
	// Initialize variables for target width and height
	var targetWidth = clientWidth;
	var targetHeight = clientHeight;
	
	if (clientHeight < clientWidth ) {
		// When height is relatively smaller, width constrained to a max of 16:10 ratio
		targetWidth = Math.min(clientWidth, Math.floor(16.0/10.0*clientHeight));
		targetHeight = clientHeight;
	} else {
		// When width is relatively smaller, height constrained to a max of 10:16 ratio
		targetWidth = clientWidth;
		targetHeight = Math.min(clientHeight, Math.floor(16.0/10.0*clientWidth));
	}
	
	// Center horizontally
	xMin = Math.floor((clientWidth - targetWidth)/2);
	xMax = xMin + targetWidth;
	
	// Top-align vertically
	yMin = 0;
	yMax = yMin + targetHeight;
}

function renderViewableArea() {
	var leftBlock = document.getElementById("leftBlock");
	var rightBlock = document.getElementById("rightBlock");
	var topBlock = document.getElementById("topBlock");
	var bottomBlock = document.getElementById("bottomBlock");
	
	leftBlock.style.backgroundColor = "#000000";
	leftBlock.style.position = "absolute";
	leftBlock.style.left = 0 + "px";
	leftBlock.style.top = 0 + "px";
	leftBlock.style.width = (xMin) + "px";
	leftBlock.style.height = (window.innerHeight) + "px";
	
	rightBlock.style.backgroundColor = "#000000";
	rightBlock.style.position = "absolute";
	rightBlock.style.left = xMax + "px";
	rightBlock.style.top = 0 + "px";
	rightBlock.style.width = (window.innerWidth - xMax) + "px";
	rightBlock.style.height = (window.innerHeight) + "px";
	
	topBlock.style.backgroundColor ="#000000";
	topBlock.style.position = "absolute";
	topBlock.style.left = 0 + "px";
	topBlock.style.top = 0 + "px";
	topBlock.style.width = (window.innerWidth) + "px";
	topBlock.style.height = (yMin) + "px";
	
	bottomBlock.style.backgroundColor = "#000000";
	bottomBlock.style.position = "absolute";
	bottomBlock.style.left = 0 + "px";
	bottomBlock.style.top = yMax + "px";
	bottomBlock.style.width = (window.innerWidth) + "px";
	bottomBlock.style.height = (window.innerHeight - yMax) + "px";
}

function positionObjects() {
	var phaseCircleContainer = document.getElementById("phaseCircleContainer");
	var phaseCircleSize = Math.floor(0.15 * Math.min(xMax - xMin, yMax - yMin));
	phaseCircleContainer.style.width = phaseCircleSize + "px";
	phaseCircleContainer.style.height = phaseCircleSize + "px";
	phaseCircleContainer.style.position = "absolute";
	phaseCircleContainer.style.top = Math.floor(0.05 * (yMax - yMin) + yMin) + "px";
	phaseCircleContainer.style.left = Math.floor(0.05 * (xMax - xMin) + xMin) + "px";
	
	var phaseCircle = document.getElementById("phaseCircle");
	phaseCircle.width = phaseCircleContainer.offsetWidth;
	phaseCircle.height = phaseCircleContainer.offsetHeight;
	
	var phaseNumber = document.getElementById("phaseNumber");
	phaseNumber.style.width = phaseCircleContainer.style.width;
	phaseNumber.style.height = phaseCircleContainer.style.height;
	phaseNumber.style.position = "absolute";
	phaseNumber.style.top = phaseCircleContainer.style.top;
	phaseNumber.style.left = phaseCircleContainer.style.left;
	phaseNumber.style.lineHeight = phaseNumber.style.height;
	phaseNumber.style.textAlign = "center";
	phaseNumber.style.verticalAlign = "middle";
	phaseNumber.style.color = "white";
	phaseNumber.style.fontSize = Math.floor(0.8*2/3*phaseCircleSize) + "px";
	phaseNumber.style.fontFamily = "Helvetica Neue";
	phaseNumber.style.fontWeight = "bold";
	phaseNumber.innerHTML = "3";
	
	var phaseLine = document.getElementById("phaseLine");
	phaseLine.style.width = Math.floor(0.905 * (xMax - xMin) - phaseCircleSize) + "px";
	var lineHeight = 0.07*phaseCircleSize;
	phaseLine.style.height = Math.floor(lineHeight)+"px";
	phaseLine.style.position = "absolute";
	phaseLine.style.top = Math.floor(0.05 * (yMax - yMin) + yMin + phaseCircleSize/2 - lineHeight/2) + "px";
	phaseLine.style.left = Math.floor(0.045 * (xMax - xMin) + xMin + phaseCircleSize) + "px";
	phaseLine.style.backgroundColor = "#ffffff";
	
	var clockRingContainer = document.getElementById("clockRingContainer");
	var clockRingSize = Math.floor(0.6 * Math.min(xMax - xMin, yMax - yMin));
	clockRingContainer.style.width = clockRingSize + "px";
	clockRingContainer.style.height = clockRingSize + "px";
	clockRingContainer.style.position = "absolute";
	var clockRingContainerTop = Math.floor(0.25 * (yMax - yMin) + yMin);
	var clockRingContainerLeft = Math.floor(((xMax - xMin) - clockRingSize)/2 + xMin);
	clockRingContainer.style.top = clockRingContainerTop + "px";
	clockRingContainer.style.left = clockRingContainerLeft + "px";
	
	var clockRing = document.getElementById("clockRing");
	clockRing.width = clockRingContainer.offsetWidth;
	clockRing.height = clockRingContainer.offsetHeight;
	
	var clockValue = document.getElementById("clockValue");
	clockValue.style.width = clockRingContainer.style.width;
	clockValue.style.height = clockRingContainer.style.height;
	clockValue.style.position = "absolute";
	clockValue.style.top = clockRingContainer.style.top;
	clockValue.style.left = clockRingContainer.style.left;
	clockValue.style.lineHeight = clockValue.style.height;
	clockValue.style.textAlign = "center";
	clockValue.style.verticalAlign = "middle";
	clockValue.style.color = "white";
	clockValue.style.fontSize = Math.floor(1/3*clockRingSize) + "px";
	clockValue.style.fontFamily = "Helvetica Neue";
	clockValue.style.fontWeight = "bold";
	
	var addExtraTimeButton = document.getElementById("addExtraTimeButton");
	var addExtraTimeButtonWidth = Math.floor(0.08 * Math.min(xMax - xMin, yMax - yMin));
	var addExtraTimeButtonHeight = Math.floor(0.06 * Math.min(xMax - xMin, yMax - yMin));
	addExtraTimeButton.style.width = addExtraTimeButtonWidth + "px";
	addExtraTimeButton.style.height = addExtraTimeButtonHeight + "px";
	addExtraTimeButton.style.backgroundColor = "rgba(" + hexToRGB(getTimeBasedColor(31)) + ",0.4)";
	addExtraTimeButton.style.border = "2px solid "+ getTimeBasedColor(31);
	addExtraTimeButton.style.position = "absolute";
	addExtraTimeButton.style.top = clockRingContainer.style.top;
	addExtraTimeButton.style.left = clockRingContainer.style.left;
	addExtraTimeButton.style.lineHeight = addExtraTimeButton.style.height;
	addExtraTimeButton.style.textAlign = "center";
	addExtraTimeButton.style.verticalAlign = "middle";
	addExtraTimeButton.style.color = "white";
	addExtraTimeButton.style.fontSize = Math.floor(0.6 * addExtraTimeButtonHeight) + "px";
	addExtraTimeButton.style.fontFamily = "Helvetica Neue";
	addExtraTimeButton.style.fontWeight = "bold";
	addExtraTimeButton.innerHTML = "+30";
}

function renderObjects() {
	drawphaseCircleCanvas();
	drawclockRing();
	
	var addExtraTimeButton = document.getElementById("addExtraTimeButton");
	addExtraTimeButton.style.cursor = "pointer";
	addExtraTimeButton.onclick = function() {
			addExtraTime();
	};
}

function backingScale(context) {
	if ("devicePixelRatio" in window) {
		if (window.devicePixelRatio > 1) {
			return window.devicePixelRatio;
		}
	}
	return 1;
}

function hexToR(h) {return parseInt((cutHex(h)).substring(0,2),16)}
function hexToG(h) {return parseInt((cutHex(h)).substring(2,4),16)}
function hexToB(h) {return parseInt((cutHex(h)).substring(4,6),16)}
function cutHex(h) {return (h.charAt(0)=="#") ? h.substring(1,7):h}
function hexToRGB(h) {return hexToR(h)+","+hexToG(h)+","+hexToB(h)}

window.onresize = function() {
	calculateExtents();
	renderViewableArea();
	positionObjects();
	renderObjects();
}

function toggleAudio() {
	audioCounter++;
	var oldTrack = null;
	var newTrack = null;
	if (audioCounter % 3 == 0) {
		oldTrack = document.getElementById("wrong");
		newTrack = document.getElementById("reveal");
	} else if (audioCounter % 3 == 1) {
		oldTrack = document.getElementById("reveal");
		newTrack = document.getElementById("wonderwall");
	} else {
		oldTrack = document.getElementById("wonderwall");
		newTrack = document.getElementById("wrong");
	}
	oldTrack.pause();
	newTrack.currentTime = 0;
	newTrack.play(); 
}

function drawclockRing() {
	// Get the canvas.
	var canvasContainer = document.getElementById("clockRingContainer");
	var canvas = document.getElementById("clockRing");
	
	// Grab our context
	var context = canvas.getContext('2d');
	
	var devicePixelRatio = window.devicePixelRatio || 1;
	var backingStoreRatio = context.webkitBackingStorePixelRatio
	    	|| context.mozBackingStorePixelRatio
	    	|| context.msBackingStorePixelRatio
	    	|| context.oBackingStorePixelRatio
	    	|| context.backingStorePixelRatio
	    	|| 1;
	var ratio = devicePixelRatio / backingStoreRatio;
	
	if (devicePixelRatio !== backingStoreRatio) {
		var oldWidth = canvas.width;
		var oldHeight = canvas.height;

		canvas.width = oldWidth * ratio;
		canvas.height = oldHeight * ratio;

		canvas.style.width = oldWidth + 'px';
		canvas.style.height = oldHeight + 'px';

		// now scale the context to counter
		// the fact that we've manually scaled
		// our canvas element
		//context.scale(ratio, ratio);
	}
	
	// Make sure we have a valid defintion of requestAnimationFrame
	var requestAnimationFrame =
		window.requestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		window.msRequestAnimationFrame ||
		window.oRequestAnimationFrame ||
		function(callback) {
				return setTimeout(callback, 16);
		};
	
	var render = function() {
		// Clear the canvas
		context.clearRect(0, 0, canvas.width, canvas.height);
				
		// Draw the clock.
		var center = [canvas.width / 2, canvas.height / 2];
		var arcOrigin = 270*Math.PI/180;
		var outerArcWidth = 25/300*Math.min(canvas.width, canvas.height);
		var innerArcWidth = 20/300*Math.min(canvas.width, canvas.height);
		var lineWidth = outerArcWidth/5;
		
		var radius = Math.min(canvas.width, canvas.height) / 2 - outerArcWidth;
		
		context.beginPath();
		context.arc(center[0],center[1],radius,0,2*Math.PI);
		context.lineWidth = outerArcWidth;
		context.strokeStyle = "rgba(" + hexToRGB("#666666") + ",0.5)";
		context.stroke();
		context.closePath();
		
		// Get current time
		var time = new Date().getTime();
		
		// Time units are the integer portion of the time remaining, rounded up
		var timeUnits = 0;
		
		// With no extra time, we see how far out the end time is.
		// If extra time is active, we look at the gap between the
		// end of extra time and the end of regular time.
		timeUnits = Math.ceil((endTime-time)/1000);
		if (timeUnits < 0) {
			timeUnits = 0;
		}
		
		var radPerTick = 2*Math.PI/(duration/1000);
		var tickPaddingRad = duration <= 360*1000 ? 2*Math.PI/1080 : -2*Math.PI/1080;
		
		context.beginPath();
		context.arc(center[0],center[1],radius-outerArcWidth/2-lineWidth/2+1,0,2*Math.PI);
		context.lineWidth = lineWidth;
		context.strokeStyle = getTimeBasedColor(timeUnits);
		context.stroke();
		context.closePath();
		
		for (var tick = 0; tick < timeUnits; ++tick) {
			context.beginPath();
			context.arc(
				center[0],
				center[1],
				radius,
				arcOrigin-tick*radPerTick-tickPaddingRad/2,
				arcOrigin-tick*radPerTick-radPerTick+tickPaddingRad/2,
				true);
			context.lineWidth = innerArcWidth;
			context.strokeStyle = getTimeBasedColor(timeUnits);
			context.stroke();
			context.closePath();
		}
		
		var clockValue = document.getElementById("clockValue");
		clockValue.style.color = getTimeBasedColor(timeUnits);
		clockValue.innerHTML = timeUnits < 10 ? "0"+timeUnits : timeUnits;
		
		// Redraw
		requestAnimationFrame(render);
	};

	// Start the redrawing process
	render();
}

function addExtraTime() {
	var currentTime = new Date().getTime();
	
	// Require that there be some time remaining.
	if (currentTime < endTime) {
		var extraTimeDuration = 30*1000;
		duration += extraTimeDuration;
		endTime += extraTimeDuration;
	}
}

function getTimeBasedColor(timeUnits) {
	var color = "#ffffff";
	if (timeUnits > 30) {
		color = "#95ec00";
	} else if (timeUnits == 0) {
		color = "#999999";
	} else if (timeUnits <= 5) {
		color = "#fd0006";
	} else if (timeUnits <= 10) {
		color = "#fff700";
	}
	return color;
}

function drawphaseCircleCanvas() {
	// Get the canvas.
	var canvasContainer = document.getElementById("phaseCircleContainer");
	var canvas = document.getElementById("phaseCircle");
	
	// Grab our context
	var context = canvas.getContext('2d');
	
	var devicePixelRatio = window.devicePixelRatio || 1;
	var backingStoreRatio = context.webkitBackingStorePixelRatio
	    	|| context.mozBackingStorePixelRatio
	    	|| context.msBackingStorePixelRatio
	    	|| context.oBackingStorePixelRatio
	    	|| context.backingStorePixelRatio
	    	|| 1;
	var ratio = devicePixelRatio / backingStoreRatio;
	
	if (devicePixelRatio !== backingStoreRatio) {
		var oldWidth = canvas.width;
		var oldHeight = canvas.height;

		canvas.width = oldWidth * ratio;
		canvas.height = oldHeight * ratio;

		canvas.style.width = oldWidth + 'px';
		canvas.style.height = oldHeight + 'px';
	}
	
	// Make sure we have a valid defintion of requestAnimationFrame
	var requestAnimationFrame =
		window.requestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		window.msRequestAnimationFrame ||
		window.oRequestAnimationFrame ||
		function(callback) {
				return setTimeout(callback, 16);
		};
	
	var render = function() {
		// Clear the canvas
		context.clearRect(0, 0, canvas.width, canvas.height);
				
		// Draw the ring.
		var center = [canvas.width / 2, canvas.height / 2];
		var arcOrigin = 270*Math.PI/180;
		var outerArcWidth = 20/300*Math.min(canvas.width, canvas.height);
		
		var radius = Math.min(canvas.width, canvas.height) / 2 - outerArcWidth;
		
		context.beginPath();
		context.arc(center[0],center[1],radius,0,2*Math.PI);
		context.lineWidth = outerArcWidth;
		context.strokeStyle = "rgba(" + hexToRGB("#ffffff") + ",1.0)";
		context.stroke();
		context.closePath();
		
		// Redraw
		requestAnimationFrame(render);
	};

	// Start the redrawing process
	render();
}
