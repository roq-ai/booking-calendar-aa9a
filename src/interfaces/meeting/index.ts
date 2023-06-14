import { ClientInterface } from 'interfaces/client';
import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface MeetingInterface {
  id?: string;
  title: string;
  start_time: any;
  end_time: any;
  is_recurring: boolean;
  recurrence_interval?: number;
  single_use_link: string;
  client_id: string;
  guest_id: string;
  created_at?: any;
  updated_at?: any;

  client?: ClientInterface;
  user?: UserInterface;
  _count?: {};
}

export interface MeetingGetQueryInterface extends GetQueryInterface {
  id?: string;
  title?: string;
  single_use_link?: string;
  client_id?: string;
  guest_id?: string;
}
