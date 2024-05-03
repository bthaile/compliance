import React, { useState } from 'react';
import { FormControl, InputLabel, Select, MenuItem, Button, Box, Paper, Grid, CircularProgress } from '@mui/material';
import { CensusTrackFormData } from './compliance';
import { CensusTrackFormQuery } from 'contexts/socket/ChartDataProvider';

type CensusTracksPickerProps = {
    formData: CensusTrackFormData;
    receiveValues: (values: CensusTrackFormQuery) => void;
    isLoading?: boolean;
};

export default function CensusTracksPicker({ receiveValues, formData, isLoading }: CensusTracksPickerProps) {
    const [year, setYear] = useState(formData?.years?.data[formData?.years?.defaultValue]);
    const [fairLendingType, setFairLendingType] = useState<string>(formData?.fairLendingTypes?.data[formData?.fairLendingTypes?.defaultValue]);
    const [city, setCity] = useState(formData?.cities?.data[formData?.cities?.defaultValue]);
    const [type, setType] = useState(formData?.types?.data[formData?.types?.defaultValue]);

    // Handle the form submission
    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        // Insert what you want to do on form submit
        receiveValues({year, type, fairLendingType, city })
    };

    const resetValues = () => {
        setYear(formData?.years?.data[formData?.years?.defaultValue]);
        setFairLendingType(formData?.fairLendingTypes?.data[formData?.fairLendingTypes?.defaultValue]);
        setCity(formData?.cities?.data[formData?.cities?.defaultValue]);
        setType(formData?.types?.data[formData?.types?.defaultValue]);
    }

    const plotToMap = () => {
        // TODO: Implement this function, send all rows to the map
        console.log('Plot to map (census)');
    }

    return (
        <Paper elevation={3} style={{ padding: '1rem', margin: '1rem' }}>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={3}>
                        <FormControl fullWidth margin="normal">
                            <InputLabel id="year-select-label">Year</InputLabel>
                            <Select
                                labelId="year-select-label"
                                id="year-select"
                                value={year}
                                label="Year"
                                onChange={(e) => setYear(e.target.value)}
                            >
                                {formData?.years?.data?.map((year) => (
                                    <MenuItem key={year} value={year}>
                                        {year}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                   {/** <Grid item xs={12} sm={3}>
                        <FormControl fullWidth margin="normal">
                            <InputLabel id="type-select-label">Type</InputLabel>
                            <Select
                                labelId="type-select-label"
                                id="type-select"
                                value={type}
                                label="Type"
                                onChange={(e) => setType(e.target.value)}
                            >
                                {formData?.types?.data?.map((ftype) => (
                                    <MenuItem key={ftype} value={ftype}>
                                        {ftype}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid> */}
                    {/**<Grid item xs={12} sm={3}>
                        <FormControl fullWidth margin="normal">
                            <InputLabel id="fair-lending-type-select-label">Fair Lending Type</InputLabel>
                            <Select
                                labelId="fair-lending-type-select-label"
                                id="fair-lending-type-select"
                                value={fairLendingType}
                                label="Fair Lending Type"
                                onChange={(e) => setFairLendingType(e.target.value)}
                            >
                                {formData?.fairLendingTypes?.data?.map((ftype) => (
                                    <MenuItem key={ftype} value={ftype}>
                                        {ftype}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                                </Grid>**/}
                    <Grid item xs={12} sm={3}>
                        <FormControl fullWidth margin="normal">
                            <InputLabel id="city-select-label">Assess Area</InputLabel>
                            <Select
                                labelId="city-select-label"
                                id="city-select"
                                value={city}
                                label="Assess Area"
                                onChange={(e) => setCity(e.target.value)}
                            >
                                {formData?.cities?.data?.map((cityValue) => (
                                    <MenuItem key={cityValue} value={cityValue}>
                                        {cityValue}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
                <Box display="flex" mt={2} mr={2} gap={2} alignItems="center">
                    <Button variant="contained" color="primary" type="submit" onClick={handleSubmit} disabled={isLoading}>
                        Apply
                    </Button>
                    <Button variant="outlined" color="primary" onClick={resetValues}>
                        Reset
                    </Button>
                    {/*<Button variant="outlined" color="primary" onClick={plotToMap}>
                        Plot to Map
                                </Button>*/}
                    {isLoading && <CircularProgress size={24} />}
                </Box>
            </form>
        </Paper>
    );
}
