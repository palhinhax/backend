import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  // 🔓 público
  @Get(':postId')
  getComments(@Param('postId') postId: string) {
    return this.commentService.getCommentsByPost(postId);
  }

  // 🔒 privado
  @UseGuards(JwtAuthGuard)
  @Post(':postId')
  addComment(
    @Param('postId') postId: string,
    @Req() req: { user: { userId: string } },
    @Body() body: { content: string },
  ) {
    return this.commentService.create(postId, req.user.userId, body.content);
  }
}
