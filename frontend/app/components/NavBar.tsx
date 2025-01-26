'use client';

import React from 'react';
import Link from 'next/link';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

export default function NavBar() {
  return (
    <AppBar position="static">
      <Toolbar>
        {/* Logo / App Title */}
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          My App
        </Typography>

        {/* Nav Links */}
        <Button color="inherit" component={Link} href="/main">
          Home
        </Button>
        <Button color="inherit" component={Link} href="/main/dashboard">
          Dashboard
        </Button>
        <Button color="inherit" component={Link} href="/help">
          Help
        </Button>
      </Toolbar>
    </AppBar>
  );
}
