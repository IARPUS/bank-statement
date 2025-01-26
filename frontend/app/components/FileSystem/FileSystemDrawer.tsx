'use client';
import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import FileSystemTree from './FileSystemTree';
import FolderIcon from '@mui/icons-material/Folder';
export default function FileSystemDrawer() {
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation">
      <Box>
        <Button onClick={toggleDrawer(false)}><FolderIcon></FolderIcon></Button>
        <FileSystemTree />
      </Box>
    </Box>
  );

  return (
    <div>
      <Button onClick={toggleDrawer(true)}><FolderIcon></FolderIcon></Button>
      <Drawer open={open}>
        {DrawerList}
      </Drawer>
    </div>
  );
}