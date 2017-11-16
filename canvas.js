var canvas = document.getElementById('canvas');
var context = canvas.getContext("2d");
var paint = false;
var finished = false;
var update;
var pixels = new Array();

for (var x = 0; x < 160; x++) {
	pixels.push([]);
	for(var y = 0; y < 160; y++) {
		pixels[x].push(false);
	}
}

function getMousePos(canvas, evt) {
	var rect = canvas.getBoundingClientRect();
	return {
		x: evt.clientX - rect.left,
		y: evt.clientY - rect.top
	};
}

function drawRect(pos) {
	context.fillRect(pos.x - pos.x%5, pos.y - pos.y%5, 5, 5);
	pixels[pos.x/5>>0][pos.y/5>>0] = true;
}

canvas.addEventListener('mousedown', function(evt) {
	paint = !finished;
	if (paint)
		drawRect(getMousePos(canvas, evt));
})

canvas.addEventListener('mousemove', function(evt) {
	if (paint)
		drawRect(getMousePos(canvas, evt));
})

canvas.addEventListener('mouseup', function(evt) {
	paint = false;
})

function finish() {
	if (!finished)
		update = setInterval(function(){console.log("ban");}, 1000);
		//clearInterval(update());
	finished = true;
	
	var numPixels = 0;
	for (var x = 0; x < 160; x++) {
		for(var y = 0; y < 160; y++) {
			numPixels += (pixels[x][y]) ? 1 : 0;
		}
	}
}