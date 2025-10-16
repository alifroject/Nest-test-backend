import 'express-session';

declare module 'express-session' {
  interface SessionData {
    user: {
      id: number;
      email: string;
      role: string;
    };
  }
}
declare module 'express-serve-static-core' {
  interface Request {
    session: Session & Partial<SessionData>;
  }
}
