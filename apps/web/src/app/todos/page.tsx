import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@consultoria-financiera/auth";
import TodosClient from "./todos-client";

export default async function TodosPage() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session?.user) {
		redirect("/login");
	}

	return <TodosClient />;
}
