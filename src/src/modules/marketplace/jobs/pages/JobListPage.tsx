import React, { useEffect, useMemo } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Alert,
  Box,
  Chip,
  CircularProgress,
  Fade,
  Grid,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Typography,
  alpha,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import debounce from 'lodash/debounce';
import ConstructionIcon from '@mui/icons-material/Construction';
import FilterListIcon from '@mui/icons-material/FilterList';
import SearchIcon from '@mui/icons-material/Search';

import BaseButton from '@/core/components/atoms/buttons/BaseButton';
import BaseContainer from '@/core/components/atoms/containers/BaseContainer';
import JobCard from '@/core/components/molecules/cards/JobCard';
import { useRootStore } from '@/core/hooks/useRootStore';
import { JOB_CATEGORIES } from '@/modules/marketplace/jobs/constants/jobCategories';
import { BRAND_COLORS } from '@/ui/themes/default/theme';

const JobListPage: React.FC = observer(() => {
  const { jobStore, bidStore, authenticationStore } = useRootStore();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const debouncedSearch = useMemo(
    () => debounce((val: string) => jobStore.setJobSearchQuery(val), 300),
    [jobStore]
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    jobStore.setJobSearchInputValue(val);
    debouncedSearch(val);
  };

  useEffect(() => {
    jobStore.initializeJobFiltersForCurrentUser();
    void jobStore.loadJobs();
    void bidStore.loadBids();

    return () => {
      debouncedSearch.cancel();
    };
  }, [bidStore, jobStore, debouncedSearch]);

  const filteredJobs = jobStore.filteredJobs;
  const roleLabel = authenticationStore.user?.role === 'IZVODJAC' ? 'izvođača' : 'investitora';

  return (
    <Box sx={{ pb: 12 }}>
      <Box
        sx={{
          color: 'white',
          pt: { xs: 6, md: 9 },
          pb: { xs: 7, md: 12 },
          mb: { xs: 4, md: 6 },
          borderRadius: { xs: '0 0 30px 30px', md: '0 0 60px 60px' },
          boxShadow: `0 20px 40px ${alpha(theme.palette.common.black, 0.22)}`,
          position: 'relative',
          zIndex: 1,
          mx: { xs: -2, sm: 0 },
          overflow: 'hidden',
          background: BRAND_COLORS.heroGradient,
          '&::before': {
            content: '""',
            position: 'absolute',
            inset: 0,
            background: `radial-gradient(circle at 15% 18%, ${alpha(theme.palette.primary.main, 0.16)}, transparent 36%), radial-gradient(circle at 80% 70%, ${alpha(theme.palette.primary.main, 0.14)}, transparent 35%)`,
          },
        }}
      >
        <BaseContainer maxWidth="lg">
          <Grid container spacing={4} alignItems="center" sx={{ position: 'relative', zIndex: 1 }}>
            <Grid size={{ xs: 12, md: 8 }}>
              <Chip
                label="Aktivni oglasi za gradjevinu"
                sx={{
                  mb: 2,
                  px: 0.8,
                  py: 0.2,
                  bgcolor: alpha(theme.palette.common.white, 0.1),
                  border: '1px solid',
                  borderColor: alpha(theme.palette.common.white, 0.18),
                  color: 'primary.main',
                  fontWeight: 800,
                  fontSize: '0.76rem',
                  letterSpacing: '0.03em',
                  textTransform: 'uppercase',
                }}
              />
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 900,
                  mb: 2,
                  letterSpacing: '-0.03em',
                  fontSize: { xs: '2rem', sm: '2.5rem', md: '3.75rem' },
                  textAlign: { xs: 'center', md: 'left' },
                }}
              >
                Pronadite sljedeci projekt
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: alpha(theme.palette.common.white, 0.82),
                  mb: 4,
                  fontWeight: 400,
                  maxWidth: { xs: '100%', md: '90%' },
                  textAlign: { xs: 'center', md: 'left' },
                  fontSize: { xs: '1rem', md: '1.25rem' },
                }}
              >
                Povezite se s investitorima direktno i bez posrednika.
              </Typography>

              <Paper
                elevation={0}
                sx={{
                  p: 0.5,
                  borderRadius: 3,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  maxWidth: 650,
                  bgcolor: 'background.paper',
                  boxShadow: `0 10px 30px ${alpha(theme.palette.common.black, 0.2)}`,
                  mx: { xs: 'auto', md: '0' },
                }}
              >
                <TextField
                  fullWidth
                  placeholder={isMobile ? 'Pretrazi...' : 'Pretrazite po zanimanju, gradu...'}
                  variant="outlined"
                  value={jobStore.jobSearchInputValue}
                  onChange={handleSearchChange}
                  sx={{
                    '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                    '& .MuiInputBase-input': { fontWeight: 500, py: 1.5 },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: 'primary.main', ml: 1 }} />
                      </InputAdornment>
                    ),
                  }}
                />
                {!isMobile && (
                  <BaseButton variant="contained" color="primary" sx={{ px: 4, borderRadius: 2.5, height: 48, fontWeight: 800 }}>
                    Pretrazi
                  </BaseButton>
                )}
              </Paper>
            </Grid>
          </Grid>
        </BaseContainer>
      </Box>

      <BaseContainer maxWidth="lg">
        {jobStore.jobsError && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 3 }}>
            {jobStore.jobsError}
          </Alert>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h5" sx={{ fontWeight: 900, color: 'secondary.main', display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ width: 6, height: 24, bgcolor: 'primary.main', borderRadius: 1 }} />
            Dostupni poslovi
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FilterListIcon fontSize="small" sx={{ color: 'text.disabled' }} />
            <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.secondary' }}>
              {filteredJobs.length} oglasa
            </Typography>
          </Box>
        </Box>

        <Paper
          elevation={0}
          sx={{
            mb: 4,
            p: { xs: 2, md: 3 },
            borderRadius: 4,
            border: '1px solid',
            borderColor: alpha(theme.palette.divider, 0.1),
            bgcolor: 'background.paper',
          }}
        >
          <Stack spacing={2}>
            <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.secondary' }}>
              Zadani filter za ulogu {roleLabel}: odaberite kategorije koje želite vidjeti odmah.
            </Typography>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {JOB_CATEGORIES.map((category) => {
                const isActive = jobStore.selectedJobCategories.includes(category);
                return (
                  <Chip
                    key={category}
                    clickable
                    label={category}
                    color={isActive ? 'primary' : 'default'}
                    variant={isActive ? 'filled' : 'outlined'}
                    onClick={() => jobStore.toggleSelectedJobCategory(category)}
                    sx={{ fontWeight: 700 }}
                  />
                );
              })}
            </Box>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
              <BaseButton
                variant="contained"
                color="primary"
                onClick={() => jobStore.saveCurrentJobFiltersAsDefault()}
                sx={{ fontWeight: 800 }}
              >
                Spremi kao zadano
              </BaseButton>
              <BaseButton
                variant="outlined"
                color="secondary"
                onClick={() => jobStore.resetAllJobFilters()}
                sx={{ fontWeight: 700 }}
              >
                Resetiraj filtere
              </BaseButton>
            </Stack>
          </Stack>
        </Paper>

        {jobStore.isLoadingJobs && filteredJobs.length === 0 ? (
          <Paper
            sx={{
              p: { xs: 6, md: 10 },
              textAlign: 'center',
              borderRadius: 5,
              border: '1px solid',
              borderColor: 'divider',
              bgcolor: 'background.paper',
            }}
          >
            <CircularProgress color="primary" />
          </Paper>
        ) : filteredJobs.length === 0 ? (
          <Fade in>
            <Paper
              sx={{
                p: { xs: 6, md: 10 },
                textAlign: 'center',
                borderRadius: 5,
                border: '2px dashed',
                borderColor: 'divider',
                bgcolor: alpha(theme.palette.background.paper, 0.5),
              }}
            >
              <ConstructionIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Nema rezultata
              </Typography>
              <BaseButton variant="text" onClick={() => jobStore.resetAllJobFilters()} sx={{ mt: 1 }}>
                Prikazi sve poslove
              </BaseButton>
            </Paper>
          </Fade>
        ) : (
          <Grid container spacing={{ xs: 2, md: 3 }}>
            {filteredJobs.map((job, index) => (
              <Grid key={job.id} size={{ xs: 12, sm: 6, md: 4 }}>
                <Fade in timeout={index * 50}>
                  <Box sx={{ height: '100%' }}>
                    <JobCard job={job} />
                  </Box>
                </Fade>
              </Grid>
            ))}
          </Grid>
        )}
      </BaseContainer>
    </Box>
  );
});

export default JobListPage;
