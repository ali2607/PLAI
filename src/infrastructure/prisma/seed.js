// This is your updated Prisma seed file.
// It creates:
//  • 1 ROOT user
//  • 3 ADMIN users with realistic names
//  • 30 normal users with realistic full names
//  • 10 games with real game names
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

  // Create 3 ADMIN users with realistic names
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

  // Create 30 normal users with realistic full names
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

  // Create 10 games with real game names
  const gameData = [
    { name: 'Pac-Man', description: 'Un classique de l’arcade où vous mangez des pastilles en évitant les fantômes.' },
    { name: 'Tetris', description: 'Un jeu de puzzle avec des blocs qui tombent.' },
    { name: 'Super Mario Bros', description: 'Un jeu de plateforme emblématique de Nintendo.' },
    { name: 'The Legend of Zelda', description: "Un jeu d'aventure et d'action avec des énigmes." },
    { name: 'Street Fighter II', description: 'Un jeu de combat légendaire.' },
    { name: 'Minecraft', description: 'Un jeu de construction et d’exploration en monde ouvert.' },
    { name: 'Doom', description: 'Un jeu de tir à la première personne qui a défini le genre.' },
    { name: 'Half-Life', description: 'Un jeu de tir à la première personne avec une histoire captivante.' },
    { name: 'Final Fantasy VII', description: 'Un RPG emblématique avec une histoire épique.' },
    { name: 'Call of Duty', description: 'Un jeu de tir à la première personne populaire pour son mode multijoueur.' }
  ];

  const games = [];
  for (const game of gameData) {
    const createdGame = await prisma.game.create({ data: game });
    games.push(createdGame);
  }

  // Combine all users into a single array for score assignments
  const allUsers = [rootUser, ...adminUsers, ...normalUsers];

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

  console.log('Seed effectué avec succès !');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
