import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';

import { Box, Typography, Grid } from '@mui/material';
import FairLendingPicker from './fair-lending-picker';
import { FairLendingTypesKeys, FormInputData } from './compliance';
import { makeTopicRequest, makeTopicResponse } from 'contexts/socket/PubSubTopics';
import { usePubSub } from 'contexts/socket/WebSocketProvider';
import { decimalToPercentage } from 'shared/utils/formatters';
import { capitalizeWords, lookupBankName } from 'shared/utils/textNames';
import ChartDataLabels from 'chartjs-plugin-datalabels';

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
        },
        x: {
            beginAtZero: true,
            ticks: {
                color: '#000', // Ensures that the ticks (labels) are in black
            }
        }
    },
    indexAxis: 'y',
    elements: {
        bar: {
            borderWidth: 1,
        },
    },
    responsive: true,
    plugins: {
        legend: {
            position: 'bottom',
        },
        title: {
            display: true,
            text: '',
        },
        tooltip: {
            enabled: false,
        },
        datalabels: {
            anchor: 'end',
            align: 'end',
            offset: 5,
            formatter: (value, context) => {
                console.log(value, context)
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
            barThickness: 10,
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
        const year = values.year.replace(' YTD', '');
        const payload = {
            ...values,
            year,
            uid,
        }
        pubSub.publish(makeTopicRequest(topic), { topic, payload });

    }

    const updateChartData = (inputs: BankYearLoanFairCityProps, chartData: any) => {
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

        const loanPctData = typeOfLoan?.loanCounts?.map((item: { lenderCode: string, pct: number, label: string }) => ({
            pct: decimalToPercentage(item.pct),
            label: capitalizeWords(lookupBankName(item.lenderCode, lenderNames), 30),
            name: lookupBankName(item.lenderCode, lenderNames),
            dataLabel: item.label
        }));

        const loanPct = loanPctData.map((item: { pct: number }) => item.pct);
        const tl = loanPct?.reduce((acc: number, item: number) => acc + item, 0);

        const maxValue = Math.max(...loanPct);
        const newLabels = loanPctData.map((item: { label: string }) => item.label);
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
        const dataLabels = {
            datalabels: {
                anchor: 'end',
                align: 'end',
                offset: 5,
                formatter: (value, context) => {
                    console.log(value, context, loanPctData);
                    const l = loanPctData.find((item: { pct: number }) => item.pct === value);
                    console.log('loan pct data:', l)
                    return l?.dataLabel || value.toLocaleString(); // or just value if you don't want to format
                },
                color: '#000',
                padding: {
                    right: 10 // Adjust the padding as needed to fit the labels inside the bars
                }

            },
        }
        const newchartoptions = {
            ...chartOptions,
            scales: {
                ...chartOptions.scales,
                x: {
                    beginAtZero: true,
                    min: 0,
                    max: maxValue + (maxValue * 0.15), // Adding 10% to the max value for padding
                    ticks: {
                        color: '#000',
                        font: {
                            weight: 'bold',
                        }
                    }
                }
            },
            plugins: {
                ...chartOptions.plugins,
                ...dataLabels,
                title: {
                    display: true,
                    text: `${inputs.type} - ${inputs.city} - ${inputs.year}`,

                },
                tooltip: {
                    enabled: false, // Disable tooltips
                },
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
        /*
                receiveValues({
                    year: formData?.years?.data[formData?.years.defaultValue],
                    type: formData?.types?.data[formData?.types.defaultValue],
                    fairLendingType: formData.fairLendingTypes.data[formData.fairLendingTypes.defaultValue],
                    city: formData?.cities?.data[formData?.cities.defaultValue],
                });
        */

        return () => {
            pubSub.unsubscribe(makeTopicResponse(topic));
        }
    }, []);


    return (
        <Grid container sx={{ height: '100vh' }}>
            {/* Chart section */}
            <Grid item xs={12} md={8}>
                <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
                    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <div className="chart-container" >
                            <Bar data={chartData} options={chartOptions} />
                        </div>
                        <Typography >
                            {`Total Mortgages: ${totalLoans.toLocaleString()}`}
                        </Typography>
                    </div>
                </Box>
            </Grid>

            {/* Form section */}
            <Grid item xs={12} md={4}>
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
            </Grid>
        </Grid>
    )

}
