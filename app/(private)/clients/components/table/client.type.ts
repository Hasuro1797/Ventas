export interface IClient {
  id: number;
  name: string;
  email: string;
  phone?: string;
  registeredAt : string;
  clientInfo?: {
    comments?: {
      text: string;
      date: Date;
    }[];
    preferences?: {
      language?: string;
      paid_method?: string;
      notifications?: boolean;
    };
  };
}

