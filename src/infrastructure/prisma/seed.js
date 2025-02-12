const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  // Insertion de quelques utilisateurs
  const user1 = await prisma.user.create({
    data: {
      username: 'player1',
      passwordHash: 'hashed_password_1', // Remplacez par un hash sécurisé
    }
  })

  const user2 = await prisma.user.create({
    data: {
      username: 'player2',
      passwordHash: 'hashed_password_2',
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
