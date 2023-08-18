'use client'

import { getProviders, LiteralUnion, ClientSafeProvider } from "next-auth/react";
import { useState, useEffect } from 'react';
import SignIn from "@/components/SignIn";

export default function SignInPage() {
    const [providers, setProviders] = useState({} as Record<LiteralUnion<string>, ClientSafeProvider> | null);

    useEffect(() => {
        (async () => {
          const res = await getProviders();
          setProviders(res);
        })();
      }, []);
    
    return (
        <SignIn providers={providers}/>
    )
}
