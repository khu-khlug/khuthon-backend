import { SetMetadata } from '@nestjs/common';

export const NO_BODY_LOG_KEY = Symbol('NO_BODY_LOG_KEY');

export const NoBodyLog = () => SetMetadata(NO_BODY_LOG_KEY, true);
