'use client'

import 'tailwindcss/tailwind.css'

import { HuddleClient, HuddleProvider } from "@huddle01/react";
import React from "react";
 
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
 
  const huddleClient = new HuddleClient({
    projectId: "4v2R9A9qCNcW1FzH72lHhDPCTcpJNpme"!,
  });
 
  return (
    <html lang="en">
      <body>
        <HuddleProvider client={huddleClient}>
          {children}
        </HuddleProvider>
      </body>
    </html>
  );
}