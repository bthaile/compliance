import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TableSortLabel } from '@mui/material';
import { LoanPortfolioRowData } from './loan-portfolio';

// Define a type for the order direction
type Order = 'asc' | 'desc';

// Define a type for the props of the component, if any are needed
interface LoanPortfolioTableProps {
    // Define any props the component might take, such as an array of RowData
    rows: LoanPortfolioRowData[];
}

// Define a type for the key of RowData
type DataKey = keyof LoanPortfolioRowData;

export default function LoanPortfolioTable({ rows }: LoanPortfolioTableProps) {
    const [order, setOrder] = React.useState<Order>('asc');
    const [orderBy, setOrderBy] = React.useState<DataKey>('censusTract');


    const handleSort = (property: DataKey) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    // This function would compare two values based on the order
    const compare = (a: number | string, b: number | string, isAsc: boolean) => {
        if (isAsc) {
            return a < b ? -1 : 1;
        }
        return a > b ? -1 : 1;
    };

    // This function would get the comparator function based on the orderBy and order
    const getComparator = (order: Order, orderBy: DataKey): (a: LoanPortfolioRowData, b: LoanPortfolioRowData) => number => {
        return order === 'desc'
            ? (a, b) => compare(a[orderBy], b[orderBy], false)
            : (a, b) => compare(a[orderBy], b[orderBy], true);
    };

    // Use a stable sort function if needed
    const stableSort = (array: LoanPortfolioRowData[], comparator: (a: LoanPortfolioRowData, b: LoanPortfolioRowData) => number): LoanPortfolioRowData[] => {
        // Implement stable sorting algorithm
        if (!array || array.length === 0) return [];
        return array.sort(comparator);
    };

    // Sort rows
    const sortedRows = stableSort(rows, getComparator(order, orderBy));

    return (
        <TableContainer component={Paper}>
            <Table aria-label="sortable table">
                <TableHead>
                    <TableRow>
                        <TableCell>
                            <TableSortLabel
                                active={orderBy === 'censusTract'}
                                direction={orderBy === 'censusTract' ? order : 'asc'}
                                onClick={() => handleSort('censusTract')}
                            >
                                Census Tract
                            </TableSortLabel>
                        </TableCell>
                        <TableCell>
                            <TableSortLabel
                                active={orderBy === 'assetArea'}
                                direction={orderBy === 'assetArea' ? order : 'asc'}
                                onClick={() => handleSort('assetArea')}
                            >
                                Asset Area
                            </TableSortLabel>
                        </TableCell>
                        <TableCell>
                            <TableSortLabel
                                active={orderBy === 'confirming'}
                                direction={orderBy === 'confirming' ? order : 'asc'}
                                onClick={() => handleSort('confirming')}
                            >
                                Confirming
                            </TableSortLabel>
                        </TableCell>
                        <TableCell>
                            <TableSortLabel
                                active={orderBy === 'loanProduct'}
                                direction={orderBy === 'loanProduct' ? order : 'asc'}
                                onClick={() => handleSort('loanProduct')}
                            >
                                Loan Product
                            </TableSortLabel>
                        </TableCell>
                        <TableCell>
                            <TableSortLabel
                                active={orderBy === 'dwellingType'}
                                direction={orderBy === 'dwellingType' ? order : 'asc'}
                                onClick={() => handleSort('dwellingType')}
                            >
                                Dwelling Type
                            </TableSortLabel>
                        </TableCell>
                        <TableCell>
                            <TableSortLabel
                                active={orderBy === 'ethnicity'}
                                direction={orderBy === 'ethnicity' ? order : 'asc'}
                                onClick={() => handleSort('ethnicity')}
                            >
                                Ethnicity
                            </TableSortLabel>
                        </TableCell>
                        <TableCell>
                        <TableSortLabel
                                active={orderBy === 'race'}
                                direction={orderBy === 'race' ? order : 'asc'}
                                onClick={() => handleSort('race')}
                            >
                                Race
                            </TableSortLabel>
                        </TableCell>
                        <TableCell>
                        <TableSortLabel
                                active={orderBy === 'loanAmount'}
                                direction={orderBy === 'loanAmount' ? order : 'asc'}
                                onClick={() => handleSort('loanAmount')}
                            >
                                Loan Amount
                            </TableSortLabel>
                        </TableCell>
                        <TableSortLabel
                                active={orderBy === 'interestRate'}
                                direction={orderBy === 'interestRate' ? order : 'asc'}
                                onClick={() => handleSort('interestRate')}
                            >
                                Interest Rate
                            </TableSortLabel>
                        <TableCell>
                        <TableSortLabel
                                active={orderBy === 'loanTerm'}
                                direction={orderBy === 'interestRate' ? order : 'asc'}
                                onClick={() => handleSort('interestRate')}
                            >
                                Loan Term
                            </TableSortLabel>
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {sortedRows?.map((row, index) => (
                        <TableRow key={index}>
                            <TableCell>{row.censusTract}</TableCell>
                            <TableCell>{row.assetArea}</TableCell>
                            <TableCell>{row.confirming}</TableCell>
                            <TableCell>{row.loanProduct}</TableCell>
                            <TableCell>{row.dwellingType}</TableCell>
                            <TableCell>{row.ethnicity}</TableCell>
                            <TableCell>{row.race}</TableCell>
                            <TableCell>{row.loanAmount}</TableCell>
                            <TableCell>{row.interestRate}</TableCell>
                            <TableCell>{row.loanTerm}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};
