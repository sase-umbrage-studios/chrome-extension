import mongoose from 'mongoose';
import { IUser, UserModel } from './user.schema.js';

export class UserRepository {
  UserModel: mongoose.Model<IUser>
  initialCredits: number;

  constructor() {
    this.findOneById=this.findOneById.bind(this);
    this.createOne=this.createOne.bind(this);
    this.updateOneById=this.updateOneById.bind(this);
    this.UserModel = UserModel;
    this.initialCredits = 2;
  }

  async findOneById(id: string) {
    const user = await this.UserModel.findOne({ id });
    if (user) return user;
    console.error(`[Server]: Error - Cannot find user with id = ${id}`);
    return null;
  }

  async createOne(id: string) {
    const user = new this.UserModel({
      id,
      credits: this.initialCredits
    });
    await user.save();
    const constructedUser: IUser = { id, credits: 2 };
    return constructedUser;
  }

  async updateOneById(id: string, updates: {[k:string]: unknown}) {
    return await this.UserModel.updateOne({ id }, updates);
  }
}
