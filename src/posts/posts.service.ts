import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Posts, PostsDocument } from 'src/schemas/post.schema';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/schemas/user.schema';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Posts.name) private postModel: Model<PostsDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async getUserPosts(userId: String) {
    return this.postModel.find({ userId: userId }).exec();
  }

  async findNewest(): Promise<Posts[]> {
    return this.postModel.aggregate([{ $sort: { create_at: -1 } }]);
  }

  async increaseFavorite(id: string) {
    let post = this.postModel.findOne({ _id: id }).exec();
    let amount = (await post).favoriteAmount + 1;
    let response = this.postModel.updateOne(
      { _id: id },
      { $set: { ...post, favoriteAmount: amount } },
    );

    return response;
  }

  // Essential CRUD
  async create(createPostDto: CreatePostDto): Promise<Posts> {
    return new this.postModel(createPostDto).save();
  }

  async findAll(): Promise<Posts[]> {
    return this.postModel.find().exec();
  }

  // findOne(id: string): any {
  //   return this.postModel.findOne({ _id: id }).exec();
  // }
  async findOne(id: string) {
    let post = (await this.postModel.findOne({ _id: id })) as any;
    let user = await this.userModel.findOne({ _id: post.userId });
    let res = { ...post._doc, user: user };
    return res;
    // return this.postModel.aggregate([
    //   { $project: { title: 1, userId: { $toObjectId: '$userId' } } },
    //   {
    //     $lookup: {
    //       from: 'users',
    //       localField: 'userId',
    //       foreignField: '_id',
    //       pipeline: [{ $project: { username: 1 } }],
    //       as: 'userInfo',
    //     },
    //   },
    // ]);
  }

  async update(id: string, req) {
    try {
      // console.log(id);
      // console.log(req.body);
      return this.postModel.updateOne(
        { _id: id },
        {
          $set: {
            title: req.body.title,
            description: req.body.description,
            category: req.body.category,
          },
        },
      );

      // if (updatePostDto.byUserId === updatePostDto.userId) {
      //   return this.postModel
      //     .updateOne(
      //       { _id: id },
      //       {
      //         $set: {
      //           title: updatePostDto.title,
      //           description: updatePostDto.description,
      //           category: updatePostDto.category,
      //         },
      //       },
      //     )
      //     .exec();
      // }
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async remove(id: string) {
    return this.postModel.deleteOne({ _id: id }).exec();
  }
}
