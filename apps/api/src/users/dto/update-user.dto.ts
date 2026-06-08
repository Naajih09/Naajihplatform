export class UpdateUserDto {
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;

  entrepreneurProfile?: {
    businessName?: string;
    industry?: string;
    focusIndustries?: string[];
    description?: string;
  };

  investorProfile?: {
    interests?: string[];
    focusIndustries?: string[];
    budget?: number;
  };
}
