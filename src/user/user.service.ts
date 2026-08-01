import { UserRepository } from "./user.repository";
import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

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

    const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);

    return this.userRepository.create({
      ...data,
      password: hashedPassword,
    });
  }

  async validatePassword(email: string, password: string) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) throw new Error("Email atau password salah");

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) throw new Error("Email atau password salah");

    return user;
  }
}
