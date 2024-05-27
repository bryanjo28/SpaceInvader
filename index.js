const canvas = document.querySelector("canvas");
const scoreEl = document.querySelector("#score");
const gameOverOverlay = document.getElementById("gameOverOverlay"); // Mendapatkan elemen overlay game over
const restartButton = document.getElementById("restartButton"); // Mendapatkan tombol restart

const c = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;


console.log(scoreEl)

let touchStartX = null; // Simpan posisi sentuhan awal
const swipeThreshold = 50; // Ambang batas untuk menganggap gerakan sebagai swipe

// Tangani peristiwa sentuhan
canvas.addEventListener("touchstart", (event) => {
	touchStartX = event.touches[0].clientX; // Simpan posisi sentuhan awal
});

canvas.addEventListener("touchmove", (event) => {
	if (touchStartX === null) return; // Jika tidak ada sentuhan awal, keluar dari fungsi
	const touchMoveX = event.touches[0].clientX; // Ambil posisi sentuhan saat ini
	const swipeDistance = touchMoveX - touchStartX; // Hitung pergeseran horizontal

	// Geser karakter berdasarkan pergeseran, misalnya:
	if (swipeDistance > swipeThreshold) {
			// Geser ke kanan
			keys.a.pressed = false;
			keys.d.pressed = true;
	} else if (swipeDistance < -swipeThreshold) {
			// Geser ke kiri
			keys.a.pressed = true;
			keys.d.pressed = false;
	}
});

canvas.addEventListener("touchend", () => {
	touchStartX = null; // Reset posisi sentuhan awal saat sentuhan berakhir
	// Berhenti menggerakkan karakter saat sentuhan berakhir
	keys.a.pressed = false;
	keys.d.pressed = false;
});


class Player {
	constructor() {
		this.velocity = {
			x: 0,
			y: 0,
		};

		this.rotation = 0;
		this.opacity = 1;
		const image = new Image();
		image.src = "./spaceship.png";
		image.onload = () => {
			const scale = 0.15;
			this.image = image;
			this.width = image.width * scale;
			this.height = image.height * scale;
			this.position = {
				x: canvas.width / 2 - this.width / 2,
				y: canvas.height - this.height - 20,
			};
		};
	}
	//draw player
	draw() {
		// c.fillStyle = 'red'
		// c.fillRect(this.position.x, this.position.y, this.width, this.height)
		c.save();
		c.globalAlpha = this.opacity
		c.translate(
			player.position.x + player.width / 2,
			player.position.y + player.height / 2
		);
		c.rotate(this.rotation);

		c.translate(
			-player.position.x - player.width / 2,
			-player.position.y - player.height / 2
		);

		c.drawImage(
			this.image,
			this.position.x,
			this.position.y,
			this.width,
			this.height
		);
		c.restore();
	}

	update() {
		if (this.image) {
			this.draw();
			this.position.x += this.velocity.x;
		}
	}
	
}

//projectile
class Projectile {
	constructor({ position, velocity }) {
		this.position = position;
		this.velocity = velocity;

		this.radius = 4;
	}
	draw() {
		c.beginPath();
		c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
		c.fillStyle = "red";
		c.fill();
		c.closePath();
	}

	update() {
		this.draw();
		this.position.x += this.velocity.x;
		this.position.y += this.velocity.y;
	}
}

//particle
class Particle {
	constructor({ position, velocity, radius, color, fades }) {
		this.position = position;
		this.velocity = velocity;

		this.radius = radius;
		this.color = color;
		this.opacity = 1;
		this.fades = fades
	}
	draw() {
		c.save()
		c.globalAlpha = this.opacity
		c.beginPath();
		c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
		c.fillStyle = this.color;
		c.fill();
		c.closePath();
		c.restore()
	}

	update() {
		this.draw();
		this.position.x += this.velocity.x;
		this.position.y += this.velocity.y;
		if (this.fades) this.opacity -= 0.01
	}
}


//Invaderprojectile
class InvaderProjectile {
	constructor({ position, velocity }) {
		this.position = position;
		this.velocity = velocity;

		this.width = 3;
		this.height = 10;
	}
	draw() {
		c.fillStyle = "white";
		c.fillRect(this.position.x, this.position.y, this.width, this.height);
	}

	update() {
		this.draw();
		this.position.x += this.velocity.x;
		this.position.y += this.velocity.y;
	}
}

