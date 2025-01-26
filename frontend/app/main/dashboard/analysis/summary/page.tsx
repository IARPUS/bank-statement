'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useBankStatement } from '../../layout'
import { parseBankStatementText } from '@/app/utils/files';
interface Transaction {
  date: string;
  description: string;
  debit?: string;
  credit?: string;
  balance?: string;
}

interface OrganizedResponse {
  accountInfo: Record<string, string>;
  transactions: Transaction[];
}

const FinancialSummaryPage: React.FC = () => {
  const { bankStatementText } = useBankStatement(); // Access the bank statement text
  const [data, setData] = useState<OrganizedResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("PARSING:", bankStatementText)
    if (!bankStatementText) {
      setError('No bank statement text available.');
      setLoading(false);
      return;
    }

    const processBankStatement = async () => {
      try {
        // Replace this with the actual processing logic (e.g., API call to process text)
        const response = await parseBankStatementText(bankStatementText)
        console.log(response)
        const processedData: OrganizedResponse = response
        setData(processedData);
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
    return <Typography variant="h6">Loading data...</Typography>;
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

  if (!data) {
    return (
      <Typography variant="h6">
        No data available.
      </Typography>
    );
  }

  const transactionsForGraph = data.transactions.map((transaction) => ({
    date: transaction.date,
    debit: transaction.debit ? parseFloat(transaction.debit) : 0,
    credit: transaction.credit ? parseFloat(transaction.credit) : 0,
    balance: transaction.balance ? parseFloat(transaction.balance) : 0,
  }));

  return (
    <Box sx={{ p: 3 }}>
      {/* Summary Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Account Summary
        </Typography>
        <Paper sx={{ p: 3 }}>
          {Object.entries(data.accountInfo).map(([key, value]) => (
            <Typography key={key} variant="body1">
              <strong>{key}:</strong> {value}
            </Typography>
          ))}
        </Paper>
      </Box>

      {/* Graph Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Transaction Analysis
        </Typography>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={transactionsForGraph} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="debit" stroke="#ff7300" name="Debit" />
            <Line type="monotone" dataKey="credit" stroke="#387908" name="Credit" />
            <Line type="monotone" dataKey="balance" stroke="#003f5c" name="Balance" />
          </LineChart>
        </ResponsiveContainer>
      </Box>

      {/* Transactions Table */}
      <Box>
        <Typography variant="h5" gutterBottom>
          Transactions
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Debit</TableCell>
                <TableCell>Credit</TableCell>
                <TableCell>Balance</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.transactions.map((transaction, index) => (
                <TableRow key={index}>
                  <TableCell>{transaction.date}</TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell>{transaction.debit || '-'}</TableCell>
                  <TableCell>{transaction.credit || '-'}</TableCell>
                  <TableCell>{transaction.balance || '-'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default FinancialSummaryPage;