"use client";
import ProductTable from "./table/ProductTable";

interface ProductPageComponentProps {
  page: string;
  pageSize: string;
  sort: string;
  search: string;
}

export default function ProductPageComponent({
  page,
  pageSize,
  sort,
  search,
}: ProductPageComponentProps) {
  return (
    <section className="p-6">
      <div className="">
        <ProductTable
          page={+page}
          pageSize={+pageSize}
          sort={sort}
          search={search}
        />
      </div>
    </section>
  );
}
