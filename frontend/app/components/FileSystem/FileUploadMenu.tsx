'use client';

import React, { useState } from 'react';
import { uploadFile } from '@/app/utils/files';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { styled } from '@mui/material/styles';

const FileInput = styled('input')({
  display: 'none',
});

const FileUploadMenu: React.FC<{ open: boolean; setOpen: (bool: boolean) => void; currentPath: string }> = ({ open, setOpen, currentPath }) => {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert('Please select a file first.');
      return;
    }
    try {
      await uploadFile('iarpus-bankstatement', currentPath.replace(/\/$/, ""), file);
      alert('File uploaded successfully!');
      setFile(null);
      setOpen(false);
    } catch (error) {
      console.error('File upload failed:', error);
      alert('File upload failed. Please try again.');
    }
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
      <DialogTitle>Upload a File</DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
          <Typography variant="body1" textAlign="center">
            Select a PDF file to upload to the current directory.
          </Typography>
          <label htmlFor="file-upload">
            <FileInput
              id="file-upload"
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
            />
            <Button variant="contained" component="span">
              {file ? file.name : 'Choose File'}
            </Button>
          </label>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpen(false)} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleUpload} variant="contained" color="primary">
          Upload
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FileUploadMenu;
