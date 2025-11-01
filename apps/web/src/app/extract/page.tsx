import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@consultoria-financiera/auth";
import ExtractClient from "./extract-client";

export default async function ExtractPage() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session?.user) {
		redirect("/login");
	}

	return <ExtractClient />;
}
