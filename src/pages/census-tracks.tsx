import React, { useEffect } from 'react';
import { Box } from '@mui/material';
import CensusTracksTable from './census-tracks-table'; // Assuming this is your table component
import CensusTracksPicker from './census-tracks-picker'; // Your form component
import { FairLendingTypes, CensusTrackProps, CensusTrackRowData, CensusData, FairLendingTypesKeys } from './compliance';
import { usePubSub } from 'contexts/socket/WebSocketProvider';
import { makeTopicRequest, makeTopicResponse } from 'contexts/socket/PubSubTopics';
import { CensusTrackFormQuery } from 'contexts/socket/ChartDataProvider';

const FairLendingTypeLMIIndex = 0;
const FairLendingTypeMinorityIndex = 1;
const FairLendingTypeHispanicIndex = 2;
const FairLendingTypeAAIndex = 3;
const FairLendingTypeHispanicIndividualIndex = 4;
const FairLendingTypeAAIndividualIndex = 5;
const FairLendingTypeAllIndex = 6;

export default function CensusTracks({ uid, topic, formData }: CensusTrackProps) {
    // Define the data for the chart
    const [filteredRows, setFilteredRows] = React.useState<CensusTrackRowData[]>([]);
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const pubSub = usePubSub();

    const filterFairLendingType = (fairLendingType: string, row: CensusTrackRowData): boolean => {
        if (fairLendingType === FairLendingTypes[FairLendingTypeAllIndex]) {
            return true;
        }
        if (row.hispanic && fairLendingType === FairLendingTypes[FairLendingTypeHispanicIndex]) {
            return true;
        }
        if (row.aa && fairLendingType === FairLendingTypes[FairLendingTypeAAIndex]) {
            return true;
        }
        if (row.minority && fairLendingType === FairLendingTypes[FairLendingTypeMinorityIndex]) {
            return true;
        }
        if (row.lmi && fairLendingType === FairLendingTypes[FairLendingTypeLMIIndex]) {
            return true;
        }
        if (row.hispanic && fairLendingType === FairLendingTypes[FairLendingTypeHispanicIndividualIndex]) {
            return true;
        }
        if (row.aa && fairLendingType === FairLendingTypes[FairLendingTypeAAIndividualIndex]) {
            return true;
        }
        return false;
    }

    const receiveValues = (values: CensusTrackFormQuery) => {
        setIsLoading(true);
        console.log("form data", values)
        const payload = {
            type: values.type,
            year: values.year,
            city: values.city,
            uid,
        }
        const fairLendingType = FairLendingTypesKeys[values.fairLendingType];
        if (values.fairLendingType !== 'Total') {
            payload.fairLendingType = fairLendingType;
        }

        pubSub.publish(makeTopicRequest(topic), { topic, payload });
    }

    useEffect(() => {
        pubSub.subscribe(makeTopicResponse(topic), ({ request, payload }: { request: CensusTrackFormQuery, payload: CensusData }) => {
            const censusTracksData = payload;

            console.log('censusTracksData', censusTracksData)
            const myRows: CensusTrackRowData[] = [];
            for (let i = 0; i < censusTracksData.censusTracts.length; i++) {
                const data = censusTracksData.censusTracts[i];
                const row: CensusTrackRowData = {
                    ...data
                }
                // add loan type data
                let originationCounts = {};
                if (request.type === 'Total') {
                    originationCounts = data.originationCounts.find((x) => x.loanType === 'ALL');
                } else {
                    originationCounts = data.originationCounts.find((x) => x.loanType === request.type.toUpperCase());
                }
                myRows.push({
                    ...row,
                    ...originationCounts
                });
            }
            setFilteredRows(myRows)
            setIsLoading(false);
        });

        /*
                receiveValues({
                    year: formData?.years?.data[formData?.years?.defaultValue],
                    type: formData?.types?.data[formData?.types?.defaultValue],
                    city: formData?.cities?.data[formData?.cities?.defaultValue],
                    fairLendingType: formData?.fairLendingTypes?.data[formData?.fairLendingTypes?.defaultValue]
                });
        */
        return () => {
            pubSub.unsubscribe(makeTopicResponse(topic));
        }
    }, []);

    return (
        <Box sx={{ width: '100%' }}>
            {/* Top half of the screen for the CensusTracksPicker form */}
            <Box sx={{ width: '100%', marginBottom: 4 }}>
                <CensusTracksPicker receiveValues={receiveValues} formData={formData} isLoading={isLoading} />
            </Box>

            {/* Bottom half of the screen for the GoalStatusTable */}
            <Box sx={{ width: '100%' }}>
                <CensusTracksTable rows={filteredRows} />
            </Box>
        </Box>
    );
}

