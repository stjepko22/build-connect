import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import {
  CircularProgress,
  Box,
  Typography,
  Grid,
  Paper,
  Stack,
  Chip,
  Rating,
  Alert,
  alpha,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import EngineeringIcon from '@mui/icons-material/Engineering';
import EditNoteIcon from '@mui/icons-material/EditNote';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PaidOutlinedIcon from '@mui/icons-material/PaidOutlined';
import ScheduleRoundedIcon from '@mui/icons-material/ScheduleRounded';
import StarIcon from '@mui/icons-material/Star';

import BaseButton from '@/core/components/atoms/buttons/BaseButton';
import BaseContainer from '@/core/components/atoms/containers/BaseContainer';
import BaseInput from '@/core/components/atoms/inputs/BaseInput';
import { useRootStore } from '@/core/hooks/useRootStore';
import { BRAND_COLORS } from '@/ui/themes/default/theme';

const JobDetailsPage: React.FC = observer(() => {
  const { id } = useParams<{ id: string }>();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const { jobStore, bidStore, authenticationStore, reviewStore } = useRootStore();

  const jobId = id || '';
  const job = jobStore.getJobById(jobId);
  const bids = bidStore.getBidsByJobId(jobId);
  const isOwner = authenticationStore.user?.id === job?.investitorId;
  const acceptedBid = bids.find((bid) => bid.status === 'ACCEPTED');
  const existingReview = reviewStore.getReviewByJobId(jobId);

  useEffect(() => {
    bidStore.resetBidForm();
    reviewStore.resetReviewForm();

    if (jobId) {
      void jobStore.loadJobById(jobId);
      void bidStore.loadBids(jobId);
      void reviewStore.loadReviews(jobId);
    }
  }, [jobId, bidStore, jobStore, reviewStore]);

  if (jobStore.isLoadingJobDetails && !job) {
    return (
      <BaseContainer maxWidth="lg">
        <Box sx={{ pt: 1, display: 'flex', justifyContent: 'center' }}>
          <CircularProgress color="primary" />
        </Box>
      </BaseContainer>
    );
  }

  if (!job) {
    return (
      <BaseContainer maxWidth="lg">
        <Box sx={{ pt: 1, textAlign: 'center' }}>
          <Alert severity="error" sx={{ borderRadius: 4 }}>
            {jobStore.selectedJobError || 'Posao nije pronaden.'}
          </Alert>
          <BaseButton
            variant="contained"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/marketplace')}
            sx={{ mt: 4 }}
          >
            Povratak na listu
          </BaseButton>
        </Box>
      </BaseContainer>
    );
  }

  const handleSendBid = async (event: React.FormEvent) => {
    event.preventDefault();
    await bidStore.submitBidForJob(job.id);
  };

  const handleAcceptBid = async (bidId: string) => {
    if (window.confirm('Jeste li sigurni da zelite prihvatiti ovu ponudu?')) {
      await bidStore.acceptBid(bidId);
    }
  };

  const handleSubmitReview = async (event: React.FormEvent) => {
    event.preventDefault();
    await reviewStore.submitReviewForJob(job.id);
  };

  const cardStyle = {
    p: { xs: 2.2, md: 5 },
    borderRadius: { xs: 4, md: 6 },
    border: '1px solid',
    borderColor: alpha(theme.palette.divider, 0.08),
    boxShadow: `0 10px 40px ${alpha(theme.palette.common.black, 0.02)}`,
    bgcolor: 'background.paper',
  };

  const metaChipSx = {
    borderRadius: 2.5,
    fontWeight: 700,
    bgcolor: alpha(theme.palette.background.paper, 0.84),
    borderColor: alpha(theme.palette.secondary.main, 0.08),
    '& .MuiChip-label': {
      px: 1.1,
    },
  };

  const statusLabel = existingReview ? 'Zavrseno' : acceptedBid ? 'U radu' : 'Otvoreno';
  const statusColor = existingReview ? 'success' : acceptedBid ? 'primary' : 'default';
  const bidCountLabel = bids.length === 1 ? '1 ponuda' : `${bids.length} ponuda`;

  return (
    <BaseContainer maxWidth="lg" withPadding={false}>
      <Box sx={{ pt: { xs: 0.25, md: 1 }, pb: { xs: 3, md: 6 } }}>
        <BaseButton
          variant="text"
          color="secondary"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          sx={{
            mb: { xs: 0.45, md: 4 },
            fontWeight: 700,
            px: 0,
            minHeight: isMobile ? 32 : undefined,
          }}
        >
          Natrag na pretragu
        </BaseButton>

        <Box
          sx={{
            p: { xs: 2.1, md: 4 },
            mb: { xs: 2.2, md: 4 },
            borderRadius: { xs: 4, md: 5 },
            color: isMobile ? 'secondary.main' : 'common.white',
            position: 'relative',
            overflow: 'hidden',
            background: isMobile
              ? `linear-gradient(180deg, ${alpha(theme.palette.primary.light, 0.72)} 0%, ${theme.palette.background.default} 100%)`
              : BRAND_COLORS.heroGradient,
            border: isMobile ? '1px solid' : 'none',
            borderColor: isMobile ? alpha(theme.palette.primary.main, 0.08) : 'transparent',
            boxShadow: isMobile ? `0 10px 24px ${alpha(theme.palette.common.black, 0.04)}` : 'none',
            '&::before': {
              content: '""',
              position: 'absolute',
              inset: 0,
              background: isMobile
                ? `radial-gradient(circle at 18% 12%, ${alpha(theme.palette.primary.main, 0.12)}, transparent 40%)`
                : `radial-gradient(circle at 15% 20%, ${alpha(theme.palette.primary.main, 0.14)}, transparent 42%)`,
            },
          }}
        >
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={{ xs: 1.8, md: 2 }}
          justifyContent="space-between"
          sx={{ position: 'relative', zIndex: 1 }}
        >
          <Box sx={{ minWidth: 0 }}>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 1.2 }}>
              <Chip
                label={job.category}
                color="primary"
                sx={{
                  fontWeight: 800,
                  borderRadius: 999,
                  height: 30,
                  boxShadow: `0 8px 18px ${alpha(theme.palette.primary.main, 0.14)}`,
                }}
              />
              <Chip
                label={statusLabel}
                color={statusColor}
                sx={{
                  fontWeight: 900,
                  borderRadius: 999,
                  textTransform: 'uppercase',
                  fontSize: '0.68rem',
                  height: 30,
                }}
              />
            </Stack>

            <Typography
              variant="h4"
              sx={{
                fontWeight: 900,
                mb: 0.85,
                lineHeight: 1.12,
                letterSpacing: '-0.03em',
                fontSize: { xs: '1.45rem', md: '2.15rem' },
                maxWidth: { md: '90%' },
              }}
            >
              {job.title}
            </Typography>

            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              <Chip
                icon={<LocationOnIcon sx={{ fontSize: '1rem !important' }} />}
                label={job.location}
                variant="outlined"
                sx={metaChipSx}
              />
              <Chip
                icon={<CalendarMonthIcon sx={{ fontSize: '1rem !important' }} />}
                label={`Rok: ${job.deadline}`}
                variant="outlined"
                sx={metaChipSx}
              />
            </Stack>
          </Box>

          <Box
            sx={{
              alignSelf: { xs: 'stretch', md: 'flex-start' },
              minWidth: { md: 220 },
            }}
          >
            <Paper
              elevation={0}
              sx={{
                p: { xs: 1.4, md: 1.8 },
                borderRadius: 3.5,
                bgcolor: alpha(theme.palette.background.paper, isMobile ? 0.9 : 0.08),
                border: '1px solid',
                borderColor: isMobile
                  ? alpha(theme.palette.success.main, 0.12)
                  : alpha(theme.palette.common.white, 0.12),
                boxShadow: isMobile
                  ? `0 14px 28px ${alpha(theme.palette.success.main, 0.08)}`
                  : `0 18px 30px ${alpha(theme.palette.common.black, 0.14)}`,
                backdropFilter: 'blur(8px)',
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  display: 'block',
                  mb: 0.5,
                  color: isMobile ? 'text.secondary' : alpha(theme.palette.common.white, 0.7),
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                }}
              >
                Budzet projekta
              </Typography>
              <Typography
                sx={{
                  fontWeight: 900,
                  color: job.budget ? 'success.dark' : isMobile ? 'secondary.main' : 'common.white',
                  fontSize: { xs: '1.35rem', md: '1.7rem' },
                  lineHeight: 1.05,
                  letterSpacing: '-0.03em',
                }}
              >
                {job.budget ? `${job.budget.toLocaleString()} EUR` : 'Po dogovoru'}
              </Typography>
              <Typography
                sx={{
                  mt: 0.55,
                  color: isMobile ? 'text.secondary' : alpha(theme.palette.common.white, 0.72),
                  fontSize: '0.78rem',
                  fontWeight: 600,
                }}
              >
                Investitor prima ponude direktno kroz BuildConnect.
              </Typography>
            </Paper>
          </Box>
        </Stack>
        </Box>

        <Grid container spacing={{ xs: 2.2, md: 4 }}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper sx={cardStyle}>
            <Box sx={{ mb: { xs: 2.2, md: 4 } }}>
              <Typography
                variant="overline"
                sx={{
                  color: 'primary.main',
                  fontWeight: 900,
                  letterSpacing: '0.08em',
                }}
              >
                Detalji projekta
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  mt: 0.25,
                  fontWeight: 900,
                  color: 'secondary.main',
                  fontSize: { xs: '1.18rem', md: '1.5rem' },
                }}
              >
                Opis projekta
              </Typography>
            </Box>

            <Typography
              variant="body1"
              sx={{
                color: 'text.secondary',
                lineHeight: { xs: 1.72, md: 1.8 },
                whiteSpace: 'pre-line',
                fontSize: { xs: '0.98rem', md: '1.05rem' },
              }}
            >
              {job.description}
            </Typography>
          </Paper>

          {isOwner && (
            <Box sx={{ mt: 2.5, mb: { xs: 3, md: 4 }, display: 'flex', justifyContent: 'center' }}>
              <BaseButton
                variant="contained"
                color="secondary"
                startIcon={<EditNoteIcon />}
                onClick={() => navigate(`/posao/${job.id}/uredi`)}
                sx={{
                  minWidth: { xs: '100%', sm: 240 },
                  maxWidth: { xs: '100%', sm: 320 },
                  fontWeight: 800,
                  py: 1.15,
                  borderRadius: 999,
                  boxShadow: `0 14px 30px ${alpha(theme.palette.secondary.main, 0.18)}`,
                  textTransform: 'none',
                }}
              >
                Uredi ovaj oglas
              </BaseButton>
            </Box>
          )}

          {existingReview && (
            <Paper
              sx={{
                ...cardStyle,
                mt: 4,
                bgcolor: alpha(theme.palette.success.main, 0.03),
                borderColor: alpha(theme.palette.success.main, 0.1),
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  fontWeight: 900,
                  color: 'success.dark',
                  mb: 1,
                }}
              >
                <StarIcon />
                Recenzija investitora
              </Typography>
              <Rating value={existingReview.rating} readOnly sx={{ mb: 2 }} />
              <Typography
                variant="body1"
                sx={{ fontStyle: 'italic', color: 'secondary.main', fontWeight: 500 }}
              >
                "{existingReview.comment}"
              </Typography>
            </Paper>
          )}

          <Box sx={{ mt: { xs: 3, md: 8 } }}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              spacing={2}
              sx={{ mb: { xs: 2.4, md: 4 } }}
            >
              <Box>
                <Typography
                  variant="h4"
                  sx={{ fontWeight: 900, fontSize: { xs: '1.25rem', md: '2.125rem' } }}
                >
                  Pristigle ponude
                </Typography>
                <Typography sx={{ mt: 0.3, color: 'text.secondary', fontSize: { xs: '0.82rem', md: '0.9rem' } }}>
                  Pregledaj zainteresirane izvodjace i odaberi najbolju ponudu.
                </Typography>
              </Box>
              <Chip
                label={bidCountLabel}
                sx={{
                  fontWeight: 900,
                  bgcolor: alpha(theme.palette.secondary.main, 0.96),
                  color: 'common.white',
                  borderRadius: 999,
                  height: 30,
                  '& .MuiChip-label': {
                    px: 1.15,
                  },
                }}
              />
            </Stack>

            {bidStore.bidListError && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: 3 }}>
                {bidStore.bidListError}
              </Alert>
            )}

            {bidStore.isLoadingBids && bids.length === 0 ? (
              <Box sx={{ py: 8, display: 'flex', justifyContent: 'center' }}>
                <CircularProgress color="primary" />
              </Box>
            ) : bids.length === 0 ? (
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 3, md: 5 },
                  textAlign: 'center',
                  borderRadius: { xs: 4, md: 6 },
                  border: '1px dashed',
                  borderColor: alpha(theme.palette.primary.main, 0.2),
                  bgcolor: alpha(theme.palette.primary.light, 0.38),
                  backgroundImage: `linear-gradient(180deg, ${alpha(theme.palette.primary.light, 0.5)} 0%, ${alpha(theme.palette.background.paper, 0.96)} 100%)`,
                }}
              >
                <Box
                  sx={{
                    width: 58,
                    height: 58,
                    mx: 'auto',
                    mb: 2,
                    borderRadius: 999,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: alpha(theme.palette.primary.main, 0.14),
                    color: 'primary.main',
                    boxShadow: `0 12px 24px ${alpha(theme.palette.primary.main, 0.1)}`,
                  }}
                >
                  <EngineeringIcon sx={{ fontSize: 28 }} />
                </Box>
                <Typography sx={{ fontWeight: 900, color: 'secondary.main', fontSize: { xs: '1.02rem', md: '1.15rem' }, mb: 0.7 }}>
                  Jos nema ponuda
                </Typography>
                <Typography color="text.secondary" sx={{ fontWeight: 600 }}>
                  Jos nema ponuda. Budite prvi!
                </Typography>
              </Paper>
            ) : (
              bids.map((bid) => (
                <Paper
                  key={bid.id}
                  sx={{
                    ...cardStyle,
                    mb: 2.2,
                    p: { xs: 2, md: 3.25 },
                    borderColor: bid.status === 'ACCEPTED' ? alpha(theme.palette.success.main, 0.28) : alpha(theme.palette.divider, 0.1),
                    bgcolor: bid.status === 'ACCEPTED' ? alpha(theme.palette.success.main, 0.03) : 'background.paper',
                    backgroundImage: bid.status === 'ACCEPTED'
                      ? `linear-gradient(180deg, ${alpha(theme.palette.success.light, 0.16)} 0%, ${theme.palette.background.paper} 60%)`
                      : `linear-gradient(180deg, ${alpha(theme.palette.primary.light, 0.16)} 0%, ${theme.palette.background.paper} 45%)`,
                    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out, border-color 0.2s ease-in-out',
                    boxShadow: bid.status === 'ACCEPTED'
                      ? `0 18px 34px ${alpha(theme.palette.success.main, 0.08)}`
                      : `0 10px 28px ${alpha(theme.palette.common.black, 0.04)}`,
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: `0 18px 34px ${alpha(theme.palette.common.black, 0.08)}`,
                    },
                  }}
                >
                  <Stack spacing={1.5}>
                    <Stack direction="row" spacing={1.25} alignItems="flex-start">
                      <Box
                        sx={{
                          width: 42,
                          height: 42,
                          borderRadius: 999,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          bgcolor: alpha(theme.palette.primary.main, 0.14),
                          color: 'secondary.main',
                          fontWeight: 900,
                          fontSize: '1rem',
                          flexShrink: 0,
                          boxShadow: `inset 0 1px 0 ${alpha(theme.palette.common.white, 0.7)}`,
                        }}
                      >
                        {bid.contractorName.trim().charAt(0).toUpperCase()}
                      </Box>

                      <Box sx={{ minWidth: 0, flex: 1 }}>
                        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 0.5 }}>
                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: 900,
                              cursor: 'pointer',
                              color: 'secondary.main',
                              fontSize: { xs: '1rem', md: '1.1rem' },
                              lineHeight: 1.2,
                              '&:hover': { color: 'primary.main' },
                            }}
                            onClick={() => navigate(`/profil/${bid.contractorId}`)}
                          >
                            {bid.contractorName}
                          </Typography>
                          {bid.status === 'ACCEPTED' && (
                            <Chip
                              icon={<FactCheckIcon />}
                              label="Odabrana ponuda"
                              color="success"
                              size="small"
                              sx={{
                                fontWeight: 800,
                                borderRadius: 999,
                                height: 28,
                              }}
                            />
                          )}
                        </Stack>

                        <Stack direction="row" spacing={1.1} flexWrap="wrap" useFlexGap>
                          <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.45, color: 'text.secondary' }}>
                            <AccessTimeIcon sx={{ fontSize: 14 }} />
                            <Typography sx={{ fontSize: '0.76rem', fontWeight: 700 }}>
                              Poslano {bid.createdAt.toLocaleDateString('hr-HR')}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.45, color: 'text.secondary' }}>
                            <ScheduleRoundedIcon sx={{ fontSize: 14 }} />
                            <Typography sx={{ fontSize: '0.76rem', fontWeight: 700 }}>
                              Rok {bid.daysToComplete} dana
                            </Typography>
                          </Box>
                        </Stack>
                      </Box>
                    </Stack>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        lineHeight: 1.65,
                        fontSize: { xs: '0.9rem', md: '0.95rem' },
                      }}
                    >
                      {bid.message}
                    </Typography>

                    <Stack
                      direction={{ xs: 'column', sm: 'row' }}
                      spacing={1.1}
                      justifyContent="space-between"
                      alignItems={{ xs: 'stretch', sm: 'flex-end' }}
                    >
                      <Box
                        sx={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 0.8,
                          px: 1.05,
                          py: 0.8,
                          borderRadius: 3,
                          bgcolor: alpha(theme.palette.success.main, 0.1),
                          border: '1px solid',
                          borderColor: alpha(theme.palette.success.main, 0.14),
                          boxShadow: `0 10px 22px ${alpha(theme.palette.success.main, 0.08)}`,
                          alignSelf: { xs: 'flex-start', sm: 'auto' },
                        }}
                      >
                        <Box
                          sx={{
                            width: 30,
                            height: 30,
                            borderRadius: 999,
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            bgcolor: alpha(theme.palette.success.main, 0.14),
                            color: 'success.dark',
                            flexShrink: 0,
                          }}
                        >
                          <PaidOutlinedIcon sx={{ fontSize: 16 }} />
                        </Box>
                        <Box>
                          <Typography
                            sx={{
                              fontSize: '0.68rem',
                              fontWeight: 800,
                              color: 'text.secondary',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                              mb: 0.1,
                            }}
                          >
                            Ponuda
                          </Typography>
                          <Typography
                            sx={{
                              fontWeight: 900,
                              color: 'success.dark',
                              fontSize: { xs: '1.12rem', md: '1.25rem' },
                              lineHeight: 1.05,
                              letterSpacing: '-0.02em',
                            }}
                          >
                            {bid.amount.toLocaleString()} EUR
                          </Typography>
                        </Box>
                      </Box>

                      {isOwner && bid.status === 'PENDING' && !acceptedBid && (
                        <BaseButton
                          variant="contained"
                          color="success"
                          onClick={() => handleAcceptBid(bid.id)}
                          loading={bidStore.isLoading}
                          sx={{
                            minHeight: 42,
                            px: 2.2,
                            borderRadius: 2.6,
                            alignSelf: { xs: 'stretch', sm: 'flex-end' },
                          }}
                        >
                          Prihvati ponudu
                        </BaseButton>
                      )}
                    </Stack>
                  </Stack>
                </Paper>
              ))
            )}
          </Box>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Box sx={{ position: { xs: 'static', md: 'sticky' }, top: { md: 24 } }}>
            {isOwner && acceptedBid && !existingReview && (
              <Paper
                sx={{
                  ...cardStyle,
                  bgcolor: 'secondary.main',
                  color: 'white',
                  boxShadow: `0 20px 40px ${alpha(theme.palette.secondary.main, 0.25)}`,
                }}
              >
                <Typography variant="h5" sx={{ fontWeight: 900, mb: 1.5 }}>
                  Zavrsi projekt
                </Typography>
                <Typography variant="body2" sx={{ mb: 4, opacity: 0.9 }}>
                  Ocijenite izvodaca <strong>{acceptedBid.contractorName}</strong>.
                </Typography>
                <form onSubmit={handleSubmitReview}>
                  <Box
                    sx={{
                      bgcolor: alpha(theme.palette.common.white, 0.08),
                      p: 3,
                      borderRadius: 4,
                      mb: 3,
                      textAlign: 'center',
                    }}
                  >
                    <Rating
                      size="large"
                      value={reviewStore.reviewRating}
                      onChange={(_, value) => reviewStore.setReviewRating(value)}
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
                    onChange={(event) => reviewStore.setReviewComment(event.target.value)}
                    required
                    sx={{ mb: 3, '& .MuiOutlinedInput-root': { bgcolor: 'white' } }}
                  />
                  {reviewStore.reviewError && (
                    <Alert severity="error" sx={{ mb: 3, borderRadius: 3 }}>
                      {reviewStore.reviewError}
                    </Alert>
                  )}
                  <BaseButton
                    fullWidth
                    variant="contained"
                    color="primary"
                    type="submit"
                    loading={reviewStore.isLoading}
                    disabled={!reviewStore.isReviewFormValid || reviewStore.isLoading}
                  >
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
                        onChange={(event) => bidStore.setBidAmount(event.target.value)}
                        inputProps={{ min: 1, step: 1 }}
                        required
                        sx={{ mb: 2 }}
                      />
                      <BaseInput
                        label="Rok izvedbe (dana)"
                        type="number"
                        value={bidStore.bidDaysToComplete}
                        onChange={(event) => bidStore.setBidDaysToComplete(event.target.value)}
                        inputProps={{ min: 1, step: 1 }}
                        required
                        sx={{ mb: 2 }}
                      />
                      <BaseInput
                        label="Vasa poruka"
                        multiline
                        rows={5}
                        value={bidStore.bidMessage}
                        onChange={(event) => bidStore.setBidMessage(event.target.value)}
                        required
                        sx={{ mb: 3 }}
                      />
                      <BaseButton
                        fullWidth
                        variant="contained"
                        color="primary"
                        type="submit"
                        loading={bidStore.isLoading}
                        disabled={!bidStore.isBidFormValid || bidStore.isLoading}
                      >
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
      </Box>
    </BaseContainer>
  );
});

export default JobDetailsPage;
