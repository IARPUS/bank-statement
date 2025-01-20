import React from 'react';
import { Metadata } from 'next';

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
        {children}
      </body>
    </html>
  );
};

export default RootLayout;
