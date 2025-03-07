import axios from "axios";
import { JobRequestFilter, AiJobRequest, Channel, LanguageDm, AIClipDm, UITag } from "../models/Models";


const API_KEY = "ActAuth eyJpZCI6MiwibmFtZSI6IkFkbWluaXN0cmF0b3IiLCJhY3R1c191c2VyX2dyb3VwX2lkIjowLCJpc19hZG1pbiI6dHJ1ZSwic2Vzc2lvbl9ndWlkIjoiNWIwYjU5YTItNTFjYi00ZjY2LTk5YzAtOTIzOTQyNzNjZjlmIiwiaW5fZGlyZWN0b3J5X3NlcnZpY2UiOmZhbHNlLCJhZF9ncm91cF9uYW1lIjpudWxsLCJzY29wZSI6IiIsIklkZW50aXR5IjpudWxsfSZYJlgmWC0xNjA2MTEwNzA3";
const BASE_AI_JOB_API = "http://localhost:8894/intelligence/api/aijob";

export const uiClipTags:UITag[] = [];

export const getFilteredJobRequests = async (filter: JobRequestFilter): Promise<AiJobRequest[]> => {
    try {
        //const url = "http://localhost:8894/intelligence/api/aijob/ai-job-requests"; //LOCAL
        const url = "http://localhost:4200/v2/ActIntelligenceService/intelligence/api/aijob/ai-job-requests";
        const response = await axios.post<AiJobRequest[]>(url, filter, {
            headers: {
                'Accept': 'application/json',
                'actauth': API_KEY,
                'Content-Type': 'application/json',
            },
            // withCredentials: true,
        }
        );
        return response.data;
    } catch (error) {
        console.error("Error fetching job requests:", error);
        throw error;
    }
};

