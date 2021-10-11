/*
  Code modified from:
  http://www.lostdecadegames.com/how-to-make-a-simple-html5-canvas-game/
  using graphics purchased from vectorstock.com
*/

/* Initialization.
Here, we create and add our "canvas" to the page.
We also load all of our images.
*/
// const myStorage = window.localStorage;
// myStorage.setItem(`applicationState`);

const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
canvas.width = 512;
canvas.height = 480;
document.getElementById('canvas').appendChild(canvas);
const score = document.getElementById(`score`);
const highScore = document.getElementById(`highScore`);
//
let currentScore, totalScore;
currentScore = 0;
totalScore = 0;
let usernameList = document.getElementById(`usernameList`);
//TAKE USERNAME INPUT
function inputName() {
	let str = document.getElementById(`input`).value;
	let listOfNames = document.getElementById(`listOfNames`);
	usernameList = document.createTextNode(`${str}`);
	listOfNames.appendChild(usernameList);

	// alert(`Value inside the box is ${str}`);
}

let bg = {};
// APPLICATION STATE
// const applicationState = {
// 	isGameOver: false,
// 	currentUser: 'jDubs24',
// 	highScore: {
// 		score: 34,
// 		user: 'jDubs24',
// 		date: new Date(),
// 	},
// 	gameHistory: [{ user: null, score: 0, date: null }],
// };
//
function reset() {
	document.body.style.backgroundColor = 'rgb(0, 98, 128)';
	score.innerText = 0;
	highScore += currentScore;
	main();
}
document.getElementById(`btn`).addEventListener(`click`, reset);
/**
 * Setting up our characters.
 *
 * Note that hero.x represents the X position of our hero.s
 * hero.y represents the Y position.
 * We'll need these values to know where to "draw" the hero.
 * The same goes for the monsters
 *
 */

let hero = { x: canvas.width / 2, y: canvas.height / 2 };
let monsters = [
	{ x: 400, y: 100 },
	{ x: 100, y: 200 },
	{ x: 300, y: 200 },
];

let startTime = Date.now();
const SECONDS_PER_ROUND = 10;
let elapsedTime = 0;

function loadImages() {
	bg.image = new Image();

	bg.image.onload = function () {
		// show the background image
		bg.ready = true;
	};
	bg.image.src = 'images/background.png';
	hero.image = new Image();
	hero.image.onload = function () {
		// show the hero image
		hero.ready = true;
	};
	hero.image.src = 'images/hero.png';

	monsters.forEach((monster, i) => {
		monster.image = new Image();
		monster.image.onload = function () {
			// show the monster image
			monster.ready = true;
		};
		monster.image.src = `images/monster_${i + 1}.png`;
	});
}

/**
 * Keyboard Listeners
 * You can safely ignore this part, for now.
 *
 * This is just to let JavaScript know when the user has pressed a key.
 */
let keysPressed = {};
function setupKeyboardListeners() {
	// Check for keys pressed where key represents the keycode captured
	// For now, do not worry too much about what's happening here.
	document.addEventListener(
		'keydown',
		function (e) {
			keysPressed[e.key] = true;
		},
		false
	);

	document.addEventListener(
		'keyup',
		function (e) {
			keysPressed[e.key] = false;
		},
		false
	);
}

/**
 *  Update game objects - change player position based on key pressed
 *  and check to see if the monster has been caught!
 *
 *  If you change the value of 5, the player will move at a different rate.
 */

let update = function () {
	// Update the time.
	elapsedTime = Math.floor((Date.now() - startTime) / 1000);

	if (keysPressed['ArrowUp']) {
		hero.y -= 5;
		if (hero.y === -80) {
			console.log(`test 1`);
			hero.y = hero.y + 550;
		}
	}
	if (keysPressed['ArrowDown']) {
		hero.y += 5;
		if (hero.y > 500) {
			console.log(`test 2`);
			hero.y = hero.y = 0;
			console.log(hero.y);
		}
	}
	if (keysPressed['ArrowLeft']) {
		hero.x -= 5;
		if (hero.x < -20) {
			console.log(`test 3`);
			hero.x = hero.y + 300;
		}
	}
	if (keysPressed['ArrowRight']) {
		hero.x += 5;
		if (hero.x > 550) 
			console.log(`test 4`);
			hero.x = hero.x = 0;
		}
	}

	// Check if player and monster collided. Our images
	// are 32 pixels big.
	monsters.forEach((monster) => {
		if (
			hero.x <= monster.x + 32 &&
			monster.x <= hero.x + 32 &&
			hero.y <= monster.y + 32 &&
			monster.y <= hero.y + 32
		) {
			console.log('The Current Score is : ' + currentScore);
			console.log('The Total Score is : ' + totalScore); // Pick a new location for the monster.
			// Note: Change this to place the monster at a new, random location.
			monster.x = randomlyPlace('x');
			monster.y = randomlyPlace('y');
			currentScore++;
			score.innerHTML = currentScore;
		}
		if (SECONDS_PER_ROUND - elapsedTime === 0) {
			monster.x = -50;
			monster.y = -50;
			document.body.style.backgroundColor = 'red';
			console.log(`Game over!  Your score was ${currentScore}`);
			highScore.innerHTML = currentScore;
		}
	});
};
function randomlyPlace(axis) {
	if (axis === 'x') {
		return Math.floor(Math.random() * canvas.width - 20);
	} else {
		return Math.floor(Math.random() * canvas.height - 20);
	}
}
//

/**
 * This function, render, runs as often as possible.
 */
function render() {
	if (bg.ready) {
		ctx.drawImage(bg.image, 0, 0);
	}
	if (hero.ready) {
		ctx.drawImage(hero.image, hero.x, hero.y);
	}
	monsters.forEach((monster) => {
		if (monster.ready) {
			ctx.drawImage(monster.image, monster.x, monster.y);
		}
	});
	ctx.fillText(`Seconds Remaining: ${SECONDS_PER_ROUND - elapsedTime}`, 50, 50);
	if (SECONDS_PER_ROUND - elapsedTime === 0) {
		ctx.fillText(`TIME OUT`);
	}
}
function drawMonster() {
	ctx.drawImage(monster.image, monster.x, monster.y);
}
/**
 * The main game loop. Most every game will have two distinct parts:
 * update (updates the state of the game, in this case our hero and monster)
 * render (based on the state of our game, draw the right things)
 */
function main() {
	update();
	render();

	// Request to do this again ASAP. This is a special method
	// for web browsers.
	requestAnimationFrame(main);
}

// Cross-browser support for requestAnimationFrame.
// Safely ignore this line. It's mostly here for people with old web browsers.
var w = window;
requestAnimationFrame =
	w.requestAnimationFrame ||
	w.webkitRequestAnimationFrame ||
	w.msRequestAnimationFrame ||
	w.mozRequestAnimationFrame;

// Let's play this game!
loadImages();
setupKeyboardListeners();

main();
