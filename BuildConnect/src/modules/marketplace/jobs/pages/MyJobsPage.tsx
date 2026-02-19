import React from 'react';
import { Container, Typography, Box, Grid, Alert } from '@mui/material';
import { useStore } from '@/stores/RootStore';
import { observer } from 'mobx-react-lite';
import JobCard from '../components/JobCard';

const MyJobsPage: React.FC = observer(() => {
  const { jobStore, bidStore, authenticationStore } = useStore();
  const user = authenticationStore.user;

  // Logika filtriranja
  const myPublishedJobs = jobStore.allJobs.filter(job => job.investitorId === user?.id);
  
  const myBidJobIds = bidStore.bids
    .filter(bid => bid.contractorId === user?.id)
    .map(bid => bid.jobId);
  
  const jobsIAppliedTo = jobStore.allJobs.filter(job => myBidJobIds.includes(job.id));

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" sx={{ fontWeight: 800 }}>
          Moji Poslovi
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Upravljajte svojim aktivnostima na platformi
        </Typography>
      </Box>

      {user?.role === 'INVESTITOR' && (
        <Box>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 700 }}>
            Objavljeni oglasi ({myPublishedJobs.length})
          </Typography>
          {myPublishedJobs.length === 0 ? (
            <Alert severity="info">Niste objavili nijedan oglas još uvijek.</Alert>
          ) : (
            <Grid container spacing={3}>
              {myPublishedJobs.map(job => (
                <Grid key={job.id} size={{ xs: 12, sm: 6, md: 4 }}>
                  <JobCard job={job} />
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      )}

      {user?.role === 'IZVODJAC' && (
        <Box>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 700 }}>
            Poslovi na koje ste poslali ponudu ({jobsIAppliedTo.length})
          </Typography>
          {jobsIAppliedTo.length === 0 ? (
            <Alert severity="info">Niste poslali nijednu ponudu još uvijek.</Alert>
          ) : (
            <Grid container spacing={3}>
              {jobsIAppliedTo.map(job => (
                <Grid key={job.id} size={{ xs: 12, sm: 6, md: 4 }}>
                  <JobCard job={job} />
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      )}

      {!user && (
        <Alert severity="warning">Morate biti prijavljeni da biste vidjeli svoje poslove.</Alert>
      )}
    </Container>
  );
});

export default MyJobsPage;