import { protectedProcedure, publicProcedure, router } from "../trpc";
import { clientsRouter } from "./clients";
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
  todo: todoRouter,
  upload: uploadRouter,
  clients: clientsRouter,
});
export type AppRouter = typeof appRouter;
