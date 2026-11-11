import { Test, TestingModule } from '@nestjs/testing';
import { ShowingsController } from './showings.controller.js';

describe('ShowingsController', () => {
  let controller: ShowingsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShowingsController],
    }).compile();

    controller = module.get<ShowingsController>(ShowingsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
