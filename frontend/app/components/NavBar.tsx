'use client'; // Only needed if you're using Next.js 13+ App Router in a server component folder

import React from 'react';
import Link from 'next/link'; // If using Next.js
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

export default function NavBar() {
  return (
    <AppBar position="static" /* or "fixed" if you want it to stay on top while scrolling */>
      <Toolbar>
        {/* Logo / App Title */}
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          My App
        </Typography>

        {/* Nav Links */}
        <Button color="inherit" component={Link} href="/">
          Home
        </Button>
        <Button color="inherit" component={Link} href="/dashboard">
          Dashboard
        </Button>
        <Button color="inherit" component={Link} href="/help">
          Help
        </Button>
      </Toolbar>
    </AppBar>
  );
}
