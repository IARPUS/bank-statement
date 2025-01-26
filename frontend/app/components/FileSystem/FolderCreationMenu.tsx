'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { createNewDirectory } from '@/app/utils/files'; // Assume this utility function handles directory creation

// Modal styling
const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: '8px',
};

interface CreateDirectoryModalProps {
  open: boolean;
  setOpen: (value: boolean) => void;
}

const FolderCreationMenu: React.FC<CreateDirectoryModalProps> = ({
  open,
  setOpen,
}) => {
  const [directoryName, setDirectoryName] = React.useState<string>('');

  const handleSubmit = async () => {
    if (directoryName.trim() === '') {
      alert('Directory name cannot be empty.');
      return;
    }

    try {
      // Simulate directory creation
      await createNewDirectory('iarpus-bankstatement', 'user1', directoryName.trim());
      alert(`Directory "${directoryName}" created successfully.`);
    } catch (error) {
      console.error('Error creating directory:', error);
      alert('Failed to create directory.');
    } finally {
      setDirectoryName(''); // Reset input field
      setOpen(false); // Close the modal
    }
  };

  const handleClose = () => {
    setDirectoryName(''); // Reset input field
    setOpen(false); // Close the modal
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={modalStyle}>
        <Typography variant="h6" component="h2" gutterBottom>
          Create New Directory
        </Typography>
        <TextField
          fullWidth
          label="Directory Name"
          value={directoryName}
          onChange={(e) => setDirectoryName(e.target.value)}
          variant="outlined"
          margin="normal"
        />
        <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 2 }}>
          <Button onClick={handleClose} variant="outlined">
            Cancel
          </Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Create
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
};

export default FolderCreationMenu;
