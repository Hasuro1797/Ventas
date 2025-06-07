import { Checkbox } from "@/components/ui/checkbox";
import { formatCurrency, formatDate } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { IOrder } from "./order.type";
import { OrderDetail } from "./orderDetail";


export const orderColumns = (
): ColumnDef<IOrder>[] => {
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
      accessorKey: "client.name",
      id: "fullName",
      header: () => {
        return (
          <div className="">
              Nombre de Cliente
          </div>
        );
      },
      cell: ({ row }) => (
        <div className="sm:max-w-[150px] md:max-w-[190px] lg:max-w-[220px] 2xl:max-w-[320px] truncate">
          {row.getValue("fullName")}
        </div>
      ),
    },
    {
      accessorKey: "date",
      header: () => <div className="text-center">Fecha de Emisión</div>,
      cell: ({ row }) => (
        <div className="text-center">{formatDate(row.getValue("date"))}</div>
      ),
    },
    {
      accessorKey: "total",
      header: () => <div className="text-center">Total</div>,
      cell: ({ row }) => (
        <div className="text-center">
          {formatCurrency(row.getValue("total"))}
        </div>
      ),
    },
    {
      id: "actions",
      header: () => <div className="text-center">Acciones</div>,
      cell: ({ row }) => {
        return (
          <OrderDetail orderId={row.getValue("id")}/>
        );
      },
      enableHiding: false,
    },
  ];
};
