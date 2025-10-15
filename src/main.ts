import morgan from 'morgan';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:3002',
    credentials: true,
  });

  const PgSession = connectPgSimple(session)

  // App use 

  //session
  app.use(
    session({
      store: new PgSession({
        conString: process.env.DATABASE_URL,
        tableName: 'session', 
      }),
      secret: process.env.SESSION_SECRET || 'secret-key',
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: false,
        sameSite: 'lax',
        httpOnly: true,
        maxAge: 60 * 60 * 1000,
      },
    }),
  );
  
  //port
  app.use(morgan('dev'))
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
