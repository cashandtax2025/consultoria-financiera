"use client";
import { useQuery } from "@tanstack/react-query";
import { trpc } from "@/utils/trpc";

export default function Dashboard({
  session,
}: {
  session: {
    user: {
      id: string;
      name: string;
      email: string;
    };
  };
}) {
  const privateData = useQuery(trpc.privateData.queryOptions());

  return (
    <>
      <p>API: {privateData.data?.message}</p>
    </>
  );
}
