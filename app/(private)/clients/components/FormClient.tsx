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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { languages, paidMethods } from "@/lib/utils";
import { ClientSchema, clientFormSchema } from "@/lib/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import CommentSection from "./CommentSection";
import { IClient } from "./table/client.type";
import { SuccessResponseClient } from "@/types/api";

type FormData = ClientSchema;

interface FormReservationProps {
  initialData?: IClient;
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
}: FormReservationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [isCommentDirty, setIsCommentDirty] = useState(false);
  const form = useForm<FormData>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: initialData || {
      name: "",
      email: "",
      phone: "",
    },
  });
  const isFormDirty = form.formState.isDirty;

  const isReallyDirty = isFormDirty || isCommentDirty;

  useEffect(() => {
    if (initialData && mode === "edit") {
      form.reset({
        ...initialData,
        ...(initialData.clientInfo && {
          clientInfo: {
            ...(initialData.clientInfo.preferences && {
              preferences: {
                ...initialData.clientInfo.preferences,
              },
            }),
            ...(initialData.clientInfo.comments && {
              comments: initialData.clientInfo.comments,
            }),
          },
        }),
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

  const ensuredPreferenceInitialized = () => {
    const current = form.getValues("clientInfo.preferences");
    if (!current) {
      form.setValue("clientInfo.preferences", {});
    }
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
        email: "",
        phone: "",
      });
      setIsOpen(false);
    } else {
      toast.success("Cliente actualizado correctamente", {
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
                {initialData ? "Editar Cliente" : "Crear Cliente"}
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
                          Nombres y Apellidos{" "}
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
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <Label htmlFor="email">
                          Correo Electrónico{" "}
                          <span className="text-red-600">*</span>
                        </Label>
                        <FormControl>
                          <Input
                            id="email"
                            type="email"
                            required
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
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <Label htmlFor="phone">
                          Número de Teléfono(opcional)
                        </Label>
                        <FormControl>
                          <Input
                            id="phone"
                            placeholder=""
                            autoComplete=""
                            className=""
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <Separator />
                  <CommentSection onDirtyChange={setIsCommentDirty} />
                  <div className="text-sm text-muted-foreground font-semibold">
                    <span>Preferencias (Opcional)</span>
                  </div>
                  <div className="flex flex-col gap-4">
                    <FormField
                      control={form.control}
                      name="clientInfo.preferences.language"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <Label htmlFor="language">Lenguaje</Label>
                          <Select
                            onValueChange={(value) => {
                              ensuredPreferenceInitialized();
                              form.setValue(
                                "clientInfo.preferences.language",
                                value
                              );
                              field.onChange(value);
                            }}
                            value={field.value}
                          >
                            <FormControl className="w-full">
                              <SelectTrigger>
                                <SelectValue placeholder="Selecciona una opción..." />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {languages.map((type) => (
                                <SelectItem key={type.id} value={type.value}>
                                  {type.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="clientInfo.preferences.paid_method"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <Label htmlFor="language">Método de Pago</Label>
                          <Select
                            onValueChange={(value) => {
                              ensuredPreferenceInitialized();
                              form.setValue(
                                "clientInfo.preferences.paid_method",
                                value
                              );
                              field.onChange(value);
                            }}
                            value={field.value}
                          >
                            <FormControl className="w-full">
                              <SelectTrigger>
                                <SelectValue placeholder="Selecciona una opción..." />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {paidMethods.map((type) => (
                                <SelectItem key={type.id} value={type.value}>
                                  {type.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="clientInfo.preferences.notifications"
                    render={({ field }) => (
                      <FormItem className="flex flex-row gap-3 items-center justify-between rounded-lg border p-2 w-full">
                        <div className="space-y-0.5">
                          <FormLabel className="text-sm">
                            Activar notificaciones
                          </FormLabel>
                          <FormDescription className="text-xs">
                            Recibirás notificaciones por correo electrónico
                            sobre tus reservas y promociones.
                          </FormDescription>
                        </div>
                        <FormControl className="">
                          <Switch
                            checked={field.value}
                            onCheckedChange={(value) => {
                              ensuredPreferenceInitialized();
                              form.setValue(
                                "clientInfo.preferences.notifications",
                                value
                              );
                              field.onChange(value);
                            }}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <Button
                    disabled={isLoading || (mode === "edit" && !isReallyDirty)}
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
