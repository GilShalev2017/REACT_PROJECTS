import axios from "axios";
import { JobRequestFilter, AiJobRequest, Channel, LanguageDm } from "../models/Job";


const API_KEY = "ActAuth eyJpZCI6MiwibmFtZSI6IkFkbWluaXN0cmF0b3IiLCJhY3R1c191c2VyX2dyb3VwX2lkIjowLCJpc19hZG1pbiI6dHJ1ZSwic2Vzc2lvbl9ndWlkIjoiNWIwYjU5YTItNTFjYi00ZjY2LTk5YzAtOTIzOTQyNzNjZjlmIiwiaW5fZGlyZWN0b3J5X3NlcnZpY2UiOmZhbHNlLCJhZF9ncm91cF9uYW1lIjpudWxsLCJzY29wZSI6IiIsIklkZW50aXR5IjpudWxsfSZYJlgmWC0xNjA2MTEwNzA3";

export const getFilteredJobRequests = async (filter: JobRequestFilter): Promise<AiJobRequest[]> => {
    try {
        const url = "http://localhost:8894/intelligence/api/aijob/ai-job-requests";

        //filter = {};
        //const url = "http://manila.local/actus5/v2/ActIntelligenceService/intelligence/api/aijob/ai-job-requests";
        // await axios.options(url, {
        //     headers: { "actauth": API_KEY },
        // });
        const response = await axios.post<AiJobRequest[]>(url, filter
            // , {
            // headers: {
            //     "actauth": API_KEY,
            //     "Content-Type": "application/json",
            // },
            // withCredentials: true, // Ensures cookies & auth headers are sent
    //    }
    );
        return response.data;
    } catch (error) {
        console.error("Error fetching job requests:", error);
        throw error;
    }
};

const BASE_AI_JOB_API = "http://localhost:8894/intelligence/api/aijob";

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

