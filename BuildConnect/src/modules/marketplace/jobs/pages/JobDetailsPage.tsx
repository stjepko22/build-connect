import React, { useState } from 'react';
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

// Atomi i Molekule
import BaseButton from '@/components/common/atoms/buttons/BaseButton';
import BaseContainer from '@/components/common/atoms/containers/BaseContainer';
import BaseInput from '@/components/common/atoms/inputs/BaseInput';
import { useRootStore } from '@/hooks/useRootStore';

const JobDetailsPage: React.FC = observer(() => {
  const { id } = useParams<{ id: string }>();
  const theme = useTheme();
  const navigate = useNavigate();
  const { jobStore, bidStore, authenticationStore, reviewStore } = useRootStore();

  const job = jobStore.jobs.find((j) => j.id === id);
  const bids = bidStore.getBidsByJobId(id || '');
  const isOwner = authenticationStore.user?.id === job?.investitorId;
  const acceptedBid = bids.find((b) => b.status === 'ACCEPTED');
  const existingReview = reviewStore.getReviewByJobId(id || '');

  const [bidAmount, setBidAmount] = useState('');
  const [bidDays, setBidDays] = useState('');
  const [bidMessage, setBidMessage] = useState('');
  const [bidError, setBidError] = useState<string | null>(null);

  const [rating, setRating] = useState<number | null>(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewError, setReviewError] = useState<string | null>(null);

  if (!job) {
    return (
      <BaseContainer maxWidth="lg">
        <Box sx={{ mt: 8, textAlign: 'center' }}>
          <Alert severity="error" sx={{ borderRadius: 4 }}>
            Posao nije pronađen.
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

  const handleSendBid = async (e: React.FormEvent) => {
    e.preventDefault();
    setBidError(null);
    try {
      await bidStore.addBid({
        jobId: job.id,
        amount: Number(bidAmount),
        daysToComplete: Number(bidDays),
        message: bidMessage,
      });
      setBidAmount('');
      setBidDays('');
      setBidMessage('');
    } catch (error) {
      setBidError(error instanceof Error ? error.message : 'Slanje ponude nije uspjelo.');
    }
  };

  const handleAcceptBid = async (bidId: string) => {
    if (window.confirm('Jeste li sigurni da želite prihvatiti ovu ponudu?')) {
      await bidStore.acceptBid(bidId);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setReviewError(null);
    if (acceptedBid) {
      try {
        await reviewStore.addReview({
          jobId: job.id,
          revieweeId: acceptedBid.contractorId,
          rating: rating || 5,
          comment: reviewComment,
        });
        setReviewComment('');
      } catch (error) {
        setReviewError(error instanceof Error ? error.message : 'Objava recenzije nije uspjela.');
      }
    }
  };

  const cardStyle = {
    p: { xs: 3, md: 5 },
    borderRadius: 6,
    border: '1px solid',
    borderColor: alpha(theme.palette.divider, 0.08),
    boxShadow: '0 10px 40px rgba(0,0,0,0.02)',
    bgcolor: 'background.paper',
  };

  return (
    <BaseContainer maxWidth="lg">
      <BaseButton
        variant="text"
        color="secondary"
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(-1)}
        sx={{ mb: 4, fontWeight: 700, px: 0 }}
      >
        Natrag na pretragu
      </BaseButton>

      <Grid container spacing={4}>
        {/* Lijeva strana: Glavni sadržaj */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper sx={cardStyle}>
            <Box sx={{ mb: 4 }}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="flex-start"
                spacing={2}
                sx={{ mb: 2 }}
              >
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
                <Chip
                  label={existingReview ? 'Završeno' : acceptedBid ? 'U radu' : 'Otvoreno'}
                  color={existingReview ? 'success' : acceptedBid ? 'primary' : 'default'}
                  sx={{
                    fontWeight: 900,
                    borderRadius: 2,
                    textTransform: 'uppercase',
                    fontSize: '0.7rem',
                  }}
                />
              </Stack>

              <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap sx={{ mt: 3 }}>
                <Chip
                  icon={<LocationOnIcon sx={{ fontSize: '1rem !important' }} />}
                  label={job.location}
                  variant="outlined"
                  sx={{ borderRadius: 2, fontWeight: 600 }}
                />
                <Chip
                  icon={<CalendarMonthIcon sx={{ fontSize: '1rem !important' }} />}
                  label={`Rok: ${job.deadline}`}
                  variant="outlined"
                  sx={{ borderRadius: 2, fontWeight: 600 }}
                />
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
            <Typography
              variant="body1"
              sx={{
                color: 'text.secondary',
                lineHeight: 1.8,
                whiteSpace: 'pre-line',
                fontSize: '1.05rem',
              }}
            >
              {job.description}
            </Typography>
          </Paper>

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
                <StarIcon /> Recenzija investitora
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

          <Box sx={{ mt: 8 }}>
            <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 4 }}>
              <Typography variant="h4" sx={{ fontWeight: 900 }}>
                Pristigle ponude
              </Typography>
              <Chip
                label={bids.length}
                sx={{ fontWeight: 900, bgcolor: 'secondary.main', color: 'white' }}
              />
            </Stack>

            {bids.length === 0 ? (
              <Box
                sx={{
                  textAlign: 'center',
                  py: 10,
                  bgcolor: alpha(theme.palette.divider, 0.03),
                  borderRadius: 8,
                  border: '2px dashed',
                  borderColor: 'divider',
                }}
              >
                <EngineeringIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
                <Typography color="text.secondary" sx={{ fontWeight: 600 }}>
                  Još nema ponuda. Budite prvi!
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
                    borderColor:
                      bid.status === 'ACCEPTED'
                        ? 'success.main'
                        : alpha(theme.palette.divider, 0.1),
                    bgcolor:
                      bid.status === 'ACCEPTED'
                        ? alpha(theme.palette.success.main, 0.02)
                        : 'background.paper',
                    transition: 'transform 0.2s ease-in-out',
                    '&:hover': { transform: 'translateY(-4px)' },
                  }}
                >
                  <Grid container spacing={3} alignItems="center">
                    <Grid size={{ xs: 12, sm: 8 }}>
                      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 1.5 }}>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 900,
                            cursor: 'pointer',
                            '&:hover': { color: 'primary.main' },
                          }}
                          onClick={() => navigate(`/profil/${bid.contractorId}`)}
                        >
                          {bid.contractorName}
                        </Typography>
                        {bid.status === 'ACCEPTED' && (
                          <Chip
                            icon={<FactCheckIcon />}
                            label="Prihvaćena"
                            color="success"
                            size="small"
                            sx={{ fontWeight: 800 }}
                          />
                        )}
                      </Stack>
                      <Typography variant="body1" color="text.secondary">
                        {bid.message}
                      </Typography>
                    </Grid>
                    <Grid
                      size={{ xs: 12, sm: 4 }}
                      sx={{ textAlign: { xs: 'left', sm: 'right' } }}
                    >
                      <Typography
                        variant="h4"
                        sx={{ fontWeight: 900, color: 'secondary.main', mb: 0.5 }}
                      >
                        {bid.amount.toLocaleString()} €
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          display: 'block',
                          mb: 2,
                          fontWeight: 800,
                          color: 'text.disabled',
                          textTransform: 'uppercase',
                        }}
                      >
                        ROK: {bid.daysToComplete} DANA
                      </Typography>

                      {isOwner && bid.status === 'PENDING' && !acceptedBid && (
                        <BaseButton
                          variant="contained"
                          color="success"
                          onClick={() => handleAcceptBid(bid.id)}
                          loading={bidStore.isLoading}
                        >
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

        {/* Desna strana: Sidebar */}
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
                  Završi projekt
                </Typography>
                <Typography variant="body2" sx={{ mb: 4, opacity: 0.9 }}>
                  Ocijenite izvođača <strong>{acceptedBid.contractorName}</strong>.
                </Typography>
                <form onSubmit={handleSubmitReview}>
                  <Box
                    sx={{
                      bgcolor: 'rgba(255,255,255,0.08)',
                      p: 3,
                      borderRadius: 4,
                      mb: 3,
                      textAlign: 'center',
                    }}
                  >
                    <Rating
                      size="large"
                      value={rating}
                      onChange={(_, val) => setRating(val)}
                      sx={{
                        '& .MuiRating-iconFilled': { color: 'primary.main' },
                        '& .MuiRating-iconEmpty': { color: 'rgba(255,255,255,0.2)' },
                      }}
                    />
                  </Box>
                  <BaseInput
                    fullWidth
                    label="Komentar suradnje"
                    multiline
                    rows={4}
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    required
                    sx={{ mb: 3, '& .MuiOutlinedInput-root': { bgcolor: 'white' } }}
                  />
                  {reviewError && (
                    <Alert severity="error" sx={{ mb: 3, borderRadius: 3 }}>
                      {reviewError}
                    </Alert>
                  )}
                  <BaseButton
                    fullWidth
                    variant="contained"
                    color="primary"
                    type="submit"
                    loading={reviewStore.isLoading}
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
                    Ovaj oglas više ne prima ponude.
                  </Alert>
                ) : (
                  <>
                    <Typography variant="h5" sx={{ fontWeight: 900, mb: 1 }}>
                      Pošaljite ponudu
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                      Investitor će primiti vašu ponudu odmah.
                    </Typography>
                    <form onSubmit={handleSendBid}>
                      {bidError && (
                        <Alert severity="error" sx={{ mb: 2, borderRadius: 3 }}>
                          {bidError}
                        </Alert>
                      )}
                      <BaseInput
                        label="Cijena (EUR)"
                        type="number"
                        value={bidAmount}
                        onChange={(e) => setBidAmount(e.target.value)}
                        inputProps={{ min: 1, step: 1 }}
                        required
                        sx={{ mb: 2 }}
                      />
                      <BaseInput
                        label="Rok izvedbe (dana)"
                        type="number"
                        value={bidDays}
                        onChange={(e) => setBidDays(e.target.value)}
                        inputProps={{ min: 1, step: 1 }}
                        required
                        sx={{ mb: 2 }}
                      />
                      <BaseInput
                        label="Vaša poruka"
                        multiline
                        rows={5}
                        value={bidMessage}
                        onChange={(e) => setBidMessage(e.target.value)}
                        required
                        sx={{ mb: 3 }}
                      />
                      <BaseButton
                        fullWidth
                        variant="contained"
                        color="primary"
                        type="submit"
                        loading={bidStore.isLoading}
                      >
                        Pošalji ponudu
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
