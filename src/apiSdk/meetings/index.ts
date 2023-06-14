import axios from 'axios';
import queryString from 'query-string';
import { MeetingInterface, MeetingGetQueryInterface } from 'interfaces/meeting';
import { GetQueryInterface } from '../../interfaces';

export const getMeetings = async (query?: MeetingGetQueryInterface) => {
  const response = await axios.get(`/api/meetings${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createMeeting = async (meeting: MeetingInterface) => {
  const response = await axios.post('/api/meetings', meeting);
  return response.data;
};

export const updateMeetingById = async (id: string, meeting: MeetingInterface) => {
  const response = await axios.put(`/api/meetings/${id}`, meeting);
  return response.data;
};

export const getMeetingById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/meetings/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteMeetingById = async (id: string) => {
  const response = await axios.delete(`/api/meetings/${id}`);
  return response.data;
};
