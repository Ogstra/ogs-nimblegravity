import React, { useState } from 'react';
import type { Job } from '../services/api';

interface JobCardProps {
    job: Job;
    onApply: (jobId: string, repoUrl: string) => Promise<void>;
    isApplying: boolean;
}

const JobCard: React.FC<JobCardProps> = ({ job, onApply, isApplying }) => {
    const [repoUrl, setRepoUrl] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const validateUrl = (url: string) => {
        return url.startsWith('https://github.com/');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (!validateUrl(repoUrl)) {
            setError('Please enter a valid GitHub repository URL (starts with https://github.com/)');
            return;
        }

        try {
            await onApply(job.id, repoUrl);
            setSuccess('Application submitted successfully!');
            setRepoUrl(''); // Clear input on success
        } catch (err: any) {
            setError(err.message || 'Failed to submit application. Please try again.');
        }
    };

    return (
        <div className="bg-white/80 backdrop-blur-sm shadow-md rounded-lg p-6 border border-stone-200 hover:shadow-xl hover:border-amber-200 transition-all duration-300">
            <h3 className="text-xl font-semibold text-amber-950 mb-4">{job.title}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor={`repo-url-${job.id}`} className="block text-sm font-medium text-stone-800 mb-1">
                        GitHub Repo URL
                    </label>
                    <input
                        id={`repo-url-${job.id}`}
                        type="url"
                        placeholder="https://github.com/username/repo"
                        required
                        value={repoUrl}
                        onChange={(e) => {
                            setRepoUrl(e.target.value);
                            if (error) setError(null); // Clear error while typing
                        }}
                        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-700 focus:border-amber-700 text-sm text-stone-900 bg-stone-50 placeholder-stone-400 ${error ? 'border-red-500' : 'border-stone-300'}`}
                        aria-invalid={!!error}
                        aria-describedby={error ? `error-${job.id}` : undefined}
                    />
                </div>

                {error && (
                    <p id={`error-${job.id}`} className="text-sm text-red-600 animate-pulse">
                        {error}
                    </p>
                )}

                {success && (
                    <p className="text-sm text-green-700 font-medium">
                        {success}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={isApplying || !repoUrl.trim()}
                    aria-busy={isApplying}
                    className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
            ${isApplying || !repoUrl.trim() ? 'bg-[#664109] opacity-70 cursor-not-allowed' : 'bg-[#664109] hover:bg-[#4d3107] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#664109]'}`}
                >
                    {isApplying ? 'Submitting...' : 'Submit'}
                </button>
            </form>
        </div>
    );
};

export default JobCard;
