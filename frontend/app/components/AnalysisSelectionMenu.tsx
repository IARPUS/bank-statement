'use client';

import React from 'react';
import { MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { useRouter } from 'next/navigation';

const AnalysisSelectionMenu: React.FC = () => {
  const router = useRouter();

  const handlePageChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const selectedPage = event.target.value as string;
    if (selectedPage) {
      router.push(selectedPage); // Navigate to the selected page
    }
  };

  return (
    <FormControl sx={{ minWidth: 200 }} size="small">
      <InputLabel id="page-select-label"></InputLabel>
      <Select
        labelId="page-select-label"
        id="page-select"
        onChange={handlePageChange}
        defaultValue="/main/dashboard/analysis/summary" // Default to Summary page
      >
        <MenuItem value="/main/dashboard/analysis/summary">Summary</MenuItem>
        <MenuItem value="/main/dashboard/analysis/organized-data">Transaction Summaries</MenuItem>
        <MenuItem value="/main/dashboard/analysis/suggestions">Analysis</MenuItem>
      </Select>
    </FormControl>
  );
};

export default AnalysisSelectionMenu;
