// app/(app)/layout.tsx

import { AppLayoutClient } from '@/components/layout/app-layout-client';
import { ReactNode } from 'react';

export default function AppLayout({ children }: { children: ReactNode }) {
    return <AppLayoutClient>{children}</AppLayoutClient>;
}