'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader, User } from 'lucide-react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { getAllProducts } from '@/actions/product-actions';
import { IProduct } from '@/app/(private)/products/components/table/product.type';
import { OrderItem } from '@/types/api';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface ProductSearchProps {
  handleProductSelect: (product: IProduct) => void;
  orderItems: OrderItem[];
}
export default function ProductSearch({ handleProductSelect, orderItems }: ProductSearchProps) {
  const [productSearch, setProductSearch] = useState('');
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const debounceClient = useDebouncedCallback(async (value: string) => {
    if (value.trim().length < 2) {
      setProducts([]);
      return;
    }
    setLoading(true);
    const res = await getAllProducts({
      page: 1,
      pageSize: 20,
      search: value,
      sort: 'name-asc',
    });
    if (res.error) {
      setError(res.error);
      setProducts([]);
    } else {
      setProducts(res.products);
    }
    setLoading(false);
  }, 400);

  const handleSelect = (product: IProduct) => {
    console.log("el product es", product)
    const usedInOrder = orderItems.find((item) => item.productId === product.id)?.quantity || 0
    const availableStock = product.stock - usedInOrder
    if (availableStock <= 0) {
      toast.error("Sin stock disponible", {
        description: "El producto no tiene stock disponible",
      })
      return
    }
    handleProductSelect(product);
    setProductSearch('');
    setProducts([]);
  }

  const getAvailableStock = (productId: number) => {
    const product = products.find((p) => p.id === productId)
    if (!product) return 0
    const usedInOrder = orderItems.find((item) => item.productId === productId)?.quantity || 0
    return product.stock - usedInOrder
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <User className="size-6" />
          Buscar producto
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Command shouldFilter={false} className='border rounded-lg'>
          <CommandInput
            placeholder='Buscar producto (mín. 2 caracteres)...'
            value={productSearch}
            onValueChange={(value) => {
              setProductSearch(value);
              debounceClient(value);
            }}
            className='border-0'
          />
          <CommandList className='max-h-[300px] overflow-y-auto'>
            {loading && (
              <div className="flex items-center justify-center p-4">
                <Loader className="h-4 w-4 animate-spin" />
                <span className="ml-2 text-sm">Buscando...</span>
              </div>
            )}
            {!loading && productSearch.length >= 2 && products.length === 0 && (
              <CommandEmpty>No se encontraron productos.</CommandEmpty>
            )}
            {!loading && error && (
              <CommandEmpty>Hubo un error al buscar productos.</CommandEmpty>
            )}
            {!loading && products.length > 0 && (
              <CommandGroup>
                {products.map((product) => {
                  const availableStock = getAvailableStock(product.id)
                  if(availableStock <= 0) return null
                  return(
                    <CommandItem key={product.id} value={product.name} onSelect={() => handleSelect(product)}>
                      <div className='flex flex-col gap-1'>
                        <p className="block font-medium">{product.name}</p>
                        <div className='text-sm flex gap-3'>
                          <span className="font-semibold text-green-600">S/ {product.price.toFixed(2)}</span>
                          <span className="text-muted-foreground">•</span>
                          <span
                            className={cn(
                              "font-medium",
                              availableStock <= 5 && availableStock > 0
                                ? "text-orange-600"
                                : availableStock === 0
                                  ? "text-red-600"
                                  : "text-blue-600",
                            )}
                          >
                            Stock: {availableStock}
                          </span>
                        </div>
                      </div>
                    </CommandItem>
                  )
                })}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </CardContent>
    </Card>
  )
}
