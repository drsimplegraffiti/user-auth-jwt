

#### Create a new nest project
> nest new [project name] 

#### Generate a new resource
> nest g resource [resource name]
> nest g resource auth --no-spec

- Choose RESTful API style
- Choose no for CRUD operations


### install prisma
> yarn add prisma -D

### npx prisma init
> npx prisma init

This will create a new folder called prisma and a file called prisma/schema.prisma

```prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

```

And also a .env file

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/postgres?schema=public"
```

You can change the database name, user and password to whatever you want.
> 
DATABASE_URL="postgresql://postgres:Bassguitar1@localhost:5432/jumong?schema=public"

Then restart the server
> yarn start:dev


---

#### Create user model in the prisma/schema.prisma file

```prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
 id String @unique @default(uuid())
 email String @unique
 hashedPassword String
 createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt()
}
```

Then install the prisma client
> yarn add @prisma/client

Then generate migration files
> npx prisma migrate dev --name init


#### validation 
> yarn add class-validator class-transformer

#### use global validation pipe in main.ts
```ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const port = process.env.PORT || 3003;
  const host = process.env.HOST || '127.0.0.1';
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(port, host, () => {
    Logger.log(`Application listening on port ${port}`, 'Bootstrap');
  });
}
bootstrap();
```

---


#### Create a new user
> http://localhost:3003/auth/signup
```json
{
    "email": "Nicola17@gmail.com",
    "password": "1234"
}
```

---

#### Check prisma studio
> npx prisma studio


![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/kgfznsrw5gdb362ouuxr.png)


---

#### Jwt 
> yarn add @nestjs/jwt 

#### Sign in
> http://localhost:3003/auth/signin
```json
{
    "email": "Nicola17@gmail.com",
    "password": "1234"
}
```

---

#### Send the token as cookie to the client
> yarn add cookie-parser
> yarn add @types/cookie-parser -D

#### Sign out
> http://localhost:3003/auth/signout GET

---

#### Create user resource 
> nest g resource users --no-spec

#### To create a private route we need to install passport and passport-jwt.
> yarn add passport passport-jwt @nestjs/passport
> yarn add @types/passport-jwt -D

<!-- #### Source: https://www.youtube.com/watch?v=4JyBeN69wq4&t=652s -->