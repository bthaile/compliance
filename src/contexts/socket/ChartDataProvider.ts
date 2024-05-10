import { GoalStatusLoadData, LenderTrendQuery, LoanPortfolioFormQuery, assetTypeKeys } from "pages/compliance";
import { BankYearLoanCityProps } from "pages/peer-group-chart";
import hashSum from "hash-sum";

export type UserAssessmentAreasQuery = {
    uid: string;
}

export type CensusTrackFormQuery = {
    uid?: string;
    year: string;
    type: string;
    fairLendingType: string;
    city: string;
};

async function hashQuery(query: object) {
    return hashSum(query);
}

const AssessmentAreaCache: { [key: string]: string } = {}
const buildAssessmentCache = (assess: { assessmentAreas: { id: string, name: string }[] }): void => {
    assess?.assessmentAreas?.forEach((area: { id: string, name: string }) => {
        AssessmentAreaCache[area.name] = area.id;
    })
}

const lookupAssessementAreas = (city: string): string => {
    return AssessmentAreaCache[city];

}

const lookupAssetType = (type: string): string => {
    return assetTypeKeys[type];
}

const cache: { [key: string]: object } = {};
const getCachedResult = async (endpoint: string, query: object, defaultReturn: any): Promise<object> => {
    try {
        const hash = await hashQuery({ endpoint, query });
        if (cache[hash]) {
            return cache[hash]; // Await the cached promise
        }

        const resultPromise = fetchJson(endpoint, query);
        cache[hash] = resultPromise;
        return await resultPromise;
    } catch (error) {
        console.error("Error fetching data:", error);
        return defaultReturn;
    }
}

const fetchJson = async (endpoint: string, query: object): Promise<object> => {
    const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(query)
    }).catch((error) => {
        console.error('Error fetching data:', error);
    });

    if (!response || !response.ok) {
        throw new Error(`HTTP error! status: ${response?.status}`);
    }
    return response.json() as Promise<object>;
}

const AssessmentAreaEndpoint = "/api/proxy/assessmentAreas"; // picklist
const LoanRankingEndpoint = "api/proxy/loan/ranking"; // charts 1,2 and 3
const LoanTrendEndpoint = "api/proxy/loan/trend"; // line chart
const CensusTrackEndpoint = "/api/proxy/census"; // census track table
const LoanActivityEndpoint = 'api/proxy/loan/activity'; // portfolio tabld

export const queryPicklistData = async (query: UserAssessmentAreasQuery): Promise<object> => {
    const values = await getCachedResult(AssessmentAreaEndpoint, query, []);
    buildAssessmentCache(values);
    return Object.keys(AssessmentAreaCache);
}

export const queryPeerGroupData = async (query: BankYearLoanCityProps): Promise<object> => {
    const dataQuery = {
        "userId": query.uid,
        "assessmentAreaId": lookupAssessementAreas(query.city),
        "dateRange": {
            "startYear": query.year,
            "endYear": query.year,
        },
        "type": query.type,
    };

    // Add any data transformations here
    return await getCachedResult(LoanRankingEndpoint, dataQuery, []);
}

export const queryFairLendingData = async (query: BankYearLoanCityProps): Promise<object> => {
    const dataQuery = {
        "userId": query.uid,
        "assessmentAreaId": lookupAssessementAreas(query.city),
        "dateRange": {
            "startYear": query.year,
            "endYear": query.year,
        },
        "type": lookupAssetType(query.type),
    };

    // Add any data transformations here
    return await getCachedResult(LoanRankingEndpoint, dataQuery, []);
}

export const queryGoalStatusData = async (query: GoalStatusLoadData): Promise<object> => {
    const dataQuery = {
        "userId": query.uid,
        "assessmentAreaId": lookupAssessementAreas(query.assessArea),
        "dateRange": {
            "startYear": 2021,
            "endYear": 2023,
        }
    };

    console.log('queryGoalStatusData:', dataQuery)
    // Add any data transformations here
    return await getCachedResult(LoanRankingEndpoint, dataQuery, []);
}

export const queryLoanTrends = async (query: LenderTrendQuery): Promise<object> => {
    const dataQuery = {
        "userId": query.uid,
        "assessmentAreaId": lookupAssessementAreas(query.assetArea),
        "dateRange": {
            "startYear": query.startYear,
            "endYear": query.endYear,
            //  "interval": "YEAR"     (QUARTER / MONTH)
            "interval": String(query.timeIncrement).toUpperCase()
        },
        "type": lookupAssetType(query.assetType),
    };
    console.log('queryLoanTrends:', dataQuery)
    return await getCachedResult(LoanTrendEndpoint, dataQuery, []);
}

export const queryCensusTracks = async (query: CensusTrackFormQuery): Promise<object> => {
    const dataQuery = {
        "userId": query.uid,
        "assessmentAreaId": lookupAssessementAreas(query.city),
        "year": query.year,
        "type": lookupAssetType(query.type),
    };
    console.log('queryCensusTracks:', dataQuery)
    return await getCachedResult(CensusTrackEndpoint, dataQuery, []);
}

export const queryLoanPortfolio = async (query: LoanPortfolioFormQuery): Promise<object> => {
    const dataQuery = {
        "userId": query.uid,
        "assessmentAreaId": lookupAssessementAreas(query.city),
        "year": query.year,
        "type": lookupAssetType(query.type),
        "fairLendingTypes": query.fairLendingTypes
    };
    console.log('queryLoanPortfolio:', dataQuery)
    return await getCachedResult(LoanActivityEndpoint, dataQuery, []);
}