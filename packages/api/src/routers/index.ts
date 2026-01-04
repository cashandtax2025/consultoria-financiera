import { protectedProcedure, publicProcedure, router } from "../trpc";
import { accountingRouter } from "./accounting";
import { todoRouter } from "./todo";
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
  accounting: accountingRouter,
  todo: todoRouter,
  upload: uploadRouter,
});
export type AppRouter = typeof appRouter;
