import * as yup from 'yup';
import { meetingValidationSchema } from 'validationSchema/meetings';
import { teamMemberValidationSchema } from 'validationSchema/team-members';

export const clientValidationSchema = yup.object().shape({
  description: yup.string(),
  image: yup.string(),
  name: yup.string().required(),
  user_id: yup.string().nullable().required(),
  meeting: yup.array().of(meetingValidationSchema),
  team_member: yup.array().of(teamMemberValidationSchema),
});
