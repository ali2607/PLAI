const { PrismaClient , Role} = require('@prisma/client')
const prisma = new PrismaClient()
const bcrypt = require('bcrypt');

async function main() {
  // Insertion de quelques utilisateurs
  // Création du compte ROOT
  const saltRounds = 10;
  const rootUser = await prisma.user.create({
    data: {
      username: 'root',
      passwordHash: await bcrypt.hash("root", saltRounds),
      role: Role.ROOT
    }
  })

  
  const user1 = await prisma.user.create({
    data: {
      username: 'player1',
      passwordHash:  await bcrypt.hash("test", saltRounds),
    }
  })

  const user2 = await prisma.user.create({
    data: {
      username: 'player2',
      passwordHash: await bcrypt.hash("test", saltRounds),
    }
  })

  // Insertion de quelques jeux
  const game1 = await prisma.game.create({
    data: {
      name: 'Pac-Man',
      description: 'Un classique de l’arcade où vous mangez des pastilles en évitant les fantômes.',
    }
  })

  const game2 = await prisma.game.create({
    data: {
      name: 'Tetris',
      description: 'Un jeu de puzzle avec des blocs qui tombent.',
    }
  })

  console.log('Seed effectué avec succès !')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
