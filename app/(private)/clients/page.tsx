import React from "react";
import ClientsPageComponent from "./components/ClientsPageComponent";

export default async function ClientsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const {
    page = "1",
    pageSize = "10",
    sort = "registeredAt-desc",
    search = "",
  } = await searchParams;
  return (
    <main className="w-full">
      <ClientsPageComponent
        page={page as string}
        pageSize={pageSize as string}
        sort={sort as string}
        search={search as string}
      />
    </main>
  );
}
