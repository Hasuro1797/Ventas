"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ProductFormSchema, productFormSchema } from "@/lib/zod";
import { SuccessResponseClient } from "@/types/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { IProduct } from "./table/product.type";

type FormData = ProductFormSchema;

interface FormProductProps {
  initialData?: IProduct;
  onSubmit: (
    data: FormData
  ) => Promise<{ error?: string; data?: SuccessResponseClient }>;
  isLoading?: boolean;
  children: React.ReactNode;
  mode?: "create" | "edit";
  variant?:
    | "ghost"
    | "default"
    | "outline"
    | "secondary"
    | "link"
    | "destructive";
  styles?: string;
  title?: string;
  getInfoBeforeToShow?: () => Promise<void>;
}

export default function FormReservation({
  getInfoBeforeToShow,
  initialData,
  onSubmit,
  isLoading = false,
  mode = "create",
  children,
  variant = "default",
  styles = "",
  title = "",
}: FormProductProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const form = useForm<FormData>({
    resolver: zodResolver(productFormSchema),
    defaultValues: initialData || {
      name: "",
      price: 0.0,
      stock: 0,
    },
  });
  const isFormDirty = form.formState.isDirty;

  useEffect(() => {
    if (initialData && mode === "edit") {
      form.reset({
        name: initialData.name,
        price: initialData.price,
        stock: initialData.stock,
      });
    }
  }, [initialData, form, mode]);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (isFormDirty) {
        event.preventDefault();
        return "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isFormDirty]);

  const handleClose = () => {
    if (isFormDirty) {
      setShowAlert(true);
    } else {
      setIsOpen(false);
    }
  };

  const handleConfirmClose = () => {
    setIsOpen(false);
    form.reset(initialData);
    setShowAlert(false);
  };

  const handleCancelClose = () => {
    setShowAlert(false);
  };

  const handleOpenSheet = async () => {
    await getInfoBeforeToShow?.();
    setIsOpen(true);
  };

  async function handleSubmit(values: FormData) {
    const result = await onSubmit(values);
    if (result.error) {
      toast.error(result.error || "Error al ejecutar la consulta", {
        description: "Por favor, inténtelo de nuevo",
        classNames: {
          toast: "bg-background",
          icon: "text-red-500",
          title: "text-foreground",
          description: "text-foreground",
        },
      });
      return;
    }
    if (mode === "create") {
      form.reset({
        name: "",
        price: 0.0,
        stock: 0,
      });
      setIsOpen(false);
    } else {
      toast.success("Producto actualizado correctamente", {
        position: "top-center",
        classNames: {
          toast: "bg-background",
          icon: "text-green-500",
          title: "text-foreground",
          description: "text-foreground",
        },
      });
    }
  }
  return (
    <>
      <Sheet
        open={isOpen}
        onOpenChange={(open) => {
          if (!open) {
            handleClose();
          } else {
            setIsOpen(true);
          }
        }}
      >
        <SheetTrigger asChild>
          <Button
            variant={variant}
            onClick={handleOpenSheet}
            className={styles}
            title={title}
          >
            {children}
          </Button>
        </SheetTrigger>
        <SheetContent
          onInteractOutside={handleClose}
          onEscapeKeyDown={handleClose}
          className="!p-0 :focus-visible:outline-none !w-[400px]"
        >
          <ScrollArea className="h-screen p-6">
            <SheetHeader className="px-1">
              <SheetTitle>
                {initialData ? "Editar Producto" : "Crear Producto"}
              </SheetTitle>
            </SheetHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="flex flex-col justify-center px-1"
              >
                <div className="grid gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <Label htmlFor="name">
                          Nombre del Producto{" "}
                          <span className="text-red-600">*</span>
                        </Label>
                        <FormControl>
                          <Input
                            id="name"
                            placeholder=""
                            autoComplete=""
                            className=""
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="stock"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Stock <span className="text-red-600">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min={0}
                              max={100000}
                              {...field}
                              className=""
                              onChange={(e) =>
                                field.onChange(parseInt(e.target.value))
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Costo (S/.) <span className="text-red-600">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min={0}
                              max={100000}
                              step="0.01"
                              {...field}
                              className=""
                              onChange={(e) =>
                                field.onChange(parseFloat(e.target.value))
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <Button
                    disabled={isLoading || (mode === "edit" && !isFormDirty)}
                    type="submit"
                    className="w-full font-semibold flex gap-1"
                  >
                    {isLoading && (
                      <Loader
                        strokeWidth={2}
                        className="animate-spin repeat-infinite !size-4"
                      />
                    )}
                    <span>Guardar</span>
                  </Button>
                </div>
              </form>
            </Form>
          </ScrollArea>
        </SheetContent>
      </Sheet>
      <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              ¿Estás seguro de que quieres cerrar?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Hay cambios sin guardar en el formulario. Si cierras ahora,
              perderás estos cambios.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelClose}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmClose} className="">
              Cerrar sin guardar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
