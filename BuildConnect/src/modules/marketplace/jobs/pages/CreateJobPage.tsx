import React, { useState } from 'react';
import { Container, Paper, Typography, TextField, Button, Box, MenuItem, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/stores/RootStore';
import { observer } from 'mobx-react-lite';

const categories = [
  'Zidarski radovi',
  'Limarija',
  'Rigips / Suha gradnja',
  'Vodoinstalacije',
  'Elektroinstalacije',
  'Keramika',
  'Fasada',
  'Ostalo'
];

const CreateJobPage: React.FC = observer(() => {
  const { jobStore } = useStore();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    location: '',
    budget: '',
    deadline: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await jobStore.addJob(formData);
    navigate('/');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4, borderRadius: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 800 }}>
          Objavi novi posao
        </Typography>
        <Typography variant="body1" color="textSecondary" sx={{ mb: 4 }}>
          Unesite detalje o projektu kako bi izvođači mogli poslati svoje ponude.
        </Typography>

        <form onSubmit={handleSubmit}>
          {/* U MUI v7, Grid container se koristi bez 'item' propova na djeci */}
          <Grid container spacing={3}>
            <Grid size={12}>
              <TextField
                fullWidth
                label="Naslov oglasa"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </Grid>
            
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                select
                label="Kategorija"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                {categories.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Lokacija"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Okvirni budžet (EUR)"
                name="budget"
                value={formData.budget}
                onChange={handleChange}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Rok za završetak"
                name="deadline"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={formData.deadline}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid size={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Detaljan opis posla"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid size={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button variant="outlined" onClick={() => navigate('/')}>
                  Odustani
                </Button>
                <Button 
                  type="submit" 
                  variant="contained" 
                  color="primary"
                  disabled={jobStore.isLoading}
                >
                  {jobStore.isLoading ? 'Objavljivanje...' : 'Objavi posao'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
});

export default CreateJobPage;