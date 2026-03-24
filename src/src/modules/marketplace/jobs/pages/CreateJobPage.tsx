import React from 'react';
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
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PostAddIcon from '@mui/icons-material/PostAdd';
import EuroIcon from '@mui/icons-material/Euro';
import PlaceIcon from '@mui/icons-material/Place';
import EventIcon from '@mui/icons-material/Event';

import BaseButton from '@/core/components/atoms/buttons/BaseButton';
import BaseContainer from '@/core/components/atoms/containers/BaseContainer';
import BaseInput from '@/core/components/atoms/inputs/BaseInput';
import { useRootStore } from '@/core/hooks/useRootStore';
import { JOB_CATEGORIES, JobCategory } from '@/modules/marketplace/jobs/constants/jobCategories';
import { BRAND_COLORS } from '@/ui/themes/default/theme';

const CreateJobPage: React.FC = observer(() => {
  const { jobStore } = useRootStore();
  const theme = useTheme();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isCreated = await jobStore.submitCreateJobForm();

    if (isCreated) {
      navigate('/marketplace');
    }
  };

  return (
    <BaseContainer maxWidth="md" sx={{ py: 6 }}>
      <BaseButton
        variant="text"
        color="secondary"
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(-1)}
        sx={{ mb: 4, fontWeight: 700, px: 0 }}
      >
        Odustani
      </BaseButton>

      <Box
        sx={{
          color: 'common.white',
          p: { xs: 3, md: 4 },
          mb: 3,
          borderRadius: 5,
          position: 'relative',
          overflow: 'hidden',
          background: BRAND_COLORS.heroGradient,
          '&::before': {
            content: '""',
            position: 'absolute',
            inset: 0,
            background: `radial-gradient(circle at 15% 18%, ${alpha(theme.palette.primary.main, 0.14)}, transparent 40%)`,
          },
        }}
      >
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Typography variant="h4" sx={{ fontWeight: 900, mb: 0.8 }}>
            Objavi novi projekt
          </Typography>
          <Typography sx={{ color: alpha(theme.palette.common.white, 0.82) }}>
            Ispunite detalje projekta kako biste privukli najbolje izvodace.
          </Typography>
        </Box>
      </Box>

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
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            p: 3,
            bgcolor: alpha(theme.palette.primary.main, 0.1),
            borderRadius: '0 0 0 30px',
          }}
        >
          <PostAddIcon sx={{ color: 'primary.main' }} />
        </Box>

        <Typography variant="h5" sx={{ fontWeight: 900, mb: 1 }}>
          Detalji oglasa
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4, maxWidth: 500 }}>
          Jasno opisan projekt daje brze i kvalitetnije ponude.
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
                placeholder="npr. Izrada termofasade na obiteljskoj kuci"
                value={jobStore.createJobTitle}
                onChange={(e) => jobStore.setCreateJobTitle(e.target.value)}
                required
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
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

            <Grid size={{ xs: 12, md: 6 }}>
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

            <Grid size={{ xs: 12, md: 6 }}>
              <BaseInput
                fullWidth
                label="Budzet (EUR)"
                type="number"
                value={jobStore.createJobBudget}
                onChange={(e) => jobStore.setCreateJobBudget(e.target.value)}
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

            <Grid size={{ xs: 12 }}>
              <BaseInput
                fullWidth
                label="Detaljan opis posla"
                multiline
                rows={6}
                placeholder="Opisite sto je potrebno napraviti..."
                value={jobStore.createJobDescription}
                onChange={(e) => jobStore.setCreateJobDescription(e.target.value)}
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
                  fullWidth={true}
                  sx={{
                    px: { xs: 2, sm: 6, md: 8 },
                    py: 1.5,
                    borderRadius: 3,
                    fontWeight: 900,
                    maxWidth: { xs: '100%', sm: 360 },
                  }}
                  loading={jobStore.isLoading}
                  disabled={jobStore.isLoading || !jobStore.isCreateJobFormValid}
                >
                  Objavi oglas
                </BaseButton>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </BaseContainer>
  );
});

export default CreateJobPage;
