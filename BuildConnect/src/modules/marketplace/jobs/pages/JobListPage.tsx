import React from 'react';
import { Container, Typography, Box, Grid, Alert, Button } from '@mui/material';
import { useStore } from '@/stores/RootStore';
import { observer } from 'mobx-react-lite';
import JobCard from '../components/JobCard';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';

const JobListPage: React.FC = observer(() => {
  const { jobStore, authenticationStore } = useStore();
  const navigate = useNavigate();

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h3" sx={{ fontWeight: 800 }}>
            Marketplace
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Pronađite aktivne građevinske projekte
          </Typography>
        </Box>
        
        {authenticationStore.user?.role === 'INVESTITOR' && (
          <Button 
            variant="contained" 
            startIcon={<AddIcon />} 
            onClick={() => navigate('/objavi-posao')}
          >
            Objavi novi oglas
          </Button>
        )}
      </Box>

      {jobStore.allJobs.length === 0 ? (
        <Alert severity="info" sx={{ borderRadius: 2 }}>
          Trenutno nema objavljenih poslova. Budite prvi koji će objaviti projekt!
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {jobStore.allJobs.map((job) => (
            <Grid key={job.id} size={{ xs: 12, sm: 6, md: 4 }}>
              <JobCard job={job} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
});

export default JobListPage;