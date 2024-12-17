'use client';

import { SessionProvider } from "next-auth/react";
import { FC, PropsWithChildren } from 'react';

//クライアント側でセッション情報を管理するにはSessionProviderで全体をラップする
export const NextAuthProvider: FC<PropsWithChildren> = ({ children }) => {
    return <SessionProvider>{children}</SessionProvider>;
}