const mapping: Record<string, string> = {
  clients: 'client',
  meetings: 'meeting',
  'team-members': 'team_member',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
