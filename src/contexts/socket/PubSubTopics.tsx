export const CHART_TOPICS = {
    PEER_GROUP: 'peer_group',
    FAIR_LENDING_RANK: 'fair_lending_rank',
    GOAL_SETTING: 'goal_setting',
    LENDING_TRENDS: 'lending_trends',
    LOAN_PORTFOLIO: 'loan_portfolio',
    CENSUS_TRACT: 'census_tract',
    PICKLIST_DATA: 'picklist_data',
}

export const makeTopicRequest = (topic: string) => `${topic}_REQUEST`;

export const makeTopicResponse = (topic: string) => `${topic}_RESPONSE`;

export const stripTopicAction = (topicAction: string) => topicAction.replace('_REQUEST', '').replace('_RESPONSE', '');