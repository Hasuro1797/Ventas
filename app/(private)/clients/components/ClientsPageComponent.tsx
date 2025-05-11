"use client";
import ClientTable from "./table/ClientTable";

interface ClientsPageComponentProps {
  page: string;
  pageSize: string;
  sort: string;
  search: string;
}

export default function ClientsPageComponent({
  page,
  pageSize,
  sort,
  search,
}: ClientsPageComponentProps) {
  return (
    <section className="p-6">
      <div className="">
        <ClientTable
          page={+page}
          pageSize={+pageSize}
          sort={sort}
          search={search}
        />
      </div>
    </section>
  );
}
