import prisma from "../lib/prisma";

export class UserRepository {
  async findById(id: string) {
    return prisma.user.findUnique({ where: { id }, omit: { password: true } });
  }

  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  async create(data: { email: string; name: string; password: string }) {
    return prisma.user.create({ data });
  }

  async findAll() {
    return prisma.user.findMany({
      where: { deletedAt: null },
      omit: { password: true },
    });
  }

  async search(query: string) {
    return prisma.user.findMany({
      where: {
        deletedAt: null,
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { email: { contains: query, mode: "insensitive" } },
        ],
      },
      omit: { password: true },
      take: 20,
    });
  }
}
