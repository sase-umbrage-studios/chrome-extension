import { UserModel } from './user.schema.js';
export class UserRepository {
    UserModel;
    initialCredits;
    constructor() {
        this.findOneById = this.findOneById.bind(this);
        this.createOne = this.createOne.bind(this);
        this.updateOneById = this.updateOneById.bind(this);
        this.UserModel = UserModel;
        this.initialCredits = 2;
    }
    async findOneById(id) {
        const user = await this.UserModel.findOne({ id });
        if (user)
            return user;
        console.error(`[Server]: Error - Cannot find user with id = ${id}`);
        return null;
    }
    async createOne(id) {
        const user = new this.UserModel({
            id,
            credits: this.initialCredits
        });
        await user.save();
        const constructedUser = { id, credits: 2 };
        return constructedUser;
    }
    async updateOneById(id, updates) {
        return await this.UserModel.updateOne({ id }, updates);
    }
}
