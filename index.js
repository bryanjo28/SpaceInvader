const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
console.log("canvas");


class Player {
	constructor() {

		this.velocity = {
			x: 0,
			y: 0
		}

		this.rotation = 0

		const image = new Image()
		image.src = "./spaceship.png"
		image.onload = () => {
			const scale = 0.15;
			this.image = image
			this.width = image.width * scale
			this.height = image.height * scale
			this.position = {
				x: canvas.width / 2 - this.width / 2,
				y: canvas.height - this.height - 20
			}
		}
	}
	//draw player
	draw() {
		// c.fillStyle = 'red'
		// c.fillRect(this.position.x, this.position.y, this.width, this.height)
		c.save()
		c.translate(
			player.position.x + player.width / 2,
			player.position.y + player.height / 2
		)
		c.rotate(this.rotation)

		c.translate(
			-player.position.x - player.width / 2,
			-player.position.y - player.height / 2
		)

		c.drawImage(
			this.image,
			this.position.x,
			this.position.y,
			this.width,
			this.height
		)
		c.restore()

	}

	update() {
		if (this.image) {
			this.draw()
			this.position.x += this.velocity.x
		}
	}
}

//projectile
class Projectile {
	constructor({ position, velocity }) {
		this.position = position,
			this.velocity = velocity

		this.radius = 3
	}
	draw() {
		c.beginPath()
		c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
		c.fillStyle = 'red'
		c.fill()
		c.closePath()
	}

	update() {
		this.draw()
		this.position.x += this.velocity.x
		this.position.y += this.velocity.y
	}
}

//draw Invader
class Invader {
	constructor({ position }) {

		this.velocity = {
			x: 0,
			y: 0
		}


		const image = new Image()
		image.src = "./invader.png"
		image.onload = () => {
			const scale = 1;
			this.image = image
			this.width = image.width * scale
			this.height = image.height * scale
			this.position = {
				x: position.x,
				y: position.y
			}
		}
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
		)
		c.restore()

	}

	update({ velocity }) {
		if (this.image) {
			this.draw()
			this.position.x += velocity.x
			this.position.y += velocity.y
		}
	}
}

//draw Grid
class Grid {
	constructor() {
		this.position = {
			x: 0,
			y: 0
		}
		this.velocity = {
			x: 3,
			y: 0
		}

		this.invaders = []

		const rows = Math.floor(Math.random() * 5 + 2)
		const col = Math.floor(Math.random() * 10 + 2)

		this.width = col * 30
		for (let x = 0; x < col; x++) {
			for (let y = 0; y < rows; y++) {
				this.invaders.push(
					new Invader({
						position: {
							x: x * 30,
							y: y * 30
						}
					}))
			}
		}

		console.log(this.invaders)
	}

	update() {
		this.position.x += this.velocity.x
		this.position.y += this.velocity.y
		this.velocity.y = 0
		
		if(this.position.x + this.width >= canvas.width || this.position.x <= 0){
			this.velocity.x = -this.velocity.x;
			this.velocity.y = 30
		}
	}
}

//call
const player = new Player()
const projectiles = []
const grids = [new Grid()]

const keys = {
	a: {
		pressed: false
	},
	d: {
		pressed: false
	},
	space: {
		pressed: false
	}
}

//fungsi animasi
function animate() {
	requestAnimationFrame(animate)
	c.fillStyle = 'black'
	c.fillRect(0, 0, canvas.width, canvas.height)

	player.update()

	projectiles.forEach((projectile, index) => {
		if (projectile.position.y + projectile.radius <= 0) {
			setTimeout(() => {
				projectiles.splice(index, 1)
			}, 0)
		} else {
			projectile.update()
		}
	})

	grids.forEach(grid => {
		grid.update()
		grid.invaders.forEach(invader => {
			invader.update({ velocity: grid.velocity })
		})
	})

	if (keys.a.pressed && player.position.x >= 0) {
		player.velocity.x = -10
		player.rotation = -0.15
	} else if (keys.d.pressed && player.position.x + player.width <= canvas.width) {
		player.velocity.x = 10
		player.rotation = 0.15
	} else {
		player.velocity.x = 0
		player.rotation = 0
	}
}

animate()

addEventListener('keydown', ({ key }) => {
	switch (key) {
		case 'a':
			console.log('left');
			keys.a.pressed = true
			break
		case 'd':
			console.log('right');
			keys.d.pressed = true
			break
		case ' ':
			console.log('space')
			console.log(projectiles)
			projectiles.push(
				new Projectile({
					position: {
						x: player.position.x + player.width / 2,
						y: player.position.y
					},
					velocity: {
						x: 0,
						y: -10
					}
				})
			)
			break
	}
})

addEventListener('keyup', ({ key }) => {
	switch (key) {
		case 'a':
			console.log('left');
			keys.a.pressed = false
			break
		case 'd':
			console.log('right');
			keys.d.pressed = false
			break
		case ' ':
			console.log('space');
			break
	}
})