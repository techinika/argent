export interface TeamMember {
  id: string;
  userId: string;
  businessId: string;
  email: string;
  name: string;
  role: "owner" | "admin" | "member" | "viewer";
  status: "active" | "pending" | "inactive";
  photoURL?: string;
  joinedAt?: Date;
  invitedAt?: Date;
}

export interface TeamInvitation {
  id: string;
  businessId: string;
  email: string;
  role: "admin" | "member" | "viewer";
  invitedBy: string;
  token: string;
  expiresAt: Date;
  createdAt: Date;
}

export interface BusinessFeature {
  id: string;
  name: string;
  key: string;
  enabled: boolean;
  description?: string;
}

export interface BusinessSettings {
  id: string;
  userId: string;
  name: string;
  logo?: string;
  features: BusinessFeature[];
  createdAt: Date;
  updatedAt: Date;
}