//draw Invader
class Invader {
	constructor({ position }) {
		this.velocity = {
			x: 0,
			y: 0,
		};

		const image = new Image();
		image.src = "./invader.png";
		image.onload = () => {
			const scale = 1;
			this.image = image;
			this.width = image.width * scale;
			this.height = image.height * scale;
			this.position = {
				x: position.x,
				y: position.y,
			};
		};
	}

	draw() {
		// c.fillStyle = 'red'
		// c.fillRect(this.position.x, this.position.y, this.width, this.height)
		c.drawImage(
			this.image,
			this.position.x,
			this.position.y,
			this.width,
			this.height
		);
		c.restore();
	}

	update({ velocity }) {
		if (this.image) {
			this.draw();
			this.position.x += velocity.x;
			this.position.y += velocity.y;
		}
	}
	shoot(invaderProjectiles) {
		invaderProjectiles.push(
			new InvaderProjectile({
				position: {
					x: this.position.x + this.width / 2,
					y: this.position.y + this.height,
				},
				velocity: {
					x: 0,
					y: 5,
				},
			})
		);
	}
}

//draw Grid
class Grid {
	constructor() {
		this.position = {
			x: 0,
			y: 0,
		};
		this.velocity = {
			x: 0.5,
			y: 0,
		};

		this.invaders = [];

		const rows = Math.floor(Math.random() * 5 + 2);
		const col = Math.floor(Math.random() * 10 + 2);

		this.width = col * 30;
		for (let x = 0; x < col; x++) {
			for (let y = 0; y < rows; y++) {
				this.invaders.push(
					new Invader({
						position: {
							x: x * 30,
							y: y * 30,
						},
					})
				);
			}
		}

		console.log(this.invaders);
	}

	update() {
		this.position.x += this.velocity.x;
		this.position.y += this.velocity.y;
		this.velocity.y = 0;

		if (this.position.x + this.width >= canvas.width || this.position.x <= 0) {
			this.velocity.x = -this.velocity.x;
			this.velocity.y = 30;
		}
	}
}

//call
const player = new Player();
const projectiles = [];
const grids = [];
const invaderProjectiles = [];
const particles = [];

const keys = {
	a: {
		pressed: false,
	},
	d: {
		pressed: false,
	},
	space: {
		pressed: false,
	},
};

let frames = 0;
let randomInterval = Math.floor(Math.random() * 500 + 500);
let game = {
	over: false,
	active: true
}
let score = 0

//star di canvas
for (let i = 0; i < 100; i++) {
	particles.push(
		new Particle({
			position: {
				x: Math.random() * canvas.width,
				y: Math.random() * canvas.height
			},
			velocity: {
				x: 0,
				y: 0.2
			},
			radius: Math.random() * 2,
			color: "white"
		}))
}

//fungsi particles
function createParticles({ object, color, fades }) {
	for (let i = 0; i < 15; i++) {
		particles.push(new Particle({
			position: {
				x: object.position.x + object.height / 2,
				y: object.position.y + object.height / 2
			},
			velocity: {
				x: (Math.random() - 0.5) * 2,
				y: (Math.random() - 0.5) * 2
			},
			radius: Math.random() * 3,
			color: color || "#BAA0DE",
			fades
		}))
	}
}

// Menambahkan fungsi untuk menembak secara otomatis setiap interval tertentu
function autoShoot() {
	projectiles.push(
			new Projectile({
					position: {
							x: player.position.x + player.width / 2,
							y: player.position.y,
					},
					velocity: {
							x: 0,
							y: -10,
					},
			})
	);
}
// Mengatur interval tembakan otomatis
const autoShootInterval = setInterval(autoShoot, 500); 

