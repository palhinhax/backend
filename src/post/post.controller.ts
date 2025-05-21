import {
  Controller,
  Get,
  Post as HttpPost,
  Body,
  UseGuards,
  Req,
  Put,
  Param,
  Delete,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PostService } from './post.service';

@Controller('posts')
export class PostController {
  constructor(private postService: PostService) {}

  // 🔓 Rota pública
  @Get('feed')
  getPublicFeed() {
    return this.postService.getPublicFeed();
  }

  // 🔒 Rotas privadas
  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMyPosts(@Req() req: { user: { userId: string } }) {
    return this.postService.getMyPosts(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @HttpPost()
  createPost(
    @Req() req: { user: { userId: string } },
    @Body() body: { title: string; content: string; image?: string },
  ) {
    return this.postService.create(req.user.userId, body);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  updatePost(
    @Param('id') id: string,
    @Req() req: { user: { userId: string } },
    @Body() body: { title?: string; content?: string; image?: string },
  ) {
    return this.postService.update(req.user.userId, id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  deletePost(
    @Param('id') id: string,
    @Req() req: { user: { userId: string } },
  ) {
    return this.postService.delete(req.user.userId, id);
  }
}
