import React, { useEffect, useMemo, useState } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Alert,
  Box,
  Chip,
  CircularProgress,
  Drawer,
  Fade,
  Grid,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Typography,
  alpha,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import debounce from 'lodash/debounce';
import ConstructionIcon from '@mui/icons-material/Construction';
import FilterListIcon from '@mui/icons-material/FilterList';
import SearchIcon from '@mui/icons-material/Search';
import { useSearchParams } from 'react-router-dom';

import BaseButton from '@/core/components/atoms/buttons/BaseButton';
import BaseContainer from '@/core/components/atoms/containers/BaseContainer';
import BaseInput from '@/core/components/atoms/inputs/BaseInput';
import JobCard from '@/core/components/molecules/cards/JobCard';
import { useRootStore } from '@/core/hooks/useRootStore';
import { JOB_CATEGORIES, JobCategory } from '@/modules/marketplace/jobs/constants/jobCategories';
import { BRAND_COLORS } from '@/ui/themes/default/theme';

const MARKET_MOBILE_CONTENT_WIDTH = { xs: 440, sm: 460 };
const MARKET_MOBILE_CONTENT_PADDING = { xs: 1.5, sm: 2 };
const MARKET_RESULTS_PADDING = { xs: 0.75, sm: 1.25 };

const JobListPage: React.FC = observer(() => {
  const { jobStore, bidStore, authenticationStore } = useRootStore();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [searchParams] = useSearchParams();
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);

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
    const categoryFilters = Array.from(
      new Set(
        searchParams
          .getAll('category')
          .filter((value): value is JobCategory => JOB_CATEGORIES.includes(value as JobCategory))
      )
    );
    const queryFilter = searchParams.get('q')?.trim() ?? '';
    const hasRouteFilters = searchParams.has('q') || searchParams.has('category');

    jobStore.resetAllJobFilters();
    jobStore.initializeJobFiltersForCurrentUser();

    if (hasRouteFilters) {
      jobStore.setSelectedJobCategories(categoryFilters);
      jobStore.setJobSearchInputValue(queryFilter);
      jobStore.setJobSearchQuery(queryFilter);
    }

    void jobStore.loadJobs();
    void bidStore.loadBids();

    return () => {
      debouncedSearch.cancel();
    };
  }, [bidStore, jobStore, debouncedSearch, searchParams]);

  const filteredJobs = jobStore.filteredJobs;
  const roleLabel = authenticationStore.user?.role === 'IZVODJAC' ? 'izvodjaca' : 'investitora';
  const selectedFiltersCount = jobStore.selectedJobCategories.length;

  const desktopFilterPanel = (
    <Paper
      elevation={0}
      sx={{
        mb: 4,
        p: 3,
        borderRadius: 4,
        border: '1px solid',
        borderColor: alpha(theme.palette.divider, 0.1),
        bgcolor: 'background.paper',
      }}
    >
      <Stack spacing={2}>
        <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.secondary' }}>
          Zadani filter za ulogu {roleLabel}: odaberite kategorije koje zelite vidjeti odmah.
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
  );

  return (
    <Box sx={{ pb: 12, mx: { xs: -2, sm: 0 } }}>
      {isMobile ? (
        <Box
          sx={{
            pt: 0.25,
            pb: 0.8,
            mb: 0.55,
            background: `linear-gradient(180deg, ${alpha(theme.palette.primary.light, 0.62)} 0%, ${theme.palette.background.default} 100%)`,
          }}
        >
          <BaseContainer maxWidth={false} disableGutters withPadding={false} animate={false}>
            <Box
              sx={{
                width: '100%',
                maxWidth: MARKET_MOBILE_CONTENT_WIDTH,
                mx: 'auto',
                px: MARKET_MOBILE_CONTENT_PADDING,
              }}
            >
              <Stack spacing={1.1}>
                <Box>
                  <Typography sx={{ fontWeight: 900, color: 'secondary.main', fontSize: '1.02rem' }}>
                    Pronadji posao
                  </Typography>
                  <Typography sx={{ mt: 0.25, color: 'text.secondary', fontSize: '0.8rem' }}>
                    Pretrazi aktivne oglase i kreni prema sljedecem projektu.
                  </Typography>
                </Box>

                <Paper
                  elevation={0}
                  sx={{
                    p: 0.35,
                    borderRadius: 3,
                    bgcolor: 'background.paper',
                    border: '1px solid',
                    borderColor: alpha(theme.palette.divider, 0.16),
                    boxShadow: `0 10px 24px ${alpha(theme.palette.common.black, 0.05)}`,
                  }}
                >
                  <BaseInput
                    placeholder="Pretrazi po zanimanju, gradu..."
                    value={jobStore.jobSearchInputValue}
                    onChange={handleSearchChange}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2.5,
                        bgcolor: 'transparent',
                        minHeight: 50,
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'transparent',
                        },
                      },
                      '& .MuiInputBase-input': {
                        py: 0.88,
                        fontSize: '0.89rem',
                        fontWeight: 500,
                      },
                    }}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon sx={{ color: 'text.secondary', ml: 0.35 }} />
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                </Paper>
              </Stack>
            </Box>
          </BaseContainer>
        </Box>
      ) : (
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
                    placeholder="Pretrazite po zanimanju, gradu..."
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
                  <BaseButton variant="contained" color="primary" sx={{ px: 4, borderRadius: 2.5, height: 48, fontWeight: 800 }}>
                    Pretrazi
                  </BaseButton>
                </Paper>
              </Grid>
            </Grid>
          </BaseContainer>
        </Box>
      )}

      <BaseContainer maxWidth="lg">
          <Box
            sx={{
              width: '100%',
              maxWidth: isMobile ? MARKET_MOBILE_CONTENT_WIDTH : '100%',
              mx: 'auto',
              px: isMobile ? MARKET_RESULTS_PADDING : 0,
              mt: isMobile ? 0 : undefined,
            }}
          >
          {jobStore.jobsError && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 3 }}>
              {jobStore.jobsError}
            </Alert>
          )}

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: isMobile ? 2 : 4 }}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 900,
                  color: 'secondary.main',
                  display: 'flex',
                  alignItems: 'center',
                  gap: isMobile ? 1 : 1.5,
                  fontSize: { xs: '1.02rem', md: '1.5rem' },
                }}
              >
                <Box sx={{ width: isMobile ? 5 : 6, height: isMobile ? 20 : 24, bgcolor: 'primary.main', borderRadius: 1 }} />
                Dostupni poslovi
              </Typography>
              {isMobile && selectedFiltersCount > 0 && (
                <Chip
                  label={`${selectedFiltersCount}`}
                  color="primary"
                  size="small"
                  sx={{
                    height: 22,
                    fontWeight: 800,
                    '& .MuiChip-label': {
                      px: 0.8,
                      fontSize: '0.68rem',
                    },
                  }}
                />
              )}
            </Stack>

            {isMobile ? (
              <BaseButton
                variant="outlined"
                color="secondary"
                startIcon={<FilterListIcon />}
                onClick={() => setIsFilterSheetOpen(true)}
                sx={{
                  minHeight: 36,
                  borderRadius: 2,
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  px: 1.15,
                  whiteSpace: 'nowrap',
                }}
              >
                Filteri
              </BaseButton>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                <FilterListIcon fontSize="small" sx={{ color: 'text.disabled', fontSize: 20 }} />
                <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.secondary' }}>
                  {filteredJobs.length} oglasa
                </Typography>
              </Box>
            )}
          </Box>

          {!isMobile && desktopFilterPanel}

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
            <Grid container spacing={{ xs: 1.5, md: 3 }}>
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
        </Box>
      </BaseContainer>

      {isMobile && (
        <Drawer
          anchor="bottom"
          open={isFilterSheetOpen}
          onClose={() => setIsFilterSheetOpen(false)}
          PaperProps={{
            sx: {
              borderTopLeftRadius: 22,
              borderTopRightRadius: 22,
              bgcolor: 'background.paper',
            },
          }}
        >
          <Box
            sx={{
              width: '100%',
              maxWidth: MARKET_MOBILE_CONTENT_WIDTH,
              mx: 'auto',
              px: MARKET_MOBILE_CONTENT_PADDING,
              pt: 1.1,
              pb: 2,
            }}
          >
            <Box
              sx={{
                width: 42,
                height: 4,
                borderRadius: 999,
                bgcolor: alpha(theme.palette.text.primary, 0.14),
                mx: 'auto',
                mb: 1.25,
              }}
            />

            <Stack spacing={1.4}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 1 }}>
                <Box>
                  <Typography sx={{ fontWeight: 900, color: 'secondary.main', fontSize: '1rem' }}>
                    Filteri
                  </Typography>
                  <Typography sx={{ mt: 0.2, color: 'text.secondary', fontSize: '0.78rem' }}>
                    Odaberi kategorije koje zelis vidjeti u marketu.
                  </Typography>
                </Box>
                <Chip
                  label={selectedFiltersCount > 0 ? `${selectedFiltersCount} aktivno` : 'Bez filtera'}
                  color={selectedFiltersCount > 0 ? 'primary' : 'default'}
                  variant={selectedFiltersCount > 0 ? 'filled' : 'outlined'}
                  sx={{
                    height: 30,
                    fontWeight: 700,
                    '& .MuiChip-label': {
                      px: 1.1,
                      fontSize: '0.74rem',
                    },
                  }}
                />
              </Box>

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
                      sx={{
                        fontWeight: 700,
                        height: 32,
                        '& .MuiChip-label': {
                          px: 1.2,
                          fontSize: '0.76rem',
                        },
                      }}
                    />
                  );
                })}
              </Box>

              <Stack direction="row" spacing={1}>
                <BaseButton
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    jobStore.saveCurrentJobFiltersAsDefault();
                    setIsFilterSheetOpen(false);
                  }}
                  sx={{
                    flex: 1,
                    minHeight: 42,
                    borderRadius: 2.2,
                    fontSize: '0.76rem',
                    fontWeight: 800,
                    px: 1.2,
                  }}
                >
                  Spremi
                </BaseButton>
                <BaseButton
                  variant="outlined"
                  color="secondary"
                  onClick={() => {
                    jobStore.resetAllJobFilters();
                    setIsFilterSheetOpen(false);
                  }}
                  sx={{
                    flex: 1,
                    minHeight: 42,
                    borderRadius: 2.2,
                    fontSize: '0.76rem',
                    fontWeight: 700,
                    px: 1.2,
                  }}
                >
                  Reset
                </BaseButton>
              </Stack>
            </Stack>
          </Box>
        </Drawer>
      )}
    </Box>
  );
});

export default JobListPage;
