// import type { GameRoom, GameSession, GamePlayer, GameWinner } from "./types"
// import { generateUniqueCards, validateBingo, getRandomNumber } from "./helpers"

// class GameStateManager {
//   private rooms: Map<string, GameRoom> = new Map()
//   private games: Map<string, GameSession> = new Map()
//   private playerSessions: Map<string, string> = new Map() // playerId -> roomId

//   // Room management
//   createRoom(roomData: {
//     id: string
//     name: string
//     fee: number
//     capacity: number
//     nextStartAt?: string
//   }): GameRoom {
//     const cardCount = roomData.fee === 10 ? 200 : 50 // More cards for $10 rooms
//     const availableCards = generateUniqueCards(cardCount)

//     const room: GameRoom = {
//       ...roomData,
//       status: "open",
//       players: [],
//       availableCards,
//       createdAt: new Date().toISOString(),
//     }

//     this.rooms.set(room.id, room)
//     return room
//   }

//   getRoom(roomId: string): GameRoom | null {
//     return this.rooms.get(roomId) || null
//   }

//   getAllRooms(): GameRoom[] {
//     return Array.from(this.rooms.values())
//   }

//   // Player management
//   joinRoom(roomId: string, playerId: string, playerName: string, cardIds: string[]): boolean {
//     const room = this.rooms.get(roomId)
//     if (!room || room.status !== "open" || room.players.length >= room.capacity) {
//       return false
//     }

//     // Check if player already in room
//     if (room.players.some((p) => p.playerId === playerId)) {
//       return false
//     }

//     // Get selected cards
//     const selectedCards = room.availableCards.filter((card) => cardIds.includes(card.id))
//     if (selectedCards.length !== cardIds.length) {
//       return false
//     }

//     const player: GamePlayer = {
//       playerId,
//       name: playerName,
//       cards: selectedCards,
//       markedNumbers: {},
//       isReady: false,
//       joinedAt: new Date().toISOString(),
//     }

//     room.players.push(player)
//     this.playerSessions.set(playerId, roomId)

//     // Remove selected cards from available pool
//     room.availableCards = room.availableCards.filter((card) => !cardIds.includes(card.id))

//     return true
//   }

//   leaveRoom(roomId: string, playerId: string): boolean {
//     const room = this.rooms.get(roomId)
//     if (!room) return false

//     const playerIndex = room.players.findIndex((p) => p.playerId === playerId)
//     if (playerIndex === -1) return false

//     const player = room.players[playerIndex]

//     // Return cards to available pool if game hasn't started
//     if (room.status === "open") {
//       room.availableCards.push(...player.cards)
//     }

//     room.players.splice(playerIndex, 1)
//     this.playerSessions.delete(playerId)

//     return true
//   }

//   // Game management
//   startGame(roomId: string): GameSession | null {
//     const room = this.rooms.get(roomId)
//     if (!room || room.status !== "open" || room.players.length === 0) {
//       return null
//     }

//     const gameId = `game_${roomId}_${Date.now()}`
//     const totalPrize = room.fee * room.players.length * 0.9 // 90% of entry fees as prize

//     const game: GameSession = {
//       gameId,
//       roomId,
//       status: "active",
//       calledNumbers: [],
//       winners: [],
//       startedAt: new Date().toISOString(),
//       totalPrize,
//     }

//     room.status = "in-game"
//     room.game = game
//     this.games.set(gameId, game)

//     return game
//   }

//   callNumber(roomId: string): { number: number; letter: string } | null {
//     const room = this.rooms.get(roomId)
//     if (!room?.game || room.game.status !== "active") {
//       return null
//     }

//     const availableNumbers = []
//     for (let i = 1; i <= 75; i++) {
//       if (!room.game.calledNumbers.includes(i)) {
//         availableNumbers.push(i)
//       }
//     }

//     if (availableNumbers.length === 0) {
//       return null
//     }

//     const number = getRandomNumber(availableNumbers)
//     room.game.calledNumbers.push(number)
//     room.game.currentNumber = number

//     const letter = this.getLetterForNumber(number)
//     return { number, letter }
//   }

//   markCard(roomId: string, playerId: string, cardId: string, number: number): boolean {
//     const room = this.rooms.get(roomId)
//     if (!room?.game) return false

