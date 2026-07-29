import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConnectionStatus, Subscription, User, UserRole } from '@prisma/client';
import { DatabaseService } from '../database/database.service';

type PolicyUser = Pick<
  User,
  'id' | 'role' | 'isActive' | 'isVerified' | 'emailVerified'
> & {
  subscription?: Subscription | null;
};

export type UserEntitlements = {
  academyPremium: boolean;
  networkingPremium: boolean;
  mentorBooking: boolean;
  certificates: boolean;
  canCreatePitch: boolean;
  canConnect: boolean;
  canMessage: boolean;
  canSubmitVerification: boolean;
};

@Injectable()
export class AccessPolicyService {
  constructor(private readonly databaseService: DatabaseService) {}

  isActivePremium(subscription?: Subscription | null) {
    if (!subscription || subscription.plan !== 'PREMIUM') return false;

    const activeUntil = subscription.endDate || subscription.trialEndsAt;
    return !activeUntil || activeUntil > new Date();
  }

  entitlementsFor(user?: PolicyUser | null): UserEntitlements {
    const isActive = Boolean(user?.isActive);
    const isVerified = Boolean(user?.isVerified);
    const hasPremium = this.isActivePremium(user?.subscription);
    const role = user?.role;

    const academyPremium =
      isActive &&
      hasPremium &&
      (role === UserRole.ASPIRING_BUSINESS_OWNER || role === UserRole.ADMIN);
    const networkingPremium =
      isActive &&
      hasPremium &&
      (role === UserRole.ENTREPRENEUR ||
        role === UserRole.INVESTOR ||
        role === UserRole.ADMIN);

    return {
      academyPremium,
      networkingPremium,
      mentorBooking: academyPremium,
      certificates: academyPremium,
      canCreatePitch:
        isActive &&
        role === UserRole.ENTREPRENEUR &&
        isVerified &&
        networkingPremium,
      canConnect:
        isActive &&
        isVerified &&
        (role === UserRole.ENTREPRENEUR || role === UserRole.INVESTOR),
      canMessage:
        isActive &&
        isVerified &&
        (role === UserRole.ENTREPRENEUR || role === UserRole.INVESTOR),
      canSubmitVerification:
        isActive &&
        (role === UserRole.ENTREPRENEUR || role === UserRole.INVESTOR),
    };
  }

  async getUserEntitlements(userId: string) {
    const user = await this.databaseService.user.findUnique({
      where: { id: userId },
      include: { subscription: true },
    });

    return this.entitlementsFor(user);
  }

  assertCanCreatePitch(user: PolicyUser | null | undefined) {
    if (!user) {
      throw new ForbiddenException('Authenticated user is required.');
    }
    if (user.role !== UserRole.ENTREPRENEUR) {
      throw new ForbiddenException(
        'Only entrepreneur accounts can submit pitches.',
      );
    }
    if (!user.isVerified) {
      throw new ForbiddenException(
        'Verify your account to unlock this feature',
      );
    }
    if (!this.entitlementsFor(user).canCreatePitch) {
      throw new ForbiddenException(
        'Networking premium is required to submit pitches.',
      );
    }
  }

  assertCanConnect(user: PolicyUser | null | undefined) {
    if (!this.entitlementsFor(user).canConnect) {
      throw new ForbiddenException(
        'Verified entrepreneur or investor access is required to connect.',
      );
    }
  }

  assertCanSubmitVerification(user: PolicyUser | null | undefined) {
    if (!this.entitlementsFor(user).canSubmitVerification) {
      throw new ForbiddenException(
        'Only active entrepreneur and investor accounts can submit verification.',
      );
    }
  }

  async assertCanMessage(senderId: string, receiverId: string) {
    if (senderId === receiverId) {
      throw new ForbiddenException('You cannot message yourself.');
    }

    const [sender, receiver, connection] = await Promise.all([
      this.databaseService.user.findUnique({
        where: { id: senderId },
        include: { subscription: true },
      }),
      this.databaseService.user.findUnique({
        where: { id: receiverId },
        select: { id: true, isActive: true },
      }),
      this.databaseService.connection.findFirst({
        where: {
          status: ConnectionStatus.ACCEPTED,
          OR: [
            { senderId, receiverId },
            { senderId: receiverId, receiverId: senderId },
          ],
        },
      }),
    ]);

    if (!receiver?.isActive) {
      throw new ForbiddenException('Recipient account is not available.');
    }
    if (!this.entitlementsFor(sender).canMessage) {
      throw new ForbiddenException(
        'Verified entrepreneur or investor access is required to message.',
      );
    }
    if (!connection) {
      throw new ForbiddenException(
        'An accepted connection is required before messaging.',
      );
    }
  }

  async assertCanAccessProgram(userId: string, programId: string) {
    const [user, program] = await Promise.all([
      this.databaseService.user.findUnique({
        where: { id: userId },
        include: { subscription: true },
      }),
      this.databaseService.program.findUnique({
        where: { id: programId },
        select: { id: true, isPremium: true },
      }),
    ]);

    if (!program) {
      throw new ForbiddenException('Program not found.');
    }
    if (program.isPremium && !this.entitlementsFor(user).academyPremium) {
      throw new ForbiddenException('Academy premium is required.');
    }

    return { user, program };
  }

  async assertCanUseCertificate(userId: string) {
    const entitlements = await this.getUserEntitlements(userId);
    if (!entitlements.certificates) {
      throw new ForbiddenException('Academy premium is required.');
    }
  }
}
