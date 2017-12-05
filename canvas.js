var canvas = document.getElementById("d1").childNodes[1];
var context = canvas.getContext("2d");
var paint, finished, pixels, finalPattern, patternIndices, permanentIndices, numPixels, stepInterval;

start();

function start() {
	context.fillStyle = "#FFFFFF";
	context.fillRect(0, 0, canvas.width, canvas.height);
	finished = false;
	pixels = new Array();
	finalPattern = new Array();
	patternIndices = new Array();
	permanentIndices = new Array();
	numPixels = 0;
	stepInterval = 10;
	for (var x = 0; x < 160; x++) {
		pixels.push([]);
		finalPattern.push([]);
		for(var y = 0; y < 160; y++) {
			pixels[x].push(0);
			if ((x < 50 && x > 30 && y < 60 && y > 40) || (x < 130 && x > 110 && y < 60 && y > 40) || (x > 20 && x < 140 && y > 100 && y < 120)) {
				finalPattern[x].push(0);
				patternIndices.push([x, y]);
				permanentIndices.push([x, y]);
			} else {
				finalPattern[x].push(2);
			}
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
	context.fillStyle = "#000000";
	context.fillRect(pos.x - pos.x%5, pos.y - pos.y%5, 5, 5);
	pixels[pos.x/5>>0][pos.y/5>>0] = pixels[pos.x/5>>0][pos.y/5>>0] + 1;
}

canvas.addEventListener('mousedown', function(evt) {
	paint = true;
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
		for (var x = 0; x < pixels.length; x++) {
			for (var y = 0; y < pixels[0].length; y++) {
				numPixels += pixels[x][y];
			}
		}
		setTimeout(step, stepInterval);
	}
}

function step() {
	var sorted = [];
	for (var x = 0; x < pixels.length; x++) {
		for (var y = 0; y < pixels[0].length; y++) {
			if (pixels[x][y] > 0) {
				var closest = getClosest(x, y);
				var dist = distTo(x, y, closest[0], closest[1]);
				for (var z = 0; z < pixels[x][y]; z++) {
					if (sorted.length == 0) {
						sorted.push([x, y, dist]);
					} else {
						var index = Math.floor(sorted.length / 2);
						var leap = Math.floor(sorted.length / 4);
						while(leap > 1) {
							if (dist < sorted[index][2]) {
								index -= leap;
							} else if (dist > sorted[index][2]) {
								index += leap;
							} else {
								break;
							}
							leap = Math.floor(leap / 2);
						}
						sorted.splice(index, 0, [x, y, dist]);
					}
				}
			}
		}
	}
	
	for (var x = 0; x < sorted.length; x++) {
		deal(sorted[x][0], sorted[x][1])
	}
	if (finished) {
		setTimeout(step, stepInterval);
	}
}

function deal(x, y) {
	var closestPixel = getClosest(x, y);
	var x_Inc = (x < closestPixel[0]) ? 1 : ((x > closestPixel[0]) ? -1 : 0);
	var y_Inc = (y < closestPixel[1]) ? 1 : ((y > closestPixel[1]) ? -1 : 0);
	if (numPixels >= patternIndices.length) {
		pixels[x][y] = pixels[x][y] - 1;
		numPixels--;
		if (finalPattern[x][y] != 1) {
			context.fillStyle="#FFFFFF";
			context.fillRect(x * 5, y * 5, 5, 5)
		}
	}
	if (numPixels <= patternIndices.length) {
		pixels[x + x_Inc][y + y_Inc] = pixels[x + x_Inc][y + y_Inc] + 1;
		numPixels++;
		context.fillStyle="#000000";
		context.fillRect((x + x_Inc) * 5, (y + y_Inc) * 5, 5, 5);
		if (finalPattern[x + x_Inc][y + y_Inc] == 0) {
			finalPattern[x + x_Inc][y + y_Inc] = 1;
			pixels[x + x_Inc][y + y_Inc] = pixels[x + x_Inc][y + y_Inc] - 1;
			numPixels--;
			for (var z = 0; z < patternIndices.length; z++) {
				if (patternIndices[z][0] == x + x_Inc && patternIndices[z][1] == y + y_Inc) {
					patternIndices.splice(z, 1);
					break;
				}
			}
		}
	}
}

function getClosest(x, y) {
	var distance = 10000;
	var closest;
	if (patternIndices.length > 0) {
		for (var z = 0; z < patternIndices.length; z++) {
			var temp = distTo(x, y, patternIndices[z][0], patternIndices[z][1])
			if (temp < distance) {
				distance = temp;
				closest = patternIndices[z];
			}
		}
	} else {
		for (var z = 0; z < permanentIndices.length; z++) {
			var temp = distTo(x, y, permanentIndices[z][0], permanentIndices[z][1])
			if (temp < distance) {
				distance = temp;
				closest = permanentIndices[z];
			}
		}
	}
	return closest;
}

function distTo(x, y, a, b) {
	var diffX = Math.abs(x - a);
	var diffY = Math.abs(y - b);
	return Math.sqrt(diffX*diffX + diffY*diffY);
}