import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Box, Typography, Grid } from '@mui/material';
import PeerGroupPicker from './peer-group-picker';
import { FormInputData } from './compliance';
import { usePubSub } from 'contexts/socket/WebSocketProvider';
import { makeTopicRequest, makeTopicResponse } from 'contexts/socket/PubSubTopics';
import { capitalizeWords, lookupBankName } from 'shared/utils/textNames';

export type BankYearLoanCityProps = {
    uid?: string;
    year: string;
    type: string;
    city: string;
}

export type PeerGroupFormData = {
    years: FormInputData;
    cities: FormInputData;
    types: FormInputData;

}

export type PeerGroupChartProps = {
    uid?: string;
    topic: string;
    formData: PeerGroupFormData;
}

export type LoanYearCityTypesProps = {
    isLoading: boolean;
    years: FormInputData;
    cities: FormInputData;
    types: FormInputData;
    receiveValues: (values: BankYearLoanCityProps) => void;
};

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
            text: 'First Mortgage - Dallas - 2023',
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

const defaultChartData = {
    labels: [],
    datasets: [
        {
            label: 'Number of Mortgages',
            data: [],
            backgroundColor: 'rgba(54, 162, 235, 0.5)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
            barThickness: 20,
        },
    ],
}
export default function PeerGroupChart({ uid, topic, formData }: PeerGroupChartProps) {
    const [totalLoans, setTotalLoans] = useState<number>(0);
    const [chartData, setChartData] = useState(defaultChartData);

    const [chartOptions, setChartOptions] = useState(options);
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const pubSub = usePubSub();

    const receiveValues = (values: BankYearLoanCityProps) => {
        setIsLoading(true);
        const payload = {
            ...values,
            uid,
        }
        pubSub.publish(makeTopicRequest(topic), { topic, payload });

    }

    const updateChartData = (inputs: BankYearLoanCityProps, chartData: any) => {
        console.log('peer chart data:', chartData)
        const selectedType = inputs.type.split(' ')[0].toUpperCase()
        if (!chartData || chartData?.length === 0) {
            setTotalLoans(0)
            setChartData(defaultChartData);
            setIsLoading(false)
            return;
        }

        const { lenderNames, loanRankings } = chartData;

        // filter based on selected type
        console.log(loanRankings, inputs.type)
        const loans = loanRankings.filter((item: { loanType: string }) => item.loanType === selectedType);
        const itemOneLoans = (loans[0]?.fairLendingCounts[0]?.loanCounts || []).filter((i: { count: number }) => i.count > 0);
        const loanCounts = itemOneLoans?.map((item: { lenderCode: string, count: number }) => item.count);
        const tl = itemOneLoans?.reduce((acc: number, item: { lenderCode: string, count: number }) => acc + item.count, 0);
        const newLabels = itemOneLoans?.map((l: { lenderCode: string }) => capitalizeWords(lookupBankName(l.lenderCode, lenderNames), 12));
        const newData = {
            ...defaultChartData, // Spread the existing data to maintain other properties
            labels: newLabels,
            datasets: defaultChartData?.datasets?.map(dataset => ({
                ...dataset, // Spread existing dataset properties
                data: loanCounts, // Update data with new loan numbers
            })),
        };

        setTotalLoans(tl)
        setChartData(newData)

        const newChartOptions = {
            ...chartOptions,
            plugins: {
                ...chartOptions.plugins,
                title: {
                    display: true,
                    text: `${inputs.type} - ${inputs.city} - ${inputs.year}`,

                }
            }
        }

        setChartOptions(newChartOptions)
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
            city: formData?.cities?.data[formData?.cities.defaultValue],
        });


        return () => {
            pubSub.unsubscribe(makeTopicResponse(topic));
        }
    }, []);

    return (
        <Grid container sx={{ height: '100vh' }}>
            {/* Chart section */}
            <Grid item xs={12} md={8}>
                <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
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
                <PeerGroupPicker
                    {...{
                        years: formData?.years,
                        cities: formData?.cities,
                        types: formData?.types,
                        receiveValues,
                        isLoading,
                    }}
                />
            </Grid>
        </Grid>
    );
}
