import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  Query,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Posts } from 'src/schemas/post.schema';
import { UserService } from 'src/user/user.service';

@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly userService: UserService,
  ) {}

  @Get()
  async getUserPosts(@Query('userId') userId: string) {
    if (!userId) {
      return this.postsService.findAll();
    }
    return this.postsService.getUserPosts(userId);
  }

  @Get('newest')
  findNewest() {
    return this.postsService.findNewest();
  }

  @Post(':id')
  increaseFavorite(@Param('id') id: string) {
    return this.postsService.increaseFavorite(id);
  }

  // Basic CRUD
  @Post()
  create(@Body() createPostDto: CreatePostDto) {
    return this.postsService.create(createPostDto);
  }

  @Get()
  findAll() {
    return this.postsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): any {
    let post = this.postsService.findOne(id);

    return post;
  }

  @Patch(':id')
  update(@Param('id') id: string, @Request() req) {
    return this.postsService.update(id, req);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postsService.remove(id);
  }
}
