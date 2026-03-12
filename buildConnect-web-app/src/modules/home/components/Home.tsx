import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Paper,
  Typography,
  alpha,
  Stack,
  Chip,
  Divider,
  useTheme,
} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import EngineeringIcon from '@mui/icons-material/Engineering';
import BusinessIcon from '@mui/icons-material/Business';
import GroupIcon from '@mui/icons-material/Group';
import InventoryIcon from '@mui/icons-material/Inventory';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import VerifiedIcon from '@mui/icons-material/Verified';
import HandshakeIcon from '@mui/icons-material/Handshake';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ShieldIcon from '@mui/icons-material/Shield';
import BaseButton from '@/core/components/atoms/buttons/BaseButton';
import BaseContainer from '@/core/components/atoms/containers/BaseContainer';
import { BRAND_COLORS } from '@/ui/themes/default/theme';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  return (
    <Box
      sx={{
        overflow: 'hidden',
        bgcolor: 'background.default',
        mx: { xs: -2, sm: 0 },
        mt: { xs: -2, sm: 0 },
      }}
    >
      <Box
        sx={{
          pt: { xs: 7, md: 11 },
          pb: { xs: 8, md: 12 },
          color: 'white',
          position: 'relative',
          borderRadius: { xs: '0 0 36px 36px', md: '0 0 72px 72px' },
          background: BRAND_COLORS.heroGradient,
          '&::before': {
            content: '""',
            position: 'absolute',
            inset: 0,
            background: `radial-gradient(circle at 15% 18%, ${alpha(theme.palette.primary.main, 0.16)}, transparent 36%), radial-gradient(circle at 80% 70%, ${alpha(theme.palette.primary.main, 0.14)}, transparent 35%)`,
          },
        }}
      >
        <BaseContainer maxWidth="lg">
          <Grid container spacing={{ xs: 5, md: 8 }} alignItems="center" sx={{ position: 'relative', zIndex: 1 }}>
            <Grid size={{ xs: 12, md: 7 }} sx={{ display: 'flex', justifyContent: { xs: 'center', md: 'flex-start' } }}>
              <Box
                sx={{
                  width: '100%',
                  maxWidth: { xs: 360, sm: 520, md: 'none' },
                  mx: { xs: 'auto', md: 0 },
                  textAlign: { xs: 'center', md: 'left' },
                }}
              >
                <Chip
                  label="Pro mreza za gradjevinu"
                  icon={<ShieldIcon sx={{ color: 'primary.main !important', fontSize: 16 }} />}
                  sx={{
                    display: 'inline-flex',
                    mb: 2.5,
                    px: 0.6,
                    py: 0.2,
                    bgcolor: alpha(theme.palette.common.white, 0.1),
                    border: '1px solid',
                    borderColor: alpha(theme.palette.common.white, 0.18),
                    color: 'primary.main',
                    fontWeight: 800,
                    fontSize: '0.76rem',
                    letterSpacing: '0.03em',
                    textTransform: 'uppercase',
                    borderRadius: 2,
                    mx: { xs: 'auto', md: 0 },
                  }}
                />

                <Typography
                  variant="h1"
                  sx={{
                    fontWeight: 900,
                    lineHeight: 1.04,
                    letterSpacing: '-0.035em',
                    mb: 2,
                    fontSize: { xs: '2.2rem', sm: '2.9rem', md: '4.4rem' },
                    textAlign: { xs: 'center', md: 'left' },
                  }}
                >
                  Posao i majstori
                  <Box component="span" sx={{ color: 'primary.main', display: 'block' }}>
                    bez improvizacije
                  </Box>
                </Typography>

                <Typography
                  sx={{
                    maxWidth: 600,
                    mb: 4,
                    lineHeight: 1.65,
                    color: alpha(theme.palette.common.white, 0.82),
                    fontSize: { xs: '1rem', md: '1.15rem' },
                    textAlign: { xs: 'center', md: 'left' },
                  }}
                >
                  BuildConnect povezuje investitore i izvodjace kroz strukturirane oglase, ponude i recenzije. Odluke
                  donosis na temelju podataka, ne dojma.
                </Typography>

                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  spacing={2.2}
                  sx={{
                    maxWidth: { xs: 360, sm: 520 },
                    mx: { xs: 'auto', md: 0 },
                    alignItems: { xs: 'center', sm: 'stretch' },
                  }}
                >
                  <BaseButton
                    variant="contained"
                    size="large"
                    endIcon={<ArrowForwardIcon />}
                    onClick={() => navigate('/marketplace')}
                    fullWidth={false}
                    sx={{
                      py: 1.6,
                      borderRadius: 3,
                      fontWeight: 900,
                      width: { xs: '100%', sm: '100%' },
                      maxWidth: { xs: 340, sm: 'none' },
                      mx: { xs: 'auto', sm: 0 },
                    }}
                  >
                    Otvori marketplace
                  </BaseButton>
                  <BaseButton
                    variant="outlined"
                    onClick={() => navigate('/register')}
                    fullWidth={false}
                    sx={{
                      py: 1.6,
                      borderRadius: 3,
                      fontWeight: 800,
                      width: { xs: '100%', sm: '100%' },
                      maxWidth: { xs: 340, sm: 'none' },
                      mx: { xs: 'auto', sm: 0 },
                      color: 'common.white',
                      borderColor: alpha(theme.palette.common.white, 0.38),
                      '&:hover': { borderColor: alpha(theme.palette.common.white, 0.9) },
                    }}
                  >
                    Kreiraj racun
                  </BaseButton>
                </Stack>
              </Box>
            </Grid>

            <Grid size={{ xs: 12, md: 5 }} sx={{ display: 'flex', justifyContent: { xs: 'center', md: 'flex-start' } }}>
              <Paper
                elevation={0}
                sx={{
                  width: '100%',
                  maxWidth: { xs: 360, sm: 'none' },
                  p: { xs: 3, md: 4 },
                  borderRadius: 5.5,
                  border: '1px solid',
                  borderColor: alpha(theme.palette.common.white, 0.22),
                  bgcolor: alpha(theme.palette.common.white, 0.08),
                  backdropFilter: 'blur(14px)',
                  boxShadow: `inset 0 1px 0 ${alpha(theme.palette.common.white, 0.18)}, 0 24px 44px ${alpha(theme.palette.common.black, 0.28)}`,
                }}
              >
                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                  <Chip
                    label="Provjereno"
                    size="small"
                    sx={{
                      bgcolor: alpha(theme.palette.common.white, 0.12),
                      color: 'common.white',
                      borderRadius: 1.5,
                      fontWeight: 700,
                    }}
                  />
                  <Typography sx={{ color: alpha(theme.palette.common.white, 0.7), fontSize: '0.8rem', fontWeight: 700 }}>
                    odgovor unutar 24h
                  </Typography>
                </Stack>

                <Typography variant="h5" sx={{ fontWeight: 900, color: 'primary.main', mb: 1.2 }}>
                  Sto dobivas odmah
                </Typography>
                <Typography sx={{ color: alpha(theme.palette.common.white, 0.72), mb: 3, fontSize: '0.95rem' }}>
                  Jedinstven tijek rada: od objave posla do potvrde izvodjaca.
                </Typography>

                <Stack spacing={1.2}>
                  {[
                    {
                      icon: <VerifiedIcon sx={{ color: 'primary.main', fontSize: 19 }} />,
                      text: 'Auditabilne recenzije i povijest izvedbi',
                    },
                    {
                      icon: <HandshakeIcon sx={{ color: 'primary.main', fontSize: 19 }} />,
                      text: 'Direktan kontakt s odgovornom osobom',
                    },
                    {
                      icon: <TrendingUpIcon sx={{ color: 'primary.main', fontSize: 19 }} />,
                      text: 'Jasna usporedba cijena, rokova i opsega',
                    },
                  ].map((item) => (
                    <Stack
                      key={item.text}
                      direction="row"
                      alignItems="center"
                      spacing={1.2}
                      sx={{
                        px: 1.2,
                        py: 1,
                        borderRadius: 2,
                        bgcolor: alpha(theme.palette.common.white, 0.05),
                        border: '1px solid',
                        borderColor: alpha(theme.palette.common.white, 0.08),
                      }}
                    >
                      {item.icon}
                      <Typography sx={{ color: 'common.white', fontSize: '0.92rem' }}>{item.text}</Typography>
                    </Stack>
                  ))}
                </Stack>
              </Paper>
            </Grid>
          </Grid>
        </BaseContainer>
      </Box>

      <Box sx={{ py: { xs: 6, md: 10 } }}>
        <BaseContainer maxWidth="lg">
          <Typography
            textAlign="center"
            sx={{
              fontWeight: 900,
              color: 'secondary.main',
              mb: { xs: 4, md: 6 },
              fontSize: { xs: '1.7rem', md: '2.35rem' },
            }}
          >
            Jedna platforma, cetiri kljucne uloge
          </Typography>

          <Grid container spacing={{ xs: 2, md: 3 }}>
            {[
              {
                title: 'Majstor',
                icon: <EngineeringIcon sx={{ fontSize: 34 }} />,
                desc: 'Grade reputaciju kroz stvarne projekte i recenzije.',
              },
              {
                title: 'Firma',
                icon: <BusinessIcon sx={{ fontSize: 34 }} />,
                desc: 'Prate vise projekata i timova na jednom mjestu.',
              },
              {
                title: 'Investitor',
                icon: <GroupIcon sx={{ fontSize: 34 }} />,
                desc: 'Usporeduju ponude i biraju izvedbu bez rizika.',
              },
              {
                title: 'Dobavljac',
                icon: <InventoryIcon sx={{ fontSize: 34 }} />,
                desc: 'Povezuju proizvode s aktivnim izvodacima.',
              },
            ].map((item) => (
              <Grid key={item.title} size={{ xs: 12, sm: 6, md: 3 }}>
                <Paper
                  sx={{
                    p: { xs: 3, md: 3.5 },
                    borderRadius: 4,
                    border: '1px solid',
                    borderColor: 'divider',
                    height: '100%',
                    textAlign: 'center',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      borderColor: 'primary.main',
                      transform: { md: 'translateY(-4px)' },
                      boxShadow: 4,
                    },
                  }}
                >
                  <Box sx={{ color: 'primary.main', mb: 1.3 }}>{item.icon}</Box>
                  <Typography sx={{ fontWeight: 900, mb: 1, fontSize: '1.05rem' }}>{item.title}</Typography>
                  <Typography sx={{ color: 'text.secondary', lineHeight: 1.6, fontSize: '0.92rem' }}>{item.desc}</Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </BaseContainer>
      </Box>

      <Box sx={{ py: { xs: 6, md: 9 }, bgcolor: alpha(theme.palette.common.black, 0.02) }}>
        <BaseContainer maxWidth="lg">
          <Grid container spacing={{ xs: 2, md: 3 }}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper sx={{ p: { xs: 3, md: 4 }, borderRadius: 4, border: '1px solid', borderColor: 'divider', height: '100%' }}>
                <Typography
                  sx={{ fontWeight: 900, color: 'error.main', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}
                >
                  <CancelIcon /> Klasicni kanali
                </Typography>
                <Stack spacing={1.2}>
                  {[
                    'Nepouzdani profili i oglasi',
                    'Puno gubljenja vremena na provjere',
                    'Nema jasnog traga kvalitete rada',
                  ].map((line) => (
                    <Typography key={line} sx={{ color: 'text.secondary', fontSize: '0.95rem' }}>
                      - {line}
                    </Typography>
                  ))}
                </Stack>
              </Paper>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Paper
                sx={{
                  p: { xs: 3, md: 4 },
                  borderRadius: 4,
                  bgcolor: 'secondary.main',
                  color: 'common.white',
                  height: '100%',
                }}
              >
                <Typography
                  sx={{ fontWeight: 900, color: 'primary.main', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}
                >
                  <ShieldIcon /> BuildConnect
                </Typography>
                <Stack spacing={1.2}>
                  {[
                    'Provjerljivi profili i recenzije',
                    'Pregled ponuda i rokova na jednom ekranu',
                    'Brzi odabir i manje rizicnih odluka',
                  ].map((line) => (
                    <Stack key={line} direction="row" spacing={1} alignItems="center">
                      <CheckCircleIcon sx={{ color: 'primary.main', fontSize: 18 }} />
                      <Typography sx={{ color: alpha(theme.palette.common.white, 0.92), fontSize: '0.95rem' }}>{line}</Typography>
                    </Stack>
                  ))}
                </Stack>
              </Paper>
            </Grid>
          </Grid>

          <Divider sx={{ my: { xs: 4, md: 5 } }} />

          <Box sx={{ textAlign: 'center' }}>
            <Typography sx={{ color: 'text.secondary', mb: 2 }}>Spremni za sljedeci projekt?</Typography>
            <BaseButton
              variant="contained"
              size="large"
              onClick={() => navigate('/register')}
              endIcon={<ArrowForwardIcon />}
              sx={{ px: { xs: 3, md: 5 }, py: 1.4, borderRadius: 3, fontWeight: 900 }}
            >
              Pokreni racun
            </BaseButton>
          </Box>
        </BaseContainer>
      </Box>
    </Box>
  );
};

export default Home;
