import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { 
  Box, 
  Typography, 
  Grid, 
  Paper, 
  Avatar, 
  Chip, 
  Stack, 
  Divider,
  Rating,
  alpha,
  useTheme
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';

import BaseButton from '@/components/common/atoms/buttons/BaseButton';
import BaseContainer from '@/components/common/atoms/containers/BaseContainer';
import { useRootStore } from '@/hooks/useRootStore';
import JobCard from '@/components/common/molecules/cards/JobCard';

const ProfilePage: React.FC = observer(() => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const theme = useTheme();
  const { userStore, jobStore, reviewStore, authenticationStore } = useRootStore();

  const user = userStore.getUserById(id || '');
  const isOwnProfile = authenticationStore.user?.id === id;

  // Dohvati poslove ako je investitor
  const userJobs = jobStore.jobs.filter(j => j.investitorId === id);
  
  // Dohvati recenzije ako je izvođač
  const userReviews = reviewStore.reviews.filter(r => r.revieweeId === id);
  const avgRating = userReviews.length > 0 
    ? userReviews.reduce((acc, curr) => acc + curr.rating, 0) / userReviews.length 
    : 0;

  if (!user) {
    return (
      <BaseContainer maxWidth="lg">
        <Box sx={{ mt: 10, textAlign: 'center' }}>
          <Typography variant="h5" sx={{ fontWeight: 900 }}>Korisnik nije pronađen.</Typography>
          <BaseButton onClick={() => navigate(-1)} sx={{ mt: 2 }}>Povratak</BaseButton>
        </Box>
      </BaseContainer>
    );
  }

  const cardStyle = {
    p: 4,
    borderRadius: 6,
    border: '1px solid',
    borderColor: alpha(theme.palette.divider, 0.1),
    bgcolor: 'background.paper',
    boxShadow: 'none' // Terminalski stil - manje sjena, više čvrstih linija
  };

  return (
    <BaseContainer maxWidth="lg">
      <BaseButton 
        variant="text" 
        startIcon={<ArrowBackIcon />} 
        onClick={() => navigate(-1)} 
        sx={{ mb: 4, px: 0, fontWeight: 700 }}
      >
        Natrag
      </BaseButton>

      <Grid container spacing={4}>
        {/* Sidebar: User Info */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={cardStyle}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <Avatar 
                sx={{ 
                  width: 120, 
                  height: 120, 
                  bgcolor: 'primary.main', 
                  fontSize: 40, 
                  fontWeight: 900,
                  mb: 3
                }}
              >
                {user.displayName.charAt(0)}
              </Avatar>
              
              <Typography variant="h5" sx={{ fontWeight: 900, mb: 1 }}>
                {user.displayName}
              </Typography>

              {isOwnProfile && (
                <Chip
                  label="Moj profil"
                  variant="outlined"
                  color="success"
                  sx={{ fontWeight: 800, borderRadius: 2, mb: 2 }}
                />
              )}
              
              <Chip 
                label={user.role} 
                color={user.role === 'IZVODJAC' ? 'secondary' : 'primary'}
                sx={{ fontWeight: 900, borderRadius: 2, mb: 3 }}
              />

              <Stack spacing={2} sx={{ width: '100%', mt: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <LocationOnIcon sx={{ color: 'text.disabled' }} />
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{user.location}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <CalendarMonthIcon sx={{ color: 'text.disabled' }} />
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    Član od: {user.joinedAt.toLocaleDateString('hr-HR')}
                  </Typography>
                </Box>
                {user.role === 'IZVODJAC' && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <VerifiedUserIcon sx={{ color: 'success.main' }} />
                    <Typography variant="body2" sx={{ fontWeight: 600, color: 'success.main' }}>
                      Provjereni izvođač
                    </Typography>
                  </Box>
                )}
              </Stack>
            </Box>

            <Divider sx={{ my: 4 }} />

            <Typography variant="subtitle2" sx={{ fontWeight: 900, color: 'text.disabled', textTransform: 'uppercase', mb: 2 }}>
              Biografija
            </Typography>
            <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
              {user.bio}
            </Typography>

            {user.skills && (
              <Box sx={{ mt: 4 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 900, color: 'text.disabled', textTransform: 'uppercase', mb: 2 }}>
                  Vještine
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {user.skills.map(skill => (
                    <Chip key={skill} label={skill} size="small" sx={{ fontWeight: 700, borderRadius: 1 }} />
                  ))}
                </Box>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Main Content: Activity / Reviews */}
        <Grid size={{ xs: 12, md: 8 }}>
          {user.role === 'IZVODJAC' ? (
            <Box>
              <Paper sx={{ ...cardStyle, mb: 4, bgcolor: 'primary.main', color: 'white' }}>
                <Grid container alignItems="center">
                  <Grid size={{ xs: 6 }}>
                    <Typography variant="h6" sx={{ opacity: 0.8, fontWeight: 700 }}>Ukupna ocjena</Typography>
                    <Typography variant="h2" sx={{ fontWeight: 900 }}>{avgRating.toFixed(1)}</Typography>
                  </Grid>
                  <Grid size={{ xs: 6 }} sx={{ textAlign: 'right' }}>
                    <Rating value={avgRating} readOnly precision={0.5} size="large" />
                    <Typography sx={{ mt: 1, opacity: 0.8 }}>{userReviews.length} recenzija</Typography>
                  </Grid>
                </Grid>
              </Paper>

              <Typography variant="h4" sx={{ fontWeight: 900, mb: 3 }}>Recenzije klijenata</Typography>
              
              {userReviews.length === 0 ? (
                <Paper sx={{ ...cardStyle, textAlign: 'center', py: 8 }}>
                  <Typography sx={{ fontWeight: 600, color: 'text.disabled' }}>Još nema recenzija.</Typography>
                </Paper>
              ) : (
                <Stack spacing={3}>
                  {userReviews.map(review => (
                    <Paper key={review.id} sx={cardStyle}>
                      <Stack direction="row" justifyContent="space-between" sx={{ mb: 2 }}>
                        <Rating value={review.rating} readOnly size="small" />
                        <Typography variant="caption" sx={{ color: 'text.disabled', fontWeight: 700 }}>
                          {review.createdAt.toLocaleDateString('hr-HR')}
                        </Typography>
                      </Stack>
                      <Typography variant="body1" sx={{ fontWeight: 500, mb: 1 }}>
                        "{review.comment}"
                      </Typography>
                      <Typography variant="caption" sx={{ fontWeight: 800, color: 'secondary.main' }}>
                        PROJEKT: {jobStore.jobs.find(j => j.id === review.jobId)?.title || 'Nepoznat posao'}
                      </Typography>
                    </Paper>
                  ))}
                </Stack>
              )}
            </Box>
          ) : (
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 900, mb: 3 }}>Objavljeni oglasi</Typography>
              {userJobs.length === 0 ? (
                <Paper sx={{ ...cardStyle, textAlign: 'center', py: 8 }}>
                  <Typography sx={{ fontWeight: 600, color: 'text.disabled' }}>Korisnik trenutno nema aktivnih oglasa.</Typography>
                </Paper>
              ) : (
                <Grid container spacing={3}>
                  {userJobs.map(job => (
                    <Grid key={job.id} size={{ xs: 12, sm: 6 }}>
                      <JobCard job={job} />
                    </Grid>
                  ))}
                </Grid>
              )}
            </Box>
          )}
        </Grid>
      </Grid>
    </BaseContainer>
  );
});

export default ProfilePage;
