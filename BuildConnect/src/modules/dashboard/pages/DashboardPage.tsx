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
  useTheme
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AssignmentIcon from '@mui/icons-material/Assignment';
import SendIcon from '@mui/icons-material/Send';
import StarRateIcon from '@mui/icons-material/StarRate';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import EngineeringIcon from '@mui/icons-material/Engineering';

import BaseContainer from '@/components/common/atoms/containers/BaseContainer';
import BaseButton from '@/components/common/atoms/buttons/BaseButton';
import { useRootStore } from '@/hooks/useRootStore';
import StatCard from '../components/StatCard';
import { useNavigate } from 'react-router-dom';

const DashboardPage: React.FC = observer(() => {
  const { authenticationStore, jobStore, bidStore, reviewStore } = useRootStore();
  const theme = useTheme();
  const navigate = useNavigate();
  const user = authenticationStore.user;

  // Izračuni za Investitora
  const myJobs = jobStore.jobs.filter(j => j.investitorId === user?.id);
  const totalBidsOnMyJobs = myJobs.reduce((acc, job) => acc + bidStore.getBidsByJobId(job.id).length, 0);
  const activeProjectsCount = myJobs.filter(j => 
    bidStore.getBidsByJobId(j.id).some(b => b.status === 'ACCEPTED')
  ).length;

  // Izračuni za Izvođača
  const myBids = bidStore.bids.filter(b => b.contractorId === user?.id);
  const acceptedBids = myBids.filter(b => b.status === 'ACCEPTED');
  const userReviews = reviewStore.reviews.filter(r => r.revieweeId === user?.id);
  const myRating = userReviews.length > 0 
    ? userReviews.reduce((acc, r) => acc + r.rating, 0) / userReviews.length 
    : 0;

  const cardStyle = {
    p: 4,
    borderRadius: 6,
    border: '1px solid',
    borderColor: alpha(theme.palette.divider, 0.08),
    bgcolor: 'background.paper',
    boxShadow: '0 4px 20px rgba(0,0,0,0.01)'
  };

  return (
    <BaseContainer maxWidth="lg">
      <Box sx={{ mb: 6 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h3" sx={{ fontWeight: 900, color: 'primary.main', mb: 1, letterSpacing: '-1px' }}>
              Nadzorna ploča
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
              Dobrodošao natrag, <Box component="span" sx={{ color: 'secondary.main', fontWeight: 900 }}>{user?.displayName}</Box>
            </Typography>
          </Box>
          <BaseButton 
            variant="contained" 
            startIcon={user?.role === 'INVESTITOR' ? <AssignmentIcon /> : <EngineeringIcon />}
            onClick={() => navigate(user?.role === 'INVESTITOR' ? '/objavi-posao' : '/marketplace')}
            sx={{ borderRadius: 3, px: 4 }}
          >
            {user?.role === 'INVESTITOR' ? 'Novi Oglas' : 'Pronađi Posao'}
          </BaseButton>
        </Stack>
      </Box>

      {/* Stats Section */}
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
              <StatCard label="Prihvaćeni Poslovi" value={acceptedBids.length} icon={<AssignmentIcon />} color={theme.palette.success.main} />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <StatCard label="Prosječna Ocjena" value={myRating.toFixed(1)} icon={<StarRateIcon />} color="#ed6c02" />
            </Grid>
          </>
        )}
      </Grid>

      <Grid container spacing={4}>
        {/* Aktivnosti */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper sx={cardStyle}>
            <Typography variant="h5" sx={{ fontWeight: 900, mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
              <NotificationsActiveIcon color="secondary" /> 
              {user?.role === 'INVESTITOR' ? 'Status vaših oglasa' : 'Status vaših ponuda'}
            </Typography>

            <Stack spacing={2}>
              {user?.role === 'INVESTITOR' ? (
                myJobs.length === 0 ? (
                  <Box sx={{ py: 4, textAlign: 'center', bgcolor: alpha(theme.palette.divider, 0.03), borderRadius: 4 }}>
                    <Typography color="text.disabled" sx={{ fontWeight: 600 }}>Nemate aktivnih oglasa.</Typography>
                  </Box>
                ) : (
                  myJobs.map(job => {
                    const bidsCount = bidStore.getBidsByJobId(job.id).length;
                    return (
                      <Box key={job.id} sx={{ p: 3, border: '1px solid', borderColor: alpha(theme.palette.divider, 0.1), borderRadius: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                          <Typography variant="body1" sx={{ fontWeight: 900, mb: 0.5 }}>{job.title}</Typography>
                          <Stack direction="row" spacing={1} alignItems="center">
                             <Chip label={`${bidsCount} ponuda`} size="small" sx={{ fontWeight: 800, height: 20, fontSize: 10 }} />
                             <Typography variant="caption" color="text.disabled">Budžet: {job.budget} €</Typography>
                          </Stack>
                        </Box>
                        <BaseButton size="small" variant="outlined" onClick={() => navigate(`/posao/${job.id}`)}>Pregledaj</BaseButton>
                      </Box>
                    );
                  })
                )
              ) : (
                myBids.length === 0 ? (
                  <Box sx={{ py: 4, textAlign: 'center', bgcolor: alpha(theme.palette.divider, 0.03), borderRadius: 4 }}>
                    <Typography color="text.disabled" sx={{ fontWeight: 600 }}>Niste poslali ni jednu ponudu.</Typography>
                  </Box>
                ) : (
                  myBids.map(bid => {
                    const relatedJob = jobStore.jobs.find(j => j.id === bid.jobId);
                    return (
                      <Box key={bid.id} sx={{ p: 3, border: '1px solid', borderColor: alpha(theme.palette.divider, 0.1), borderRadius: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                          <Typography variant="body1" sx={{ fontWeight: 900, mb: 0.5 }}>{relatedJob?.title || 'Nepoznat posao'}</Typography>
                          <Chip 
                            label={bid.status} 
                            size="small" 
                            color={bid.status === 'ACCEPTED' ? 'success' : bid.status === 'PENDING' ? 'primary' : 'default'}
                            sx={{ fontWeight: 900, height: 20, fontSize: 10 }}
                          />
                        </Box>
                        <Typography variant="h6" sx={{ fontWeight: 900, color: 'secondary.main' }}>{bid.amount} €</Typography>
                      </Box>
                    );
                  })
                )
              )}
            </Stack>
          </Paper>
        </Grid>

        {/* Info panel */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Stack spacing={3}>
            <Paper sx={{ ...cardStyle, bgcolor: 'primary.main', color: 'white' }}>
              <Typography variant="h6" sx={{ fontWeight: 900, mb: 2 }}>Savjeti za terminal</Typography>
              <Divider sx={{ bgcolor: 'rgba(255,255,255,0.1)', mb: 2 }} />
              <Typography variant="body2" sx={{ opacity: 0.9, lineHeight: 1.6 }}>
                Uvijek provjerite recenzije investitora prije slanja ponude kako biste osigurali dobru suradnju.
              </Typography>
            </Paper>

            <Paper sx={cardStyle}>
              <Typography variant="h6" sx={{ fontWeight: 900, mb: 2 }}>Moj Profil</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Vaš profil je javan i vidljiv drugim korisnicima.
              </Typography>
              <BaseButton fullWidth variant="outlined" onClick={() => navigate(`/profil/${user?.id}`)}>
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