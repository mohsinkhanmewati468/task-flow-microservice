// common/pipes/sanitize.pipe.ts
import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import sanitizeHtml from 'sanitize-html';

@Injectable()
export class SanitizePipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (metadata.type !== 'body') {
      return value;
    }
    if (typeof value === 'object') {
      return this.sanitizeObject(value);
    }
    return value;
  }

  private sanitizeObject(obj: any) {
    const sanitized = {};

    for (const key in obj) {
      let val = obj[key];

      if (typeof val === 'string') {
        val = sanitizeHtml(val, {
          allowedTags: [],
          allowedAttributes: {},
        });
      }

      sanitized[key] = val;
    }

    return sanitized;
  }
}
