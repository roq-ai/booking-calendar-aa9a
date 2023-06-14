import { UserInterface } from 'interfaces/user';
import { ClientInterface } from 'interfaces/client';
import { GetQueryInterface } from 'interfaces';

export interface TeamMemberInterface {
  id?: string;
  user_id: string;
  client_id: string;
  created_at?: any;
  updated_at?: any;

  user?: UserInterface;
  client?: ClientInterface;
  _count?: {};
}

export interface TeamMemberGetQueryInterface extends GetQueryInterface {
  id?: string;
  user_id?: string;
  client_id?: string;
}
