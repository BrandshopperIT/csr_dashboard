export { default } from 'next-auth/middleware';

export const config = {
  matcher: [
    '/unres',
    '/unres_archived',
    '/ccsheet',
    '/refund',
    '/tracer',
    '/replacement',
  ],
};
