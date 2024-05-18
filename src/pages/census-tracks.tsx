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
        if (row.hispanicArea && fairLendingType === FairLendingTypes[FairLendingTypeHispanicIndex]) {
            return true;
        }
        if (row.aaArea && fairLendingType === FairLendingTypes[FairLendingTypeAAIndex]) {
            return true;
        }
        if (row.minorityArea && fairLendingType === FairLendingTypes[FairLendingTypeMinorityIndex]) {
            return true;
        }
        if (row.lmiArea && fairLendingType === FairLendingTypes[FairLendingTypeLMIIndex]) {
            return true;
        }
        if (row.hispanicArea && fairLendingType === FairLendingTypes[FairLendingTypeHispanicIndividualIndex]) {
            return true;
        }
        if (row.aaArea && fairLendingType === FairLendingTypes[FairLendingTypeAAIndividualIndex]) {
            return true;
        }
        return false;
    }

    const receiveValues = (values: CensusTrackFormQuery) => {
        setIsLoading(true);
        console.log("form data", values)
        const payload = {
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
            const values = request;
            const censusTracksData = payload;

            const myRows: CensusTrackRowData[] = [];
            for (let i = 0; i < censusTracksData.censusTracts.length; i++) {
                const data = censusTracksData.censusTracts[i];
                const row: CensusTrackRowData = {
                    censusTract: data.tractName,
                    totalPop: data.totalPop,
                    totalOriginations: data.totalOrig,
                    myOriginations: data.totalOrig,
                    myPct: 0,
                    lmiArea: data.lmi,
                    minorityArea: data.minority,
                    minorityCount: data.minorityPop,
                    minorityPct: 0,
                    hispanicArea: data.hispanic,
                    hispanicCount: data.hispPop,
                    hispanicPct: 0,
                    aaArea: data.aa,
                    aaCount: data.aaPop,
                    aaPct: 0,
                    hispIndivOriginations: "",
                    myHistIndivOriginations: "",
                    aaIndivOriginations: "",
                    myAaIndivOriginations: "",
                }
                if (values.fairLendingType !== FairLendingTypes[FairLendingTypeAllIndex]) {
                    filterFairLendingType(values.fairLendingType, row) && myRows.push(row);
                } else {
                    myRows.push(row);
                }
            }
            setFilteredRows(myRows)
            setIsLoading(false);
        });


        receiveValues({
            year: formData?.years?.data[formData?.years?.defaultValue],
            type: formData?.types?.data[formData?.types?.defaultValue],
            city: formData?.cities?.data[formData?.cities?.defaultValue],
            fairLendingType: formData?.fairLendingTypes?.data[formData?.fairLendingTypes?.defaultValue]
        });

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

