'use client';

import React, { createContext, useState, useContext } from 'react';
import FileSystemDrawer from '@/app/components/FileSystem/FileSystemDrawer';
// Create a context for the bank statement
const BankStatementContext = createContext<{
  bankStatementText: string;
  setBankStatementText: React.Dispatch<React.SetStateAction<string>>;
} | null>(null);

// Create a custom hook for easier access to the context
export const useBankStatement = () => {
  const context = useContext(BankStatementContext);
  if (!context) {
    throw new Error('useBankStatement must be used within an AnalysisLayout');
  }
  return context;
};

export default function AnalysisLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [bankStatementText, setBankStatementText] = useState<string>('');

  return (
    <BankStatementContext.Provider value={{ bankStatementText, setBankStatementText }}>
      <FileSystemDrawer></FileSystemDrawer>
      <section>{children}</section>
    </BankStatementContext.Provider>
  );
}
