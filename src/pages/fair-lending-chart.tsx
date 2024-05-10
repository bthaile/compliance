import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';

import { Box, Typography, Grid } from '@mui/material';
import FairLendingPicker from './fair-lending-picker';
import { FairLendingTypesKeys, FormInputData } from './compliance';
import { makeTopicRequest, makeTopicResponse } from 'contexts/socket/PubSubTopics';
import { usePubSub } from 'contexts/socket/WebSocketProvider';
import { decimalToPercentage } from 'shared/utils/formatters';
import { capitalizeWords, lookupBankName } from 'shared/utils/textNames';

const options = {
    scales: {
        y: {
            ticks: {
                color: '#000', // Ensures that the ticks (labels) are in black
                font: {
                    weight: 'bold', // Makes the font bold
                }
            },
            barPercentage: 0.5, // Adjust this value as needed
            categoryPercentage: 0.8, // Adjust this value as needed
        }
    },
    indexAxis: 'y',
    elements: {
        bar: {
            borderWidth: 2,
        },
    },
    responsive: true,
    plugins: {
        legend: {
            position: 'bottom',
        },
        title: {
            display: true,
            text: 'LMI Areas - Dallas - 2023',
        },
        datalabels: {
            anchor: 'end',
            align: 'end',
            offset: 5,
            formatter: (value, context) => {
                return value.toLocaleString(); // or just value if you don't want to format
            },
            color: '#000',
            padding: {
                right: 10 // Adjust the padding as needed to fit the labels inside the bars
            }

        },
    },
};

export type BankYearLoanFairCityProps = {
    year: string;
    type: string;
    fairLendingType: string;
    city: string;
}

export type FairLendingFormData = {
    years: FormInputData;
    cities: FormInputData;
    fairLendingTypes: FormInputData;
    types: FormInputData;

}

export type FairLendingChartProps = {
    uid?: string;
    topic: string;
    formData: FairLendingFormData;
}

const defaultChartData = {
    labels: [],
    datasets: [
        {
            label: 'Total Percentage',
            data: [],
            backgroundColor: 'rgba(54, 162, 235, 0.5)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
            barThickness: 20,
        },
    ],
};

export default function FairLendingChart({ uid, topic, formData }: FairLendingChartProps) {
    const [totalLoans, setTotalLoans] = useState<number>(0);
    const [chartData, setChartData] = useState(defaultChartData);
    const [chartOptions, setChartOptions] = useState(options);
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const pubSub = usePubSub();


    const receiveValues = (values: BankYearLoanFairCityProps) => {
        setIsLoading(true);
        const payload = {
            ...values,
            uid,
        }
        pubSub.publish(makeTopicRequest(topic), { topic, payload });

    }

    const updateChartData = (inputs: BankYearLoanFairCityProps, chartData: any) => {
        console.log('peer chart data:', chartData)
        let selectedType = inputs.type.split(' ')[0].toUpperCase()
        // TODO: get data and form keys synched up
        if (selectedType === 'TOTAL') {
            selectedType = "ALL"
        }

        if (!chartData || chartData?.length === 0) {
            setTotalLoans(0)
            setChartData(defaultChartData);
            setIsLoading(false)
            return;
        }

        const { lenderNames, loanRankings } = chartData;
        // filter based on loan type
        const loanTypeFiltered = loanRankings.find((item: { loanType: string }) => item.loanType === selectedType) || [];

        if (!loanTypeFiltered) {
            console.error('No data found for loan type:', inputs.type)
            return;
        }
        const fairLendingLoans = loanTypeFiltered?.fairLendingCounts;
        let selectedFairLendingType = FairLendingTypesKeys[inputs.fairLendingType].toLowerCase();

        const typeOfLoan = fairLendingLoans.find(x => x.fairLendingType.toLowerCase() === selectedFairLendingType);
        console.log('type of loan:', typeOfLoan)
        const loanPct = typeOfLoan?.loanCounts?.map((item: { lenderCode: string, pct: number }) => decimalToPercentage(item.pct));
        console.log('loan pct:', loanPct)
        const tl = loanPct?.reduce((acc: number, item: number) => acc + item, 0);
        const newLabels = typeOfLoan?.loanCounts?.map((l: { lenderCode: string }) => capitalizeWords(lookupBankName(l.lenderCode, lenderNames), 12));
        console.log('new labels:', newLabels)
        const newData = {
            ...defaultChartData, // spread the existing data to maintain other properties
            labels: newLabels,
            datasets: defaultChartData?.datasets?.map(dataSet => ({
                ...dataSet, // spread existing dataset properties
                data: loanPct, // update data with new loan numbers
            })),
        };

        setTotalLoans(tl || 0)
        setChartData(newData)

        const newchartoptions = {
            ...chartOptions,
            plugins: {
                ...chartOptions.plugins,
                title: {
                    display: true,
                    text: `${inputs.type} - ${inputs.city} - ${inputs.year}`,

                }
            }
        }

        setChartOptions(newchartoptions)
        setIsLoading(false)
    }

    // force a load of intial data to load chart
    useEffect(() => {
        pubSub.subscribe(makeTopicResponse(topic), ({ request, payload }: { request: BankYearLoanCityProps, payload: CensusData }) => {
            const inputs = request;
            const peerLoans = payload;
            updateChartData(inputs, peerLoans)
        });

        receiveValues({
            year: formData?.years?.data[formData?.years.defaultValue],
            type: formData?.types?.data[formData?.types.defaultValue],
            fairLendingType: formData.fairLendingTypes.data[formData.fairLendingTypes.defaultValue],
            city: formData?.cities?.data[formData?.cities.defaultValue],
        });


        return () => {
            pubSub.unsubscribe(makeTopicResponse(topic));
        }
    }, []);


    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
            <Grid container>
                {/* Chart section */}
                <Grid item xs={12} md={8}>
                    <Box sx={{ flexGrow: 1, position: 'relative', width: '100%', height: '100%' }}>
                        <div style={{ flexGrow: 1 }}>
                            <Bar data={chartData} options={chartOptions} />
                            <Typography sx={{ position: 'absolute', bottom: 0, left: 0, padding: '8px' }}>
                                {`Total Mortgages: ${totalLoans.toLocaleString()}`}
                            </Typography>
                        </div>
                    </Box>
                </Grid>

                {/* Form section */}
                <Grid item xs={12} md={4}>
                    <Box sx={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <FairLendingPicker
                            {...{
                                years: formData?.years,
                                cities: formData?.cities,
                                types: formData?.types,
                                fairLendingTypes: formData?.fairLendingTypes,
                            }}
                            isLoading={isLoading}
                            receiveValues={receiveValues}
                        />
                    </Box>
                </Grid>
            </Grid>
        </Box>
    )

}
