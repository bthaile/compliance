import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';

import { Box, Typography } from '@mui/material';
import FairLendingPicker from './fair-lending-picker';
import { FormInputData } from './compliance';
import { makeTopicRequest, makeTopicResponse } from 'contexts/socket/PubSubTopics';
import { usePubSub } from 'contexts/socket/WebSocketProvider';

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
            label: 'Total Count',
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
    
    function capitalizeWord(word: string) {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }

    function lookupBankName(lenderCode: string, lenderData: { lenderCode: string, lenderName: string }[]) {
        const bank = lenderData.find(l => l.lenderCode === lenderCode);
        return bank?.lenderName || lenderCode;
    }

    const updateChartData = (inputs: BankYearLoanFairCityProps, chartData: any) => {
        console.log('peer chart data:', chartData)

        if (!chartData || chartData?.length === 0) {
            setTotalLoans(0)
            setChartData(defaultChartData);
            setIsLoading(false)
            return;
        }

        const { lenderNames, loanRankings } = chartData;

        // TODO: server should return an easy to chart data structure. 
        const itemOneLoans = loanRankings[0]?.fairLendingCounts[0]?.loanCounts || [];
        const loanCounts = itemOneLoans?.map((item: { lenderCode: string, count: number }) => item.count);
        const tl = itemOneLoans?.reduce((acc: number, item: { lenderCode: string, count: number }) => acc + item.count, 0);
        const newLabels = itemOneLoans?.map((l: {lenderCode: string}) => capitalizeWord(lookupBankName(l.lenderCode, lenderNames)));
        
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
            fairLendingType: formData.fairLendingTypes.data[formData.fairLendingTypes.defaultValue],
            city: formData?.cities?.data[formData?.cities.defaultValue],
        });


        return () => {
            pubSub.unsubscribe(makeTopicResponse(topic));
        }
    }, []);

    return (
        <Box sx={{ height: '100vh', display: 'flex' }}>
            <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ flexGrow: 1 }}>
                    <Bar data={chartData} options={chartOptions} />
                    <Typography>
                        {`Total Mortgages: ${totalLoans.toLocaleString()}`}
                    </Typography>
                </div>
            </Box>
            <Box sx={{ width: 300, display: 'flex', flexDirection: 'column' }}>
                <FairLendingPicker isLoading={isLoading} receiveValues={receiveValues} />
            </Box>
        </Box>
    )
};
