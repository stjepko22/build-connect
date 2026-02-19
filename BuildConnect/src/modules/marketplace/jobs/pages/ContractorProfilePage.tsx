import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography, Paper, Box, Grid, Rating, Divider, Card, Avatar, alpha } from '@mui/material';
import { observer } from 'mobx-react-lite';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import VerifiedIcon from '@mui/icons-material/Verified';

// Atomi
import BaseButton from '@/components/common/atoms/buttons/BaseButton';
import BaseContainer from '@/components/common/atoms/containers/BaseContainer';
import { useRootStore } from '@/hooks/useRootStore';

const ContractorProfilePage: React.FC = observer(() => {
  const { id } = useParams<{ id: string }>();
  const { reviewStore } = useRootStore();
  const navigate = useNavigate();

  const contractorReviews = reviewStore.reviews.filter(r => r.revieweeId === id);
  const averageRating = contractorReviews.length > 0 
    ? contractorReviews.reduce((sum, r) => sum + r.rating, 0) / contractorReviews.length 
    : 0;

  return (
    <BaseContainer maxWidth="md">
      <BaseButton 
        variant="text" 
        color="secondary" 
        startIcon={<ArrowBackIcon />} 
        onClick={() => navigate(-1)} 
        sx={{ mb: 4 }}
      >
        Povratak
      </BaseButton>

      <Paper sx={{ p: 4, borderRadius: 4, mb: 4, textAlign: 'center', border: '1px solid', borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <Avatar 
            sx={{ 
              width: 100, 
              height: 100, 
              bgcolor: 'primary.main', 
              color: 'primary.contrastText',
              fontSize: '2.5rem',
              fontWeight: 800,
              boxShadow: (theme) => `0 8px 24px ${alpha(theme.palette.primary.main, 0.3)}`
            }}
          >
            {id === 'izvodjac-1' ? 'M' : 'I'}
          </Avatar>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
              {id === 'izvodjac-1' ? 'Marko Majstor' : 'Izvođač'} <VerifiedIcon color="primary" />
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Certificirani izvođač radova
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, bgcolor: 'primary.light', px: 3, py: 1, borderRadius: 10 }}>
            <Rating value={averageRating} readOnly precision={0.5} />
            <Typography variant="h6" sx={{ fontWeight: 800, color: 'primary.dark' }}>
              {averageRating.toFixed(1)}
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
            Ukupno recenzija: {contractorReviews.length}
          </Typography>
        </Box>
      </Paper>

      <Typography variant="h5" sx={{ fontWeight: 900, mb: 3 }}>
        Što klijenti kažu
      </Typography>

      {contractorReviews.length === 0 ? (
        <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 4, bgcolor: 'action.hover', border: '2px dashed', borderColor: 'divider' }}>
          <Typography color="text.secondary">Ovaj izvođač još nema ocjena.</Typography>
        </Paper>
      ) : (
        <Grid container spacing={2}>
          {contractorReviews.map(review => (
            <Grid key={review.id} size={{ xs: 12 }}>
              <Card sx={{ p: 3, borderRadius: 3, boxShadow: 'none', border: '1px solid', borderColor: 'divider' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Rating value={review.rating} readOnly size="small" />
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                    {new Date(review.createdAt).toLocaleDateString('hr-HR')}
                  </Typography>
                </Box>
                <Typography variant="body1" sx={{ fontStyle: 'italic', mb: 2, color: 'text.primary' }}>
                  "{review.comment}"
                </Typography>
                <Divider sx={{ mb: 1.5, opacity: 0.5 }} />
                <Typography variant="caption" sx={{ fontWeight: 700, color: 'primary.dark' }}>
                  KLIJENT: {review.reviewerId}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </BaseContainer>
  );
});

export default ContractorProfilePage;