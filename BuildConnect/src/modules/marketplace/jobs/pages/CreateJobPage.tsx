import React, { useState } from 'react';
import { 
  Typography, 
  Paper, 
  Box, 
  Grid, 
  MenuItem, 
  alpha, 
  useTheme,
  Divider,
  InputAdornment
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PostAddIcon from '@mui/icons-material/PostAdd';
import EuroIcon from '@mui/icons-material/Euro';
import PlaceIcon from '@mui/icons-material/Place';
import EventIcon from '@mui/icons-material/Event';

// Atomi
import BaseButton from '@/core/components/atoms/buttons/BaseButton';
import BaseContainer from '@/core/components/atoms/containers/BaseContainer';
import BaseInput from '@/core/components/atoms/inputs/BaseInput';
import { useRootStore } from '@/core/hooks/useRootStore';

const CATEGORIES = ['Gradnja', 'Renovacija', 'Struja', 'Voda', 'Grijanje', 'Fasade', 'Krovovi', 'Ostalo'];

const CreateJobPage: React.FC = observer(() => {
  const { jobStore } = useRootStore();
  const theme = useTheme();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [budget, setBudget] = useState('');
  const [category, setCategory] = useState('');
  const [deadline, setDeadline] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await jobStore.createJob({
      title,
      description,
      location,
      budget: budget ? Number(budget) : undefined,
      category,
      deadline
    });
    navigate('/marketplace');
  };

  return (
    <BaseContainer maxWidth="md" sx={{ py: 6 }}>
      <BaseButton 
        variant="text" 
        color="secondary" 
        startIcon={<ArrowBackIcon />} 
        onClick={() => navigate(-1)} 
        sx={{ mb: 4, fontWeight: 700, px: 0 }}
      >
        Odustani
      </BaseButton>

      <Paper 
        elevation={0}
        sx={{ 
          p: { xs: 4, md: 7 }, 
          borderRadius: 8, 
          border: '1px solid', 
          borderColor: alpha(theme.palette.divider, 0.1),
          boxShadow: '0 20px 60px rgba(0,0,0,0.03)',
          position: 'relative'
        }}
      >
        <Box sx={{ 
          position: 'absolute', 
          top: 0, 
          right: 0, 
          p: 3, 
          bgcolor: alpha(theme.palette.primary.main, 0.1),
          borderRadius: '0 0 0 30px'
        }}>
          <PostAddIcon color="primary" />
        </Box>

        <Typography variant="h3" sx={{ fontWeight: 900, mb: 1.5, letterSpacing: '-1.5px' }}>
          Objavi novi projekt
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 6, maxWidth: 500 }}>
          Ispunite detalje projekta kako biste privukli najbolje izvođače.
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Naslov */}
            <Grid size={{ xs: 12 }}>
              <BaseInput
                fullWidth
                label="Naslov oglasa"
                placeholder="npr. Izrada termofasade na obiteljskoj kući"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </Grid>

            {/* Kategorija */}
            <Grid size={{ xs: 12, md: 6 }}>
              <BaseInput
                fullWidth
                select
                label="Kategorija radova"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                {CATEGORIES.map((cat) => (
                  <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                ))}
              </BaseInput>
            </Grid>

            {/* Lokacija */}
            <Grid size={{ xs: 12, md: 6 }}>
              <BaseInput
                fullWidth
                label="Lokacija"
                placeholder="npr. Zagreb, Jarun"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PlaceIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            {/* Budžet */}
            <Grid size={{ xs: 12, md: 6 }}>
              <BaseInput
                fullWidth
                label="Budžet (EUR)"
                type="number"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="Ostavite prazno za dogovor"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EuroIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            {/* Rok */}
            <Grid size={{ xs: 12, md: 6 }}>
              <BaseInput
                fullWidth
                label="Rok završetka"
                placeholder="npr. Lipanj 2026."
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EventIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            {/* Opis */}
            <Grid size={{ xs: 12 }}>
              <BaseInput
                fullWidth
                label="Detaljan opis posla"
                multiline
                rows={6}
                placeholder="Opišite što je potrebno napraviti..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Divider sx={{ my: 2, borderStyle: 'dashed' }} />
              <Box sx={{ mt: 2, display: 'flex', justifyContent: { xs: 'stretch', sm: 'flex-end' } }}>
                <BaseButton
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  fullWidth={true}
                  sx={{ px: { xs: 2, sm: 6, md: 8 }, py: 1.5, borderRadius: 3, fontWeight: 900, maxWidth: { xs: '100%', sm: 360 } }}
                  loading={jobStore.isLoading}
                >
                  Objavi oglas
                </BaseButton>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </BaseContainer>
  );
});

export default CreateJobPage;

