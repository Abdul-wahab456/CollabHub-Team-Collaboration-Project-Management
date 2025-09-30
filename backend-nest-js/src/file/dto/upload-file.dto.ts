import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class UploadFileDto {
  @IsNotEmpty()
  @IsString()
  fileName: string;

  @IsInt()
  uploadedBy: number;

  @IsInt()
  projectId: number;
}
