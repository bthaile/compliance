import React, { useState } from 'react';
import { FormControl, InputLabel, Select, MenuItem, Button, Box, Paper, CircularProgress  } from '@mui/material';
import { LendingTrendFormData } from './lending-trends-chart';

type MortgagePickerProps = {
    isLoading: boolean;
    formData: LendingTrendFormData,
    receiveValues: (values: {
        startYear: string, startMonth: string, endYear: string, endMonth: string,
        timeIncrement: string, assetType: string, fairLendingType: string, assetArea: string
    }) => void;

};

export default function LendingTrendsPicker({
    isLoading,
    formData,
    receiveValues
}: MortgagePickerProps) {

    const [startYear, setStartYear] = useState<string>(formData?.startYears?.data[formData?.startYears?.defaultValue]);
    const [startMonth, setStartMonth] = useState<string>(formData?.startMonths?.data[formData?.startMonths?.defaultValue]);
    const [endYear, setEndYear] = useState<string>(formData?.endYears?.data[formData?.endYears?.defaultValue]);
    const [endMonth, setEndMonth] = useState<string>(formData?.endMonths?.data[formData?.endMonths?.defaultValue]);
    const [timeIncrement, setTimeIncrement] = useState<string>(formData?.timeIncrements?.data[formData?.timeIncrements?.defaultValue]);
    const [assetType, setAssetType] = useState<string>(formData?.assetTypes?.data[formData?.assetTypes?.defaultValue]);
    const [fairLendingType, setFairLendingType] = useState<string>(formData?.fairLendingTypes?.data[formData?.fairLendingTypes?.defaultValue]);
    const [assetArea, setAssetArea] = useState<string>(formData?.assetAreas?.data[formData?.assetAreas?.defaultValue]);

    // Handle the form submission
    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        // Insert what you want to do on form submit
        receiveValues({
            startYear, startMonth, endYear, endMonth, timeIncrement, assetType, fairLendingType, assetArea
        })
    };

    const resetValues = () => {
        setStartYear(formData?.startYears?.data[formData?.startYears?.defaultValue]);
        setStartMonth(formData?.startMonths?.data[formData?.startMonths?.defaultValue]);
        setEndYear(formData?.endYears?.data[formData?.endYears?.defaultValue]);
        setEndMonth(formData?.endMonths?.data[formData?.endMonths?.defaultValue]);
        setTimeIncrement(formData?.timeIncrements?.data[formData?.timeIncrements?.defaultValue]);
        setAssetType(formData?.assetTypes?.data[formData?.assetTypes?.defaultValue]);
        setFairLendingType(formData?.fairLendingTypes?.data[formData?.fairLendingTypes?.defaultValue]);
        setAssetArea(formData?.assetAreas?.data[formData?.assetAreas?.defaultValue]);
    }

    return (
        <Paper elevation={3} style={{ padding: '1rem', margin: '1rem' }}>
            <form onSubmit={handleSubmit}>
                <FormControl fullWidth margin="normal">
                    <InputLabel id="start-year-select-label">Start Year</InputLabel>
                    <Select
                        labelId="start-year-select-label"
                        id="start-year-select"
                        value={startYear}
                        label="Start Year"
                        onChange={(e) => setStartYear(e.target.value)}
                    >
                        {formData?.startYears?.data?.map((year) => (
                            <MenuItem key={year} value={year}>
                                {year}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl fullWidth margin="normal">
                    <InputLabel id="start-month-select-label">Start Month</InputLabel>
                    <Select
                        labelId="start-month-select-label"
                        id="start-month-select"
                        value={startMonth}
                        label="Start Month"
                        onChange={(e) => setStartMonth(e.target.value)}
                    >
                        {formData?.startMonths?.data?.map((month) => (
                            <MenuItem key={month} value={month}>
                                {month}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl fullWidth margin="normal">
                    <InputLabel id="end-year-select-label">End Year</InputLabel>
                    <Select
                        labelId="end-year-select-label"
                        id="end-year-select"
                        value={endYear}
                        label="End Year"
                        onChange={(e) => setEndYear(e.target.value)}
                    >
                        {formData?.endYears?.data?.map((year) => (
                            <MenuItem key={year} value={year}>
                                {year}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl fullWidth margin="normal">
                    <InputLabel id="end-month-select-label">End Month</InputLabel>
                    <Select
                        labelId="end-month-select-label"
                        id="end-month-select"
                        value={endMonth}
                        label="End Month"
                        onChange={(e) => setEndMonth(e.target.value)}
                    >
                        {formData?.endMonths?.data?.map((month) => (
                            <MenuItem key={month} value={month}>
                                {month}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl fullWidth margin="normal">
                    <InputLabel id="time-increament-select-label">Time Increment</InputLabel>
                    <Select
                        labelId="time-increament-select-label"
                        id="time-increament-select"
                        value={timeIncrement}
                        label="Time Increment"
                        onChange={(e) => setTimeIncrement(e.target.value)}
                    >
                        {formData?.timeIncrements?.data?.map((type) => (
                            <MenuItem key={type} value={type}>
                                {type}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl fullWidth margin="normal">
                    <InputLabel id="asset-type-select-label">Loan Type</InputLabel>
                    <Select
                        labelId="asset-type-select-label"
                        id="asset-type-type-select"
                        value={assetType}
                        label="Asset Type"
                        onChange={(e) => setAssetType(e.target.value)}
                    >
                        {formData?.assetTypes?.data?.map((type) => (
                            <MenuItem key={type} value={type}>
                                {type}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl fullWidth margin="normal">
                    <InputLabel id="fair-lending-type-select-label">Fair Lending Type</InputLabel>
                    <Select
                        labelId="fair-lending-type-select-label"
                        id="fair-lending-type-select"
                        value={fairLendingType}
                        label="Fair Lending Type"
                        onChange={(e) => setFairLendingType(e.target.value)}
                    >
                        {formData?.fairLendingTypes?.data?.map((type) => (
                            <MenuItem key={type} value={type}>
                                {type}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl fullWidth margin="normal">
                    <InputLabel id="asset-area-select-label">Assess Area</InputLabel>
                    <Select
                        labelId="asset-area-select-label"
                        id="asset-area-select"
                        value={assetArea}
                        label="Assess Area"
                        onChange={(e) => setAssetArea(e.target.value)}
                    >
                        {formData?.assetAreas?.data?.map((cityValue) => (
                            <MenuItem key={cityValue} value={cityValue}>
                                {cityValue}
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
