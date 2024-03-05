import {
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { Message } from '@khlug/constant/message';
import { Requester } from '@khlug/khuthon/core/auth/Requester';
import { Roles } from '@khlug/khuthon/core/auth/Roles';
import {
  ManagerUser,
  MemberUser,
  UserRole,
} from '@khlug/khuthon/core/auth/User';
import { UploadFileResponseDto } from '@khlug/khuthon/file/controllers/dto/UploadFileResponseDto';
import { FileService } from '@khlug/khuthon/file/services/FileService';

const _10MB = 10 * 1024 * 1024;
const mimeTypes = ['application/pdf', 'image/jpeg', 'image/png'];

@Controller()
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('/files')
  @Roles([UserRole.MEMBER, UserRole.MANAGER])
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: _10MB,
            message: Message.FILE_TOO_LARGE,
          }),
          new FileTypeValidator({
            fileType: new RegExp(`(${mimeTypes.join('|')})`),
          }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Requester() requester: MemberUser | ManagerUser,
  ): Promise<UploadFileResponseDto> {
    const memberId =
      requester.role === UserRole.MEMBER ? requester.memberId : null;

    const newFile = await this.fileService.uploadFile(file, memberId);

    return new UploadFileResponseDto(newFile);
  }
}
