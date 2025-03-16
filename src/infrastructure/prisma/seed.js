// This is the seed script.
// It creates:
//  • 1 ROOT user
//  • 3 ADMIN users
//  • 30 normal users
//  • 10 games
//  • Scores: one normal user plays all games, one plays none, and the others (plus admins and root) get random scores.

const { PrismaClient, Role } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');

async function main() {
  const saltRounds = 10;

  // Create ROOT user
  const rootUser = await prisma.user.create({
    data: {
      username: 'root',
      email: 'root@plai.com',
      passwordHash: await bcrypt.hash("root", saltRounds),
      role: Role.ROOT
    }
  });

  // Create 3 ADMIN users
  const adminData = [
    {
      username: 'Alice Johnson',
      email: 'alice.johnson@example.com',
      passwordHash: await bcrypt.hash("adminpass", saltRounds),
      role: Role.ADMIN
    },
    {
      username: 'Bob Smith',
      email: 'bob.smith@example.com',
      passwordHash: await bcrypt.hash("adminpass", saltRounds),
      role: Role.ADMIN
    },
    {
      username: 'Carol Davis',
      email: 'carol.davis@example.com',
      passwordHash: await bcrypt.hash("adminpass", saltRounds),
      role: Role.ADMIN
    }
  ];

  const adminUsers = [];
  for (const admin of adminData) {
    const createdAdmin = await prisma.user.create({ data: admin });
    adminUsers.push(createdAdmin);
  }

  // Create 30 normal users
  const normalUserNames = [
    "David Miller", "Emma Wilson", "Frank Garcia", "Grace Martinez", "Henry Robinson",
    "Isabella Clark", "Jack Lewis", "Karen Lee", "Larry Walker", "Monica Young",
    "Nathan Hall", "Olivia Allen", "Paul Hernandez", "Quincy King", "Rachel Wright",
    "Samuel Lopez", "Theresa Hill", "Ursula Scott", "Victor Green", "Wendy Adams",
    "Xavier Baker", "Yvonne Nelson", "Zachary Carter", "Aaron Mitchell", "Bethany Perez",
    "Cameron Roberts", "Diana Turner", "Ethan Phillips", "Fiona Campbell", "George Parker"
  ];

  const normalUsers = [];
  for (const name of normalUserNames) {
    // Create an email by converting the name to lower case and replacing spaces with dots.
    const email = name.toLowerCase().split(' ').join('.') + "@example.com";
    const user = await prisma.user.create({
      data: {
        username: name,
        email: email,
        passwordHash: await bcrypt.hash("userpass", saltRounds),
        role: Role.USER
      }
    });
    normalUsers.push(user);
  }

  // Create 10 games
  const gameData = [
    { name: 'Pac-Man', description: 'An arcade classic where you eat pellets while avoiding ghosts.' },
    { name: 'Tetris', description: 'A puzzle game with falling blocks.' },
    { name: 'Super Mario Bros', description: 'An iconic platformer from Nintendo.' },
    { name: 'The Legend of Zelda', description: 'An adventure and action game with puzzles.' },
    { name: 'Street Fighter II', description: 'A legendary fighting game.' },
    { name: 'Minecraft', description: 'A building and exploration game in an open world.' },
    { name: 'Doom', description: 'A first-person shooter that defined the genre.' },
    { name: 'Half-Life', description: 'A first-person shooter with a captivating story.' },
    { name: 'Final Fantasy VII', description: 'An iconic RPG with an epic story.' },
    { name: 'Call of Duty', description: 'A popular first-person shooter known for its multiplayer mode.' }
  ];  

  const games = [];
  for (const game of gameData) {
    const createdGame = await prisma.game.create({ data: game });
    games.push(createdGame);
  }

  // For scores, we want:
  //  • One normal user (first in normalUsers array: "David Miller") to play all games.
  //  • One normal user (second: "Emma Wilson") to play none.
  //  • For all other normal users, add a score for each game with a 50% chance.
  //  • Additionally, assign random scores for each game for admin users and root.

  // Assign scores for normal users
  for (let i = 0; i < normalUsers.length; i++) {
    const user = normalUsers[i];
    if (i === 0) {
      // "David Miller" plays all games.
      for (const game of games) {
        await prisma.score.create({
          data: {
            score: Math.floor(Math.random() * 10000),
            userId: user.id,
            gameId: game.id
          }
        });
      }
    } else if (i === 1) {
      // "Emma Wilson" plays none.
      continue;
    } else {
      // Other users: for each game, 50% chance to add a score.
      for (const game of games) {
        if (Math.random() < 0.5) {
          await prisma.score.create({
            data: {
              score: Math.floor(Math.random() * 10000),
              userId: user.id,
              gameId: game.id
            }
          });
        }
      }
    }
  }

  // Also assign random scores for each ADMIN user
  for (const admin of adminUsers) {
    for (const game of games) {
      if (Math.random() < 0.5) {
        await prisma.score.create({
          data: {
            score: Math.floor(Math.random() * 10000),
            userId: admin.id,
            gameId: game.id
          }
        });
      }
    }
  }

  // And assign random scores for the ROOT user
  for (const game of games) {
    if (Math.random() < 0.5) {
      await prisma.score.create({
        data: {
          score: Math.floor(Math.random() * 10000),
          userId: rootUser.id,
          gameId: game.id
        }
      });
    }
  }

  console.log('Seed Completed !');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
