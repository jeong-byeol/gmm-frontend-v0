"use client"

import { type PropsWithChildren } from "react"
import web3AuthContextConfig from "@/lib/web3auth"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Web3AuthReact = require("@web3auth/modal/react") as {
  Web3AuthProvider: (props: PropsWithChildren<{ config: unknown; initialState?: unknown }>) => JSX.Element
}
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Web3AuthWagmi = require("@web3auth/modal/react/wagmi") as {
  WagmiProvider: (props: PropsWithChildren) => JSX.Element
}

const queryClient = new QueryClient()

export function Providers({ children }: PropsWithChildren) {
  return (
    <Web3AuthReact.Web3AuthProvider config={web3AuthContextConfig}>
      <QueryClientProvider client={queryClient}>
        <Web3AuthWagmi.WagmiProvider>
          {children}
        </Web3AuthWagmi.WagmiProvider>
      </QueryClientProvider>
    </Web3AuthReact.Web3AuthProvider>
  )
}


