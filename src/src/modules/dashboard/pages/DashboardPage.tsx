import React from 'react';
import { observer } from 'mobx-react-lite';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Stack,
  Divider,
  Chip,
  alpha,
  useTheme,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AssignmentIcon from '@mui/icons-material/Assignment';
import SendIcon from '@mui/icons-material/Send';
import StarRateIcon from '@mui/icons-material/StarRate';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import EngineeringIcon from '@mui/icons-material/Engineering';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';

import BaseContainer from '@/core/components/atoms/containers/BaseContainer';
import BaseButton from '@/core/components/atoms/buttons/BaseButton';
import { useRootStore } from '@/core/hooks/useRootStore';
import StatCard from '../components/StatCard';
import { useNavigate } from 'react-router-dom';
import { BRAND_COLORS } from '@/ui/themes/default/theme';

const DashboardPage: React.FC = observer(() => {
  const { authenticationStore, jobStore, bidStore, reviewStore, userStore } = useRootStore();
  const theme = useTheme();
  const navigate = useNavigate();
  const user = authenticationStore.user;

  const myJobs = jobStore.jobs.filter((j) => j.investitorId === user?.id);
  const totalBidsOnMyJobs = myJobs.reduce((acc, job) => acc + bidStore.getBidsByJobId(job.id).length, 0);
  const activeProjectsCount = myJobs.filter((j) => bidStore.getBidsByJobId(j.id).some((b) => b.status === 'ACCEPTED')).length;

  const myBids = bidStore.bids.filter((b) => b.contractorId === user?.id);
  const acceptedBids = myBids.filter((b) => b.status === 'ACCEPTED');
  const userReviews = reviewStore.reviews.filter((r) => r.revieweeId === user?.id);
  const myRating = userReviews.length > 0 ? userReviews.reduce((acc, r) => acc + r.rating, 0) / userReviews.length : 0;

  const investorCategoriesFromJobs = Array.from(new Set(myJobs.map((job) => job.category)));
  const investorLocations = Array.from(new Set(myJobs.map((job) => job.location)));
  const investorPreferredCategories = investorCategoriesFromJobs.length > 0 ? investorCategoriesFromJobs : userStore.defaultContractorCategoriesByRole.INVESTITOR;

  const recommendedContractors = userStore.contractorProfiles
    .map((contractor) => {
      const contractorCategories = contractor.serviceCategories || [];
      const categoryMatches = contractorCategories.filter((category) => investorPreferredCategories.includes(category));
      const locationMatch = investorLocations.includes(contractor.location);
      const avgRating = userStore.getContractorAverageRating(contractor.id);
      const reviewCount = userStore.getContractorReviewCount(contractor.id);

      const matchScore = categoryMatches.length * 3 + (locationMatch ? 2 : 0) + avgRating * 1.5 + Math.min(reviewCount * 0.2, 1);

      return {
        contractor,
        categoryMatches,
        locationMatch,
        avgRating,
        reviewCount,
        matchScore,
      };
    })
    .filter((item) => item.categoryMatches.length > 0 || item.locationMatch)
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 3);

  const cardStyle = {
    p: 4,
    borderRadius: 6,
    border: '1px solid',
    borderColor: alpha(theme.palette.divider, 0.08),
    bgcolor: 'background.paper',
    boxShadow: `0 4px 20px ${alpha(theme.palette.common.black, 0.01)}`,
  };

  return (
    <BaseContainer maxWidth="lg">
      <Box
        sx={{
          p: { xs: 3, md: 4 },
          mt: { xs: 0.25, md: 0.5 },
          mb: 4,
          borderRadius: 5,
          color: 'common.white',
          position: 'relative',
          overflow: 'hidden',
          background: BRAND_COLORS.heroGradient,
          '&::before': {
            content: '""',
            position: 'absolute',
            inset: 0,
            background: `radial-gradient(circle at 15% 20%, ${alpha(theme.palette.primary.main, 0.14)}, transparent 42%)`,
          },
        }}
      >
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', md: 'center' }}
          spacing={2}
          sx={{ position: 'relative', zIndex: 1 }}
        >
          <Box>
            <Typography variant="h3" sx={{ fontWeight: 900, color: 'primary.main', mb: 1, letterSpacing: '-1px' }}>
              Nadzorna ploca
            </Typography>
            <Typography variant="body1" sx={{ color: alpha(theme.palette.common.white, 0.82), fontWeight: 500 }}>
              Dobrodosao natrag, <Box component="span" sx={{ color: 'primary.main', fontWeight: 900 }}>{user?.displayName}</Box>
            </Typography>
          </Box>
          <BaseButton
            variant="contained"
            startIcon={user?.role === 'INVESTITOR' ? <AssignmentIcon /> : <EngineeringIcon />}
            onClick={() => navigate(user?.role === 'INVESTITOR' ? '/objavi-posao' : '/marketplace')}
            sx={{ borderRadius: 3, px: 4 }}
          >
            {user?.role === 'INVESTITOR' ? 'Novi Oglas' : 'Pronadi Posao'}
          </BaseButton>
        </Stack>
      </Box>

      <Grid container spacing={3} sx={{ mb: 6 }}>
        {user?.role === 'INVESTITOR' ? (
          <>
            <Grid size={{ xs: 12, md: 4 }}>
              <StatCard label="Moji Oglasi" value={myJobs.length} icon={<DashboardIcon />} />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <StatCard label="Ukupno Ponuda" value={totalBidsOnMyJobs} icon={<NotificationsActiveIcon />} color={theme.palette.secondary.main} />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <StatCard label="Ugovoreni Radovi" value={activeProjectsCount} icon={<AssignmentIcon />} color={theme.palette.success.main} />
            </Grid>
          </>
        ) : (
          <>
            <Grid size={{ xs: 12, md: 4 }}>
              <StatCard label="Poslane Ponude" value={myBids.length} icon={<SendIcon />} />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <StatCard label="Prihvaceni Poslovi" value={acceptedBids.length} icon={<AssignmentIcon />} color={theme.palette.success.main} />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <StatCard label="Prosjecna Ocjena" value={myRating.toFixed(1)} icon={<StarRateIcon />} color={theme.palette.warning.main} />
            </Grid>
          </>
        )}
      </Grid>

      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper sx={cardStyle}>
            <Typography variant="h5" sx={{ fontWeight: 900, mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
              <NotificationsActiveIcon color="secondary" />
              {user?.role === 'INVESTITOR' ? 'Status vasih oglasa' : 'Status vasih ponuda'}
            </Typography>

            <Stack spacing={2}>
              {user?.role === 'INVESTITOR' ? (
                myJobs.length === 0 ? (
                  <Box sx={{ py: 4, textAlign: 'center', bgcolor: alpha(theme.palette.divider, 0.03), borderRadius: 4 }}>
                    <Typography color="text.disabled" sx={{ fontWeight: 600 }}>Nemate aktivnih oglasa.</Typography>
                  </Box>
                ) : (
                  myJobs.map((job) => {
                    const bidsCount = bidStore.getBidsByJobId(job.id).length;
                    return (
                      <Box key={job.id} sx={{ p: 3, border: '1px solid', borderColor: alpha(theme.palette.divider, 0.1), borderRadius: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                          <Typography variant="body1" sx={{ fontWeight: 900, mb: 0.5 }}>{job.title}</Typography>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Chip label={`${bidsCount} ponuda`} size="small" sx={{ fontWeight: 800, height: 20, fontSize: 10 }} />
                            <Typography variant="caption" color="text.disabled">Budzet: {job.budget} EUR</Typography>
                          </Stack>
                        </Box>
                        <BaseButton size="small" variant="outlined" onClick={() => navigate(`/posao/${job.id}`)}>Pregledaj</BaseButton>
                      </Box>
                    );
                  })
                )
              ) : myBids.length === 0 ? (
                <Box sx={{ py: 4, textAlign: 'center', bgcolor: alpha(theme.palette.divider, 0.03), borderRadius: 4 }}>
                  <Typography color="text.disabled" sx={{ fontWeight: 600 }}>Niste poslali ni jednu ponudu.</Typography>
                </Box>
              ) : (
                myBids.map((bid) => {
                  const relatedJob = jobStore.jobs.find((j) => j.id === bid.jobId);
                  return (
                    <Box key={bid.id} sx={{ p: 3, border: '1px solid', borderColor: alpha(theme.palette.divider, 0.1), borderRadius: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box>
                        <Typography variant="body1" sx={{ fontWeight: 900, mb: 0.5 }}>{relatedJob?.title || 'Nepoznat posao'}</Typography>
                        <Chip label={bid.status} size="small" color={bid.status === 'ACCEPTED' ? 'success' : bid.status === 'PENDING' ? 'primary' : 'default'} sx={{ fontWeight: 900, height: 20, fontSize: 10 }} />
                      </Box>
                      <Typography variant="h6" sx={{ fontWeight: 900, color: 'secondary.main' }}>{bid.amount} EUR</Typography>
                    </Box>
                  );
                })
              )}
            </Stack>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Stack spacing={3}>
            <Paper sx={{ ...cardStyle, bgcolor: 'primary.main', color: 'common.white' }}>
              <Typography variant="h6" sx={{ fontWeight: 900, mb: 2 }}>Savjeti za suradnju</Typography>
              <Divider sx={{ bgcolor: alpha(theme.palette.common.white, 0.1), mb: 2 }} />
              <Typography variant="body2" sx={{ opacity: 0.9, lineHeight: 1.6 }}>
                Uvijek provjerite recenzije investitora prije slanja ponude kako biste osigurali dobru suradnju.
              </Typography>
            </Paper>

            {user?.role === 'INVESTITOR' && (
              <Paper sx={cardStyle}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 900, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PeopleAltIcon color="secondary" />
                    Preporuceni izvodaci
                  </Typography>
                  <BaseButton size="small" variant="text" onClick={() => navigate('/izvodjaci')}>
                    Svi izvodaci
                  </BaseButton>
                </Stack>

                {recommendedContractors.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    Objavite prvi posao ili odaberite kategorije kako biste dobili preporuke izvodaca.
                  </Typography>
                ) : (
                  <Stack spacing={2}>
                    {recommendedContractors.map((item) => (
                      <Box
                        key={item.contractor.id}
                        sx={{
                          p: 2,
                          borderRadius: 3,
                          border: '1px solid',
                          borderColor: alpha(theme.palette.divider, 0.1),
                          bgcolor: alpha(theme.palette.background.paper, 0.5),
                        }}
                      >
                        <Typography variant="body1" sx={{ fontWeight: 900, cursor: 'pointer', mb: 0.5 }} onClick={() => navigate(`/profil/${item.contractor.id}`)}>
                          {item.contractor.displayName}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 1 }}>
                          {item.contractor.location} • {item.contractor.legalType === 'FIRMA' ? 'Firma' : 'Fizicka osoba'}
                        </Typography>
                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                          <StarRateIcon sx={{ fontSize: 16, color: 'secondary.main' }} />
                          <Typography variant="caption" sx={{ fontWeight: 700 }}>
                            {item.avgRating.toFixed(1)} ({item.reviewCount})
                          </Typography>
                        </Stack>
                        <Stack direction="row" spacing={0.8} useFlexGap flexWrap="wrap">
                          {item.categoryMatches.slice(0, 2).map((category) => (
                            <Chip key={category} label={category} size="small" sx={{ fontWeight: 700 }} />
                          ))}
                          {item.locationMatch && <Chip label="Ista lokacija" size="small" color="success" variant="outlined" sx={{ fontWeight: 700 }} />}
                        </Stack>
                      </Box>
                    ))}
                  </Stack>
                )}
              </Paper>
            )}

            <Paper sx={cardStyle}>
              <Typography variant="h6" sx={{ fontWeight: 900, mb: 2 }}>Moj Profil</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Vas profil je javan i vidljiv drugim korisnicima.
              </Typography>
              <BaseButton fullWidth variant="outlined" onClick={() => navigate('/profil/uredi')}>
                Uredi Profil
              </BaseButton>
            </Paper>
          </Stack>
        </Grid>
      </Grid>
    </BaseContainer>
  );
});

export default DashboardPage;
