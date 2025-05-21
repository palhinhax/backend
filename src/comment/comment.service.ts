import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CommentService {
  constructor(private readonly prisma: PrismaService) {}

  async create(postId: string, userId: string, content: string): Promise<any> {
    // Alterei o tipo para 'any' ou pode ser 'unknown' também
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      throw new NotFoundException('Post não encontrado');
    }

    // Agora, 'await' garante que o valor resolvido será retornado
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    const response = await this.prisma.comment.create({
      data: {
        content,
        postId,
        authorId: userId,
      },
    });

    return response; // A resposta é do tipo inferido automaticamente pelo Prisma
  }

  async getCommentsByPost(postId: string): Promise<any[]> {
    // Mesma coisa aqui
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const response = await this.prisma.comment.findMany({
      where: { postId },
      orderBy: { createdAt: 'asc' },
      include: {
        author: {
          select: { name: true, email: true },
        },
      },
    });

    if (!response) {
      throw new NotFoundException('Post não encontrado');
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return response;
  }
}
