var div = document.getElementById("d1");
spawnMoreOverlords();

window.onscroll = function(ev) {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
		spawnMoreOverlords();
    }
};

function spawnMoreOverlords() {
	for (var x = 0; x < 100; x++) {
		var img = document.createElement("input");
		img.setAttribute("type", "image");
		img.src = "images/thumbnail.png";
		img.setAttribute("onmousedown", "showPopup()");
		img.style.marginRight = "20px";
		img.style.marginTop = "20px";
		img.style.border = "3px solid black"
		div.appendChild(img);
	}
}

function toppity() {
	scroll(0, 0);
}