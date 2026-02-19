import BaseButton from '@/components/common/atoms/buttons/BaseButton';
import BaseContainer from '@/components/common/atoms/containers/BaseContainer';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import ConstructionIcon from '@mui/icons-material/Construction';
import GroupIcon from '@mui/icons-material/Group';
import { Box, Grid, Paper, Typography, alpha } from '@mui/material';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage: React.FC = observer(() => {
  const navigate = useNavigate();

  return (
    <Box sx={{ overflow: 'hidden' }}>
      {/* Hero Section */}
      <Box 
        sx={{ 
          pt: { xs: 8, md: 15 }, 
          pb: { xs: 10, md: 20 }, 
          background: (theme) => `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${alpha(theme.palette.primary.light, 0.3)} 100%)`,
          position: 'relative'
        }}
      >
        <BaseContainer maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid size={{ xs: 12, md: 7 }}>
              <Typography 
                variant="h1" 
                sx={{ 
                  fontWeight: 900, 
                  fontSize: { xs: '3rem', md: '4.5rem' }, 
                  lineHeight: 1.1, 
                  mb: 3,
                  color: 'secondary.main'
                }}
              >
                Pronađite majstora kojeg ćete <span style={{ color: '#FFB300' }}>preporučiti.</span>
              </Typography>
              <Typography 
                variant="h5" 
                color="text.secondary" 
                sx={{ mb: 6, maxWidth: '600px', lineHeight: 1.6, fontWeight: 500 }}
              >
                BuildConnect povezuje vlasnike nekretnina s provjerenim izvođačima građevinskih radova. Brzo, sigurno i bez skrivenih troškova.
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <BaseButton 
                  variant="contained" 
                  size="large" 
                  onClick={() => navigate('/register')}
                  endIcon={<ArrowForwardIcon />}
                  sx={{ px: 4, py: 2, fontSize: '1.1rem' }}
                >
                  Trebam majstora
                </BaseButton>
                <BaseButton 
                  variant="outlined" 
                  color="secondary"
                  size="large" 
                  onClick={() => navigate('/marketplace')}
                  sx={{ px: 4, py: 2, fontSize: '1.1rem' }}
                >
                  Tražim posao
                </BaseButton>
              </Box>
            </Grid>
            
            <Grid size={{ xs: 12, md: 5 }} sx={{ display: { xs: 'none', md: 'block' } }}>
              <Box 
                sx={{ 
                  position: 'relative',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    top: '10%',
                    left: '10%',
                    width: '100%',
                    height: '100%',
                    bgcolor: 'primary.main',
                    borderRadius: 8,
                    zIndex: 1,
                    opacity: 0.1
                  }
                }}
              >
                <Paper 
                  elevation={0}
                  sx={{ 
                    p: 4, 
                    borderRadius: 8, 
                    bgcolor: 'white', 
                    border: '1px solid', 
                    borderColor: 'divider',
                    position: 'relative',
                    zIndex: 2,
                    boxShadow: '0 20px 40px rgba(0,0,0,0.05)'
                  }}
                >
                  <ConstructionIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                  <Typography variant="h5" sx={{ fontWeight: 900, mb: 1 }}>Započnite projekt</Typography>
                  <Typography color="text.secondary">Postavite oglas besplatno i primite ponude u roku od 24 sata.</Typography>
                </Paper>
              </Box>
            </Grid>
          </Grid>
        </BaseContainer>
      </Box>

      {/* Stats Section */}
      <Box sx={{ py: 10, bgcolor: 'secondary.main', color: 'white' }}>
        <BaseContainer maxWidth="lg">
          <Grid container spacing={4} sx={{ textAlign: 'center' }}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Typography variant="h3" sx={{ fontWeight: 900, color: 'primary.main' }}>500+</Typography>
              <Typography variant="subtitle1" sx={{ opacity: 0.8 }}>Aktivnih oglasa</Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Typography variant="h3" sx={{ fontWeight: 900, color: 'primary.main' }}>1.2k</Typography>
              <Typography variant="subtitle1" sx={{ opacity: 0.8 }}>Provjerenih majstora</Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Typography variant="h3" sx={{ fontWeight: 900, color: 'primary.main' }}>98%</Typography>
              <Typography variant="subtitle1" sx={{ opacity: 0.8 }}>Zadovoljnih korisnika</Typography>
            </Grid>
          </Grid>
        </BaseContainer>
      </Box>

      {/* Features Section */}
      <Box sx={{ py: 15, bgcolor: 'background.default' }}>
        <BaseContainer maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 10 }}>
            <Typography variant="h3" sx={{ fontWeight: 900, mb: 2 }}>Zašto odabrati BuildConnect?</Typography>
            <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 400 }}>Jednostavan put do kvalitetno odrađenog posla.</Typography>
          </Box>

          <Grid container spacing={4}>
            {[
              { 
                icon: <AssignmentTurnedInIcon sx={{ fontSize: 40 }} />, 
                title: "Provjerene recenzije", 
                desc: "Svi majstori imaju ocjene stvarnih klijenata nakon završenog posla." 
              },
              { 
                icon: <GroupIcon sx={{ fontSize: 40 }} />, 
                title: "Direktna komunikacija", 
                desc: "Razgovarajte s izvođačima direktno i dogovorite sve detalje bez posrednika." 
              },
              { 
                icon: <ConstructionIcon sx={{ fontSize: 40 }} />, 
                title: "Stručna podrška", 
                desc: "Naš tim je tu da vam pomogne u svakom koraku procesa gradnje ili renovacije." 
              }
            ].map((feature, index) => (
              <Grid key={index} size={{ xs: 12, md: 4 }}>
                <Paper 
                  sx={{ 
                    p: 5, 
                    height: '100%', 
                    borderRadius: 4, 
                    border: '1px solid', 
                    borderColor: 'divider',
                    transition: '0.3s',
                    '&:hover': {
                      transform: 'translateY(-10px)',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                      borderColor: 'primary.main'
                    }
                  }}
                >
                  <Box sx={{ color: 'primary.main', mb: 2 }}>{feature.icon}</Box>
                  <Typography variant="h5" sx={{ fontWeight: 800, mb: 2 }}>{feature.title}</Typography>
                  <Typography color="text.secondary" sx={{ lineHeight: 1.7 }}>{feature.desc}</Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </BaseContainer>
      </Box>
    </Box>
  );
});

export default LandingPage;