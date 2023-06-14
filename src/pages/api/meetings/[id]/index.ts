import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { meetingValidationSchema } from 'validationSchema/meetings';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.meeting
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getMeetingById();
    case 'PUT':
      return updateMeetingById();
    case 'DELETE':
      return deleteMeetingById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getMeetingById() {
    const data = await prisma.meeting.findFirst(convertQueryToPrismaUtil(req.query, 'meeting'));
    return res.status(200).json(data);
  }

  async function updateMeetingById() {
    await meetingValidationSchema.validate(req.body);
    const data = await prisma.meeting.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteMeetingById() {
    const data = await prisma.meeting.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
