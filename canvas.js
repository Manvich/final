var canvas = document.getElementById('canvas');
var context = canvas.getContext("2d");
var paint = false;
var finished = false;
var update;
var pixels = new Array();
var finalPattern = new Array();
var patternIndices = new Array();

for (var x = 0; x < 160; x++) {
	pixels.push([]);
	finalPattern.push([]);
	for(var y = 0; y < 160; y++) {
		pixels[x].push(false);
		if (x < 90 && x > 70 && y < 90 && y > 70) {
			finalPattern[x].push(0);
			patternIndices.push([x, y]);
		} else {
			finalPattern[x].push(2);
		}
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

canvas.addEventListener('mouseleave', function(evt) {
	paint = false;
})

function finish() {
	if (!finished) {
		finished = true;
		update = setInterval(step, 50);
	}
}

function step() {
	var visited = new Array();
	var queued = new Array();
	var numVisited = 0;
	
	for (var x = 0; x < finalPattern.length; x++) {
		visited.push([]);
		for (var y = 0; y < finalPattern.length; y++) {
			visited.push(0);
			if (finalPattern[x][y] != 2) {
				queued.push([x, y]);
			}
		}
	}
	
	while (numVisited < 160*160) {
		var len = queued.length;
		for (var x = 0; x < len; x++) {
			var index = queued.splice(0, 1)[0];
			visited[index[0]][index[1]] = 1;
			if (index[0] > 0 && visited[index[0] - 1][index[1]] == 0)
				queued.push([index[0] - 1, index[1]]);
			if (index[0] < 159 && visited[index[1] + 1][index[1]] == 0)
				queued.push([index[0] + 1, index[1]]);
			if (index[1] > 0 && visited[index[0]][index[1] - 1] == 0)
				queued.push([index[0], index[1] - 1]);
			if (index[1] < 159 && visited[index[0]][index[1] + 1] == 0)
				queued.push([index[0], index[1] + 1]);
			deal(index[0], index[1]);
		}
	}
}

function deal(x, y) {
	if (pixels[x][y]) {
		var closestPixel = getClosest(x, y);
		var x_Inc = (x < closestPixel[0]) ? 1 : ((x > closestPixel[0]) ? -1 : 0);
		var y_Inc = (y < closestPixel[1]) ? 1 : ((y > closestPixel[1]) ? -1 : 0);
		pixels[x][y] = false;
		if (finalPattern[x + x_Inc][y + y_Inc] != 1) {
			context.fillStyle="#FFFFFF";
			context.fillRect(x * 5, y * 5, 5, 5)
		}
		pixels[x + x_Inc][y + y_Inc] = true;
		context.fillStyle="#000000";
		context.fillRect((x + x_Inc) * 5, (y + y_Inc) * 5, 5, 5)
		if (finalPattern[x + x_Inc][y + y_Inc] == 0) {
			finalPattern[x + x_Inc][y + y_Inc] = 1;
			pixels[x + x_Inc][y + y_Inc] = false;
			for (var z = 0; z < patternIndices.length; z++) {
				if (patternIndices[z][0] == x + x_Inc && patternIndices[z][1] == y + y_Inc) {
					patternIndices.splice(z, 1);
					if (patternIndices.length == 0) {
						clearInterval(update);
						return;
					}
					break;
				}
			}
		}
	}
}

function getClosest(x, y) {
	var distance = 10000;
	var closest;
	for (var z = 0; z < patternIndices.length; z++) {
		var diffX = Math.abs(x - patternIndices[z][0]);
		var diffY = Math.abs(y - patternIndices[z][1]);
		var temp = Math.sqrt(diffX*diffX + diffY*diffY);
		if (temp < distance) {
			distance = temp;
			closest = patternIndices[z];
		}
	}
	return closest;
}