export const addNewJob = async (jobRequest: AiJobRequest): Promise<string> => {
    try {
        const response = await axios.post<string>(`${BASE_AI_JOB_API}/schedule`, jobRequest, {
            headers: {
                "actauth": API_KEY, // Ensure API_KEY is properly defined
                "Content-Type": "application/json",
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error adding new job:", error);
        throw error;
    }
};

export const getChannels = async (): Promise<Channel[]> => {
    const channelsUrl = "http://manila.local/actus5/api/channels";

    try {
        const response = await axios.get<Channel[]>(channelsUrl, {
            headers: {
                actauth: API_KEY,
                "Content-Type": "application/json",
            },
        });

        return response.data;
    } catch (error) {
        console.error("Error fetching channels:", error);
        throw error;
    }
};

export const getLanguages = async (): Promise<LanguageDm[]> => {
    try {
        const languagesUrl = 'http://corona.local/actus5/v2/ActIntelligenceService/intelligence/api/service/languages';

        const response = await axios.get<LanguageDm[]>(languagesUrl, {
            headers: {
                actauth: API_KEY,
                // "Content-Type": "application/json",
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching channels:", error);
        throw error;
    };
}

// export const getClips = async (): Promise<AIClipDm[]> => {
//     try {
//         const url = 'http://localhost:4200/v2/ActIntelligenceService/intelligence/api/aiclip';
//         const response = await axios.get<AIClipDm[]>(url, {
//             headers: {
//                 'Accept': 'application/json',
//                 'actauth': API_KEY,
//                 'Content-Type': 'application/json',
//             },
//         }
//         );
//         return response.data;
//     } catch (error) {
//         console.error("Error fetching job requests:", error);
//         throw error;
//     }
// };


// Assuming you have these states defined in your React component:
// fromDate, toDate, selectedSortOption, selectedChannelsModel, searchTerm, searchOperandAnd, limitNumberOfClips, searchedClips, filteredClips, uiClipTags, selectedTags, isSearching, prevQuery, baseGraphQL

export const graphql_searchClips = async (): Promise<AIClipDm[]> => {
    let clipCreatedFrom = null;
    let clipCreatedTo = null;

    // if (fromDate && toDate) {
    //     clipCreatedFrom = new Date(fromDate.getTime() - (fromDate.getTimezoneOffset() * 60000)).toISOString().slice(0, -5);
    //     clipCreatedTo = new Date(toDate.getTime() - (toDate.getTimezoneOffset() * 60000)).toISOString().slice(0, -5);
    // }
    const today = new Date();
    const fromDate = new Date();
    fromDate.setMonth(today.getMonth() - 2); // 2 months ago
    clipCreatedFrom = new Date(fromDate.getTime() - (fromDate.getTimezoneOffset() * 60000)).toISOString().slice(0, -5);
    clipCreatedTo = new Date(today.getTime() - (today.getTimezoneOffset() * 60000)).toISOString().slice(0, -5);

    let sortBy = "CreatedDate";
    let sortOrder = -1;

    // if (selectedSortOption === 0) {
    //     sortOrder = -1;
    //     sortBy = "CreatedDate";
    // } else if (selectedSortOption === 1) {
    //     sortOrder = 1;
    //     sortBy = "CreatedDate";
    // } else if (selectedSortOption === 2) {
    //     sortOrder = 1;
    //     sortBy = "Name";
    // } else if (selectedSortOption === 3) {
    //     sortOrder = -1;
    //     sortBy = "Name";
    // } else if (selectedSortOption === 4) {
    //     sortOrder = -1;
    //     sortBy = "VideoDurationSec";
    // } else if (selectedSortOption === 5) {
    //     sortOrder = 1;
    //     sortBy = "VideoDurationSec";
    // }

    //let proxyChannelNames = [];

    // if (selectedChannelsModel && selectedChannelsModel.length > 0) {
    //     proxyChannelNames = selectedChannelsModel.map(channel => channel.displayName);
    // }

    let insightSearch = '';

    // if (searchTerm !== '') {
    //     let searchTerms = "";
    //     const words = searchTerm.match(/[\p{Letter}]+/gu);

    //     if (!searchOperandAnd) {
    //         searchTerms = JSON.stringify(words);
    //     } else {
    //         const andSearchTerm = `["${words.join('.*')}"]`;
    //         searchTerms = andSearchTerm;
    //     }
    //     searchTerm = words.join(' ');
    //     insightSearch = `
    //         insightSearch: {
    //             searchParams: { searchTerms: ${searchTerms}, insightTypeStr: "Transcription" }
    //         }
    //     `;
    // }

    const limitNumberOfClips = 500;
    const searchTerm = "";
    const proxyChannelNames = null;//[];//["Euronews HD", "France24HD", "TRT Arabi HD", "TRT World HD"];
    //const baseGraphQL = "v2/ActIntelligenceService/intelligence/api/graphql";
    const baseGraphQL = "http://localhost:4200/v2/ActIntelligenceService/intelligence/api/graphql";
    //http://corona.local/actus5/v2/ActIntelligenceService/intelligence/api/graphql

    const query = `query SearchAiClips {
        searchAiClips(
            clipFilter: {
                ${clipCreatedFrom !== null ? `clipCreatedFrom: "${clipCreatedFrom}"` : ''}
                ${clipCreatedTo !== null ? `clipCreatedTo: "${clipCreatedTo}"` : ''}
                limit: ${limitNumberOfClips}
                sortBy: "${sortBy}"
                sortOrder: ${sortOrder}
                ${insightSearch}
                createdBy: null
                aiClipId: null
                proxyChannelNames: ${JSON.stringify(proxyChannelNames)}
                aiClipNamesCSV: "${searchTerm}"
            }
        ) {
            name
            visibility {
                value
            }
            videoDurationSec
            createdDate
            createdBy
            id
            proxyMetadata {
                from
                to
                channelDisplayName
            }
            videoProgress {
                value
            }
            insightsProgress {
                value
            }
            status
            userTags
            audioLanguage
            insights {
                results {
                    timeCodedContentWithSearchData {
                        text
                        startInSeconds
                        endInSeconds
                    }
                }
            }
        }
    }`;

    //const currentQuery = JSON.stringify(query);

    // if (prevQuery !== currentQuery) {
    //     isSearching = true;
    //     searchedClips = [];
    //     filteredClips = [];
    //     selectedTags = [];
    // }

    // prevQuery = currentQuery;

    try {
        const response = await axios.post(baseGraphQL, { query }, {
            headers: {
                'Accept': 'application/json',
                'actauth': API_KEY,
                'Content-Type': 'application/json',
            },
        });
        const clips = response.data.data?.searchAiClips || [];

        // Assuming camelToPascal and getUiClipTags are defined elsewhere
        const pascalClips = camelToPascal(clips);
        // searchedClips = pascalClips;
        // filteredClips = pascalClips;
        const uiClipTags = getUiClipTags(pascalClips);
        uiClipTags.push(...uiClipTags);
        // setClipsSelection(); // Assuming setClipsSelection is defined elsewhere
        // filterByTags(selectedTags); // Assuming filterByTags is defined elsewhere
        // isSearching = false;
        return pascalClips;
    } catch (error) {
        console.error('Error in graphql_searchClips:', error);
        //isSearching = false;
        return [];
    }
};

function camelToPascal(obj: any): any {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }

    if (Array.isArray(obj)) {
        return obj.map((item) => camelToPascal(item));
    }

    const result: any = {};
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            const value = obj[key];
            const pascalKey = key.charAt(0).toUpperCase() + key.slice(1);
            result[pascalKey] = camelToPascal(value);
        }
    }
    return result;
}

const getUiClipTags = (clips: AIClipDm[]): UITag[] => {
    const clipTagsSet = new Set<string>();

    clips.forEach(clip => {
        clip?.UserTags?.forEach(tag => {
            if (tag.trim() !== "") {
                clipTagsSet.add(tag.trim());
            }
        });
    });

    return Array.from(clipTagsSet, tag => ({ text: tag, selected: false }));
    //return Array.from(clipTagsSet, tag => ({ text: tag, selected: this.selectedTags.includes(tag) }));
}