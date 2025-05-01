import { SimpleJS } from '../framework/index.js'
import { Game, intervalID, size, startBombCheck } from './App.js'
import { animationID, lastTime } from './components/animation.js'
import { Bomb } from './components/bomb.js'
import { Lobby } from './Lobby.js'
import { Home } from './Home.js'

SimpleJS.state = {
  bombs: [],
  powers: [],
  grids: [],
  fires: [],
  playerCount: 0,
  playerName: '',
  players: {},
  chat: [],
  diffMap: [],
  currentPage: "",
  error: ""
}

SimpleJS.addRoute('/', Home)
SimpleJS.addRoute('/lobby', Lobby)
SimpleJS.addRoute('/game', Game)
SimpleJS.addRoute('/notfound', () => {
  return SimpleJS.createElement('div', {}, ['error 404'])
})

const component = SimpleJS.routes[window.location.pathname]
if (component) {
  SimpleJS.mount(component)
}

export const ws = new WebSocket('/')

ws.onopen = () => {
  console.log('you are connected to the server')
}

const bombUsers = new Bomb(true)
let resetMoves

ws.onmessage = event => {
  const {
    type,
    content,
    playerCount,
    playerName,
    boombX,
    boombY,
    cls,
    diffMap,
    playerX,
    playerY,
    moveUp,
    moveRight,
    moveLeft,
    moveDown,
    timer,
    message,
    expCount,
    row,
    col,
    lifes,
    playerNames,
  } = JSON.parse(event.data)

  switch (type) {
    case 'error':
      SimpleJS.setState(prev => ({
        ...prev,
        error: content
      }))
      break
    //CHANGE
    case 'appendQueue':
      SimpleJS.setState(prev => ({
        ...prev,
        playerCount,
        playerName: prev.playerName ? prev.playerName : playerName,
        error: "",
      }))
      if (location.pathname !== '/lobby') {
        SimpleJS.state.currentPage = "/lobby"
        SimpleJS.Link('/lobby')
      }
      break
    case 'ModifyQueue':
      SimpleJS.setState(prev => ({
        ...prev,
        playerCount,
      }))
      break
    case 'startGame':
      SimpleJS.state.players = cls
      SimpleJS.state.playerNames = playerNames
      SimpleJS.state.diffMap = diffMap
      if (location.pathname !== '/game') {
        SimpleJS.state.currentPage = "/game"
        SimpleJS.Link('/game')
      }
    case 'startTime':
      SimpleJS.setState(prev => ({ ...prev, timer }))
      break
    case 'moves':
      SimpleJS.state.players[playerName].pObj.x = playerX * size
      SimpleJS.state.players[playerName].pObj.y = playerY * size
      SimpleJS.state.players[playerName].pObj.moveUp = moveUp
      SimpleJS.state.players[playerName].pObj.moveDown = moveDown
      SimpleJS.state.players[playerName].pObj.moveLeft = moveLeft
      SimpleJS.state.players[playerName].pObj.moveRight = moveRight

      clearTimeout(resetMoves)
      resetMoves = setTimeout(() => {
        if (SimpleJS.state.players[playerName] && SimpleJS.state.players[playerName].pObj) {
          SimpleJS.state.players[playerName].pObj.moveDown = false
          SimpleJS.state.players[playerName].pObj.moveLeft = false
          SimpleJS.state.players[playerName].pObj.moveUp = false
          SimpleJS.state.players[playerName].pObj.moveRight = false
        }
      }, 50)
      break
    case 'boomb':
      bombUsers.putTheBomb(boombX * size, boombY * size, expCount)
      break
    case 'powerups':
      SimpleJS.state.grids[row][col].power = "";
      SimpleJS.setState((prev) => ({
        ...prev,
        powers: prev.powers.filter((p) => p.id !== SimpleJS.state.grids[row][col].id),
      }));
      break
    case 'newMessage':
      SimpleJS.setState((prev) => {
        return {
          ...prev, chat: [...prev.chat, { playerName, message }]
        }
      })

      break
    case 'lifes':
      SimpleJS.setState((prev) => {
        if (prev.players[playerName]) {
          prev.players[playerName].pObj.lifes = lifes
        }
        return prev
      })
      break
    case "win":
      setTimeout(() => {
        const text = playerName + " has won"
        alert(text)
        SimpleJS.state = {
          bombs: [],
          powers: [],
          grids: [],
          fires: [],
          playerCount: 0,
          playerName: '',
          diffMap: [],
          players: {},
          chat: [],
          currentPage: "",
        }
        cancelAnimationFrame(animationID)
        startBombCheck.current = false
        lastTime.current = 0
        clearInterval(intervalID)


        SimpleJS.Link("/")
      }, 200)
      //location.href = "/"
      break
  }
}

ws.onclose = () => {
  console.log('Disconnected from server')
}

ws.onerror = error => {
  console.error('WebSocket error:', error)
}
