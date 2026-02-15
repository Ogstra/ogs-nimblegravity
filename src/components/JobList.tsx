import React from 'react';
import type { Job } from '../services/api';
import JobCard from './JobCard';

interface JobListProps {
    jobs: Job[];
    onApply: (jobId: string, repoUrl: string) => Promise<void>;
    applyingJobId: string | null;
}

const JobList: React.FC<JobListProps> = ({ jobs, onApply, applyingJobId }) => {
    if (jobs.length === 0) {
        return (
            <div className="text-center py-10 text-stone-500">
                No jobs available at the moment.
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
                <JobCard
                    key={job.id}
                    job={job}
                    onApply={onApply}
                    isApplying={applyingJobId === job.id}
                />
            ))}
        </div>
    );
};

export default JobList;
