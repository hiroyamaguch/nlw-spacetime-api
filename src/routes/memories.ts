import { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma'
import { z } from 'zod'

export async function memoriesRoutes(app: FastifyInstance) {
  app.get('/memories', async () => {
    const memories = await prisma.memory.findMany({
      orderBy: {
        createdAt: 'asc',
      },
    })

    return memories.map((memory) => {
      return {
        id: memory.id,
        coverURL: memory.coverURL,
        content: memory.content.substring(0, 115).concat('...'),
      }
    })
  })

  app.get('/memories/:id', async (request) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = paramsSchema.parse(request.params)

    const memory = await prisma.memory.findUniqueOrThrow({
      where: {
        id,
      },
    })

    return memory
  })

  app.post('/memories', async (request) => {
    const paramsSchema = z.object({
      content: z.string(),
      coverURL: z.string(),
      isPublic: z.coerce.boolean().default(false),
    })

    const { content, isPublic, coverURL } = paramsSchema.parse(request.body)

    const memory = await prisma.memory.create({
      data: {
        content,
        coverURL,
        isPublic,
        userId: 'ab8624f6-b4b6-4773-a5ce-0708fe1d5a8d',
      },
    })

    return memory
  })

  app.put('/memories/:id', async (request) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = paramsSchema.parse(request.params)

    const bodySchema = z.object({
      content: z.string(),
      coverURL: z.string(),
      isPublic: z.coerce.boolean().default(false),
    })

    const { content, isPublic, coverURL } = bodySchema.parse(request.body)

    const memory = await prisma.memory.update({
      where: {
        id,
      },
      data: {
        content,
        coverURL,
        isPublic,
        userId: 'ab8624f6-b4b6-4773-a5ce-0708fe1d5a8d',
      },
    })

    return memory
  })

  app.delete('/memories/:id', async (request) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = paramsSchema.parse(request.params)

    await prisma.memory.delete({
      where: {
        id,
      },
    })
  })
}
