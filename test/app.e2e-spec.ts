import {Test} from '@nestjs/testing'
import { AppModule } from '../src/app.module';
import * as pactum from 'pactum'
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { PrismaService } from '../src/prisma/prisma.service';
import { userLogDto, userRegDto } from '../src/dto/userDto';
import {UpdateUserInfoDto} from '../src/dto/userDto';


describe('App e2e',()=>{
  let app: INestApplication;
  let prisma:PrismaService
  
 
  beforeAll(async ()=>{
      const moduleRef = await Test.createTestingModule({
        imports:[AppModule],
      }).compile();

      app = moduleRef.createNestApplication();
      app.useGlobalPipes(
        new ValidationPipe({
          whitelist:true
        })
      );
      await app.init();
      await app.listen(3333);

      prisma = app.get(PrismaService);

      await prisma.cleanDb()
      pactum.request.setBaseUrl('http:localhost:3333')
  });
  afterAll(()=>{
    app.close();
  })
  describe('Auth',()=>{
    describe('register',()=>{


      //also write tests where the user omits a required detail
      it('should NOT register',()=>{
        const dto:userRegDto ={
          email :"martins.paraclet@gmail.com",
          password: "sample2"
        }
        delete dto.password

        return pactum.spec().post(`/auth/register`)
        .withBody(dto)
        .expectStatus(400)
      })

      //wen all user inputs are complete
      it('should register',()=>{
        const dto:userRegDto ={
          email :"martins.paraclet@gmail.com",
          password: "sample2"
        }
        return pactum.spec().post(`/auth/register`)
        .withBody(dto)
        .expectStatus(201)
      })

    })

    describe('login',()=>{

      //also write tests where the user omits a required detail
      it('should not login',()=>{
        const dto:userLogDto={
          EmailOrPhoneNumber :"martins.paraclet@gmail.com",
          password: "sample2",

        }
        delete dto.EmailOrPhoneNumber
        return pactum.spec().post('/auth/login')
        .withBody(dto)
        .expectStatus(400)
      })
      
      //when it works
      it('should login',()=>{
        const dto:userLogDto={
          EmailOrPhoneNumber :"martins.paraclet@gmail.com",
          password: "sample2",

        }
        return pactum.spec().post('/auth/login')
        .withBody(dto)
        .expectStatus(200)
        .stores('userAccessToken','access_token')
      })
    })

  });

  describe('User',()=>{
    

    describe('user',()=>{
      it("should return corrent user",()=>{
        return pactum
        .spec()
        .get('/users/profile')
        .withHeaders({
          Authorization: 'Bearer $S{userAccessToken}',
        })
        .expectStatus(200)
        .inspect()
      });
    });

    describe('edit user',()=>{
      it("should return corrent user",()=>{
        const dto : UpdateUserInfoDto={
          fullName:"martins"
        }
        return pactum
        .spec()
        .patch('/users/update/:id')
        .withHeaders({
          Authorization: 'Bearer $S{userAccessToken}',
        })
        .withBody(dto)
        .expectStatus(200)
        .expectBodyContains(dto.fullName)
        .inspect()
      });
    })
  });

});