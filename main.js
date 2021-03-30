const image = new Image();
image.src = 'image.jpg'

image.addEventListener('load', function () {
    const canvas = document.getElementById('main-canvas')
    const context = canvas.getContext('2d')
    
    canvas.width = 1920
    canvas.height = 1080

    context.drawImage(image, 0, 0, canvas.width, canvas.height)

    let particleArray = []
    let mappedImage = []
    const pixels = context.getImageData(0, 0, canvas.width, canvas.height)
    const numberOfParticles = 2500;

    context.clearRect(0, 0, canvas.width, canvas.height)

    for (let y = 0; y < canvas.height; y++) {
        let row = []

        for (let x = 0; x < canvas.width; x++) {
            const red = pixels.data[(y * 4 * pixels.width) + (x * 4)]
            const green = pixels.data[(y * 4 * pixels.width) + (x * 4 + 1)]
            const blue = pixels.data[(y * 4 * pixels.width) + (x * 4 + 2)]
            const brightness = caculateRelativeBrightness(red, green, blue)
            const cell = [cellBrightness = brightness]
            row.push(cell)
        }

        mappedImage.push(row)
    }
    
    function caculateRelativeBrightness(red, green, blue) {
        return Math.sqrt(
            (red ** 2) * 0.299 + 
            (green ** 2) * 0.587 + 
            (blue ** 2) * 0.114
        ) / 200
    }

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width
            this.y = 0
            this.speed = 0
            this.velocity = Math.random() * 3.5
            this.size = Math.random() * 1.5 + 1
            this.position1 = Math.floor(this.y)
            this.position2 = Math.floor(this.x)
        }
        
        update() {
            this.position1 = Math.floor(this.y)
            this.position2 = Math.floor(this.x)
            this.speed = mappedImage[this.position1][this.position2][0]

            let movement = (3.5 - this.speed) + this.velocity

            this.y += movement

            if (this.y >= canvas.height) {
                this.x = Math.random() * canvas.width
                this.y = 0;
            }
        }

        draw() {
            context.beginPath()
            context.fillStyle = 'white'
            context.arc(this.x, this.y, this.size, 0, Math.PI * 2)
            context.fill()
        }
    }

    function init() {
        for (let i = 0; i < numberOfParticles; i++) {
            particleArray.push(new Particle)
        }
    }

    init()

    function animate() {
        context.globalAlpha = 0.05
        context.fillStyle = 'rgb(0, 0, 0)'
        context.fillRect(0, 0, canvas.width, canvas.height)
        context.globalAlpha = 0.2

        for (let i = 0; i < particleArray.length; i++) {
            particleArray[i].update()
            context.globalAlpha = particleArray[i].speed * 0.5
            particleArray[i].draw()
        }

        requestAnimationFrame(animate)
    }

    animate()
})