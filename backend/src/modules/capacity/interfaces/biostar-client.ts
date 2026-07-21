export interface BioStarEvent {
  id: string;
  datetime: string;
  server_datetime: string;
  device_id: {
    id: string;
    name?: string;
  };
  user_id?: {
    user_id: string;
    name?: string;
  };
  event_type_id: {
    code: number;
    name?: string;
  };
}

export interface BioStarUser {
  user_id: string;
  name: string;
  user_group_id: { id: string };
  start_datetime?: string;
  expiry_datetime?: string;
  email?: string;
  cards?: Array<{ card_id: string }>;
  disabled?: boolean;
}

export interface IBioStarClient {
  login(): Promise<string>;
  createUser(user: BioStarUser): Promise<any>;
  updateUser(id: string, data: Partial<BioStarUser>): Promise<any>;
  disableUser(id: string): Promise<any>;
  getEvents(from?: Date, to?: Date, limit?: number): Promise<BioStarEvent[]>;
}

export const I_BIOSTAR_CLIENT_TOKEN = 'BioStarClientToken';