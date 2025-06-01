// app/providers.tsx
import { LoadingProvider } from "@/components/loading/loading-context";

export function Providers({ children }: { children: React.ReactNode }) {
    return <LoadingProvider>{children}</LoadingProvider>;
}