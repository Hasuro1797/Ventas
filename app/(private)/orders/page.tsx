import React from "react";
import OrderPageComponent from "./components/OrderPageComponent";

export default async function OrderPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const {
    page = "1",
    pageSize = "10",
    sort = "date-desc",
    search = "",
  } = await searchParams;
  return (
    <OrderPageComponent
      page={page as string}
      pageSize={pageSize as string}
      sort={sort as string}
      search={search as string}
    />
  );
}
