'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Divider,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { analyzeOpenAI } from '@/app/utils/files';
import { useBankStatement } from '../../layout';

interface FinancialData {
  [title: string]: {
    [bullet: string]: string;
  };
}

const FinancialAnalysisPage: React.FC = () => {
  const [financialData, setFinancialData] = useState<FinancialData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { bankStatementText } = useBankStatement();

  useEffect(() => {
    if (!bankStatementText) {
      setError('No bank statement text available.');
      setLoading(false);
      return;
    }

    const processBankStatement = async () => {
      try {
        const processedData: FinancialData = await analyzeOpenAI(bankStatementText);
        setFinancialData(processedData);
      } catch (err: any) {
        console.error('Error processing bank statement:', err);
        setError('Failed to process bank statement.');
      } finally {
        setLoading(false);
      }
    };

    processBankStatement();
  }, [bankStatementText]);

  if (loading) {
    return <Typography variant="h6">Loading financial data...</Typography>;
  }

  if (error) {
    return (
      <Box>
        <Typography variant="h6" color="error">
          Error: {error}
        </Typography>
      </Box>
    );
  }

  if (!financialData) {
    return (
      <Typography variant="h6">No financial data available.</Typography>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Analysis Overview
      </Typography>

      <Grid container spacing={3}>
        {Object.entries(financialData).map(([title, bullets]) => (
          <Grid item xs={12} md={6} key={title}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Typography variant="h5" gutterBottom>
                {title}
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <List>
                {Object.entries(bullets).map(([bulletTitle, bulletText]) => (
                  <ListItem key={bulletTitle} disablePadding>
                    <ListItemText
                      primary={bulletTitle}
                      secondary={bulletText}
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default FinancialAnalysisPage;
