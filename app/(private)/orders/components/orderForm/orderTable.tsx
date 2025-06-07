import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { OrderItem } from '@/types/api'
import { IProduct } from '@/app/(private)/products/components/table/product.type'
import { Minus, Plus, Trash2 } from 'lucide-react'
import React from 'react'
import { toast } from 'sonner'

interface OrderTableProps {
    orderItems: OrderItem[]
    products: IProduct[]
    handleUpdateQuantity: (productId: number, quantity: number) => void
    handleRemoveItem: (productId: number) => void
}
export default function OrderTable({ orderItems, products, handleUpdateQuantity, handleRemoveItem }: OrderTableProps) {
  const getProductStock = (productId: number): number => {
    const product = products.find(p => p.id === productId);
    return product?.stock || 0;
  };

  const subtotal = orderItems.reduce((acc, item) => acc + item.subtotal, 0)
  const igv = subtotal * 0.18
  const total = subtotal + igv

  const handleQuantityChange = (productId: number, change: number) => {
    const item = orderItems.find((item) => item.productId === productId)
    if (!item) return
    const newQuantity = item.quantity + change
    if (newQuantity <= 0) {
      handleRemoveItem(productId)
      return
    }
    const maxStock = getProductStock(productId)
    if (newQuantity > maxStock) {
      toast.error(`No hay suficiente stock. Stock disponible: ${maxStock}`)
      return
    }
    handleUpdateQuantity(productId, newQuantity)
  }

  if (orderItems.length === 0) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="text-center text-muted-foreground">
            <div className="text-lg font-medium mb-2">No hay productos en la orden</div>
            <div className="text-sm">Busque y agregue productos para comenzar</div>
          </div>
        </CardContent>
      </Card>
    )
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Productos en la Orden ({orderItems.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Producto</TableHead>
              <TableHead className="text-right">Precio Unit.</TableHead>
              <TableHead className="text-center">Cantidad</TableHead>
              <TableHead className="text-right">Subtotal</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orderItems.map((item) => (
              <TableRow key={item.productId}>
                <TableCell>
                  <div className="font-medium">{item.productName}</div>
                </TableCell>
                <TableCell className="text-right font-medium">S/ {item.price.toFixed(2)}</TableCell>
                <TableCell>
                  <div className="flex items-center justify-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuantityChange(item.productId, -1)}
                      className="h-8 w-8 p-0"
                      disabled={item.quantity <= 1}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-12 text-center font-medium">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuantityChange(item.productId, 1)}
                      className="h-8 w-8 p-0"
                      disabled={item.quantity >= getProductStock(item.productId)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </TableCell>
                <TableCell className="text-right font-semibold">S/ {item.subtotal.toFixed(2)}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm" onClick={() => handleRemoveItem(item.productId)}>
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Totales */}
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
            <span className="text-green-600">S/ {total.toFixed(2)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
