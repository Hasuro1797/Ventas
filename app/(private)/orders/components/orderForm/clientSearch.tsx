'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader, User } from 'lucide-react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { getAllClients } from '@/actions/client-actions';
import { IClient } from '@/app/(private)/clients/components/table/client.type';

interface ClientSearchProps {
  handleClientSelect: (client: IClient) => void;
}
export default function ClientSearch({ handleClientSelect }: ClientSearchProps) {
  const [clientSearch, setClientSearch] = useState('');
  const [clients, setClients] = useState<IClient[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const debounceClient = useDebouncedCallback(async (value: string) => {
    if (value.trim().length < 2) {
      setClients([]);
      return;
    }
    setLoading(true);
    const res = await getAllClients({
      page: 1,
      pageSize: 20,
      search: value,
      sort: 'name-asc',
    });
    if (res.error) {
      setError(res.error);
      setClients([]);
    } else {
      setClients(res.clients);
    }
    setLoading(false);
  }, 400);

  const handleSelect = (client: IClient) => {
    handleClientSelect(client);
    setClientSearch('');
    setClients([]);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <User className="size-6" />
          Buscar cliente
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Command shouldFilter={false} className='border rounded-lg'>
          <CommandInput
            placeholder='Buscar cliente (mín. 2 caracteres)...'
            value={clientSearch}
            onValueChange={(value) => {
              setClientSearch(value);
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
            {!loading && clientSearch.length >= 2 && clients.length === 0 && (
              <CommandEmpty>No se encontraron clientes.</CommandEmpty>
            )}
            {!loading && error && (
              <CommandEmpty>Hubo un error al buscar clientes.</CommandEmpty>
            )}
            {!loading && clients.length > 0 && (
              <CommandGroup>
                {clients.map((client) => (
                  <CommandItem key={client.id} value={client.name} onSelect={() => handleSelect(client)}>
                    <div>
                      <div className="font-medium">{client.name}</div>
                      <div className="text-sm text-muted-foreground">{client.email}</div>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </CardContent>
    </Card>
  )
}
