'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

interface FileSystemTreeMenuProps {
  setUploadMenuOpen: (bool: boolean) => void;
  setCreateFolderMenuOpen: (bool: boolean) => void;
  contextMenu: {
    mouseX: number;
    mouseY: number;
    targetType: 'file' | 'folder' | 'empty';
    targetId?: string;
  } | null;
  handleCloseContextMenu: () => void;
}

const FileSystemTreeMenu: React.FC<FileSystemTreeMenuProps> = ({ setUploadMenuOpen, setCreateFolderMenuOpen,
  contextMenu,
  handleCloseContextMenu,
}) => {

  const handleDelete = () => {
    console.log(`Delete ${contextMenu?.targetId}`);
    //TODO: call delete api and remove from list of files
    handleCloseContextMenu();
  };

  const handleUpload = () => {
    setUploadMenuOpen(true)
    handleCloseContextMenu();
  };

  const handleCreateFile = () => {
    console.log('Create new file in top-level directory');
    setCreateFolderMenuOpen(true)
    handleCloseContextMenu();
  };
  return (
    <Box
      sx={{ minHeight: 352, minWidth: 250, position: 'relative' }}
    >
      <Menu
        open={contextMenu !== null}
        onClose={handleCloseContextMenu}
        anchorReference="anchorPosition"
        anchorPosition={
          contextMenu !== null
            ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
            : undefined
        }
      >
        {contextMenu?.targetType === 'file' && (
          <MenuItem onClick={handleDelete}>Delete</MenuItem>
        )}
        {contextMenu?.targetType === 'folder' && (
          <Box>
            <MenuItem onClick={handleUpload}>Upload File</MenuItem>
            <MenuItem onClick={handleDelete}>Delete</MenuItem>
          </Box>
        )}
        {contextMenu?.targetType === 'empty' && (
          <Box>
            <MenuItem onClick={handleUpload}>Upload File</MenuItem>
            <MenuItem onClick={handleCreateFile}>Create New File</MenuItem>
          </Box>
        )}
      </Menu>
    </Box>
  );
}
export default FileSystemTreeMenu