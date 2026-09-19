import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseService } from '../database/database.service';
import { NotificationsService } from '../notifications/notifications.service';
import { ConnectionsService } from './connections.service';
import { AccessPolicyService } from '../policies/access-policy.service';

describe('ConnectionsService', () => {
  let service: ConnectionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConnectionsService,
        { provide: DatabaseService, useValue: {} },
        { provide: NotificationsService, useValue: {} },
        { provide: AccessPolicyService, useValue: {} },
      ],
    }).compile();

    service = module.get<ConnectionsService>(ConnectionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