//     const player = room.players.find((p) => p.playerId === playerId)
//     if (!player) return false

//     const card = player.cards.find((c) => c.id === cardId)
//     if (!card) return false

//     // Check if number was called
//     if (!room.game.calledNumbers.includes(number)) return false

//     // Mark the number on the card
//     if (!player.markedNumbers[cardId]) {
//       player.markedNumbers[cardId] = []
//     }

//     if (!player.markedNumbers[cardId].includes(number)) {
//       player.markedNumbers[cardId].push(number)
//     }

//     return true
//   }

//   claimBingo(roomId: string, playerId: string, cardId: string, pattern: string): { valid: boolean; prize?: number } {
//     const room = this.rooms.get(roomId)
//     if (!room?.game || room.game.status !== "active") {
//       return { valid: false }
//     }

//     const player = room.players.find((p) => p.playerId === playerId)
//     if (!player) return { valid: false }

//     const card = player.cards.find((c) => c.id === cardId)
//     if (!card) return { valid: false }

//     const markedNumbers = player.markedNumbers[cardId] || []
//     const isValid = validateBingo(card, markedNumbers, room.game.calledNumbers, pattern)

//     if (isValid) {
//       const prize = room.game.totalPrize / (room.game.winners.length + 1)

//       const winner: GameWinner = {
//         playerId,
//         cardId,
//         pattern,
//         prize,
//         claimedAt: new Date().toISOString(),
//       }

//       room.game.winners.push(winner)

//       // End game if we have a winner (can be modified for multiple winners)
//       if (room.game.winners.length === 1) {
//         room.game.status = "finished"
//         room.game.endedAt = new Date().toISOString()
//         room.status = "finished"
//       }

//       return { valid: true, prize }
//     }

//     return { valid: false }
//   }

//   getGameState(roomId: string): GameSession | null {
//     const room = this.rooms.get(roomId)
//     return room?.game || null
//   }

//   getRoomSnapshot(roomId: string, playerId?: string): any {
//     const room = this.rooms.get(roomId)
//     if (!room) return null

//     const player = playerId ? room.players.find((p) => p.playerId === playerId) : null

//     return {
//       room: {
//         id: room.id,
//         name: room.name,
//         fee: room.fee,
//         capacity: room.capacity,
//         status: room.status,
//         playerCount: room.players.length,
//         nextStartAt: room.nextStartAt,
//       },
//       game: room.game,
//       isJoined: !!player,
//       userCards: player?.cards || [],
//       calledNumbers: room.game?.calledNumbers || [],
//       winners: room.game?.winners || [],
//     }
//   }

//   private getLetterForNumber(number: number): string {
//     if (number <= 15) return "B"
//     if (number <= 30) return "I"
//     if (number <= 45) return "N"
//     if (number <= 60) return "G"
//     return "O"
//   }

//   // Cleanup methods
//   cleanup(): void {
//     // Remove finished games older than 1 hour
//     const oneHourAgo = Date.now() - 60 * 60 * 1000

//     for (const [roomId, room] of this.rooms.entries()) {
//       if (room.status === "finished" && room.game?.endedAt) {
//         const endTime = new Date(room.game.endedAt).getTime()
//         if (endTime < oneHourAgo) {
//           this.rooms.delete(roomId)
//           if (room.game) {
//             this.games.delete(room.game.gameId)
//           }
//         }
//       }
//     }
//   }
// }

// export const gameState = new GameStateManager()

// // Initialize some test rooms
// gameState.createRoom({
//   id: "test-room-1",
//   name: "$10 Test Room (Auto-Play)",
//   fee: 10,
//   capacity: 100,
//   nextStartAt: new Date(Date.now() + 30000).toISOString(),
// })

// gameState.createRoom({
//   id: "room-10-1",
//   name: "$10 Bingo Room",
//   fee: 10,
//   capacity: 100,
//   nextStartAt: new Date(Date.now() + 120000).toISOString(),
// })

// gameState.createRoom({
//   id: "room-20-1",
//   name: "$20 High Stakes",
//   fee: 20,
//   capacity: 50,
//   nextStartAt: new Date(Date.now() + 300000).toISOString(),
// })
