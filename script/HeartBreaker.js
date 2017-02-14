var HeartBreaker = function() {
	var width = window.innerWidth;
	var height = window.innerHeight;

	var canvas = document.createElement("canvas"), 
		context = canvas.getContext("2d");

	canvas.width = width;
	canvas.height = height;

	document.body.appendChild(canvas);

	var Dimension = function(x, y, w, h) {
		this.x = x;
		this.y = y;
		this.width = w;
		this.height = h;

		this.add = function(go) {
			this.x += go.x;
			this.y += go.y;
			this.width += go.width;
			this.height += go.height;
		};
	};

	var random = function(min, max) {
		return Math.random() * (max - min) + min;
	};

	var clear = function() {
		context.fillStyle = "black";
		context.fillRect(0, 0, width, height);
	};

	var Heart = function(speed) {
		var gameObject = new Dimension(random(0, width), height, 50, 50);
		var velocity = new Dimension(0, -3, 0, 0);
		var color = "red";

		var imageURL = "assets/heart.png";
		var image = new Image();
		var imageLoaded = false;
		image.onload = function() {
			imageLoaded = true;
		};
		image.src = imageURL;

		var update = function() {
			var offset = random(-2, 2);
			velocity.width = offset;
			velocity.height = offset;

			velocity.x += random(-.1, .1);

			gameObject.add(velocity);
		};

		this.isShown = function() {
			return !(gameObject.x < 0 || gameObject.x > width || gameObject.y < 0 || gameObject.y > height);
		};

		this.collided = function(x, y) {
			return (gameObject.x <= x && gameObject.x + gameObject.width >= x && gameObject.y <= y && gameObject.y + gameObject.height >= y);
		};

		this.draw = function() {
			if(!this.isShown()) return;

			update();

			if(!imageLoaded) {
				context.fillStyle = color;
				context.fillRect(gameObject.x - gameObject.width/2, gameObject.y - gameObject.height/2, gameObject.width, gameObject.height);
			} else {
				context.drawImage(image, gameObject.x - gameObject.width/2, gameObject.y - gameObject.height/2, gameObject.width, gameObject.height);
			}
		};
	};


	var Hearts = [];
	var BurstRate = 2;
	var Frames = 60 / BurstRate;
	var currentFrame = 1;
	var x = -1, y = -1;
	var score = 0;

	var checkColisions = function() {
		if(x == -1 || y == -1) return;

		for(var i = Hearts.length-1; i >= 0; i--) {
			if(Hearts[i].collided(x, y)) {
				Hearts.splice(i, 1);
				score++;
			}
		}

		x = -1, y = -1;
	};

	var update = function() {
		checkColisions();
		if(currentFrame % Frames == 1) {
			Hearts.push(new Heart());
		}
		currentFrame = (currentFrame + 1) % 61;

		for(var i = Hearts.length-1; i >= 0; i--) {
			if(!Hearts[i].isShown()) {
				Hearts.splice(i, 1);
			}
		}
	};

	var draw = function() {
		requestAnimationFrame(draw);
		update();
		clear();

		for(var i = 0; i < Hearts.length; i++) {
			Hearts[i].draw();
		}

		context.font = "40px Arial bold";
		context.fillStyle = "red";
		context.fillText(score, width/2, 50);
	};

	draw();

	window.addEventListener("mousedown", function(e) {
		x = e.clientX;
		y = e.clientY;		
	});

};

HeartBreaker();