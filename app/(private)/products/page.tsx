import React from "react";
import ProductPageComponent from "./components/ProductPageComponent";

export default async function Products({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const {
    page = "1",
    pageSize = "10",
    sort = "createdAt-desc",
    search = "",
  } = await searchParams;
  return (
    <main className="w-full">
      <ProductPageComponent
        page={page as string}
        pageSize={pageSize as string}
        sort={sort as string}
        search={search as string}
      />
    </main>
  );
}
