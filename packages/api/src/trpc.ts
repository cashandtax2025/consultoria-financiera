import { logger } from "@consultoria-financiera/logger";
import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import type { Context } from "./context";

export const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape }) {
    return shape;
  },
});

export const errorHandler = (opts: {
  error: TRPCError;
  path: string | undefined;
  ctx: Context | undefined;
}) => {
  if (opts.error.code === "INTERNAL_SERVER_ERROR") {
    logger.error(
      `[tRPC] Internal error in ${opts.path}`,
      opts.error.cause instanceof Error ? opts.error.cause : opts.error,
      {
        ...(opts.path && { path: opts.path }),
        ...(opts.ctx?.session?.user?.id && {
          userId: opts.ctx.session.user.id,
        }),
        code: opts.error.code,
      },
    );
  }
};

export const router = t.router;

export const publicProcedure = t.procedure;

const authMiddleware = t.middleware(({ ctx, next }) => {
  if (!ctx.session) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Authentication required",
    });
  }

  return next({
    ctx: {
      ...ctx,
      session: ctx.session,
    },
  });
});

export const protectedProcedure = t.procedure.use(authMiddleware);

export const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (!ctx.session.user || ctx.session.user.role !== "admin") {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Admin access required",
    });
  }
  return next({
    ctx: {
      ...ctx,
      session: ctx.session,
    },
  });
});
