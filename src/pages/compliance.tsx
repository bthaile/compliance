import React, { useEffect, useState } from 'react';
import 'chartjs-plugin-datalabels';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { AppBar, Toolbar, IconButton, Paper, Select, MenuItem } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Sidebar from 'components/toolbar/Sidebar';
import PeerGroupChart from './peer-group-chart';
import FairLendingChart, { BankYearLoanFairCityProps } from './fair-lending-chart';
import GoalStatusTable from './goal-status-table';
import CensusTracks from './census-tracks';
import LoanPortfolio from './loan-portfolio';
import LendingTrendsChart from './lending-trends-chart';
import lendingTrends2023 from '../assets/data/lendingTrends2023.json';
import loanPortfolio2021 from '../assets/data/loanPortfolio2021.json';
import loanPortfolio2022 from '../assets/data/loanPortfolio2022.json';
import loanGoals20022003 from '../assets/data/1-2-3-MemphisAnalysis2022-2023.json';
import { usePubSub } from 'contexts/socket/WebSocketProvider';
import { CHART_TOPICS, makeTopicRequest, makeTopicResponse, stripTopicAction } from 'contexts/socket/PubSubTopics';
import useAuth from 'contexts/auth/useAuth';


export interface CensusTract {
    tractName: string;
    stateCode: string;
    msa: string;
    totalPop: number;
    minorityPop: number;
    hispPop: number;
    aaPop: number;
    totalOrig: number;
    hispOrig: number;
    aaOrig: number;
    aa: boolean;
    hispanic: boolean;
    minority: boolean;
    lmi: boolean;
    originationCounts: [{
        loanType: string;
        totalOrig: number;
        myOrig: number;
        hispOrig: number;
        myHispOrig: number;
        aaOrig: number;
        myAaOrig: number;
    }]
}

export interface CensusData {
    year: number;
    censusTracts: CensusTract[];
}


export type FormInputData = {
    data: string[];
    defaultValue: number;
}


// Define a type for the row data
export type CensusTrackRowData = {
    tractName: string;
    totalPop: number;
    totalOrig?: number; // todo: set it manually from originationCounts.totalOrig
    myOrig?: number; // todo: set it manually from originationCounts.myOrig 
    myPct: number;
    lmi: boolean;
    minority: boolean;
    minorityPop: number;
    hispanicAA: boolean;
    minorityPct: number;
    hispanic: boolean;
    hispPop: number;
    hispanicPct: number;
    aa: boolean;
    aaPop: number;
    aaPct: number;
    hispOrig?: string; // todo: set it manually from originationCounts.hispOrig
    myHispOrig?: string; // todo: set it manually from originationCounts.myHispOrig
    aaOrig?: string; // todo: set it manually from originationCounts.aaOrig
    myAaOrig?: string; // todo: set it manually from originationCounts.myAaOrig
};


// Define a type for the row data
export type LoanPortfolioRowData = {
    censusTract: string;
    assetArea: string;
    confirming: string;
    loanProduct: string;
    dwellingType: string;
    ethnicity: string;
    race: string;
    loanAmount: string;
    interestRate: string;
    loanTerm: string;
    year: number;
};

export type LoanPortfolioFormQuery = {
    uid?: string;
    year: string;
    type: string;
    city: string;
    fairLendingTypes: string[];
};

export type LoanPortfolioFormData = {
    years: FormInputData;
    cities: FormInputData;
    types: FormInputData;
    fairLendingTypes: FormInputData;
}

export type LoanPortfolioProps = {
    uid?: string;
    topic: string;
    formData: LoanPortfolioFormData;
}


export type CensusTrackFormData = {
    years: FormInputData;
    cities: FormInputData;
    types: FormInputData;
    fairLendingTypes: FormInputData;
}

export type CensusTrackProps = {
    uid?: string;
    topic: string;
    formData: CensusTrackFormData;
}

export type LenderTrendQuery = {
    uid?: string,
    startYear: string,
    startMonth: string,
    endYear: string,
    endMonth: string,
    timeIncrement: string,
    assetType: string,
    fairLendingType: string,
    assetArea: string,
}

export type LenderTrend = {
    lenderCode: string;
    counts: number[];
    percents: number[];
}

