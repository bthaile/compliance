// WebSocketManager.ts
import { CHART_TOPICS, makeTopicRequest, makeTopicResponse, stripTopicAction } from './PubSubTopics';
import { SocketActions, SocketActionTypes } from './types';
import Socket from 'simple-websocket';
import lendingTrends2023 from '../../assets/data/lendingTrends2023.json';
import censusTracksData from '../../assets/data/censusTracksData.json';
import loanPortfolio2021 from '../../assets/data/loanPortfolio2021.json';
import loanPortfolio2022 from '../../assets/data/loanPortfolio2022.json';
import loanGoals20022003 from '../../assets/data/1-2-3-MemphisAnalysis2022-2023.json';
import { queryCensusTracks, queryFairLendingData, queryGoalStatusData, queryLoanPortfolio, queryLoanTrends, queryPeerGroupData, queryPicklistData } from './ChartDataProvider';

interface MessageData {
    [key: string]: any;  // Customize according to your data structure
}

class WebSocketManager {
    private socket: Socket;
    private pubSub: any;

    public constructor(url: string, pubsub: any) {
        this.pubSub = pubsub;
        this.socket = new Socket(
            url
        );


        this.socket.on('error', (data) => {
            console.log('Websocket Error: ', data);
        });



        this.socket.on('connect', () => {
            console.log('WebSocket Connected');

            console.log('adding subscriptions')

            Object.keys(CHART_TOPICS).map(topic =>
                this.pubSub?.subscribe(makeTopicRequest(topic),
                    (data) => this.fetchData(data))
            );

        });


        this.socket.on('data', (data: Uint8Array) => {
            const dataString = new TextDecoder('utf-8').decode(data);
            const json = JSON.parse(
                dataString,
            );
            // do something here when data comes in.
            console.log('WebSocket Data:', json)
        });

        this.socket.on('close', () => {
            console.log('WebSocket Disconnected')
            Object.keys(CHART_TOPICS).map(topic => {
                this.pubSub?.unsubscribe(makeTopicRequest(topic))
                this.pubSub?.unsubscribe(makeTopicResponse(topic))
            });
        });
    }

    fetchData({ topic, payload }: { topic: string, payload: any }): void {
        // payload is request parameters
        console.log('fetching data for topic:', topic, payload)
        const featureName = stripTopicAction(topic);
        try {
            // get file data
            let data = {};

            if (featureName === CHART_TOPICS.CENSUS_TRACT) {
                data = queryCensusTracks(payload).then((data) => {
                    this.pubSub.publish(makeTopicResponse(featureName), { topic: featureName, request: payload, payload: data });
                });
            } else if (featureName === CHART_TOPICS.PICKLIST_DATA) {
                data = queryPicklistData(payload).then((data) => {
                    this.pubSub.publish(makeTopicResponse(featureName), { topic: featureName, request: payload, payload: data });
                })
            } else if (featureName === CHART_TOPICS.PEER_GROUP) {
                data = queryPeerGroupData(payload).then((data) => {
                    this.pubSub.publish(makeTopicResponse(featureName), { topic: featureName, request: payload, payload: data });
                })
            } else if (featureName === CHART_TOPICS.FAIR_LENDING_RANK) {
                data = queryFairLendingData(payload).then((data) => {
                    this.pubSub.publish(makeTopicResponse(featureName), { topic: featureName, request: payload, payload: data });
                })
            } else if (featureName === CHART_TOPICS.GOAL_SETTING) {
                data = queryGoalStatusData(payload).then((data) => {
                    this.pubSub.publish(makeTopicResponse(featureName), { topic: featureName, request: payload, payload: data });
                })
            } else if (featureName === CHART_TOPICS.LENDING_TRENDS) {
                data = queryLoanTrends(payload).then((data) => {
                    this.pubSub.publish(makeTopicResponse(featureName), { topic: featureName, request: payload, payload: data });
                })
            } else if (featureName === CHART_TOPICS.LOAN_PORTFOLIO) {
                data = queryLoanPortfolio(payload).then((data) => {
                    this.pubSub.publish(makeTopicResponse(featureName), { topic: featureName, request: payload, payload: data });
                })
            }
        } catch (error) {
            console.error(`Failed to fetch data for ${featureName}:`, error);
            this.pubSub.publish(`${featureName}_ERROR`, { error: `Failed to fetch data for ${featureName}` });
        }
    }


    sendData(data: string): void {
        if (!this.socket.closed) {
            console.log('sending data:', data)
            this.socket.send(JSON.stringify(data));
        }
    }

    close(): void {
        this.socket.destroy();
    }
}

export default WebSocketManager;
