import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Stack,
  Chip,
  Divider,
  Rating,
  Alert,
  alpha,
  useTheme,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import EngineeringIcon from '@mui/icons-material/Engineering';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import StarIcon from '@mui/icons-material/Star';

import BaseButton from '@/core/components/atoms/buttons/BaseButton';
import BaseContainer from '@/core/components/atoms/containers/BaseContainer';
import BaseInput from '@/core/components/atoms/inputs/BaseInput';
import { useRootStore } from '@/core/hooks/useRootStore';
import { BRAND_COLORS } from '@/ui/themes/default/theme';

const JobDetailsPage: React.FC = observer(() => {
  const { id } = useParams<{ id: string }>();
  const theme = useTheme();
  const navigate = useNavigate();
  const { jobStore, bidStore, authenticationStore, reviewStore } = useRootStore();

  const jobId = id || '';
  const job = jobStore.jobs.find((j) => j.id === jobId);
  const bids = bidStore.getBidsByJobId(jobId);
  const isOwner = authenticationStore.user?.id === job?.investitorId;
  const acceptedBid = bids.find((b) => b.status === 'ACCEPTED');
  const existingReview = reviewStore.getReviewByJobId(jobId);

  useEffect(() => {
    bidStore.resetBidForm();
    reviewStore.resetReviewForm();
  }, [jobId, bidStore, reviewStore]);

  if (!job) {
    return (
      <BaseContainer maxWidth="lg">
        <Box sx={{ mt: 8, textAlign: 'center' }}>
          <Alert severity="error" sx={{ borderRadius: 4 }}>
            Posao nije pronaden.
          </Alert>
          <BaseButton variant="contained" startIcon={<ArrowBackIcon />} onClick={() => navigate('/marketplace')} sx={{ mt: 4 }}>
            Povratak na listu
          </BaseButton>
        </Box>
      </BaseContainer>
    );
  }

  const handleSendBid = async (e: React.FormEvent) => {
    e.preventDefault();
    await bidStore.submitBidForJob(job.id);
  };

  const handleAcceptBid = async (bidId: string) => {
    if (window.confirm('Jeste li sigurni da zelite prihvatiti ovu ponudu?')) {
      await bidStore.acceptBid(bidId);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (acceptedBid) {
      await reviewStore.submitReviewForJob(job.id, acceptedBid.contractorId);
    }
  };

  const cardStyle = {
    p: { xs: 3, md: 5 },
    borderRadius: 6,
    border: '1px solid',
    borderColor: alpha(theme.palette.divider, 0.08),
    boxShadow: `0 10px 40px ${alpha(theme.palette.common.black, 0.02)}`,
    bgcolor: 'background.paper',
  };

  return (
    <BaseContainer maxWidth="lg">
      <BaseButton variant="text" color="secondary" startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ mb: 4, fontWeight: 700, px: 0 }}>
        Natrag na pretragu
      </BaseButton>

      <Box
        sx={{
          p: { xs: 3, md: 4 },
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
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} justifyContent="space-between" sx={{ position: 'relative', zIndex: 1 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 900, mb: 0.8 }}>
              {job.title}
            </Typography>
            <Typography sx={{ color: alpha(theme.palette.common.white, 0.82) }}>
              Lokacija: {job.location} • Rok: {job.deadline}
            </Typography>
          </Box>
          <Chip
            label={existingReview ? 'Zavrseno' : acceptedBid ? 'U radu' : 'Otvoreno'}
            color={existingReview ? 'success' : acceptedBid ? 'primary' : 'default'}
            sx={{ fontWeight: 900, borderRadius: 2, textTransform: 'uppercase', fontSize: '0.7rem', alignSelf: { xs: 'flex-start', md: 'center' } }}
          />
        </Stack>
      </Box>

      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper sx={cardStyle}>
            <Box sx={{ mb: 4 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2} sx={{ mb: 2 }}>
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 900,
                    color: 'secondary.main',
                    letterSpacing: '-1.5px',
                    lineHeight: 1.1,
                    fontSize: { xs: '1.8rem', sm: '2.2rem', md: '3rem' },
                  }}
                >
                  {job.title}
                </Typography>
              </Stack>

              <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap sx={{ mt: 3 }}>
                <Chip icon={<LocationOnIcon sx={{ fontSize: '1rem !important' }} />} label={job.location} variant="outlined" sx={{ borderRadius: 2, fontWeight: 600 }} />
                <Chip icon={<CalendarMonthIcon sx={{ fontSize: '1rem !important' }} />} label={`Rok: ${job.deadline}`} variant="outlined" sx={{ borderRadius: 2, fontWeight: 600 }} />
                <Box sx={{ flexGrow: 1 }} />
                <Typography variant="h5" sx={{ fontWeight: 900, color: 'success.dark' }}>
                  {job.budget ? `${job.budget.toLocaleString()} EUR` : 'Po dogovoru'}
                </Typography>
              </Stack>
            </Box>

            <Divider sx={{ my: 4 }} />

            <Typography variant="h5" sx={{ fontWeight: 900, mb: 2 }}>
              Opis projekta
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8, whiteSpace: 'pre-line', fontSize: '1.05rem' }}>
              {job.description}
            </Typography>
          </Paper>

          {existingReview && (
            <Paper sx={{ ...cardStyle, mt: 4, bgcolor: alpha(theme.palette.success.main, 0.03), borderColor: alpha(theme.palette.success.main, 0.1) }}>
              <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1.5, fontWeight: 900, color: 'success.dark', mb: 1 }}>
                <StarIcon /> Recenzija investitora
              </Typography>
              <Rating value={existingReview.rating} readOnly sx={{ mb: 2 }} />
              <Typography variant="body1" sx={{ fontStyle: 'italic', color: 'secondary.main', fontWeight: 500 }}>
                "{existingReview.comment}"
              </Typography>
            </Paper>
          )}

          <Box sx={{ mt: 8 }}>
            <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 4 }}>
              <Typography variant="h4" sx={{ fontWeight: 900 }}>
                Pristigle ponude
              </Typography>
              <Chip label={bids.length} sx={{ fontWeight: 900, bgcolor: 'secondary.main', color: 'white' }} />
            </Stack>

            {bids.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 10, bgcolor: alpha(theme.palette.divider, 0.03), borderRadius: 8, border: '2px dashed', borderColor: 'divider' }}>
                <EngineeringIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
                <Typography color="text.secondary" sx={{ fontWeight: 600 }}>
                  Jos nema ponuda. Budite prvi!
                </Typography>
              </Box>
            ) : (
              bids.map((bid) => (
                <Paper
                  key={bid.id}
                  sx={{
                    ...cardStyle,
                    mb: 3,
                    p: 4,
                    borderColor: bid.status === 'ACCEPTED' ? 'success.main' : alpha(theme.palette.divider, 0.1),
                    bgcolor: bid.status === 'ACCEPTED' ? alpha(theme.palette.success.main, 0.02) : 'background.paper',
                    transition: 'transform 0.2s ease-in-out',
                    '&:hover': { transform: 'translateY(-4px)' },
                  }}
                >
                  <Grid container spacing={3} alignItems="center">
                    <Grid size={{ xs: 12, sm: 8 }}>
                      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 1.5 }}>
                        <Typography
                          variant="h6"
                          sx={{ fontWeight: 900, cursor: 'pointer', '&:hover': { color: 'primary.main' } }}
                          onClick={() => navigate(`/profil/${bid.contractorId}`)}
                        >
                          {bid.contractorName}
                        </Typography>
                        {bid.status === 'ACCEPTED' && <Chip icon={<FactCheckIcon />} label="Prihvacena" color="success" size="small" sx={{ fontWeight: 800 }} />}
                      </Stack>
                      <Typography variant="body1" color="text.secondary">
                        {bid.message}
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4 }} sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
                      <Typography variant="h4" sx={{ fontWeight: 900, color: 'secondary.main', mb: 0.5 }}>
                        {bid.amount.toLocaleString()} EUR
                      </Typography>
                      <Typography variant="caption" sx={{ display: 'block', mb: 2, fontWeight: 800, color: 'text.disabled', textTransform: 'uppercase' }}>
                        ROK: {bid.daysToComplete} DANA
                      </Typography>

                      {isOwner && bid.status === 'PENDING' && !acceptedBid && (
                        <BaseButton variant="contained" color="success" onClick={() => handleAcceptBid(bid.id)} loading={bidStore.isLoading}>
                          Prihvati ponudu
                        </BaseButton>
                      )}
                    </Grid>
                  </Grid>
                </Paper>
              ))
            )}
          </Box>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Box sx={{ position: { xs: 'static', md: 'sticky' }, top: { md: 24 } }}>
            {isOwner && acceptedBid && !existingReview && (
              <Paper sx={{ ...cardStyle, bgcolor: 'secondary.main', color: 'white', boxShadow: `0 20px 40px ${alpha(theme.palette.secondary.main, 0.25)}` }}>
                <Typography variant="h5" sx={{ fontWeight: 900, mb: 1.5 }}>
                  Zavrsi projekt
                </Typography>
                <Typography variant="body2" sx={{ mb: 4, opacity: 0.9 }}>
                  Ocijenite izvodaca <strong>{acceptedBid.contractorName}</strong>.
                </Typography>
                <form onSubmit={handleSubmitReview}>
                  <Box sx={{ bgcolor: alpha(theme.palette.common.white, 0.08), p: 3, borderRadius: 4, mb: 3, textAlign: 'center' }}>
                    <Rating
                      size="large"
                      value={reviewStore.reviewRating}
                      onChange={(_, val) => reviewStore.setReviewRating(val)}
                      sx={{
                        '& .MuiRating-iconFilled': { color: 'primary.main' },
                        '& .MuiRating-iconEmpty': { color: alpha(theme.palette.common.white, 0.2) },
                      }}
                    />
                  </Box>
                  <BaseInput
                    fullWidth
                    label="Komentar suradnje"
                    multiline
                    rows={4}
                    value={reviewStore.reviewComment}
                    onChange={(e) => reviewStore.setReviewComment(e.target.value)}
                    required
                    sx={{ mb: 3, '& .MuiOutlinedInput-root': { bgcolor: 'white' } }}
                  />
                  {reviewStore.reviewError && (
                    <Alert severity="error" sx={{ mb: 3, borderRadius: 3 }}>
                      {reviewStore.reviewError}
                    </Alert>
                  )}
                  <BaseButton fullWidth variant="contained" color="primary" type="submit" loading={reviewStore.isLoading} disabled={!reviewStore.isReviewFormValid || reviewStore.isLoading}>
                    Objavi recenziju
                  </BaseButton>
                </form>
              </Paper>
            )}

            {authenticationStore.user?.role === 'IZVODJAC' && (
              <Paper sx={cardStyle}>
                {acceptedBid ? (
                  <Alert severity="info" sx={{ borderRadius: 4, fontWeight: 600 }}>
                    Ovaj oglas vise ne prima ponude.
                  </Alert>
                ) : (
                  <>
                    <Typography variant="h5" sx={{ fontWeight: 900, mb: 1 }}>
                      Posaljite ponudu
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                      Investitor ce primiti vasu ponudu odmah.
                    </Typography>
                    <form onSubmit={handleSendBid}>
                      {bidStore.bidError && (
                        <Alert severity="error" sx={{ mb: 2, borderRadius: 3 }}>
                          {bidStore.bidError}
                        </Alert>
                      )}
                      <BaseInput
                        label="Cijena (EUR)"
                        type="number"
                        value={bidStore.bidAmount}
                        onChange={(e) => bidStore.setBidAmount(e.target.value)}
                        inputProps={{ min: 1, step: 1 }}
                        required
                        sx={{ mb: 2 }}
                      />
                      <BaseInput
                        label="Rok izvedbe (dana)"
                        type="number"
                        value={bidStore.bidDaysToComplete}
                        onChange={(e) => bidStore.setBidDaysToComplete(e.target.value)}
                        inputProps={{ min: 1, step: 1 }}
                        required
                        sx={{ mb: 2 }}
                      />
                      <BaseInput
                        label="Vasa poruka"
                        multiline
                        rows={5}
                        value={bidStore.bidMessage}
                        onChange={(e) => bidStore.setBidMessage(e.target.value)}
                        required
                        sx={{ mb: 3 }}
                      />
                      <BaseButton fullWidth variant="contained" color="primary" type="submit" loading={bidStore.isLoading} disabled={!bidStore.isBidFormValid || bidStore.isLoading}>
                        Posalji ponudu
                      </BaseButton>
                    </form>
                  </>
                )}
              </Paper>
            )}
          </Box>
        </Grid>
      </Grid>
    </BaseContainer>
  );
});

export default JobDetailsPage;
