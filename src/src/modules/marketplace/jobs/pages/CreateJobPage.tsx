import React from 'react';
import {
  Alert,
  Typography,
  Box,
  Grid,
  MenuItem,
  Divider,
  InputAdornment,
  Stack,
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
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

const CreateJobPage: React.FC = observer(() => {
  const { jobStore } = useRootStore();
  const navigate = useNavigate();
  const location = useLocation();
  const navigationState = location.state as { returnTo?: string; returnLabel?: string; afterSaveTo?: string } | null;
  const backTarget = navigationState?.returnTo || '/marketplace';
  const backLabel = navigationState?.returnLabel || 'Odustani';
  const afterSaveTarget = navigationState?.afterSaveTo || '/marketplace';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isCreated = await jobStore.submitCreateJobForm();

    if (isCreated) {
      navigate(afterSaveTarget);
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
          Objavi posao
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5, maxWidth: 520, lineHeight: 1.55 }}>
          Ispunite nekoliko osnovnih polja i oglas je spreman za objavu.
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
                Dajte oglasu jasan naslov i osnovni okvir posla.
              </Typography>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12 }}>
                  <BaseInput
                    fullWidth
                    label="Naslov oglasa"
                    placeholder="npr. Izrada termofasade na obiteljskoj kuci"
                    value={jobStore.createJobTitle}
                    onChange={(e) => jobStore.setCreateJobTitle(e.target.value)}
                    required
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <BaseInput
                    fullWidth
                    select
                    label="Kategorija radova"
                    value={jobStore.createJobCategory}
                    onChange={(e) => jobStore.setCreateJobCategory(e.target.value as JobCategory)}
                    required
                  >
                    {JOB_CATEGORIES.map((cat) => (
                      <MenuItem key={cat} value={cat}>
                        {cat}
                      </MenuItem>
                    ))}
                  </BaseInput>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <BaseInput
                    fullWidth
                    label="Lokacija"
                    placeholder="npr. Zagreb, Jarun"
                    value={jobStore.createJobLocation}
                    onChange={(e) => jobStore.setCreateJobLocation(e.target.value)}
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
                    label="Budžet (EUR)"
                    type="number"
                    value={jobStore.createJobBudget}
                    onChange={(e) => jobStore.setCreateJobBudget(e.target.value)}
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
                    label="Rok završetka"
                    placeholder="npr. Lipanj 2026."
                    value={jobStore.createJobDeadline}
                    onChange={(e) => jobStore.setCreateJobDeadline(e.target.value)}
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
                Ukratko opisite sto je potrebno napraviti i sto je investitoru vazno.
              </Typography>

              <BaseInput
                fullWidth
                label="Detaljan opis posla"
                multiline
                rows={5}
                placeholder="Opisite sto je potrebno napraviti, u kojem opsegu i u kojem roku."
                value={jobStore.createJobDescription}
                onChange={(e) => jobStore.setCreateJobDescription(e.target.value)}
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
                disabled={jobStore.isLoading || !jobStore.isCreateJobFormValid}
              >
                Objavi oglas
              </BaseButton>
            </Box>
          </Stack>
        </form>
      </Box>
    </BaseContainer>
  );
});

export default CreateJobPage;
