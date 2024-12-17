import { PrismaClient } from "@prisma/client";

let prisma: PrismaClient;

const globalForPrisma = global as unknown as {
    prisma: PrismaClient | undefined
};

//もしprismaがインスタンス化されていなければインスタンス化する。
if(!globalForPrisma.prisma) {
    globalForPrisma.prisma = new PrismaClient();
}

prisma = globalForPrisma.prisma;

export default prisma;