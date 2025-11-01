import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@consultoria-financiera/auth";
import AnalyticsClient from "./analytics-client";

export default async function AnalyticsPage() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session?.user) {
		redirect("/login");
	}

	return <AnalyticsClient />;
}
