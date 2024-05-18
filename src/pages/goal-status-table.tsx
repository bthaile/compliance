import React, { useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { Box, Typography } from '@mui/material';
import GoalStatusPicker from './goal-status-picker';
import { FairLendingRowData, GoalStatusProps, GoalStatusLoadData, FairLendingRow } from './compliance'
import { usePubSub } from 'contexts/socket/WebSocketProvider';
import { makeTopicRequest, makeTopicResponse } from 'contexts/socket/PubSubTopics';

export default function GoalStatusTable({ uid, topic, formData }: GoalStatusProps) {
  const [data, setData] = React.useState<FairLendingRowData[]>([]);
  const [selectedAsset, setSelectedAsset] = React.useState<string>(formData?.assessAreas?.data[formData?.assessAreas?.defaultValue]);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const pubSub = usePubSub();


  function toPercentage(num = 0): string {
    if (num === 0 || num === undefined) return "0.00%";
    return (num * 100).toFixed(2) + '%';
  }

  const receiveValues = (values: GoalStatusLoadData) => {
    setIsLoading(true);
    const payload = {
      ...values,
      uid,
    }
    pubSub.publish(makeTopicRequest(topic), { topic, payload });
  }

  type LoanGoalData = {
    year: number;
    loanType: string;
    goalStatus: {
      fairLendingType: string;
      goalAdj: number;
      goalCount: number;
      goalPct: number;
      myCount: number;
      myPct: number;
    }[];
  };

  const updateChartData = (inputs: GoalStatusLoadData, values: { loanGoals: LoanGoalData[] }): void => {
    setSelectedAsset(inputs.assessArea);

    if (!values?.loanGoals || values?.loanGoals?.length === 0) {
      setIsLoading(false)
      return;
    }

    const loanGoals: FairLendingRowData[] = values?.loanGoals.map((goal: LoanGoalData) => {
      const fairAssets: Record<string, FairLendingRow> = {}
      const meta: FairLendingRowData = {
        year: goal.year,
        loanType: goal.loanType,
        fairLendings: fairAssets,
      }

      goal?.goalStatus?.map((status) => {
        const myData = {
          fairLendingType: status.fairLendingType,
          myCount: status.myCount,
          goalCount: status.goalCount,
          goalAdj: toPercentage(status.goalAdj),
          goalPct: toPercentage(status.goalPct),
          myPct: toPercentage(status.myPct),
          pos: 0,
          neg: 0,
        }

        if (status.goalAdj > 0) {
          myData.pos = status.goalAdj
        } else {
          myData.neg = status.goalAdj;
        }

        fairAssets[status.fairLendingType] = myData
        meta.fairLendings = fairAssets
      });
      return meta;

    });
    setData(loanGoals)
    setIsLoading(false)
  }


  // force a load of intial data to load chart
  useEffect(() => {
    pubSub.subscribe(makeTopicResponse(topic), ({ request, payload }: { request: GoalStatusLoadData, payload: GoalStatusLoadData }) => {
      console.log('GoalStatusTable', request, payload)
      updateChartData(request, payload)
    });
/* don't load initial data
    receiveValues({
      assessArea: formData?.assessAreas?.data[formData?.assessAreas.defaultValue],
    });
*/

    return () => {
      pubSub.unsubscribe(makeTopicResponse(topic));
    }
  }, []);
  const greyBackground = ['LMIArea', 'HispanicArea', 'HispanicIndividual']

  const getBackgroundColor = (value: string) => {
    if (greyBackground.includes(value)) {
      return { backgroundColor: 'lightgrey' };
    }
    return {};
  }

  const getCellStyle = (value: number, fairType: string) => {
    if (value < 0) {
      return { backgroundColor: 'lightpink' };
    } else if (value > 0) {
      return { backgroundColor: 'lightgreen' };
    }
    return getBackgroundColor(fairType);
  };



  const getLongName = (shortName: string) => {
    if (shortName === 'ALL') return 'Total Liens';
    if (shortName === 'FIRST') return 'First Liens';
    if (shortName === 'SECOND') return 'Second Liens';
  }

  const loanTypes = ['ALL', 'FIRST', 'SECOND']
  const fairTypes = ['LMIArea', 'MinorityArea', 'HispanicArea', 'AAArea', 'HispanicIndividual', 'AAIndividual']



  return (
    <Box>
      {/* Placeholder for the form */}
      <Box sx={{ marginBottom: 4 }}>
        <GoalStatusPicker isLoading={isLoading} receiveValues={receiveValues} formData={formData} />
      </Box>

      {/* Table section */}
      <TableContainer component={Paper}>
        <Typography sx={{ textAlign: 'center', fontSize: '1.5rem' }} variant="h4" component="h3" gutterBottom>
          Goal Status – {selectedAsset}
        </Typography>
        <Table aria-label="nested table headers">
          <TableHead>
            <TableRow>
              {/* First header row */}
              <TableCell align="center" colSpan={1}></TableCell>
              <TableCell sx={{ fontSize: '1rem' }} style={{ background: 'lightgrey' }} align="center" colSpan={4}>LMI Areas</TableCell>
              <TableCell sx={{ fontSize: '1rem' }} align="center" colSpan={4}>Minority Areas</TableCell>
              <TableCell sx={{ fontSize: '1rem' }} style={{ background: 'lightgrey' }} align="center" colSpan={4}>Hispanic Areas</TableCell>
              <TableCell sx={{ fontSize: '1rem' }} align="center" colSpan={4}>AA Areas</TableCell>
              <TableCell sx={{ fontSize: '1rem' }} style={{ background: 'lightgrey' }} align="center" colSpan={4}>Hisp Indiv</TableCell>
              <TableCell sx={{ fontSize: '1rem' }} align="center" colSpan={4}>AA Indiv</TableCell>
              {/* Add additional header cells with colSpan or rowSpan as needed */}
            </TableRow>
          </TableHead>

          {loanTypes.map((loanType) => (
            <>
              <TableHead>
                <TableRow sx={{ '& > *': { borderBottom: 'unset', padding: '1px' } }}>
                  <TableCell align="center">{getLongName(loanType)}</TableCell>
                  {fairTypes.map((fairType) => (
                    <>
                      <TableCell style={getBackgroundColor(fairType)} align="center">Goal</TableCell>
                      <TableCell style={getBackgroundColor(fairType)} align="center">Me</TableCell>
                      <TableCell style={getBackgroundColor(fairType)} align="center">+</TableCell>
                      <TableCell style={getBackgroundColor(fairType)} align="center">-</TableCell>
                    </>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {data.filter(d => d.loanType === loanType).map((row, rowIndex) => (
                  <TableRow key={`row-${rowIndex}`} sx={{ '& > *': { borderBottom: 'unset', padding: '4px' } }} >
                    <TableCell align="center">{row.year}</TableCell>
                    {fairTypes?.map((fairType, fairTypeIndex) => (
                      <React.Fragment key={`fairType-${rowIndex}-${fairTypeIndex}`}>
                        <TableCell style={getBackgroundColor(fairType)} align="center">{row.fairLendings[fairType]?.goalPct}</TableCell>
                        <TableCell style={getBackgroundColor(fairType)} align="center">{row.fairLendings[fairType]?.myPct}</TableCell>
                        <TableCell style={getCellStyle(row.fairLendings[fairType]?.pos, fairType)} align="center">{row.fairLendings[fairType]?.pos === 0 ? '' : row.fairLendings[fairType]?.pos}</TableCell>
                        <TableCell style={getCellStyle(row.fairLendings[fairType]?.neg, fairType)} align="center">{row.fairLendings[fairType]?.neg === 0 ? '' : row.fairLendings[fairType]?.neg}</TableCell>
                      </React.Fragment>
                    ))}
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan="100%" /> {/* Adjust the colSpan according to your table's column count */}
                </TableRow>
              </TableBody>
            </>
          ))}
        </Table >
      </TableContainer>
    </Box >
  );
};
