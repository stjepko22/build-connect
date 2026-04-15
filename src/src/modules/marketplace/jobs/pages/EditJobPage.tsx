import React, { useEffect } from 'react';
import {
  Alert,
  Typography,
  Paper,
  Box,
  Grid,
  MenuItem,
  alpha,
  useTheme,
  Divider,
  InputAdornment,
  CircularProgress,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EuroIcon from '@mui/icons-material/Euro';
import PlaceIcon from '@mui/icons-material/Place';
import EventIcon from '@mui/icons-material/Event';

import BaseButton from '@/core/components/atoms/buttons/BaseButton';
import BaseContainer from '@/core/components/atoms/containers/BaseContainer';
import BaseInput from '@/core/components/atoms/inputs/BaseInput';
import { useRootStore } from '@/core/hooks/useRootStore';
import { JOB_CATEGORIES, JobCategory } from '@/modules/marketplace/jobs/constants/jobCategories';

const EditJobPage: React.FC = observer(() => {
  const { id } = useParams<{ id: string }>();
  const { authenticationStore, jobStore } = useRootStore();
  const theme = useTheme();
  const navigate = useNavigate();

  const authenticatedUser = authenticationStore.user;
  const jobId = id || '';
  const currentJob = jobStore.getJobById(jobId);
  const isOwner = authenticatedUser?.id === currentJob?.investitorId;

  useEffect(() => {
    if (!jobId.trim()) {
      return;
    }

    void jobStore.loadJobById(jobId);
  }, [jobId, jobStore]);

  useEffect(() => {
    if (currentJob) {
      jobStore.initializeEditJobForm(currentJob);
    }
  }, [currentJob, jobStore]);

  if (!authenticatedUser) {
    return null;
  }

  if (jobStore.isLoadingJobDetails && !currentJob) {
    return (
      <BaseContainer maxWidth="md">
        <Box sx={{ pt: 1, display: 'flex', justifyContent: 'center' }}>
          <CircularProgress color="primary" />
        </Box>
      </BaseContainer>
    );
  }

  if (!currentJob) {
    return (
      <BaseContainer maxWidth="md">
        <Alert severity="error" sx={{ mt: 1, borderRadius: 3 }}>
          {jobStore.selectedJobError || 'Oglas nije dostupan za uredjivanje.'}
        </Alert>
      </BaseContainer>
    );
  }

  if (!isOwner) {
    return (
      <BaseContainer maxWidth="md">
        <Alert severity="warning" sx={{ mt: 1, borderRadius: 3 }}>
          Mozete uredjivati samo vlastite oglase.
        </Alert>
      </BaseContainer>
    );
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const isSaved = await jobStore.submitEditJobForm();
    if (isSaved) {
      navigate(`/posao/${jobId}`);
    }
  };

  return (
    <BaseContainer maxWidth="md" sx={{ pb: 6 }}>
      <BaseButton
        variant="text"
        color="secondary"
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(`/posao/${jobId}`)}
        sx={{ mb: 1.5, mt: 0.25, fontWeight: 700, px: 0 }}
      >
        Povratak na oglas
      </BaseButton>

      <Paper
        elevation={0}
        sx={{
          p: { xs: 4, md: 7 },
          borderRadius: 8,
          border: '1px solid',
          borderColor: alpha(theme.palette.divider, 0.1),
          boxShadow: `0 20px 60px ${alpha(theme.palette.common.black, 0.03)}`,
          position: 'relative',
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 900, mb: 1, color: 'secondary.main', letterSpacing: '-0.02em' }}>
          Azuriranje oglasa
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4, maxWidth: 560 }}>
          Promjene ce odmah biti vidljive izvodjacima koji pregledavaju vas oglas.
        </Typography>

        {jobStore.jobsError && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 3 }}>
            {jobStore.jobsError}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12 }}>
              <BaseInput
                fullWidth
                label="Naslov oglasa"
                value={jobStore.editJobTitle}
                onChange={(event) => jobStore.setEditJobTitle(event.target.value)}
                required
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <BaseInput
                fullWidth
                select
                label="Kategorija radova"
                value={jobStore.editJobCategory}
                onChange={(event) => jobStore.setEditJobCategory(event.target.value as JobCategory)}
                required
              >
                {JOB_CATEGORIES.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </BaseInput>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <BaseInput
                fullWidth
                label="Lokacija"
                value={jobStore.editJobLocation}
                onChange={(event) => jobStore.setEditJobLocation(event.target.value)}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PlaceIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <BaseInput
                fullWidth
                label="Budzet (EUR)"
                type="number"
                value={jobStore.editJobBudget}
                onChange={(event) => jobStore.setEditJobBudget(event.target.value)}
                placeholder="Ostavite prazno za dogovor"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EuroIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <BaseInput
                fullWidth
                label="Rok zavrsetka"
                value={jobStore.editJobDeadline}
                onChange={(event) => jobStore.setEditJobDeadline(event.target.value)}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EventIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <BaseInput
                fullWidth
                label="Detaljan opis posla"
                multiline
                rows={6}
                value={jobStore.editJobDescription}
                onChange={(event) => jobStore.setEditJobDescription(event.target.value)}
                required
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Divider sx={{ my: 2, borderStyle: 'dashed' }} />
              <Box sx={{ mt: 2, display: 'flex', justifyContent: { xs: 'stretch', sm: 'flex-end' } }}>
                <BaseButton
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  fullWidth
                  sx={{
                    px: { xs: 2, sm: 6, md: 8 },
                    py: 1.5,
                    borderRadius: 3,
                    fontWeight: 900,
                    maxWidth: { xs: '100%', sm: 360 },
                  }}
                  loading={jobStore.isLoading}
                  disabled={jobStore.isLoading || !jobStore.isEditJobFormValid}
                >
                  Spremi promjene
                </BaseButton>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </BaseContainer>
  );
});

export default EditJobPage;
