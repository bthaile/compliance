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

export default function CensusTracksTable ({ rows }: CensusTracksTableProps) {
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
                                active={orderBy === 'totalPop'}
                                direction={orderBy === 'totalPop' ? order : 'asc'}
                                onClick={() => handleSort('totalPop')}
                            >
                                Total Population
                            </TableSortLabel>
                        </TableCell>
                        <TableCell>
                            <TableSortLabel
                                active={orderBy === 'totalOriginations'}
                                direction={orderBy === 'totalOriginations' ? order : 'asc'}
                                onClick={() => handleSort('totalOriginations')}
                            >
                                Total Originations
                            </TableSortLabel>
                        </TableCell>
                        <TableCell>
                            <TableSortLabel
                                active={orderBy === 'myOriginations'}
                                direction={orderBy === 'myOriginations' ? order : 'asc'}
                                onClick={() => handleSort('myOriginations')}
                            >
                                My Originations
                            </TableSortLabel>
                        </TableCell>
                        <TableCell>
                            <TableSortLabel
                                active={orderBy === 'myPct'}
                                direction={orderBy === 'myPct' ? order : 'asc'}
                                onClick={() => handleSort('myPct')}
                            >
                                My Pct
                            </TableSortLabel>
                        </TableCell>
                        <TableCell>
                            <TableHead>
                                LMI Area
                            </TableHead>
                        </TableCell>
                        <TableCell>
                            <TableHead>
                                Minority Area
                            </TableHead>
                        </TableCell>
                        <TableCell>
                            <TableHead>
                                Minority Count
                            </TableHead>
                        </TableCell>
                        <TableCell>
                            <TableHead>
                                Minority Pct
                            </TableHead>
                        </TableCell>
                        <TableCell>
                            <TableHead>
                                Hispanic Area
                            </TableHead>
                        </TableCell>
                        <TableCell>
                            <TableHead>
                                Hispanic Count
                            </TableHead>
                        </TableCell>
                        <TableCell>
                            <TableHead>
                                Hispanic Pct
                            </TableHead>
                        </TableCell>
                        <TableCell>
                            <TableHead>
                                AA Area
                            </TableHead>
                        </TableCell>
                        <TableCell>
                            <TableHead>
                                AA Count
                            </TableHead>
                        </TableCell>
                        <TableCell>
                            <TableHead>
                                AA Pct
                            </TableHead>
                        </TableCell>
                        <TableCell>
                            <TableHead>
                                Hispanic Individual
                            </TableHead>
                        </TableCell>
                        <TableCell>
                            <TableHead>
                                Hispanic Individual Count
                            </TableHead>
                        </TableCell>
                        <TableCell>
                            <TableHead>
                                Hispanic Individual Pct
                            </TableHead>
                        </TableCell>
                        <TableCell>
                            <TableHead>
                                AA Individual
                            </TableHead>
                        </TableCell>
                        <TableCell>
                            <TableHead>
                                AA Individual Count
                            </TableHead>
                        </TableCell>
                        <TableCell>
                            <TableHead>
                                AA Individual Pct
                            </TableHead>
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {sortedRows.map((row, index) => (
                        <TableRow key={index}>
                            <TableCell>{row.censusTract}</TableCell>
                            <TableCell>{row.totalPop}</TableCell>
                            <TableCell>{row.totalOriginations}</TableCell>
                            <TableCell>{row.myOriginations}</TableCell>
                            <TableCell>{row.myPct}</TableCell>
                            <TableCell>{row.lmiArea ? <CheckIcon /> : ''}</TableCell>
                            <TableCell>{row.minorityArea ? <CheckIcon /> : ''}</TableCell>
                            <TableCell>{row.minorityCount}</TableCell>
                            <TableCell>{row.minorityPct}</TableCell>
                            <TableCell>{row.hispanicArea ? <CheckIcon /> : ''}</TableCell>
                            <TableCell>{row.hispanicCount}</TableCell>
                            <TableCell>{row.hispanicPct}</TableCell>
                            <TableCell>{row.aaArea ? <CheckIcon /> : ''}</TableCell>
                            <TableCell>{row.aaCount}</TableCell>
                            <TableCell>{row.aaPct}</TableCell>
                            <TableCell>{row.hispIndivOriginations}</TableCell>
                            <TableCell>{row.myHistIndivOriginations}</TableCell>
                            <TableCell>{row.aaIndivOriginations}</TableCell>
                            <TableCell>{row.myAaIndivOriginations}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};