export type FairLendingTrend = {
    fairLendingType: string;
    labels: string[];
    lenderTrends: LenderTrend[];
}

export type LoanTrend = {
    loanType: string;
    fairLendingTrends: FairLendingTrend[];
}



export type FairLendingRow = {
    fairLendingType: string;
    goalAdj: string;
    goalCount: number;
    goalPct: string;
    myCount: number;
    myPct: string;
    pos: number;
    neg: number;
}

// Define a type for the row data
export type FairLendingRowData = {
    fairLendings: Record<string, FairLendingRow>;
    year: number;
    loanType: string;
}

export type GoalStatusFormData = {
    assessAreas: FormInputData;

}
export type GoalStatusLoadData = {
    uid?: string;
    assessArea: string;

}
export type GoalStatusPickerProps = {
    isLoading: boolean;
    receiveValues: (values: GoalStatusLoadData) => void;
    formData: GoalStatusFormData;
}

export type GoalStatusProps = {
    uid?: string;
    topic: string;
    formData: GoalStatusFormData;
}

export type BankLoanInfo = {
    bankNames: string[];
    bankLoans: number[];
    totalLoans: number;
}

export const BaseFairLendingTypes = ['LMI Area', 'Minority Area', 'Hispanic Area', 'AA Area', 'Hispanic Individual', 'AA Individual'];
export const FairLendingTypes: string[] = [...BaseFairLendingTypes]
export const FairLendingTypesKeys: { [key: string]: string } = {
    'Total': 'Total',
    'LMI Area': 'LMIArea',
    'Minority Area': 'MinorityArea',
    'Hispanic Area': 'HispanicArea',
    'AA Area': 'AAArea',
    'Hispanic Individual': 'HispanicIndividual',
    'AA Individual': 'AAIndividual'
}

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ChartDataLabels
);

export const assetTypeNames = ['Total', 'First Mortgage', 'Second Mortgage']
export const assetTypeKeys: { [key: string]: string } = {
    'Total': 'TOTAL',
    'First Mortgage': 'FIRST',
    'Second Mortgage': 'SECOND',
}

