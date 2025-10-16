# Bingo Game API Endpoints

## Base URL
\`\`\`
Production: https://api.bingo-game.com/api
Development: http://localhost:8080/api
\`\`\`

## Authentication
All authenticated endpoints require a Bearer token in the Authorization header:
\`\`\`
Authorization: Bearer <jwt_token>
\`\`\`

## Endpoints

### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration  
- `POST /auth/logout` - User logout
- `POST /auth/refresh` - Refresh JWT token

### User Management
- `GET /users/profile` - Get user profile
- `PUT /users/profile` - Update user profile
- `GET /users/balance` - Get user balance
- `GET /users/transactions` - Get transaction history

### Room Management
- `GET /rooms` - Get all available rooms
- `GET /rooms/:id` - Get specific room details
- `POST /rooms` - Create new room (admin)
- `POST /rooms/:id/join` - Join a room
- `POST /rooms/:id/leave` - Leave a room
- `GET /rooms/:id/players` - Get room players
- `GET /rooms/:id/cards` - Get available cards

### Game Management
- `GET /game/:roomId/state` - Get current game state
- `POST /game/:roomId/start` - Start game (admin)
- `POST /game/:roomId/end` - End game (admin)
- `POST /game/:roomId/call` - Call next number (admin)
- `POST /game/:roomId/cards/:cardId/mark` - Mark card cell
- `POST /game/bingo` - Claim bingo
- `POST /game/:roomId/verify` - Verify bingo claim

### Payment Processing
- `POST /payments/charge` - Process payment
- `POST /payments/deposit` - Deposit funds
- `POST /payments/withdraw` - Withdraw funds
- `GET /payments/methods` - Get payment methods
- `POST /payments/game` - Process game entry fee
- `POST /payments/prize` - Distribute prize

### Admin Management
- `GET /admin/stats` - Get admin dashboard stats
- `GET /admin/rooms` - Get all rooms (admin view)
- `PUT /admin/rooms/:id` - Update room
- `DELETE /admin/rooms/:id` - Delete room
- `GET /admin/users` - Get all users
- `POST /admin/users/:id/ban` - Ban user
- `GET /admin/games` - Get game history

## WebSocket Connection
\`\`\`
Production: wss://api.bingo-game.com/ws/rooms/:roomId
Development: ws://localhost:8080/ws/rooms/:roomId
\`\`\`

### WebSocket Events
- `number_called` - New number called
- `bingo_claimed` - Player claimed bingo
- `game_started` - Game started
- `game_ended` - Game ended
- `player_joined` - Player joined room
- `player_left` - Player left room
- `room_updated` - Room status updated
