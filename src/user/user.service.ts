import { UserRepository } from './user.repository.js';

export class UserService {
  userRepository: UserRepository;

  constructor() {
    this.getOrCreateUser=this.getOrCreateUser.bind(this);
    this.userRepository = new UserRepository();
  }

  async getOrCreateUser(id: string) {
    const user = await this.userRepository.findOneById(id);
    if (user) return user;
    const createdUser = await this.userRepository.createOne(id);
    return createdUser;
  }
}
