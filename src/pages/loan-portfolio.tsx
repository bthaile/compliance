import React, { useEffect } from 'react';
import { Box } from '@mui/material';
import LoanPortfolioTable from './loan-portfolio-table'; // Assuming this is your table component
import LoanPortfolioPicker from './loan-portfolio-picker'; // Your form component
import { FairLendingTypesKeys, LoanPortfolioFormData, LoanPortfolioFormQuery, LoanPortfolioProps, LoanPortfolioRowData } from './compliance';
import { makeTopicRequest, makeTopicResponse } from 'contexts/socket/PubSubTopics';
import { usePubSub } from 'contexts/socket/WebSocketProvider';


export type LoanYearCityFairTypesProps = {
    isLoading: boolean;
    formData: LoanPortfolioFormData;
    receiveValues: (values: { year: string, type: string, fairLendingTypes: string[], city: string }) => void;
};

export default function LoanPortfolio({ uid, topic, formData }: LoanPortfolioProps) {
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [filteredRows, setFilteredRows] = React.useState<LoanPortfolioRowData[]>([]);
    const pubSub = usePubSub();

    const filterFairLendingType = (fairLendingTypes: string[], row: LoanPortfolioRowData): boolean => {
        // TODO: need to map filter to data property
        return true;
    }

    const receiveValues = (values: LoanPortfolioFormQuery) => {
        setIsLoading(true);
        const fairLendingTypes = values.fairLendingTypes.map((type) => FairLendingTypesKeys[type]);
        const payload = {
            ...values,
            fairLendingTypes,
            uid,
        }
        pubSub.publish(makeTopicRequest(topic), { topic, payload });
    }

    // TODO: send query to backend 
    const buildTableData = (values: LoanPortfolioFormQuery, results: LoanPortfolioRowData[]) => {

        console.log('results', results) 
        
        const newRows: LoanPortfolioRowData[] = []
        const y = parseInt(values.year)
        for (let i = 0; i < results.length; i++) {
            const d = results[i]
            let doAdd = false

            if (values.city !== 'All') {
                doAdd = true;
            }

            if (d.year === y) {
                doAdd = true
            }

            if (doAdd && values.fairLendingTypes.length > 0) {
                // TODO figure out fair lending type mapping to data property
                filterFairLendingType(values.fairLendingTypes, d) && newRows.push(d)
            }

            if (doAdd) {
                newRows.push(d)
            }

        }
        setFilteredRows(newRows)
        setIsLoading(false)
    }

    useEffect(() => {
        pubSub.subscribe(makeTopicResponse(topic), ({ request, payload }: { request: LoanPortfolioFormQuery, payload: LoanPortfolioRowData[] }) => {
            buildTableData(request, payload)
        })

        /*
        receiveValues({
            year: formData?.years?.data[formData?.years?.defaultValue],
            type: formData?.types?.data[formData?.types?.defaultValue],
            fairLendingTypes: formData?.fairLendingTypes?.data,
            city: formData?.cities?.data[formData?.cities?.defaultValue]
        });
        */
    }, []);

    return (
        <Box sx={{ width: '100%' }}>
            {/* Top half of the screen for the LoanPortfolioPicker form */}
            <Box sx={{ width: '100%', marginBottom: 4 }}>
                <LoanPortfolioPicker isLoading={isLoading} formData={formData}
                    receiveValues={receiveValues} />
            </Box>

            {/* Bottom half of the screen for the GoalStatusTable */}
            <Box sx={{ width: '100%' }}>
                <LoanPortfolioTable rows={filteredRows} />
            </Box>
        </Box>
    );
};

