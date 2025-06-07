"use client";
import SearchDebounce from "@/components/searchDebounce/SearchDebounce";
import { TitleSection } from "@/components/titleSection";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useOrderTable } from "@/hooks/useOrderTable";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Loader,
  LoaderCircle,
  Search,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Fragment, useState } from "react";
import { toast } from "sonner";
import { orderColumns } from "./orderColumn";
import { deleteOrdersAction } from "@/actions/order-actions";
import OrderViewsColumn from "./OrderViewsColumn";

interface CustomTableProps {
  page: number;
  pageSize: number;
  sort: string;
  search: string;
}

export default function OrderTable({
  pageSize,
  page,
  sort,
  search,
}: CustomTableProps) {
  const { orders, totalPages, refecthData, loading, total } = useOrderTable(
    {
      page,
      pageSize,
      search,
      sort,
    }
  );
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const [deleteLoading, setDeleteLoading] = useState(false);

  const table = useReactTable({
    data: orders || [],
    manualPagination: true,
    manualSorting: true,
    columns: orderColumns(),
    pageCount: totalPages,
    getCoreRowModel: getCoreRowModel(),
  });
  const handleStartPage = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1");
    table.setPageIndex(0);
    router.replace(`${window.location.pathname}?${params.toString()}`);
  };
  const handlePrevPage = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", (page - 1).toString());
    table.previousPage();
    router.replace(`${window.location.pathname}?${params.toString()}`);
  };

  const handleNextPage = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", (page + 1).toString());
    table.nextPage();
    router.replace(`${window.location.pathname}?${params.toString()}`);
  };
  const handleEndPage = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", totalPages.toString());
    table.setPageIndex(totalPages - 1);
    router.replace(`${window.location.pathname}?${params.toString()}`);
  };

  //DELETESELETEDPRODUCTS
  const deleteSelectedProducts = async () => {
    setDeleteLoading(true);
    const ids = table.getSelectedRowModel().rows.map((row) => row.original.id);
    const response = await deleteOrdersAction(ids);
    if (response.error) {
      toast.error("Error al eliminar las ordenes seleccionadas", {
        description: response.error,
        classNames: {
          toast: "bg-background",
          icon: "text-red-500",
          title: "text-foreground",
          description: "text-foreground",
        },
      });
      setDeleteLoading(false);
      setIsAlertDialogOpen(false);
      return;
    }
    setDeleteLoading(false);
    setIsAlertDialogOpen(false);
    table.resetRowSelection();
    toast.success(response.message || "Ordenes selecccionadas eliminadas", {
      description: "Se han eliminado las ordenes correctamente",
      position: "top-center",
      classNames: {
        toast: "bg-background",
        icon: "text-green-500",
        title: "text-foreground",
        description: "text-foreground",
      },
    });

    await refecthData();
  };

  return (
    <div className="w-full">
      <div className="w-full flex justify-between items-center gap-4 item-center">
        <div>
          <TitleSection title="Ordenes" styles="" />
          {loading ? (
            <Skeleton className="w-24 h-6" />
          ) : (
            <span className="text-sm text-muted-foreground">
              {total} resultados
            </span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-5 pt-4 pb-3 mt-5">
        <div className="flex gap-2 items-center">
          <div className="relative">
            <Search
              strokeWidth={2}
              className="w-4 h-4 text-foreground absolute top-3 left-2"
            />
            <SearchDebounce
              placeholder="Buscar..."
              initialValue={search}
              onSearch={(value) => {
                const params = new URLSearchParams(searchParams.toString());
                params.set("search", value);
                if (value === "") {
                  params.delete("search");
                }
                params.set("page", "1");
                params.delete("sort");
                router.replace(
                  `${window.location.pathname}?${params.toString()}`
                );
              }}
              className="pl-8 max-w-xs lg:max-w-sm"
            />
          </div>
        </div>
        <OrderViewsColumn table={table} />
      </div>
      {table && table.getSelectedRowModel().rows.length > 0 && (
        <div className="flex gap-3 items-center pt-2 pb-4">
          <span className="text-sm">
            {table.getSelectedRowModel().rows.length > 1
              ? `${
                  table.getSelectedRowModel().rows.length
                } entradas seleccionadas`
              : `${
                  table.getSelectedRowModel().rows.length
                } entrada seleccionada`}{" "}
          </span>
          <AlertDialog
            open={isAlertDialogOpen}
            onOpenChange={setIsAlertDialogOpen}
          >
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-8 flex text-red-500 hover:text-red-500"
              >
                Borrar
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  ¿Estás absolutamente seguro?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Esta acción no se puede deshacer. Esto eliminará
                  permanentemente los elementos elegidos.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="text-xs">
                  Cancelar
                </AlertDialogCancel>
                <Button
                  variant="destructive"
                  onClick={deleteSelectedProducts}
                  disabled={deleteLoading}
                >
                  {deleteLoading && (
                    <Loader
                      strokeWidth={2}
                      size={4}
                      className="repeat-infinite animate-spin"
                    />
                  )}
                  <span className="text-xs">Continuar</span>
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}
      <div className="rounded-md border">
        <Table>
          <TableHeader className="bg-sidebar hover:bg-sidebar">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={orderColumns().length}
                  className="h-60"
                >
                  <p className="text-center flex justify-center">
                    <LoaderCircle
                      strokeWidth={2}
                      className="size-8 text-primary animate-spin repeat-infinite"
                    />
                  </p>
                </TableCell>
              </TableRow>
            ) : (
              <Fragment>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      className=""
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={orderColumns().length}
                      className="text-center h-24 !col-span-7"
                    >
                      No hay datos
                    </TableCell>
                  </TableRow>
                )}
              </Fragment>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} de{" "}
          {table.getFilteredRowModel().rows.length} fila(s) seleccionada(s).
        </div>
        <div className="flex items-center space-x-2">
          <Select
            value={`${pageSize}`}
            onValueChange={(value) => {
              const params = new URLSearchParams(searchParams.toString());
              params.set("pageSize", value);
              params.set("page", "1");
              table.setPageSize(Number(value));
              router.replace(
                `${window.location.pathname}?${params.toString()}`
              );
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={+pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[5, 10, 20, 30].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex w-[100px] items-center justify-center text-sm font-medium">
            Pag {page} de {totalPages ? totalPages : 1}
          </div>
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={handleStartPage}
            disabled={page <= 1}
          >
            <span className="sr-only">Go to first page</span>
            <ChevronsLeft />
          </Button>
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={handlePrevPage}
            disabled={page <= 1}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeft />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNextPage}
            disabled={page >= table.getPageCount()}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRight />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleEndPage}
            disabled={page >= table.getPageCount()}
          >
            <span className="sr-only">Go to last page</span>
            <ChevronsRight />
          </Button>
        </div>
      </div>
    </div>
  );
}

