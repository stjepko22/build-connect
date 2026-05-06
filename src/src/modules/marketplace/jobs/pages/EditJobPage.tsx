import React, { useEffect } from 'react';
import {
  Alert,
  Typography,
  Box,
  Grid,
  MenuItem,
  alpha,
  useTheme,
  Divider,
  InputAdornment,
  CircularProgress,
  Stack,
} from '@mui/material';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
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
  const location = useLocation();

  const authenticatedUser = authenticationStore.user;
  const jobId = id || '';
  const currentJob = jobStore.getJobById(jobId);
  const isOwner = authenticatedUser?.id === currentJob?.investitorId;
  const navigationState = location.state as { fromMyJobs?: boolean; returnTo?: string; returnLabel?: string } | null;
  const returnToMyJobs = navigationState?.fromMyJobs === true;
  const backTarget = navigationState?.returnTo || (returnToMyJobs ? '/moji-poslovi' : `/posao/${jobId}`);
  const backLabel = navigationState?.returnLabel || (returnToMyJobs ? 'Povratak na moje poslove' : 'Povratak na oglas');

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

  if (!jobStore.canEditJob(currentJob)) {
    return (
      <BaseContainer maxWidth="md">
        <BaseButton
          variant="text"
          color="secondary"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(backTarget)}
          sx={{ mb: 1.5, mt: 0.25, fontWeight: 700, px: 0 }}
        >
          {backLabel}
        </BaseButton>
        <Alert severity="info" sx={{ borderRadius: 3 }}>
          Oglas u trenutnom statusu vise nije moguce uredjivati.
        </Alert>
      </BaseContainer>
    );
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const isSaved = await jobStore.submitEditJobForm();
    if (isSaved) {
      navigate(backTarget);
    }
  };

  return (
    <BaseContainer maxWidth={false} disableGutters animate={false} sx={{ pb: 5 }}>
      <Box sx={{ maxWidth: 860, mx: 'auto', px: { xs: 2, sm: 3, md: 4 } }}>
        <BaseButton
          variant="text"
          color="secondary"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(backTarget)}
          sx={{ mb: 1.5, mt: 0.25, fontWeight: 700, px: 0 }}
        >
          {backLabel}
        </BaseButton>

        <Typography variant="h4" sx={{ fontWeight: 900, mb: 0.6, color: 'secondary.main', letterSpacing: '-0.03em' }}>
          Uredi oglas
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5, maxWidth: 520, lineHeight: 1.55 }}>
          Uredite nekoliko kljucnih podataka i brzo spremite promjene.
        </Typography>

        {jobStore.jobsError && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 3 }}>
            {jobStore.jobsError}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <Box
              sx={{
                py: { xs: 1, md: 1.25 },
              }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 800, color: 'secondary.main', mb: 0.5 }}>
                Osnovni podaci
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2.25 }}>
                Azurirajte naslov, kategoriju i osnovne uvjete oglasa.
              </Typography>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12 }}>
                  <BaseInput
                    fullWidth
                    label="Naslov oglasa"
                    value={jobStore.editJobTitle}
                    onChange={(event) => jobStore.setEditJobTitle(event.target.value)}
                    required
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
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

                <Grid size={{ xs: 12, sm: 6 }}>
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

                <Grid size={{ xs: 12, sm: 6 }}>
                  <BaseInput
                    fullWidth
                    label="Budzet (EUR)"
                    type="number"
                    value={jobStore.editJobBudget}
                    onChange={(event) => jobStore.setEditJobBudget(event.target.value)}
                    placeholder="Po dogovoru"
                    helperText="Polje je opcionalno."
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EuroIcon fontSize="small" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
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
              </Grid>
            </Box>

            <Divider sx={{ borderStyle: 'dashed' }} />

            <Box
              sx={{
                py: { xs: 1, md: 1.25 },
              }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 800, color: 'secondary.main', mb: 0.5 }}>
                Opis posla
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2.25 }}>
                Osvjezite opis samo ako se promijenio opseg, rok ili vazni detalji.
              </Typography>

              <BaseInput
                fullWidth
                label="Detaljan opis posla"
                multiline
                rows={5}
                value={jobStore.editJobDescription}
                onChange={(event) => jobStore.setEditJobDescription(event.target.value)}
                required
              />
            </Box>

            <Divider sx={{ borderStyle: 'dashed', mt: 0.25 }} />

            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column-reverse', sm: 'row' },
                justifyContent: 'space-between',
                alignItems: { xs: 'stretch', sm: 'center' },
                gap: 1.5,
              }}
            >
              <BaseButton
                variant="text"
                color="secondary"
                onClick={() => navigate(backTarget)}
                sx={{ alignSelf: { xs: 'stretch', sm: 'flex-start' }, px: { xs: 0.5, sm: 1 } }}
              >
                Odustani
              </BaseButton>

              <BaseButton
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                fullWidth
                sx={{
                  px: { xs: 2, sm: 4.5 },
                  py: 1.4,
                  borderRadius: 999,
                  fontWeight: 900,
                  maxWidth: { xs: '100%', sm: 260 },
                }}
                loading={jobStore.isLoading}
                disabled={jobStore.isLoading || !jobStore.isEditJobFormValid}
              >
                Spremi promjene
              </BaseButton>
            </Box>
          </Stack>
        </form>
      </Box>
    </BaseContainer>
  );
});

export default EditJobPage;
