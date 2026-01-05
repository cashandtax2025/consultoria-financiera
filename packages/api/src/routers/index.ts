import { protectedProcedure, publicProcedure, router } from "../trpc";
import { accountingRouter } from "./accounting";
import { clientsRouter } from "./clients";
import { uploadRouter } from "./upload";

export const appRouter = router({
  healthCheck: publicProcedure.query(() => {
    return "OK";
  }),
  privateData: protectedProcedure.query(({ ctx }) => {
    return {
      message: "This is private",
      user: ctx.session.user,
    };
  }),
  upload: uploadRouter,
  accounting: accountingRouter,
  clients: clientsRouter,
});
export type AppRouter = typeof appRouter;
