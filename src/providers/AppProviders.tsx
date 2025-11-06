import React from "react";
import StoreProvider from "@/app/StoreProvider.jsx";
import { Toaster } from "react-hot-toast";
import { HelmetProvider } from "react-helmet-async";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <StoreProvider>
          {children}
          <Toaster />
        </StoreProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}


