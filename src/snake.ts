type SnakePart = {
	x: number;
	y: number;
};

type Snake = SnakePart[];

type Direction = {
	x: number;
	y: number;
};

type PossibleDirections = {
	Up: Direction;
	Down: Direction;
	Left: Direction;
	Right: Direction;
};

type Food = {
	x: number;
	y: number;
};

class SnakeGame {
	private canvas: HTMLCanvasElement;
	private ctx: CanvasRenderingContext2D;
	private snake: Snake = [
		{ x: 100, y: 100 },
		{ x: 110, y: 100 },
		{ x: 120, y: 100 },
		{ x: 130, y: 100 },
		{ x: 140, y: 100 },
	];
	private snakeSize: number = 10;
	private snakeHead: SnakePart;
	private possibleDirections: PossibleDirections;
	private direction: Direction;
    private gameInterval: number = 0;
    private food: Food;
    private msgBox: HTMLDivElement;
    private directionHasChanged: boolean = false;

	constructor() {
		this.canvas = <HTMLCanvasElement>document.getElementById('canvas');
		this.ctx = <CanvasRenderingContext2D>this.canvas.getContext('2d');
		this.msgBox = <HTMLDivElement>document.getElementById('message-box');
		this.snakeHead = this.snake[this.snake.length - 1];
		this.possibleDirections = {
			Up: { x: 0, y: -this.snakeSize },
			Down: { x: 0, y: this.snakeSize },
			Left: { x: -this.snakeSize, y: 0 },
			Right: { x: this.snakeSize, y: 0 },
		};
		this.direction = this.possibleDirections.Right;
        this.initGame();
    }

    initGame() {
        this.paintGrid();
        const waitTime: number = 3;
        let counter: number = 0;
        let interval: number = setInterval(() => {
            if (counter < waitTime) {
                this.showMessage(waitTime - counter);
            } else {
                clearInterval(interval);
                this.hideMessage();
                this.runGame();
            }
            counter++;
        }, 1000);
    }

    runGame() {
        this.initFood();
		this.runSnake();
		this.initEventsListeners();
    }

    showMessage(msg: string | number) {
        this.msgBox.style.display = 'flex';
        this.msgBox.textContent = `${msg}`;
    }

    hideMessage() {
        this.msgBox.style.display = 'none';
        this.msgBox.textContent = '';
    }

	initEventsListeners() {
		document.addEventListener('keydown', this.changeDirection.bind(this));
	}

	changeDirection(e: KeyboardEvent) {
        if (this.directionHasChanged) return;
        this.directionHasChanged = true;
		switch (e.key) {
			case 'ArrowUp':
				if (!Math.abs(this.direction.y)) this.direction = this.possibleDirections.Up;
				break;
			case 'ArrowRight':
				if (!Math.abs(this.direction.x)) this.direction = this.possibleDirections.Right;
				break;
			case 'ArrowDown':
				if (!Math.abs(this.direction.y)) this.direction = this.possibleDirections.Down;
				break;
			case 'ArrowLeft':
				if (!Math.abs(this.direction.x)) this.direction = this.possibleDirections.Left;
				break;
		}
	}

	paintGrid() {
		for (let x: number = 0; x <= 600; x += 10) {
			this.ctx.moveTo(x, 0);
			this.ctx.lineTo(x, 600);
		}

		for (let y: number = 0; y <= 600; y += 10) {
			this.ctx.moveTo(0, y);
			this.ctx.lineTo(600, y);
		}

		this.ctx.strokeStyle = '#505768';
		this.ctx.stroke();
	}

	paintSnake() {
		this.ctx.fillStyle = '#0bf45a';
		this.snake.forEach((snakePart) => {
			this.ctx.fillRect(snakePart.x, snakePart.y, this.snakeSize, this.snakeSize);
		});
	}

	initSnakeHead() {
		const oldSnakeHead = this.snake[this.snake.length - 1];
		const newSnakeHead = {
			x: oldSnakeHead.x + this.direction.x,
			y: oldSnakeHead.y + this.direction.y,
		};
		this.snakeHead = newSnakeHead;
	}

	moveSnake() {
		this.snake.shift();
		this.snake.push(this.snakeHead);
    }

    initFood() {
        const xMax = (this.canvas.width - this.snakeSize) / this.snakeSize;
        const yMax = (this.canvas.height - this.snakeSize) / this.snakeSize;
        const foodX = (Math.floor(Math.random() * (xMax + 1))) * this.snakeSize;
        const foodY = (Math.floor(Math.random() * (yMax + 1))) * this.snakeSize;
        this.food = { x: foodX, y: foodY };
    }

    paintFood() {
        this.ctx.fillStyle = '#057755';
		this.ctx.fillRect(this.food.x, this.food.y, this.snakeSize, this.snakeSize);
    }

	checkWallCollision() {
		const topWallCollision = this.snakeHead.y < 0;
		const bottomWallCollision = this.snakeHead.y + this.snakeSize > this.canvas.height;
		const rightWallCollision = this.snakeHead.x + this.snakeSize > this.canvas.width;
		const leftWallCollision = this.snakeHead.x < 0;

		if (topWallCollision || bottomWallCollision || rightWallCollision || leftWallCollision) {
			this.stopGame();
		}
	}

	checkSelfCollision() {
		const collision = this.snake.some((snakePart) => this.snakeHead.x === snakePart.x && this.snakeHead.y === snakePart.y);
		if (collision) this.stopGame();
    }

    checkFoodCollision() {
        const collision = this.snakeHead.x === this.food.x && this.snakeHead.y === this.food.y;
		if (collision) {
            this.increaseSnake();
            this.initFood();
        }
    }

    increaseSnake() {
        this.snake.unshift(this.food);
    }

	runSnake() {
		this.gameInterval = setInterval(() => {
			this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
			this.paintGrid();
			this.paintFood();
            this.initSnakeHead();
			this.checkWallCollision();
			this.checkSelfCollision();
			this.checkFoodCollision();
			if (this.gameInterval) this.moveSnake();
            this.paintSnake();
            this.directionHasChanged = false;
		}, 100);
	}

	stopGame() {
		clearInterval(this.gameInterval);
        this.gameInterval = 0;
        this.showMessage('Game Over');
	}
}

new SnakeGame();
