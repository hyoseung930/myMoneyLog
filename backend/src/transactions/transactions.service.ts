import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTransactionDto, UpdateTransactionDto } from '../dto/transaction.dto';

@Injectable()
export class TransactionsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createTransactionDto: CreateTransactionDto) {
    const data: any = {
      userId,
      accountId: createTransactionDto.accountId,
      date: new Date(createTransactionDto.date + 'T00:00:00'),
      amount: createTransactionDto.amount,
      type: createTransactionDto.type,
      category: createTransactionDto.category,
    };

    if (createTransactionDto.time) {
      data.time = createTransactionDto.time;
    }

    if (createTransactionDto.encryptedDescription) {
      data.encryptedDescription = createTransactionDto.encryptedDescription;
      data.descriptionIv = createTransactionDto.descriptionIv;
    }

    return this.prisma.transaction.create({ data });
  }

  async findAllByUser(userId: string, startDate?: string, endDate?: string) {
    const where: any = { userId };

    if (startDate && endDate) {
      where.date = {
        gte: new Date(startDate + 'T00:00:00'),
        lte: new Date(endDate + 'T23:59:59'),
      };
    }

    return this.prisma.transaction.findMany({
      where,
      include: {
        account: true,
      },
      orderBy: { date: 'desc' },
    });
  }

  async findOne(id: string, userId: string) {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id },
      include: {
        account: true,
      },
    });

    if (!transaction || transaction.userId !== userId) {
      throw new NotFoundException('Transaction not found');
    }

    return transaction;
  }

  async update(
    id: string,
    userId: string,
    updateTransactionDto: UpdateTransactionDto,
  ) {
    await this.findOne(id, userId);

    const data: any = {};
    
    if (updateTransactionDto.accountId !== undefined) {
      data.accountId = updateTransactionDto.accountId;
    }
    if (updateTransactionDto.date !== undefined) {
      data.date = new Date(updateTransactionDto.date + 'T00:00:00');
    }
    if (updateTransactionDto.time !== undefined) {
      data.time = updateTransactionDto.time;
    }
    if (updateTransactionDto.amount !== undefined) {
      data.amount = updateTransactionDto.amount;
    }
    if (updateTransactionDto.type !== undefined) {
      data.type = updateTransactionDto.type;
    }
    if (updateTransactionDto.category !== undefined) {
      data.category = updateTransactionDto.category;
    }
    if (updateTransactionDto.encryptedDescription !== undefined) {
      data.encryptedDescription = updateTransactionDto.encryptedDescription;
      data.descriptionIv = updateTransactionDto.descriptionIv;
    }

    return this.prisma.transaction.update({
      where: { id },
      data,
    });
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId);

    return this.prisma.transaction.delete({
      where: { id },
    });
  }

  async getStatsByDateRange(
    userId: string,
    startDate: string,
    endDate: string,
  ) {
    const transactions = await this.prisma.transaction.findMany({
      where: {
        userId,
        date: {
          gte: new Date(startDate + 'T00:00:00'),
          lte: new Date(endDate + 'T23:59:59'),
        },
      },
    });

    const stats = transactions.reduce(
      (acc, transaction) => {
        const amount = Number(transaction.amount);
        if (transaction.type === 'income') {
          acc.totalIncome += amount;
        } else {
          acc.totalExpense += amount;
        }
        return acc;
      },
      { totalIncome: 0, totalExpense: 0 },
    );

    return {
      ...stats,
      netAmount: stats.totalIncome - stats.totalExpense,
    };
  }
}
