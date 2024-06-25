import React, { useState } from 'react';
import { FormControl, InputLabel, Select, MenuItem, Button, Paper, Grid, CircularProgress } from '@mui/material';
import { GoalStatusPickerProps } from './compliance';

export default function GoalStatusPicker({ isLoading, receiveValues, formData }: GoalStatusPickerProps) {
    const [assessArea, setAssessArea] = useState(formData?.assessAreas && formData?.assessAreas?.data[formData?.assessAreas?.defaultValue]);

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        receiveValues({ assessArea });
    };

    return (
        <Paper elevation={3} style={{ padding: '1rem', margin: '1rem' }}>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={3}>
                        <FormControl fullWidth margin="normal">
                            <InputLabel id="assess-area-label">Assess Area</InputLabel>
                            <Select
                                labelId="assess-area-label"
                                label="Assess Area"
                                value={assessArea}
                                onChange={(e) => setAssessArea(e.target.value)}
                            >
                                {formData?.assessAreas?.data?.map((area) => (
                                    <MenuItem key={area} value={area}>{area}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3} display="flex" justifyContent="flex-start" alignItems="center">
                        <Button variant="contained" color="primary" type="submit" style={{ marginRight: '0.5rem' }} disabled={isLoading}>
                            {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Apply'}
                        </Button>
                        <Button variant="outlined" color="primary" onClick={() => { }}>
                            Reset
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Paper>
    );
};
