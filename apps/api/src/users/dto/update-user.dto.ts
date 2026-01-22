export class UpdateUserDto {
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;

  entrepreneurProfile?: {
    businessName?: string;
    industry?: string;
    description?: string;
  };

  investorProfile?: {
    interests?: string[];
    budget?: number;
  };
}
