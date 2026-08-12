import { NestFactory } from '@nestjs/core';
import { SeederModule } from './seeder/seeder.module';
import { Logger } from '@nestjs/common';
import { SeederService } from './seeder/seeder.service';


async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(SeederModule);
  const logger = new Logger('Seeder');
  const seeder = appContext.get(SeederService);

  try {
    logger.log('Seeding initial data...');
    await seeder.seed();
    logger.log('Seeding complete!');
  } catch (error) {
    logger.error('Seeding failed!');
    logger.error(error);
  } finally {
    await appContext.close();
  }
}

void bootstrap();