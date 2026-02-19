import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Paper, Box, Rating, Divider, Card, Button, Avatar } from '@mui/material';
import { useStore } from '@/stores/RootStore';
import { observer } from 'mobx-react-lite';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import VerifiedIcon from '@mui/icons-material/Verified';

const ContractorProfilePage: React.FC = observer(() => {
  const { id } = useParams<{ id: string }>();
  const { reviewStore } = useStore();
  const navigate = useNavigate();

  // Filtriramo sve recenzije koje je ovaj izvođač dobio
  const contractorReviews = reviewStore.reviews.filter(r => r.revieweeId === id);
  
  // Računamo prosječnu ocjenu
  const averageRating = contractorReviews.length > 0 
    ? contractorReviews.reduce((sum, r) => sum + r.rating, 0) / contractorReviews.length 
    : 0;

  return (
    <Container maxWidth="md">
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ mb: 3 }}>
        Povratak
      </Button>

      <Paper sx={{ p: 4, borderRadius: 4, mb: 4, textAlign: 'center' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ width: 100, height: 100, bgcolor: 'secondary.main', fontSize: '2.5rem' }}>
            {id === 'izvodjac-1' ? 'M' : 'I'}
          </Avatar>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
              {id === 'izvodjac-1' ? 'Marko Majstor' : 'Izvođač'} <VerifiedIcon color="primary" />
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Certificirani izvođač radova
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Rating value={averageRating} readOnly precision={0.5} size="large" />
            <Typography variant="h6">({averageRating.toFixed(1)})</Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            Ukupno recenzija: {contractorReviews.length}
          </Typography>
        </Box>
      </Paper>

      <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, mb: 3 }}>
        Povratne informacije klijenata
      </Typography>

      {contractorReviews.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 3 }}>
          <Typography color="text.secondary">Ovaj izvođač još nema recenzija.</Typography>
        </Paper>
      ) : (
        contractorReviews.map(review => (
          <Card key={review.id} sx={{ mb: 2, p: 3, borderRadius: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Rating value={review.rating} readOnly size="small" />
              <Typography variant="caption" color="text.secondary">
                {new Date(review.createdAt).toLocaleDateString('hr-HR')}
              </Typography>
            </Box>
            <Typography variant="body1" sx={{ fontStyle: 'italic' }}>
              "{review.comment}"
            </Typography>
            <Divider sx={{ my: 1.5 }} />
            <Typography variant="caption" sx={{ fontWeight: 700 }}>
              Investitor ID: {review.reviewerId}
            </Typography>
          </Card>
        ))
      )}
    </Container>
  );
});

export default ContractorProfilePage;