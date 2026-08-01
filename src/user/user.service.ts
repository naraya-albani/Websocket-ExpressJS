import { UserRepository } from "./user.repository";

export class UserService {
  private userRepository = new UserRepository();

  async getUserById(id: string) {
    const user = await this.userRepository.findById(id);
    if (!user) throw new Error("User tidak ditemukan");
    return user;
  }

  async getAllUsers() {
    return this.userRepository.findAll();
  }

  async createUser(data: { email: string; name: string; password: string }) {
    const existing = await this.userRepository.findByEmail(data.email);
    if (existing) throw new Error("Email sudah terdaftar");
    return this.userRepository.create(data);
  }
}
