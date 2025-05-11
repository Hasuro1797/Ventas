import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { formatCurrency } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import EditProduct from "./EditProduct";
import { IProduct } from "./product.type";
export const productColumns = (
  handleSort: (columId: string) => void,
  refechAllProducts: () => Promise<void>
): ColumnDef<IProduct>[] => {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            table.getIsSomePageRowsSelected()
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Seleccionar todo"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select fila"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => {
        return <div className="text-foreground">{row.getValue("id")}</div>;
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "name",
      id: "name",
      header: () => {
        return (
          <div className="">
            <Button
              variant="ghost"
              onClick={() => handleSort("name")}
              className="hover:bg-transparent bg-transparent !h-auto !p-0 !py-1"
            >
              Nombre de Producto
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </div>
        );
      },
      cell: ({ row }) => (
        <div className="sm:max-w-[150px] md:max-w-[190px] lg:max-w-[220px] 2xl:max-w-[320px] truncate">
          {row.getValue("name")}
        </div>
      ),
    },
    {
      accessorKey: "stock",
      header: () => <div className="text-center">Stock</div>,
      cell: ({ row }) => (
        <div className="text-center">{row.getValue("stock")}</div>
      ),
    },
    {
      accessorKey: "price",
      header: () => <div className="text-center">Precio</div>,
      cell: ({ row }) => (
        <div className="text-center">
          {formatCurrency(row.getValue("price"))}
        </div>
      ),
    },
    {
      id: "actions",
      header: () => <div className="text-center">Acciones</div>,
      cell: ({ row }) => {
        return (
          <EditProduct
            idProduct={row.original.id}
            refechProducts={refechAllProducts}
          />
        );
      },
      enableHiding: false,
    },
  ];
};
