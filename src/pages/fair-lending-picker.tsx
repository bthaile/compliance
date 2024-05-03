import React, { useState } from 'react';
import { FormControl, InputLabel, Select, MenuItem, Button, Box, Paper, CircularProgress } from '@mui/material';

type FairLendingPickerProps = {
    isLoading: boolean;
    receiveValues: (values: { year: string, type: string, fairLendingType: string, city: string }) => void;
};

export default function FairLendingPicker({ isLoading, receiveValues }: FairLendingPickerProps) {
    const years = ['2023', '2022', '2021', '2020', '2019'];
    const fairLoanTypes = ['LMI Area', 'Minority Area', 'Hispanic Area', 'AA Area', 'Hispanic Individual', 'AA Individual' ]
    const types = ['Total Counts', 'First Mortgages', 'Second Mortgages'];
    const cities = ['Dallas', 'Austin', 'Houston', 'San Antonio', 'El Paso'];

    const [year, setYear] = useState(years[0]);
    const [fairLendingType, setFairLendingType] = useState(fairLoanTypes[0]);
    const [city, setCity] = useState(cities[0]);
    const [type, setType] = useState(types[0]);


    // Handle the form submission
    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        // Insert what you want to do on form submit
        receiveValues({ year, type, fairLendingType, city })
    };

    const resetValues = () => {
        setYear(years[0]);
        setFairLendingType(fairLoanTypes[0]);
        setCity(cities[0]);
    }

    return (
            <Paper elevation={3} style={{ padding: '1rem', margin: '1rem' }}>
                <form onSubmit={handleSubmit}>
                    <FormControl fullWidth margin="normal">
                        <InputLabel id="year-select-label">Year</InputLabel>
                        <Select
                            labelId="year-select-label"
                            id="year-select"
                            value={year}
                            label="Year"
                            onChange={(e) => setYear(e.target.value )}
                        >
                            {years?.map((year) => (
                                <MenuItem key={year} value={year}>
                                    {year}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth margin="normal">
                        <InputLabel id="type-select-label">Type</InputLabel>
                        <Select
                            labelId="type-select-label"
                            id="type-select"
                            value={type}
                            label="Type"
                            onChange={(e) => setType(e.target.value )}
                        >
                            {types?.map((type) => (
                                <MenuItem key={type} value={type}>
                                    {type}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth margin="normal">
                        <InputLabel id="city-select-label">Assess Area</InputLabel>
                        <Select
                            labelId="city-select-label"
                            id="city-select"
                            value={city}
                            label="Assess Area"
                            onChange={(e) => setCity(e.target.value )}
                        >
                            {cities?.map((cityValue) => (
                                <MenuItem key={cityValue} value={cityValue}>
                                    {cityValue}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth margin="normal">
                        <InputLabel id="type-select-label">Fair Lending Type</InputLabel>
                        <Select
                            labelId="type-select-label"
                            id="type-select"
                            value={fairLendingType}
                            label="Type"
                            onChange={(e) => setFairLendingType(e.target.value )}
                        >
                            {fairLoanTypes?.map((type) => (
                                <MenuItem key={type} value={type}>
                                    {type}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <Box display="flex" justifyContent="space-between" mt={2}>
                        <Button variant="contained" color="primary" type="submit" disabled={isLoading}>
                            Apply
                        </Button>
                        <Button variant="outlined" color="primary" onClick={resetValues}>
                            Reset
                        </Button>
                        {isLoading && <CircularProgress size={24} />}
                    </Box>
                </form>
            </Paper>
    );
}
