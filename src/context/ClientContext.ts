'use client';
import { ProductOptions } from '@/model/ProductOptions';
import { createContext, useContext } from 'react';

export interface ClientData {
  product: ProductOptions;
  organizationId: string;
  clientId: string;
  clientSecret: string;
}

export interface ClientContextType {
  clients: ClientData[];
  addClient: (client: ClientData) => void;
  removeClient: (clientId: string) => void;
  updateClient: (clientId: string, client: ClientData) => void;
}

export const ClientContext = createContext<ClientContextType | undefined>(
  undefined
);

export const useClientContext = () => {
  const context = useContext(ClientContext);

  if (!context) {
    throw new Error('useClientContext must be used within a ClientProvider');
  }
  return context;
};
