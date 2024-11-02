-- AlterTable
ALTER TABLE "users" ADD COLUMN     "image" TEXT,
ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'admin';

-- CreateTable
CREATE TABLE "proxies" (
    "id" SERIAL NOT NULL,
    "proxy" TEXT NOT NULL,
    "numofProxies" INTEGER NOT NULL,
    "countryCode" TEXT,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "proxies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "proxy_logs" (
    "id" SERIAL NOT NULL,
    "proxyId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "proxy_logs_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "proxies" ADD CONSTRAINT "proxies_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proxy_logs" ADD CONSTRAINT "proxy_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proxy_logs" ADD CONSTRAINT "proxy_logs_proxyId_fkey" FOREIGN KEY ("proxyId") REFERENCES "proxies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
