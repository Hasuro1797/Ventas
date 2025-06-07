'use client'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Calendar, Eye, IdCard, Loader2, Mail, Phone, User } from "lucide-react"
import { useState } from "react"
import { IOrder } from "./order.type"
import { getOrderById } from "@/actions/order-actions"
import { toast } from "sonner"
import { formatDate } from "@/lib/utils"
import { TableBody, TableCell, TableHead, TableHeader, TableRow, Table } from "@/components/ui/table"

export function OrderDetail({orderId}: {orderId: number}) {
  const [loading, setLoading] = useState(false)
  const [orderDetail, setOrderDetail] = useState<IOrder | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleGetOrderDetail = async (orderId: number) => {
    setLoading(true)
    setError(null)
    try { 
      const res = await getOrderById(orderId)
      if (res.error) {
        toast.error("Error", {
          description: res.error,
        })
        setLoading(false)
        return
      }
      setOrderDetail(res.order)
      setLoading(false)
    } catch (error) {
      console.error(error)
      toast.error("Error", {
        description: "Error al obtener el detalle de la orden",
      })
      setLoading(false)
    }
  }
  const subtotal = orderDetail?.details.reduce((acc, item) => acc + item.subtotal, 0) || 0
  const igv = subtotal * 0.18
  return (
    <div className="flex items-center justify-center">
      <Dialog modal>
        <DialogTrigger asChild>
          <Button className="mx-auto" variant="outline" size="icon" onClick={() => handleGetOrderDetail(orderId)}>
            <Eye className="size-4"/>
          </Button>
        </DialogTrigger>
        <DialogContent
          className="sm:max-w-[600px] lg:max-w-[670px] xl:max-w-[750px]"
          aria-describedby={undefined}
        >
          <DialogHeader>
            <DialogTitle>Detalle de la Orden</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 h-[70vh] px-4 overflow-y-auto">
            {
              loading ? (
                <div className="flex-1 flex items-center justify-center">
                  <Loader2 className="animate-spin"/>
                </div>
              ) : error ? (
                <div className="flex-1 flex items-center justify-center">
                  <span className="text-red-500">Error al obtener el detalle de la orden</span>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-2 p-4 border rounded-md">
                    <div>
                      <div className="flex gap-2 items-center mb-3">
                        <User className="size-4 text-muted-foreground"/>
                        <span className="font-semibold text-muted-foreground">Datos del cliente</span>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <IdCard className="size-4 text-muted-foreground"/>
                          <span className="font-medium text-muted-foreground">Señor(es):</span>
                          <span>{orderDetail?.client.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="size-4 text-muted-foreground"/>
                          <span className="font-medium text-muted-foreground">Email:</span>
                          <span>{orderDetail?.client.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="size-4 text-muted-foreground"/>
                          <span className="font-medium text-muted-foreground">Teléfono:</span>
                          <span>{orderDetail?.client.phone || "No registrado"}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="flex gap-2 items-center mb-3">
                        <Calendar className="size-4 text-muted-foreground"/>
                        <span className="font-semibold text-muted-foreground">Información del Comprobante</span>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-muted-foreground">Fecha de Emisión:</span>
                          <span>{formatDate(orderDetail?.date || new Date().toISOString())}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-muted-foreground">Tipo de Moneda:</span>
                          <span>SOLES</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-muted-foreground">Condición:</span>
                          <span>CONTADO</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Producto</TableHead>
                        <TableHead className="text-right">Precio Unit.</TableHead>
                        <TableHead className="text-center">Cantidad</TableHead>
                        <TableHead className="text-right">Subtotal</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orderDetail?.details?.map((item) => (
                        <TableRow key={item.productId}>
                          <TableCell>
                            <div className="">{item.product.name}</div>
                          </TableCell>
                          <TableCell className="text-right">S/ {item.product.price.toFixed(2)}</TableCell>
                          <TableCell>
                            <div className="flex items-center justify-center gap-2">
                              <span className="w-12 text-center">{item.quantity}</span> 
                            </div>
                          </TableCell>
                          <TableCell className="text-right">S/ {item.subtotal.toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <div className="mt-6 space-y-3 border-t pt-4">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal:</span>
                      <span className="font-medium">S/ {subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>IGV (18%):</span>
                      <span className="font-medium">S/ {igv.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold border-t pt-3">
                      <span>Total:</span>
                      <span className="text-green-600">S/ {orderDetail?.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              )
            }
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

