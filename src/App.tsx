import { useEffect, useState } from 'react';
import { getCandidate, getJobs, applyToJob, type Candidate, type Job } from './services/api';
import JobList from './components/JobList';

function App() {
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [applyingJobId, setApplyingJobId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Execute requests in parallel for speed
        const [candidateData, jobsData] = await Promise.all([
          getCandidate(),
          getJobs(),
        ]);
        setCandidate(candidateData);
        setJobs(jobsData);
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleApply = async (jobId: string, repoUrl: string) => {
    if (!candidate) return;

    try {
      setApplyingJobId(jobId);
      await applyToJob({
        uuid: candidate.uuid,
        jobId,
        candidateId: candidate.candidateId,
        applicationId: candidate.applicationId,
        repoUrl,
      });
    } catch (err: any) {
      console.error(err);
      throw err; // Re-throw to be handled by the component
    } finally {
      setApplyingJobId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-orange-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-800"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-orange-50 p-4">
        <div className="bg-red-50 text-red-900 p-6 rounded-lg shadow-md max-w-md text-center border border-red-200">
          <h2 className="text-lg font-bold mb-2">Error</h2>
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-700 text-white rounded hover:bg-red-800 transition shadow-sm"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-orange-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold text-amber-950 mb-2">
            Nimble Gravity
          </h1>
          {candidate && (
            <p className="text-lg text-stone-700">
              <span className="font-semibold">{candidate.firstName} {candidate.lastName}</span>
            </p>
          )}
        </header>

        <main>
          <JobList
            jobs={jobs}
            onApply={handleApply}
            applyingJobId={applyingJobId}
          />
        </main>
      </div>
    </div>
  );
}

export default App;
