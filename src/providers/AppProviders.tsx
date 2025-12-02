import React from "react";
import StoreProvider from "@/app/StoreProvider.jsx";
import { Toaster } from "react-hot-toast";
import { HelmetProvider } from "react-helmet-async";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LanguageCurrencyProvider } from "@/contexts/LanguageCurrencyContext";

const queryClient = new QueryClient();

export default function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <StoreProvider>
          <LanguageCurrencyProvider>
            {children}
            <Toaster />
          </LanguageCurrencyProvider>
        </StoreProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}


