import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TableSortLabel } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import { CensusTrackRowData } from './compliance';


// Define a type for the order direction
type Order = 'asc' | 'desc';

// Define a type for the props of the component, if any are needed
interface CensusTracksTableProps {
    // Define any props the component might take, such as an array of CensusTrackRowData
    rows: CensusTrackRowData[];
}

// Define a type for the key of CensusTrackRowData
type DataKey = keyof CensusTrackRowData;

export default function CensusTracksTable({ rows }: CensusTracksTableProps) {
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
    const getComparator = (order: Order, orderBy: DataKey): (a: CensusTrackRowData, b: CensusTrackRowData) => number => {
        return order === 'desc'
            ? (a, b) => compare(a[orderBy], b[orderBy], false)
            : (a, b) => compare(a[orderBy], b[orderBy], true);
    };

    // Use a stable sort function if needed
    const stableSort = (array: CensusTrackRowData[], comparator: (a: CensusTrackRowData, b: CensusTrackRowData) => number): CensusTrackRowData[] => {
        // Implement stable sorting algorithm
        if (!array || array.length === 0) return [];
        return array.sort(comparator);
    };

    // Sort rows
    const sortedRows = stableSort(rows, getComparator(order, orderBy));

    const MyTableHeader = (name: string, label: string) => {
        return (
            <TableSortLabel
                active={orderBy === name}
                direction={orderBy === name ? order : 'asc'}
                onClick={() => handleSort(name)}
            >
                {label}
            </TableSortLabel>
        );
    }

    return (
        <TableContainer component={Paper}>
            <Table aria-label="sortable table">
                <TableHead>
                    <TableRow>
                        <TableCell>
                            {MyTableHeader("tractName", "Census Tract")}
                        </TableCell>
                        <TableCell>
                            {MyTableHeader("totalPop", "Total Population")}
                        </TableCell>
                        <TableCell>
                            {MyTableHeader("totalOrig", "Total Originations")}
                        </TableCell>
                        <TableCell>
                            {MyTableHeader("myOrig", "My Originations")}
                        </TableCell>
                        <TableCell>
                            {MyTableHeader("lmi", "LMI Area",)}
                        </TableCell>
                        <TableCell>
                            {MyTableHeader("minority", "Minority Area")}
                        </TableCell>
                        <TableCell>
                            {MyTableHeader("hispanic", "Hispanic Area")}
                        </TableCell>
                        <TableCell>
                            {MyTableHeader("aa", "AA Area")}
                        </TableCell>
                        <TableCell>
                            {MyTableHeader("hispanicAA", "Hispanic AA Area")}
                        </TableCell>
                        <TableCell>
                            {MyTableHeader("minorityPop", "Minority Population")}
                        </TableCell>
                        <TableCell>
                            {MyTableHeader("minorityPop", "Hispanic Population")}
                        </TableCell>
                        <TableCell>
                            {MyTableHeader("aaPop", "AA Population")}
                        </TableCell>
                        <TableCell>
                            {MyTableHeader("hispOrig", "Hispanic Originations")}
                        </TableCell>
                        <TableCell>
                            {MyTableHeader("myHispOrig", "My Hispanic Originations")}
                        </TableCell>
                        <TableCell>
                            {MyTableHeader("aaOrig", "AA Originations")}
                        </TableCell>
                        <TableCell>
                            {MyTableHeader("myAaOrig", "My AA Originations")}
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {sortedRows.map((row, index) => (
                        <TableRow key={index}>
                            <TableCell>{row.tractName}</TableCell>
                            <TableCell>{row.totalPop}</TableCell>
                            <TableCell>{row.totalOrig}</TableCell>
                            <TableCell>{row.myOrig}</TableCell>
                            <TableCell>{row.lmi ? <CheckIcon /> : ''}</TableCell>
                            <TableCell>{row.minority ? <CheckIcon /> : ''}</TableCell>
                            <TableCell>{row.hispanic ? <CheckIcon /> : ''}</TableCell>
                            <TableCell>{row.aa ? <CheckIcon /> : ''}</TableCell>
                            <TableCell>{row.hispanicAA ? <CheckIcon /> : ''}</TableCell>
                            <TableCell>{row.minorityPop}</TableCell>
                            <TableCell>{row.hispPop}</TableCell>
                            <TableCell>{row.aaPop}</TableCell>
                            <TableCell>{row.hispOrig}</TableCell>
                            <TableCell>{row.myHispOrig}</TableCell>
                            <TableCell>{row.aaOrig}</TableCell>
                            <TableCell>{row.myAaOrig}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};
