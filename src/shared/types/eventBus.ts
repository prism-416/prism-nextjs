// import { User } from 'next-auth';

/**
 * @description 인증 이벤트 버스 타입
 */
export type AuthEventBus = {
  status: number;
  message: string;
  data: unknown | null | undefined;
};
