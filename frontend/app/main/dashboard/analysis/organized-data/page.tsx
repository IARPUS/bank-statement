'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { produceSummaryOpenAI } from '@/app/utils/files';
import { useBankStatement } from '../../layout';

interface Transaction {
  date: string;
  description: string;
  amount: string; // Updated to handle both numeric and empty string
  paymentMethod: string;
}

interface CategoryData {
  transactions: Transaction[];
  total: string; // Updated to handle string values
}

interface SummaryData {
  totalSpending: string;
  highestCategory: string;
  lowestCategory: string;
}

interface FinancialData {
  categories: Record<string, CategoryData>;
  summary: SummaryData;
}

const FinancialPage: React.FC = () => {
  const { bankStatementText } = useBankStatement();
  const [financialData, setFinancialData] = useState<FinancialData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const theme = useTheme();

  useEffect(() => {
    if (!bankStatementText) {
      setError('No bank statement text available.');
      setLoading(false);
      return;
    }

    const processBankStatement = async () => {
      try {
        const response = await produceSummaryOpenAI(bankStatementText);
        console.log('API Response:', response);

        const processedData: FinancialData = response;
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

  if (loading) return <Typography variant="h6">Loading financial data...</Typography>;
  if (error)
    return (
      <Typography variant="h6" color="error">
        {error}
      </Typography>
    );

  if (!financialData) return null;

  const { categories, summary } = financialData;

  return (
    <Box sx={{ p: 3 }}>
      {/* Summary Section */}
      <Paper sx={{ mb: 4, p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Financial Summary
        </Typography>
        <Typography variant="body1">
          <strong>Total Spending:</strong> ${summary.totalSpending || '0.00'}
        </Typography>
        <Typography variant="body1">
          <strong>Highest Spending Category:</strong> {summary.highestCategory || 'N/A'}
        </Typography>
        <Typography variant="body1">
          <strong>Lowest Spending Category:</strong> {summary.lowestCategory || 'N/A'}
        </Typography>
      </Paper>

      {/* Categories Section */}
      <Typography variant="h5" gutterBottom>
        Spending Categories
      </Typography>
      <Grid container spacing={3}>
        {Object.entries(categories).map(([categoryName, categoryData]) => (
          <Grid item xs={12} md={6} key={categoryName}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                {categoryName}
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>Total:</strong> ${categoryData.total || '0.00'}
              </Typography>
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell>Description</TableCell>
                      <TableCell>Amount</TableCell>
                      <TableCell>Payment Method</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {categoryData.transactions.map((transaction, index) => (
                      <TableRow key={index}>
                        <TableCell>{transaction.date || 'N/A'}</TableCell>
                        <TableCell>{transaction.description || 'N/A'}</TableCell>
                        <TableCell>
                          {transaction.amount ? `$${transaction.amount}` : 'N/A'}
                        </TableCell>
                        <TableCell>{transaction.paymentMethod || 'N/A'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default FinancialPage;
