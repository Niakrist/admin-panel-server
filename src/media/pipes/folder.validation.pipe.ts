import {
  ArgumentMetadata,
  BadRequestException,
  PipeTransform,
} from '@nestjs/common';

const allowedFolders = ['default', 'users'];

export class FolderValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (
      metadata.type === 'query' &&
      value &&
      !allowedFolders.includes(value?.toLowerCase())
    ) {
      throw new BadRequestException(`Invalid folder name: ${value}`);
    }
    return value;
  }
}
