import React from 'react';
import { Box, Typography, Link, Divider, IconButton, alpha, Grid } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

// Atomi
import BaseContainer from '@/components/common/atoms/containers/BaseContainer';
import BaseLogo from '@/components/common/atoms/logo/BaseLogo';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Box 
      component="footer" 
      sx={{ 
        bgcolor: 'secondary.main', 
        color: 'grey.400',
        pt: 8,
        pb: 4,
        mt: 'auto',
        borderTop: '1px solid',
        borderColor: alpha('#FFF', 0.05)
      }}
    >
      <BaseContainer maxWidth="lg">
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ mb: 3, filter: 'brightness(0) invert(1)' }}>
              <BaseLogo />
            </Box>
            <Typography variant="body2" sx={{ maxWidth: 320, mb: 3, lineHeight: 1.8, color: 'grey.500' }}>
              BuildConnect je vodeća platforma za povezivanje investitora i provjerenih izvođača građevinskih radova. Gradimo povjerenje, ciglu po ciglu.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1.5 }}>
              <IconButton 
                sx={{ color: 'grey.500', p: 1.25, '&:hover': { color: 'primary.main', bgcolor: alpha('#FFF', 0.05) } }}
              >
                <FacebookIcon />
              </IconButton>
              <IconButton 
                sx={{ color: 'grey.500', p: 1.25, '&:hover': { color: 'primary.main', bgcolor: alpha('#FFF', 0.05) } }}
              >
                <InstagramIcon />
              </IconButton>
              <IconButton 
                sx={{ color: 'grey.500', p: 1.25, '&:hover': { color: 'primary.main', bgcolor: alpha('#FFF', 0.05) } }}
              >
                <LinkedInIcon />
              </IconButton>
            </Box>
          </Grid>

          <Grid size={{ xs: 6, sm: 3, md: 2 }}>
            <Typography variant="subtitle1" sx={{ color: 'common.white', fontWeight: 800, mb: 3 }}>
              Platforma
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Link component={RouterLink} to="/marketplace" color="inherit" underline="none" sx={{ fontSize: '0.9rem', '&:hover': { color: 'primary.main' } }}>
                Marketplace
              </Link>
              <Link component={RouterLink} to="/moji-poslovi" color="inherit" underline="none" sx={{ fontSize: '0.9rem', '&:hover': { color: 'primary.main' } }}>
                Moji Poslovi
              </Link>
              <Link component={RouterLink} to="/" color="inherit" underline="none" sx={{ fontSize: '0.9rem', '&:hover': { color: 'primary.main' } }}>
                Početna
              </Link>
            </Box>
          </Grid>

          <Grid size={{ xs: 6, sm: 3, md: 2 }}>
            <Typography variant="subtitle1" sx={{ color: 'common.white', fontWeight: 800, mb: 3 }}>
              Podrška
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Link component={RouterLink} to="/login" color="inherit" underline="none" sx={{ fontSize: '0.9rem', '&:hover': { color: 'primary.main' } }}>
                Prijava
              </Link>
              <Link component={RouterLink} to="/register" color="inherit" underline="none" sx={{ fontSize: '0.9rem', '&:hover': { color: 'primary.main' } }}>
                Registracija
              </Link>
              <Link component={RouterLink} to="/marketplace" color="inherit" underline="none" sx={{ fontSize: '0.9rem', '&:hover': { color: 'primary.main' } }}>
                Marketplace
              </Link>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="subtitle1" sx={{ color: 'common.white', fontWeight: 800, mb: 3 }}>
              Ostanite povezani
            </Typography>
            <Typography variant="body2" sx={{ mb: 3, lineHeight: 1.6 }}>
              Prijavite se na naš newsletter kako biste primali obavijesti o novim projektima i majstorima.
            </Typography>
            {/* Ovdje ćemo kasnije implementirati BaseInput Newsletter */}
          </Grid>
        </Grid>

        <Divider sx={{ my: 6, borderColor: alpha('#FFF', 0.08) }} />

        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' }, 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            gap: 2 
          }}
        >
          <Typography variant="caption" sx={{ color: 'grey.600' }}>
            © {currentYear} BuildConnect. Sva prava pridržana.
          </Typography>
          <Typography variant="caption" sx={{ color: 'grey.600', fontWeight: 500 }}>
            Razvijeno s pažnjom za građevinski sektor.
          </Typography>
        </Box>
      </BaseContainer>
    </Box>
  );
};

export default Footer;
