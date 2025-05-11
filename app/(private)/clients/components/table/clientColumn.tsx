import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { IClient } from "./client.type";
import EditReservation from "./EditClient";
import { formatDate } from "@/lib/utils";
export const clientColumns = (
  handleSort: (columId: string) => void,
  refechAllClient: () => Promise<void>
): ColumnDef<IClient>[] => {
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
              Nombres y Apellidos
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </div>
        );
      },
      cell: ({ row }) => (
        <div className="sm:max-w-[150px] md:max-w-[190px] lg:max-w-[220px] xl:max-w-full truncate">
          {row.getValue("name")}
        </div>
      ),
    },
    {
      accessorKey: "email",
      header: () => <div className="">Correo Electrónico</div>,
      cell: ({ row }) => <div className="">{row.getValue("email")}</div>,
    },
    {
      accessorKey: "registeredAt",
      header: "Fecha de Registro",
      cell: ({ row }) => <div>{formatDate(row.getValue("registeredAt"))}</div>,
      enableSorting: false,
    },

    {
      id: "actions",
      header: () => <div className="text-center">Acciones</div>,
      cell: ({ row }) => {
        return (
          <EditReservation
            idClient={row.original.id}
            refechAllClient={refechAllClient}
          />
        );
      },
      enableHiding: false,
    },
  ];
};
