import { Injectable, BadRequestException } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { v4 as uuid } from 'uuid';

@Injectable()
export class S3Service {
  async uploadImage(image: Express.Multer.File): Promise<string> {
    if (!image) throw new BadRequestException('Image is required');

    if (!image?.mimetype.includes('image'))
      throw new BadRequestException('This file must be an image');

    const s3 = new S3();
    console.log(image.filename);

    const uploadResult = await s3
      .upload({
        Bucket: process.env.S3_BUCKET_NAME,
        Body: image.buffer,
        Key: `${uuid()}-${image.filename}`,
        ContentType: image.mimetype,
      })
      .promise();

    return uploadResult.Key;
  }

  async deleteImage(key: string): Promise<void> {
    const s3 = new S3();
    await s3
      .deleteObject({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: key,
      })
      .promise();
  }

  async generatePresignedUrl(key: string): Promise<string> {
    const s3 = new S3();

    return s3.getSignedUrlPromise('getObject', {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key,
      Expires: 3600,
    });
  }
}