const ComplianceCharts = () => {
    const [openDrawer, setOpenDrawer] = useState<boolean>(false);
    const [chartType, setChartType] = useState('peer_group');
    const [assessmentAreas, setAssessmentAreas] = useState<string[]>([]);
    const pubSub = usePubSub();
    const { authUser } = useAuth();

    const distributeData = ({ topic, payload }: { topic: string, payload: any }) => {
        console.log(`Received data for ${topic}`);
        const featureName = stripTopicAction(topic);
        if (featureName === CHART_TOPICS.PICKLIST_DATA) {
            console.log('setting assessment areas')
            setAssessmentAreas(payload as string[]);
        }
    }

    useEffect(() => {
        Object.keys(CHART_TOPICS).map(topic => {
            pubSub?.subscribe(makeTopicResponse(topic), (data) => distributeData(data))
        });

        pubSub.publish(makeTopicRequest(CHART_TOPICS.PICKLIST_DATA), { topic: CHART_TOPICS.PICKLIST_DATA, payload: { uid: authUser?.uid } });

        return () => {
            Object.keys(CHART_TOPICS).map(topic =>
                pubSub?.unsubscribe(makeTopicResponse(topic))
            );
        }
    }, []);

    const handleChartChange = (event: any) => {
        setChartType(event?.target?.value as string);
        // You can also add logic here to change the main page content based on the selected chart
    };

    const peerGroupFormData = {
        years: { data: ['2024 YTD', '2023', '2022', '2021'], defaultValue: 1 },
        cities: { data: assessmentAreas, defaultValue: 0 },
        types: { data: assetTypeNames, defaultValue: 0 },
    }

    const loanGoalsFormData = {
        assessAreas: { data: assessmentAreas, defaultValue: 0 },
    }

    const fairLendingFormData = {
        years: { data: ['2024 YTD', '2023', '2022', '2021'], defaultValue: 1 },
        cities: { data: assessmentAreas, defaultValue: 0 },
        types: { data: assetTypeNames, defaultValue: 0 },
        fairLendingTypes: { data: FairLendingTypes, defaultValue: 0 },
    }
 
    // TODO: need better way to organize data for forms
    const lendingTrendsFormData = {
        startYears: { data: ['2024', '2023', '2022', '2021', '2020'], defaultValue: 2 },
        startMonths: { data: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'], defaultValue: 0 },
        endYears: { data: ['2024', '2023', '2022', '2021', '2020'], defaultValue: 1 },
        endMonths: { data: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'], defaultValue: 0 },
        timeIncrements: { data: ['Month', 'Quarter', 'Year'], defaultValue: 1 },
        assetTypes: { data: assetTypeNames, defaultValue: 0 },
        fairLendingTypes: { data: FairLendingTypes, defaultValue: 0 },
        assetAreas: { data: [...assessmentAreas, 'No Asset Area', 'All'], defaultValue: 0 },
    }

    const censusTrackFormData = {
        years: { data: ['2023', '2022', '2021'], defaultValue: 0 },
        types: { data: assetTypeNames, defaultValue: 0 },
        cities: { data: assessmentAreas, defaultValue: 0 },
        fairLendingTypes: { data: ['Total', ...FairLendingTypes], defaultValue: 0 },
    }

    const loanPortfolioFormData = {
        years: { data: ['2023', '2022', '2021', '2020'], defaultValue: 0 },
        types: { data: assetTypeNames, defaultValue: 0 },
        cities: { data: [...assessmentAreas, 'No Asset Area', 'All'], defaultValue: 0 },
        fairLendingTypes: { data: BaseFairLendingTypes, defaultValue: 0 },
    }


    const handleDrawerChange = (open: boolean) => {
        setOpenDrawer(open);
    };


    const renderChart = () => {
        switch (chartType) {
            case 'peer_group':
                return <PeerGroupChart uid={authUser?.uid} topic={CHART_TOPICS.PEER_GROUP} formData={peerGroupFormData} />;
            case 'fair_lending_rank':
                return <FairLendingChart uid={authUser?.uid} topic={CHART_TOPICS.FAIR_LENDING_RANK} formData={fairLendingFormData} />;
            case 'goal_status':
                return <GoalStatusTable uid={authUser?.uid} topic={CHART_TOPICS.GOAL_SETTING} formData={loanGoalsFormData} />;
            case 'lending_trends':
                return <LendingTrendsChart uid={authUser?.uid} topic={CHART_TOPICS.LENDING_TRENDS} formData={lendingTrendsFormData} />;
            case 'census_tracks':
                return <CensusTracks uid={authUser?.uid} topic={CHART_TOPICS.CENSUS_TRACT} formData={censusTrackFormData} />;
            case 'loan_portfolio':
                return <LoanPortfolio uid={authUser?.uid} topic={CHART_TOPICS.LOAN_PORTFOLIO} formData={loanPortfolioFormData} />;
            default:
                return <PeerGroupChart uid={authUser?.uid} topic={CHART_TOPICS.PEER_GROUP} formData={peerGroupFormData} />;
        }
    };

    return (
        <div>
            <Paper>
                <div>
                    <AppBar position="sticky">
                        <Toolbar>
                            <IconButton
                                color="inherit"
                                aria-label="open drawer"
                                onClick={() => handleDrawerChange(!openDrawer)}
                                edge="start"
                            >
                                <MenuIcon />
                            </IconButton>

                            <Select
                                value={chartType}
                                onChange={handleChartChange}
                                displayEmpty
                                inputProps={{ 'aria-label': 'Without label' }}
                                variant="standard"
                                sx={{ color: 'white', borderColor: 'white' }}
                            >
                                <MenuItem value="peer_group">Peer Group</MenuItem>
                                <MenuItem value="fair_lending_rank">Fair Lending Rank</MenuItem>
                                <MenuItem value="goal_status">Goal Status</MenuItem>
                                <MenuItem value="lending_trends">Lending Trends</MenuItem>
                                <MenuItem value="census_tracks">Census Tracks</MenuItem>
                              
                            </Select>
                        </Toolbar>
                    </AppBar>
                </div>
                <Sidebar open={openDrawer} handleDrawerChange={handleDrawerChange} />
                <div style={{ height: '100%', margin: '10px' }}>
                    {assessmentAreas.length > 0 && renderChart()}
                </div>

            </Paper >
        </div >

    )
};

export default ComplianceCharts;
