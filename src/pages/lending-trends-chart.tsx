import React, { useEffect, useState } from 'react';

import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import { Box } from '@mui/material';
import LendingTrendsPicker from './lending-trends-picker';
import { FormInputData, FairLendingTypesKeys, LenderTrendQuery, LoanTrend, LenderTrend, FairLendingTrend } from './compliance';
import { usePubSub } from 'contexts/socket/WebSocketProvider';
import { makeTopicRequest, makeTopicResponse } from 'contexts/socket/PubSubTopics';
import { capitalizeWords, lookupBankName } from 'shared/utils/textNames';


const bankColors = [
    '#FF6384', '#36A2EB', '#FFCE56', '#cc65fe',
    '#ff9f40', '#9ccc65', '#00bfff', '#ff66ff',
    '#a0522d', '#daa520', '#ff7f50', '#cfb379'
];


const options = {
    scales: {
        y: {
            beginAtZero: false,
            categoryPercentage: 1, // Adjust this value as needed
        },
        x: {
            beginAtZero: false,
            categoryPercentage: 1, // Adjust this value as needed
        }
    },
    indexAxis: 'x',
    elements: {
        line: {
            borderWidth: 2,
        },
    },
    responsive: true,
    plugins: {
        legend: {
            display: true,
            position: 'bottom',
        },
        title: {
            display: true,
            text: '-',
        },
    },
};

export type LendingTrendFormData = {
    startYears: FormInputData;
    startMonths: FormInputData;
    endYears: FormInputData;
    endMonths: FormInputData;
    timeIncrements: FormInputData;
    assetTypes: FormInputData;
    fairLendingTypes: FormInputData;
    assetAreas: FormInputData;
}

export type LendingTrendsChartProps = {
    uid?: string;
    topic: string;
    formData: LendingTrendFormData;
}

export default function LendingTrendsChart({ uid, topic, formData }: LendingTrendsChartProps) {
    const [chartData, setChartData] = useState(null);
    const [chartOptions, setChartOptions] = useState(options);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const pubSub = usePubSub();

    const buildChartData = (trends: LenderTrend[] = [], lenderNames: { lenderCode: string, lenderName: string }[]) => {
        const sortedTrends = trends.sort((a, b) => {
            const lenderNameA = capitalizeWords(lookupBankName(a.lenderCode, lenderNames)); 
            const lenderNameB = capitalizeWords(lookupBankName(b.lenderCode, lenderNames)); 
            const isCadenceA = lenderNameA.toLowerCase().includes('cadence');
            const isCadenceB = lenderNameB.toLowerCase().includes('cadence');
            if (isCadenceA && !isCadenceB) {
                return -1;  // 'cadence' should come first
            }
            if (!isCadenceA && isCadenceB) {
                return 1;   // 'cadence' should come first
            }
            return 0;  // Keep original order if neither or both are 'cadence'
        });
        return sortedTrends?.map((trend, index) => {
            const lenderName = capitalizeWords(lookupBankName(trend.lenderCode, lenderNames));
            const isCadence = lenderName.toLowerCase().includes('cadence');

            return ({
                label: lenderName,
                data: trend.counts,
                borderColor: isCadence ? '#24A926' : bankColors[index % bankColors.length], // Red color for 'cadence'
                borderWidth: isCadence ? 4 : 2, // Thicker line for 'cadence'
                backgroundColor: isCadence ? '#24A926' : bankColors[index % bankColors.length], // Keep background the same
                fill: false,
            })
        });

    }

    const receiveValues = (values: LenderTrendQuery) => {
        setIsLoading(true);
        const payload = {
            ...values,
            uid,
        }
        pubSub.publish(makeTopicRequest(topic), { topic, payload });
    }

    const updateChartData = (values: LenderTrendQuery, lendingData: any) => {
        console.log('lendings', lendingData)
        const lenderNames = lendingData?.lenderNames;
        const lendings = lendingData?.loanTrends;
        let lendingValue: LoanTrend = (lendings && lendings[0]) || [];
        let fairLending: FairLendingTrend = lendingValue?.fairLendingTrends[0] || [];

        // asset type≈
        if (values.assetType === 'Total') {
            lendingValue = lendings.find((lending) => lending.loanType === 'Total') || (lendings && lendings[0]);
        } else if (values.assetType === 'First Mortgage') {
            lendingValue = lendings.find((lending) => lending.loanType === 'FIRST') || (lendings && lendings[0]);
        } else if (values.assetType === 'Second Mortgage') {
            lendingValue = lendings.find((lending) => lending.loanType === 'SECOND') || (lendings && lendings[0]);
        }

        // fair lending
        const flType = FairLendingTypesKeys[values.fairLendingType]
        fairLending = lendingValue?.fairLendingTrends?.find(x => x.fairLendingType === flType) || lendingValue?.fairLendingTrends[0];

       // const newLabels = itemOneLoans?.map((l: {lenderCode: string}) => capitalizeWords(lookupBankName(l.lenderCode, lenderNames)));
        const newData = {
            ...chartData, // Spread the existing data to maintain other properties
            labels: fairLending?.labels, // Update labels with new banks
            datasets: buildChartData(fairLending?.lenderTrends, lenderNames), // Update data with new loan numbers
        };

        setChartData(newData)

        const newChartOptions = {
            ...chartOptions,
            plugins: {
                ...chartOptions.plugins,
                title: {
                    display: true,
                    text: `${values.assetType} - ${values.fairLendingType}`,

                }
            }
        }
        setChartOptions(newChartOptions)
        setIsLoading(false);
    }

    useEffect(() => {
        pubSub.subscribe(makeTopicResponse(topic), ({ request, payload }: { request: LenderTrendQuery, payload: LenderTrend[] }) => {
            try {
                updateChartData(request, payload)
            } catch(e) {
                console.error('Error updating chart data', e)
                setIsLoading(false)
            }

        });
        /* default chart values
        receiveValues({
            startYear: formData?.startYears?.data[formData?.startYears.defaultValue],
            startMonth: formData?.startMonths?.data[formData?.startMonths.defaultValue],
            endYear: formData?.endYears?.data[formData?.endYears.defaultValue],
            endMonth: formData?.endMonths?.data[formData?.endMonths.defaultValue],
            timeIncrement: formData?.timeIncrements?.data[formData?.timeIncrements.defaultValue],
            assetType: formData?.assetTypes?.data[formData?.assetTypes.defaultValue],
            fairLendingType: formData?.fairLendingTypes?.data[formData?.fairLendingTypes.defaultValue],
            assetArea: formData?.assetAreas?.data[formData?.assetAreas.defaultValue]
        });
        */
    }, [])

    return (
        <Box sx={{ height: '100vh', display: 'flex' }}>
            <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ flexGrow: 1 }}>
                    {chartData !== null && <Line data={chartData} options={chartOptions} />}
                </div>
            </Box>
            <Box sx={{ width: 300, display: 'flex', flexDirection: 'column' }}>
                <LendingTrendsPicker
                    isLoading={isLoading}
                    formData={formData}
                    receiveValues={receiveValues}
                />
            </Box>
        </Box>
    )
}
