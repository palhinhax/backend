import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PostService {
  constructor(private prisma: PrismaService) {}

  create(
    userId: string,
    data: { title: string; content: string; image?: string },
  ) {
    return this.prisma.post.create({
      data: {
        ...data,
        authorId: userId,
      },
    });
  }

  getMyPosts(userId: string) {
    return this.prisma.post.findMany({
      where: { authorId: userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async update(
    userId: string,
    postId: string,
    data: { title?: string; content?: string; image?: string },
  ) {
    const post = await this.prisma.post.findUnique({ where: { id: postId } });

    if (!post) throw new NotFoundException('Post não encontrado');
    if (post.authorId !== userId)
      throw new ForbiddenException('Não autorizado');

    return this.prisma.post.update({
      where: { id: postId },
      data,
    });
  }

  async delete(userId: string, postId: string) {
    const post = await this.prisma.post.findUnique({ where: { id: postId } });

    if (!post) throw new NotFoundException('Post não encontrado');
    if (post.authorId !== userId)
      throw new ForbiddenException('Não autorizado');

    return this.prisma.post.delete({ where: { id: postId } });
  }

  getPublicFeed() {
    return this.prisma.post.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: { name: true, email: true },
        },
      },
    });
  }
}
