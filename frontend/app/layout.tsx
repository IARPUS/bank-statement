import React from 'react';
import { CssBaseline } from '@mui/material';
import { Metadata } from 'next';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
export const metadata: Metadata = {
  title: 'Your App Title',
  description: 'A description of your app',
};

const RootLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <html lang="en">
      <head>
        {/* Next.js will automatically inject necessary scripts and metadata */}
      </head>
      <body>
        <AppRouterCacheProvider>
          <CssBaseline />
          {children}
        </AppRouterCacheProvider>
      </body>
    </html>
  );
};

export default RootLayout;