//fungsi animasi
function animate() {
	if(!game.active) return
	requestAnimationFrame(animate);
	c.fillStyle = "black";
	c.fillRect(0, 0, canvas.width, canvas.height);
	player.update();
	particles.forEach((particle, i) => {
		if(particle.position.y - particle.radius >= canvas.height){
			particle.position.x = Math.random() * canvas.width,
			particle.position.y = -particle.radius
		}
		if (particle.opacity <= 0) {
			setTimeout(() => {
				particles.splice(i, 1)
			}, 0)
		} else {
			particle.update()
		}
	})

	invaderProjectiles.forEach((invaderProjectile, index) => {
		if (
			invaderProjectile.position.y + invaderProjectile.height >=
			canvas.height
		) {
			setTimeout(() => {
				invaderProjectiles.splice(index, 1);
			}, 0);
		} else invaderProjectile.update();

		// projectiles hit players
		if (invaderProjectile.position.y + invaderProjectile.height >= player.position.y &&
			invaderProjectile.position.x + invaderProjectile.width >= player.position.x &&
			invaderProjectile.position.x <= player.position.x + player.width) {
			setTimeout(() => {
				invaderProjectiles.splice(index, 1);
				player.opacity = 0,
				game.over = true
				clearInterval(autoShootInterval);
			}, 0);

			setTimeout(() => {
				game.active = false,
				gameOverOverlay.classList.add("active"); // Menampilkan overlay game over
				
			}, 1000);

			console.log('you lose')
			createParticles({
				object: player,
				color: 'white',
				fades: true
			})
		}
	});


	projectiles.forEach((projectile, index) => {
		if (projectile.position.y + projectile.radius <= 0) {
			setTimeout(() => {
				projectiles.splice(index, 1);
			}, 0);
		} else {
			projectile.update();
		}
	});

	//grid position
	grids.forEach((grid, gridIndex) => {
		grid.update();

		if (frames % 100 === 0 && grid.invaders.length > 0) {
			grid.invaders[Math.floor(Math.random() * grid.invaders.length)].shoot(
				invaderProjectiles
			);
		}

		grid.invaders.forEach((invader, i) => {
			invader.update({ velocity: grid.velocity });

			//projectiles hit enemy
			projectiles.forEach((projectile, j) => {
				if (
					projectile.position.y - projectile.radius <=
					invader.position.y + invader.height &&
					projectile.position.x + projectile.radius >= invader.position.x &&
					projectile.position.x - projectile.radius <=
					invader.position.x + invader.width &&
					projectile.position.y - projectile.radius >= invader.position.y
				) {

					setTimeout(() => {

						const invaderFound = grid.invaders.find(
							(invader2) => invader2 === invader
						);
						const projectileFound = projectiles.find(
							(projectile2) => projectile2 === projectile
						);

						//remove invader and projectile
						if (invaderFound && projectileFound) {
						 	score	+= 100
							scoreEl.innerHTML = score
							//particles animate
							createParticles({
								object: invader,
								fades: true
							})

							grid.invaders.splice(i, 1);
							projectiles.splice(j, 1);

							if (grid.invaders.length > 0) {
								const firstInvader = grid.invaders[0];
								const lastInvader = grid.invaders[grid.invaders.length - 1];

								grid.width =
									lastInvader.position.x -
									firstInvader.position.x +
									lastInvader.width;
								grid.position.x = firstInvader.position.x;
							} else {
								grids.splice(gridIndex, 1);
							}
						}
					}, 0)
				}
			});
		});
	});

	if (keys.a.pressed && player.position.x >= 0) {
		player.velocity.x = -7;
		player.rotation = -0.15;
	} else if (
		keys.d.pressed &&
		player.position.x + player.width <= canvas.width
	) {
		player.velocity.x = 7;
		player.rotation = 0.15;
	} else {
		player.velocity.x = 0;
		player.rotation = 0;
	}

	//spawning enemies
	if (frames % randomInterval === 0) {
		grids.push(new Grid());
		randomInterval = Math.floor(Math.random() * 500 + 500);
		frames = 0;
		console.log(randomInterval);
	}

	frames++;
}

animate();

addEventListener("keydown", ({ key }) => {
	if(game.over) return

	switch (key) {
		case "a":
			console.log("left");
			keys.a.pressed = true;
			break;
		case "d":
			console.log("right");
			keys.d.pressed = true;
			break;
		case " ":
			console.log("space");
			console.log(projectiles);
			projectiles.push(
				new Projectile({
					position: {
						x: player.position.x + player.width / 2,
						y: player.position.y,
					},
					velocity: {
						x: 0,
						y: -10,
					},
				})
			);
			break;
	}
});

addEventListener("keyup", ({ key }) => {
	switch (key) {
		case "a":
			console.log("left");
			keys.a.pressed = false;
			break;
		case "d":
			console.log("right");
			keys.d.pressed = false;
			break;
		case " ":
			console.log("space");
			break;
	}
});
