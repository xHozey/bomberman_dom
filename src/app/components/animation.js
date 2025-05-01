import { SimpleJS } from "../../framework/index.js";
import { height, size, width } from "../App.js";
import { ws } from "../index.js";
import { checkDownMove, checkIfBombed, checkLeftMove, checkRightMove, checkUpperMove, getPosImg } from "./checker.js";
import { death } from "./helpers.js";

let resetMoves
export let animationID
export const lastTime = { current: 0 };
export const animateMovement = (currentTime) => {
	const delta = (currentTime - lastTime.current) / 1000;
	lastTime.current = currentTime;

	const grids = SimpleJS.state.grids
	let player = SimpleJS.state.players[SimpleJS.state.playerName].pObj

	if (player && player.lifes !== 0) {
		const oldX = player.x
		const oldY = player.y

		let checkObj;
		switch (true) {
			case player.moveDown:
				player.rowBot = Math.floor((player.y + player.speed * delta) / height);
				player.rowTop = Math.ceil((player.y + player.speed * delta) / height);
				player.colBot = Math.floor(player.x / width);
				player.colTop = Math.ceil(player.x / width);

				checkObj = checkDownMove(
					grids,
					player.rowTop,
					player.colBot,
					player.colTop,
					player,
					delta
				);
				player.x = checkObj[1];
				if (!checkObj[0]) {
					player.y += player.speed * delta;
				}

				clearTimeout(resetMoves)
				break;
			case player.moveLeft:
				player.rowBot = Math.floor(player.y / height);
				player.rowTop = Math.ceil(player.y / height);
				player.colBot = Math.floor((player.x - player.speed * delta) / width);
				player.colTop = Math.ceil((player.x - player.speed * delta) / width);
				checkObj = checkLeftMove(
					grids,
					player.rowBot,
					player.rowTop,
					player.colBot,
					player,
					delta
				);
				player.y = checkObj[1];
				if (!checkObj[0]) {
					player.x -= player.speed * delta;
				}

				clearTimeout(resetMoves)
				break;
			case player.moveUp:
				player.rowBot = Math.floor((player.y - player.speed * delta) / height);
				player.colBot = Math.floor(player.x / width);
				player.colTop = Math.ceil(player.x / width);
				checkObj = checkUpperMove(
					grids,
					player.rowBot,
					player.colBot,
					player.colTop,
					player,
					delta
				);
				player.x = checkObj[1];
				if (!checkObj[0]) {
					player.y -= player.speed * delta;
				}

				clearTimeout(resetMoves)
				break;
			case player.moveRight:
				player.rowBot = Math.floor(player.y / height);
				player.rowTop = Math.ceil(player.y / height);
				player.colTop = Math.ceil((player.x + player.speed * delta) / width);
				checkObj = checkRightMove(
					grids,
					player.rowBot,
					player.rowTop,
					player.colTop,
					player,
					delta
				);
				player.y = checkObj[1];
				if (!checkObj[0]) {
					player.x += player.speed * delta
				}

				clearTimeout(resetMoves)
				break;
			default:
				if (!resetMoves) {
					resetMoves = setTimeout(() => {
						ws.send(JSON.stringify({ type: "moves", playerName: SimpleJS.state.playerName, playerX: player.x / size, playerY: player.y / size, moveRight: player.moveRight, moveUp: player.moveUp, moveDown: player.moveDown, moveLeft: player.moveLeft }))
					}, 50)
				}
		}
		if (oldX != player.x || oldY != player.y) {
			ws.send(JSON.stringify({ type: "moves", playerName: SimpleJS.state.playerName, playerX: player.x / size, playerY: player.y / size, moveRight: player.moveRight, moveUp: player.moveUp, moveDown: player.moveDown, moveLeft: player.moveLeft }))
		}
	}


	Object.entries(SimpleJS.state.players).forEach(([playerName, { pObj }]) => {
		if (pObj && pObj.lifes !== 0) {
			pObj.bomberman.current.style.transform = `translate(${pObj.x}px, ${pObj.y}px)`;

			switch (true) {
				case pObj.moveDown:
					getPosImg(pObj.frames[pObj.loop], 4, pObj.bomberman.current);
					break;
				case pObj.moveLeft:
					getPosImg(pObj.frames[pObj.loop], 3, pObj.bomberman.current);
					break;
				case pObj.moveUp:
					getPosImg(pObj.frames[pObj.loop], 1, pObj.bomberman.current);
					break;
				case pObj.moveRight:
					getPosImg(pObj.frames[pObj.loop], 2, pObj.bomberman.current);
					break;

			}
			if (pObj.slow >= pObj.slowFrames) {
				if (pObj.loop < pObj.frames.length - 1) {
					pObj.loop++;
				} else {
					pObj.loop = 0;
				}


				pObj.slow = 0;
			} else {
				pObj.slow++;
			}
		}
		else {
			/*--- player death ---*/
			if (pObj) {
				SimpleJS.setState((prev) => {
					prev.players[playerName].pObj = undefined
					return prev

				})
			}
		}
	})



	if (player && player.lifes !== 0 &&
		checkIfBombed(grids, player.x, player.y) &&
		!player.immune
	) {
		death(player, player.bomberman.current);
		if (player.lifes !== 1) {
			ws.send(JSON.stringify({ type: "moves", playerName: SimpleJS.state.playerName, playerX: player.x / size, playerY: player.y / size, moveRight: player.moveRight, moveUp: player.moveUp, moveDown: player.moveDown, moveLeft: player.moveLeft }))

		}
		SimpleJS.setState((prev) => {
			prev.players[prev.playerName].pObj.lifes--
			return prev
		})
		ws.send(JSON.stringify({ type: "lifes", playerName: SimpleJS.state.playerName, lifes: SimpleJS.state.players[SimpleJS.state.playerName].pObj.lifes }))

	}


	animationID = requestAnimationFrame(animateMovement);
};
export const bomChecker = () => {
	let player = SimpleJS.state.players[SimpleJS.state.playerName].pObj

	if (player && player.lifes !== 0 &&
		checkIfBombed(SimpleJS.state.grids, player.x, player.y) &&
		!player.immune
	) {
		death(player, player.bomberman.current);
		if (player.lifes !== 1) {
			ws.send(JSON.stringify({ type: "moves", playerName: SimpleJS.state.playerName, playerX: player.x / size, playerY: player.y / size, moveRight: player.moveRight, moveUp: player.moveUp, moveDown: player.moveDown, moveLeft: player.moveLeft }))

		}
		SimpleJS.setState((prev) => {
			prev.players[prev.playerName].pObj.lifes--
			return prev
		})
		ws.send(JSON.stringify({ type: "lifes", playerName: SimpleJS.state.playerName, lifes: SimpleJS.state.players[SimpleJS.state.playerName].pObj.lifes }))

	}
}
