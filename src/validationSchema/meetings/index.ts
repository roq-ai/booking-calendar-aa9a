import * as yup from 'yup';

export const meetingValidationSchema = yup.object().shape({
  title: yup.string().required(),
  start_time: yup.date().required(),
  end_time: yup.date().required(),
  is_recurring: yup.boolean().required(),
  recurrence_interval: yup.number().integer(),
  single_use_link: yup.string().required(),
  client_id: yup.string().nullable().required(),
  guest_id: yup.string().nullable().required(),
});
