import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Paper, Grid, Box, Button, Divider, TextField, Card, Alert, Chip, Rating } from '@mui/material';
import { useStore } from '@/stores/RootStore';
import { observer } from 'mobx-react-lite';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PaymentsIcon from '@mui/icons-material/Payments';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import StarIcon from '@mui/icons-material/Star';

const JobDetailsPage: React.FC = observer(() => {
  const { id } = useParams<{ id: string }>();
  const { jobStore, bidStore, authenticationStore, reviewStore } = useStore();
  const navigate = useNavigate();

  const job = jobStore.jobs.find(j => j.id === id);
  const bids = bidStore.getBidsByJobId(id || '');
  const isOwner = authenticationStore.user?.id === job?.investitorId;
  const acceptedBid = bids.find(b => b.status === 'ACCEPTED');
  const existingReview = reviewStore.getReviewByJobId(id || '');

  const [bidAmount, setBidAmount] = useState('');
  const [bidDays, setBidDays] = useState('');
  const [bidMessage, setBidMessage] = useState('');
  
  const [rating, setRating] = useState<number | null>(5);
  const [reviewComment, setReviewComment] = useState('');

  if (!job) {
    return (
      <Container sx={{ mt: 5 }}>
        <Alert severity="error">Posao nije pronađen.</Alert>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/marketplace')} sx={{ mt: 2 }}>
          Povratak na listu
        </Button>
      </Container>
    );
  }

  const handleSendBid = async (e: React.FormEvent) => {
    e.preventDefault();
    await bidStore.addBid({
      jobId: job.id,
      amount: Number(bidAmount),
      daysToComplete: Number(bidDays),
      message: bidMessage
    });
    setBidAmount('');
    setBidDays('');
    setBidMessage('');
  };

  const handleAcceptBid = async (bidId: string) => {
    if (window.confirm('Jeste li sigurni da želite prihvatiti ovu ponudu? Ostale ponude će biti odbijene.')) {
      await bidStore.acceptBid(bidId);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (acceptedBid) {
      await reviewStore.addReview({
        jobId: job.id,
        revieweeId: acceptedBid.contractorId,
        rating: rating || 5,
        comment: reviewComment
      });
    }
  };

  return (
    <Container maxWidth="lg">
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ mb: 3 }}>
        Povratak
      </Button>

      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper sx={{ p: 4, borderRadius: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Typography variant="h3" gutterBottom sx={{ fontWeight: 800 }}>
                {job.title}
              </Typography>
              {existingReview && <Chip label="ZAVRŠENO" color="success" sx={{ fontWeight: 900 }} />}
            </Box>
            
            <Box sx={{ display: 'flex', gap: 3, mb: 3, flexWrap: 'wrap' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <LocationOnIcon color="action" />
                <Typography variant="subtitle1">{job.location}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <PaymentsIcon color="action" />
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  {job.budget ? `${job.budget} EUR` : 'Dogovor'}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <CalendarMonthIcon color="action" />
                <Typography variant="subtitle1">Rok: {job.deadline}</Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>
              Opis projekta
            </Typography>
            <Typography variant="body1" paragraph sx={{ whiteSpace: 'pre-line' }}>
              {job.description}
            </Typography>
          </Paper>

          {existingReview && (
            <Paper sx={{ p: 4, mt: 3, borderRadius: 3, bgcolor: '#f8fdf8', border: '1px solid #c3e6cb' }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 700 }}>
                <StarIcon color="primary" /> Vaša recenzija izvođača
              </Typography>
              <Rating value={existingReview.rating} readOnly sx={{ mb: 1 }} />
              <Typography variant="body1">"{existingReview.comment}"</Typography>
            </Paper>
          )}

          <Box sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 700 }}>
              Ponude ({bids.length})
            </Typography>
            {bids.length === 0 ? (
              <Typography color="text.secondary">Još nema pristiglih ponuda.</Typography>
            ) : (
              bids.map(bid => (
                <Card 
                  key={bid.id} 
                  sx={{ 
                    mb: 2, 
                    p: 2, 
                    border: bid.status === 'ACCEPTED' ? '2px solid #4caf50' : 'none',
                    opacity: (acceptedBid && bid.status !== 'ACCEPTED') ? 0.5 : 1
                  }}
                >
                  <Grid container spacing={2} alignItems="center">
                    <Grid size={{ xs: 8 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Typography 
                          variant="subtitle1" 
                          sx={{ 
                            fontWeight: 700, 
                            cursor: 'pointer', 
                            '&:hover': { color: 'primary.main', textDecoration: 'underline' } 
                          }}
                          onClick={() => navigate(`/profil/${bid.contractorId}`)}
                        >
                          {bid.contractorName}
                        </Typography>
                        {bid.status === 'ACCEPTED' && <Chip label="Prihvaćeno" color="success" size="small" icon={<CheckCircleIcon />} />}
                        {bid.status === 'REJECTED' && <Chip label="Odbijeno" size="small" variant="outlined" />}
                      </Box>
                      <Typography variant="body2">{bid.message}</Typography>
                    </Grid>
                    <Grid size={{ xs: 4 }} sx={{ textAlign: 'right' }}>
                      <Typography variant="h6" color="primary.main">{bid.amount} EUR</Typography>
                      <Typography variant="caption" display="block">{bid.daysToComplete} dana</Typography>
                      
                      {isOwner && bid.status === 'PENDING' && !acceptedBid && (
                        <Button 
                          variant="contained" 
                          color="success" 
                          size="small" 
                          sx={{ mt: 1 }}
                          onClick={() => handleAcceptBid(bid.id)}
                          disabled={bidStore.isLoading}
                        >
                          Prihvati
                        </Button>
                      )}
                    </Grid>
                  </Grid>
                </Card>
              ))
            )}
          </Box>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          {isOwner && acceptedBid && !existingReview && (
            <Paper sx={{ p: 3, borderRadius: 3, bgcolor: '#fff9c4', border: '1px solid #fbc02d', position: 'sticky', top: 100 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>
                Završi projekt
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Posao je u tijeku s izvođačem <strong>{acceptedBid.contractorName}</strong>. 
                Ocijenite suradnju kada posao bude gotov.
              </Typography>
              <form onSubmit={handleSubmitReview}>
                <Typography component="legend">Ocjena suradnje:</Typography>
                <Rating
                  name="simple-controlled"
                  value={rating}
                  onChange={(_event, newValue) => setRating(newValue)}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Vaše iskustvo"
                  multiline
                  rows={3}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Napišite komentar o kvaliteti rada..."
                  required
                />
                <Button 
                  fullWidth 
                  variant="contained" 
                  color="primary" 
                  type="submit" 
                  sx={{ mt: 2 }}
                  disabled={reviewStore.isLoading}
                >
                  {reviewStore.isLoading ? 'Spremanje...' : 'Završi i ocijeni'}
                </Button>
              </form>
            </Paper>
          )}

          {authenticationStore.user?.role === 'IZVODJAC' && (
            <Paper sx={{ p: 3, borderRadius: 3, position: 'sticky', top: 100 }}>
              {acceptedBid ? (
                <Alert severity="info">Ovaj posao je već dodijeljen drugom izvođaču.</Alert>
              ) : (
                <>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>
                    Pošalji svoju ponudu
                  </Typography>
                  <form onSubmit={handleSendBid}>
                    <TextField
                      fullWidth
                      label="Iznos ponude (EUR)"
                      margin="normal"
                      type="number"
                      value={bidAmount}
                      onChange={(e) => setBidAmount(e.target.value)}
                      required
                    />
                    <TextField
                      fullWidth
                      label="Vrijeme izrade (dana)"
                      margin="normal"
                      type="number"
                      value={bidDays}
                      onChange={(e) => setBidDays(e.target.value)}
                      required
                    />
                    <TextField
                      fullWidth
                      label="Poruka investitoru"
                      margin="normal"
                      multiline
                      rows={3}
                      value={bidMessage}
                      onChange={(e) => setBidMessage(e.target.value)}
                      required
                    />
                    <Button 
                      fullWidth 
                      variant="contained" 
                      color="secondary" 
                      type="submit" 
                      size="large"
                      sx={{ mt: 2 }}
                      disabled={bidStore.isLoading}
                    >
                      {bidStore.isLoading ? 'Slanje...' : 'Pošalji ponudu'}
                    </Button>
                  </form>
                </>
              )}
            </Paper>
          )}
        </Grid>
      </Grid>
    </Container>
  );
});

export default JobDetailsPage;