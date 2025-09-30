import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { S3Service } from './s3/s3.service';

@Injectable()
export class FileService {
  constructor(
    private prisma: PrismaService,
    private s3Service: S3Service,
  ) {}
  async findAll(userId: number) {
    const files = await this.prisma.file.findMany({
      include: {
        uploader: { select: { name: true } },
      },
    });
    return files;
  }

  async upload(file: Express.Multer.File, userId: number) {
    try {
      // Upload file to S3
      const url = await this.s3Service.uploadFile(
        file,
        process.env.AWS_BUCKET as string,
      );

      // Save record in DB
      const savedFile = await this.prisma.file.create({
        data: {
          fileName: file.originalname,
          url,
          uploaderId: userId,
          projectId: 1,
        },
      });

      return savedFile;
    } catch (error) {
      throw error;
    }
  }
}
