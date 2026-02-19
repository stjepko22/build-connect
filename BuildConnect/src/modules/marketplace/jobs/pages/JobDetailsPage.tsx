import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Paper, Grid, Box, Button, Divider, TextField, Card, Alert } from '@mui/material';
import { useStore } from '@/stores/RootStore';
import { observer } from 'mobx-react-lite';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PaymentsIcon from '@mui/icons-material/Payments';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const JobDetailsPage: React.FC = observer(() => {
  const { id } = useParams<{ id: string }>();
  const { jobStore, bidStore, authenticationStore } = useStore();
  const navigate = useNavigate();

  const job = jobStore.jobs.find(j => j.id === id);
  const bids = bidStore.getBidsByJobId(id || '');

  const [bidAmount, setBidAmount] = useState('');
  const [bidDays, setBidDays] = useState('');
  const [bidMessage, setBidMessage] = useState('');

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

  return (
    <Container maxWidth="lg">
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/marketplace')} sx={{ mb: 3 }}>
        Povratak
      </Button>

      <Grid container spacing={4}>
        {/* Lijeva strana - Detalji posla */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper sx={{ p: 4, borderRadius: 3 }}>
            <Typography variant="h3" gutterBottom sx={{ fontWeight: 800 }}>
              {job.title}
            </Typography>
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

          {/* Lista ponuda za Investitora ili Izvođača */}
          <Box sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 700 }}>
              Ponude ({bids.length})
            </Typography>
            {bids.length === 0 ? (
              <Typography color="text.secondary">Još nema pristiglih ponuda.</Typography>
            ) : (
              bids.map(bid => (
                <Card key={bid.id} sx={{ mb: 2, p: 2 }}>
                  <Grid container justifyContent="space-between" alignItems="center">
                    <Grid size={8}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{bid.contractorName}</Typography>
                      <Typography variant="body2">{bid.message}</Typography>
                    </Grid>
                    <Grid size={4} sx={{ textAlign: 'right' }}>
                      <Typography variant="h6" color="primary.main">{bid.amount} EUR</Typography>
                      <Typography variant="caption">{bid.daysToComplete} dana</Typography>
                    </Grid>
                  </Grid>
                </Card>
              ))
            )}
          </Box>
        </Grid>

        {/* Desna strana - Forma za slanje ponude (Samo za izvođače) */}
        <Grid size={{ xs: 12, md: 4 }}>
          {authenticationStore.user?.role === 'IZVODJAC' ? (
            <Paper sx={{ p: 3, borderRadius: 3, position: 'sticky', top: 100 }}>
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
            </Paper>
          ) : (
            <Paper sx={{ p: 3, borderRadius: 3, bgcolor: '#f5f5f5' }}>
              <Typography variant="body2" color="text.secondary" align="center">
                Samo prijavljeni izvođači mogu slati ponude na ovaj oglas.
              </Typography>
            </Paper>
          )}
        </Grid>
      </Grid>
    </Container>
  );
});

export default JobDetailsPage;