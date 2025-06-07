import React from "react";
import OrderForm from "./orderForm/OrderForm";
import OrderTable from "./orderTable/OrderTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface OrderPageComponentProps {
  page: string;
  pageSize: string;
  sort: string;
  search: string;
}

export default function OrderPageComponent({
  page,
  pageSize,
  sort,
  search
}: OrderPageComponentProps) {
  return (
    <main className="w-full p-6 flex flex-col gap-4">
      <Tabs defaultValue="orders">
        <TabsList>
          <TabsTrigger value="orders">Ordenes</TabsTrigger>
          <TabsTrigger value="form">Crear Orden</TabsTrigger>
        </TabsList>
        <TabsContent value="orders">
          <OrderTable page={+page} pageSize={+pageSize} sort={sort} search={search}/>
        </TabsContent>
        <TabsContent value="form">
          <OrderForm/>
        </TabsContent>
      </Tabs>

    </main>
  );
}
