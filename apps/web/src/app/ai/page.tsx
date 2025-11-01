import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@consultoria-financiera/auth";
import AIClient from "./ai-client";

export default async function AIPage() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session?.user) {
		redirect("/login");
	}

	return <AIClient />;
}
