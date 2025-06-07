'use client';
import { IClient } from '@/app/(private)/clients/components/table/client.type';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Loader2, RotateCcw, ShoppingCart } from 'lucide-react'
import React from 'react'
import { toast } from 'sonner';
import ClientSearch from './clientSearch';
import { IProduct } from '@/app/(private)/products/components/table/product.type';
import ProductSearch from './productSearch';
import OrderTable from './orderTable';
import { createOrderAction } from '@/actions/order-actions';

interface OrderItem {
  productId: number
  productName: string
  price: number
  quantity: number
  subtotal: number
}
export default function OrderForm() {
  const [selectedClient, setSelectedClient] = React.useState<IClient | null>(null);
  const [orderItems, setOrderItems] = React.useState<OrderItem[]>([]);
  const [products, setProducts] = React.useState<IProduct[]>([]);
  const [loading, setLoading] = React.useState(false);

  const handleClientSelect = (client: IClient) => {
    setSelectedClient(client);
  }
  const clearOrder = () => {
    setOrderItems([])
    setSelectedClient(null)
    toast.success("Orden limpiada", {
      description: "Se ha limpiado toda la orden",
    })
  }

  const handleAddProduct = (product: IProduct) => {
    const existingProduct = orderItems.find((item) => item.productId === product.id);
    if (existingProduct) {
      toast.info("Producto ya agregado", {
        description: "Use los botones +/- para ajustar la cantidad",
      })
      return
    }

    setProducts((prev) => [...prev, product]);
    
    const newItem: OrderItem = {
      productId: product.id,
      productName: product.name,
      price: product.price,
      quantity: 1,
      subtotal: product.price,
    }
    setOrderItems((prev) => [...prev, newItem])
    toast.success("Producto agregado", {
      description: "Se ha agregado el producto a la orden",
    })
  }

  const handleUpdateQuantity = (productId: number, newQuantity: number) => {
    setOrderItems((prev) => 
      prev.map(item => 
        item.productId === productId ? {
          ...item, 
          quantity: newQuantity, 
          subtotal: item.price * newQuantity
        } : item
      )
    )
  }

  const handleRemoveItem = (productId: number) => {
    const removedItem = orderItems.find((item) => item.productId === productId)
    setOrderItems((prev) => prev.filter(item => item.productId !== productId))
    if(removedItem) {
      toast.success("Producto removido", {
        description: `Se ha removido ${removedItem.productName} de la orden`,
      })
    }
  }

  const subtotal = orderItems.reduce((sum, item) => sum + item.subtotal, 0)
  const igv = subtotal * 0.18
  const total = subtotal + igv
  
  const handleSubmitOrder = async () => {
    setLoading(true)
    if (!selectedClient) {
      toast.error("Error", {
        description: "Debe seleccionar un cliente",
      })
      setLoading(false)
      return
    }
    if (orderItems.length === 0) {
      toast.error("Error", {
        description: "Debe agregar al menos un producto",
      })
      setLoading(false)
      return
    }
    const subtotal = orderItems.reduce((sum, item) => sum + item.subtotal, 0)
    const igv = subtotal * 0.18
    const total = subtotal + igv

    const orderData = {
      clientId: selectedClient.id,
      total,
      items: orderItems.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        subtotal: item.subtotal
      }))
    }
    const res = await createOrderAction(orderData)
    setLoading(false)
    if (res.error) {
      toast.error("Error", {
        description: res.error,
      })
      return
    }
    toast.success("Orden creada", {
      description: "Se ha creado la orden",
    })
    setOrderItems([])
    setSelectedClient(null)
  }
  return (
    <div className='max-w-6xl mx-auto p-6 space-y-6'>
      <Card>
        <CardHeader>
          <div className='flex justify-between items-center'>
            <div>
              <CardTitle className='flex items-center gap-2'>
                <ShoppingCart className='size-6' />
                Crear Nueva Orden
              </CardTitle>
              <CardDescription>Seleccione un cliente y agrege productos a la orden</CardDescription>
            </div>
            {(selectedClient || orderItems.length > 0) && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <RotateCcw className="size-4 mr-2" />
                    Limpiar Orden
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>¿Limpiar orden?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta acción eliminará todos los productos de la orden y deseleccionará el cliente. Esta acción no
                      se puede deshacer.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={clearOrder}>Limpiar</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </CardHeader>
        <CardContent className='space-y-6'>
          <div className='space-y-2'>
            <ClientSearch handleClientSelect={handleClientSelect} />
            {/* Cliente seleccionado */}
            {selectedClient && (
              <div className="p-4 bg-muted border rounded-lg">
                <div className="mb-2">
                  <span className="font-medium">Cliente seleccionado</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <span className="text-sm text-muted-foreground font-medium">Nombre:</span>
                    <p className="font-medium">{selectedClient.name}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground font-medium">Email:</span>
                    <p className="font-medium">{selectedClient.email}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground font-medium">Teléfono:</span>
                    <p className="font-medium">{selectedClient.phone || "No registrado"}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
          {selectedClient && <ProductSearch orderItems={orderItems} handleProductSelect={handleAddProduct} />}  
          <OrderTable 
            orderItems={orderItems}
            products={products}
            handleUpdateQuantity={handleUpdateQuantity}
            handleRemoveItem={handleRemoveItem}
          />
          {selectedClient && (
            <div className="flex justify-end pt-4">
              <Button
                size="lg"
                onClick={handleSubmitOrder}
                disabled={orderItems.length === 0 || loading}
                className="min-w-[200px]"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <ShoppingCart className="w-4 h-4 mr-2" />
                )}
                Crear Orden {total > 0 && `(S/ ${total.toFixed(2)})`}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
