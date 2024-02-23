import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const newArtist = await prisma.userDemo.create({
        data: {
            name: 'Osinachi Kalu',
            email: 'sinach@sinachmusic.com',
          
        },
    })
    console.log('Created new artist: ', newArtist)

    const allArtists = await prisma.userDemo.findMany({})
    console.log('All artists: ')
    console.dir(allArtists, { depth: null })
}

main()
    .catch((e) => console.error(e))
    .finally(async() => await prisma.$disconnect())