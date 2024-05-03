import React, { useState } from 'react';
import { FormControl, InputLabel, Select, MenuItem, Button, Box, Paper, CircularProgress } from '@mui/material';
import { LoanYearCityTypesProps } from './peer-group-chart';

export default function PeerGroupPicker({ isLoading, years, cities, types, receiveValues }: LoanYearCityTypesProps) {

    const [year, setYear] = useState<string>(years?.data[years.defaultValue]);
    const [city, setCity] = useState<string>(cities?.data[cities.defaultValue]);
    const [type, setType] = useState<string>(types?.data[types.defaultValue]);

    // Handle the form submission
    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        // Insert what you want to do on form submit
        receiveValues({ year, type, city })
    };

    const resetValues = () => {
        setYear(years?.data[years.defaultValue]);
        setType(cities?.data[cities.defaultValue]);
        setCity(types?.data[types.defaultValue]);
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
                        onChange={(e) => setYear(e.target.value)}
                    >
                        {years?.data?.map((year) => (
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
                        onChange={(e) => setType(e.target.value)}
                    >
                        {types?.data?.map((type) => (
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
                        onChange={(e) => setCity(e.target.value)}
                    >
                        {cities?.data?.map((city) => (
                            <MenuItem key={city} value={city}>
                                {city}
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
};
