import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const CANDIDATE_EMAIL = import.meta.env.VITE_CANDIDATE_EMAIL;

export interface Candidate {
    uuid: string;
    candidateId: string;
    applicationId: string;
    firstName: string;
    lastName: string;
    email: string;
}

export interface Job {
    id: string;
    title: string;
}

export interface ApplicationData {
    uuid: string;
    jobId: string;
    candidateId: string;
    applicationId: string;
    repoUrl: string;
}

const api = axios.create({
    baseURL: BASE_URL,
});

export const getCandidate = async (): Promise<Candidate> => {
    const response = await api.get<Candidate>(`/api/candidate/get-by-email`, {
        params: { email: CANDIDATE_EMAIL },
    });
    return response.data;
};

export const getJobs = async (): Promise<Job[]> => {
    const response = await api.get<Job[]>(`/api/jobs/get-list`);
    return response.data;
};

export const applyToJob = async (data: ApplicationData): Promise<{ ok: boolean }> => {
    const response = await api.post<{ ok: boolean }>(`/api/candidate/apply-to-job`, data);
    return response.data;
};

export default api;
