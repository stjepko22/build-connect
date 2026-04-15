import React, { useMemo, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  Typography,
  alpha,
  useTheme,
} from '@mui/material';
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded';
import ApartmentRoundedIcon from '@mui/icons-material/ApartmentRounded';
import AssignmentTurnedInRoundedIcon from '@mui/icons-material/AssignmentTurnedInRounded';
import BusinessRoundedIcon from '@mui/icons-material/BusinessRounded';
import ElectricBoltRoundedIcon from '@mui/icons-material/ElectricBoltRounded';
import EngineeringRoundedIcon from '@mui/icons-material/EngineeringRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import PlumbingRoundedIcon from '@mui/icons-material/PlumbingRounded';
import RoofingRoundedIcon from '@mui/icons-material/RoofingRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import ViewInArRoundedIcon from '@mui/icons-material/ViewInArRounded';
import BaseContainer from '@/core/components/atoms/containers/BaseContainer';
import BaseButton from '@/core/components/atoms/buttons/BaseButton';
import BaseInput from '@/core/components/atoms/inputs/BaseInput';
import { useRootStore } from '@/core/hooks/useRootStore';
import { JobCategory } from '@/modules/marketplace/jobs/constants/jobCategories';

type QuickAction = {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
};

type ContractorShortcut = {
  label: string;
  category: JobCategory;
  icon: React.ReactNode;
};

const HOME_CONTENT_WIDTH = { xs: 412, sm: 428, md: 456 };
const HOME_CONTENT_PADDING = { xs: 1.5, sm: 2 };

const contractorShortcuts: ContractorShortcut[] = [
  { label: 'Gradnja', category: 'Gradnja', icon: <EngineeringRoundedIcon /> },
  { label: 'Fasade', category: 'Fasade', icon: <ApartmentRoundedIcon /> },
  { label: 'Krovovi', category: 'Krovovi', icon: <RoofingRoundedIcon /> },
  { label: 'Keramika', category: 'Keramika', icon: <ViewInArRoundedIcon /> },
  { label: 'Elektro', category: 'Elektro', icon: <ElectricBoltRoundedIcon /> },
  { label: 'Voda', category: 'Vodoinstalacije', icon: <PlumbingRoundedIcon /> },
];

const Home: React.FC = observer(() => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { authenticationStore } = useRootStore();
  const user = authenticationStore.user;
  const [searchValue, setSearchValue] = useState('');

  const openLogin = () => {
    authenticationStore.setLoginDialogOpen(true);
  };

  const navigateWithScroll = (path: string) => {
    navigate(path);
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  };

  const buildPathWithParams = (basePath: string, params: Record<string, string | undefined>) => {
    const query = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value && value.trim().length > 0) {
        query.set(key, value);
      }
    });

    const queryString = query.toString();
    return queryString ? `${basePath}?${queryString}` : basePath;
  };

  const handleSearch = (target: 'jobs' | 'contractors') => {
    const query = searchValue.trim();
    const path = target === 'jobs'
      ? buildPathWithParams('/marketplace', { q: query })
      : buildPathWithParams('/izvodjaci', { q: query });

    navigateWithScroll(path);
  };

  const quickActions = useMemo<QuickAction[]>(() => {
    const profilePath = user ? `/profil/${user.id}` : '';

    return [
      {
        label: 'Glavni izvodjaci',
        icon: <BusinessRoundedIcon />,
        onClick: () => navigateWithScroll('/izvodjaci'),
      },
      {
        label: 'Trazim kooperanta',
        icon: <ApartmentRoundedIcon />,
        onClick: () => navigateWithScroll('/izvodjaci?legalType=FIRMA'),
      },
      {
        label: 'Pronadji posao',
        icon: <SearchRoundedIcon />,
        onClick: () => navigateWithScroll('/marketplace'),
      },
      {
        label: 'Projekti u toku',
        icon: <AssignmentTurnedInRoundedIcon />,
        onClick: () => {
          if (!user) {
            openLogin();
            return;
          }

          navigateWithScroll('/dashboard');
        },
      },
      {
        label: user?.role === 'INVESTITOR' ? 'Objavi posao' : 'Moj panel',
        icon: <EngineeringRoundedIcon />,
        onClick: () => {
          if (!user) {
            openLogin();
            return;
          }

          navigateWithScroll(user.role === 'INVESTITOR' ? '/objavi-posao' : '/dashboard');
        },
      },
      {
        label: user ? 'Moj profil' : 'Prijava',
        icon: <PersonRoundedIcon />,
        onClick: () => {
          if (!user) {
            openLogin();
            return;
          }

          navigateWithScroll(profilePath);
        },
      },
    ];
  }, [user]);

  return (
    <Box
      sx={{
        minHeight: '100%',
        bgcolor: 'background.default',
        pb: { xs: 2.5, md: 8 },
        background: `linear-gradient(180deg, ${alpha(theme.palette.primary.light, 0.62)} 0%, ${theme.palette.background.default} 24%, ${theme.palette.background.default} 100%)`,
      }}
    >
      <BaseContainer maxWidth={false} disableGutters withPadding={false}>
        <Box
          sx={{
            width: '100%',
            maxWidth: HOME_CONTENT_WIDTH,
            mx: 'auto',
            px: HOME_CONTENT_PADDING,
            pt: { xs: 1.15, sm: 1.5 },
            minHeight: { xs: 'calc(100svh - 146px)', md: 'auto' },
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Stack spacing={{ xs: 1.45, md: 2.2 }}>
            <Paper
              elevation={0}
              sx={{
                p: 0.35,
                borderRadius: 3,
                bgcolor: 'background.paper',
                border: '1px solid',
                borderColor: alpha(theme.palette.divider, 0.16),
                boxShadow: `0 10px 24px ${alpha(theme.palette.common.black, 0.05)}`,
              }}
            >
              <BaseInput
                placeholder="Pretrazi firme, projekte ili usluge..."
                value={searchValue}
                onChange={(event) => setSearchValue(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault();
                    handleSearch('jobs');
                  }
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2.5,
                    bgcolor: 'transparent',
                    minHeight: { xs: 50, md: 54 },
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'transparent',
                    },
                  },
                  '& .MuiInputBase-input': {
                    py: { xs: 0.88, md: 1 },
                    fontSize: { xs: '0.89rem', md: '0.98rem' },
                  },
                }}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchRoundedIcon sx={{ color: 'text.secondary', ml: 0.35 }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => handleSearch('jobs')}
                          sx={{
                            width: 34,
                            height: 34,
                            bgcolor: 'primary.main',
                            color: 'primary.contrastText',
                            '&:hover': { bgcolor: 'primary.dark' },
                          }}
                        >
                          <ArrowForwardIosRoundedIcon sx={{ fontSize: 12 }} />
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Paper>

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                gap: { xs: 0.85, sm: 1, md: 1.25 },
                width: '100%',
              }}
            >
              {quickActions.map((action) => (
                <Paper
                  key={action.label}
                  elevation={0}
                  onClick={action.onClick}
                  sx={{
                    width: '100%',
                    boxSizing: 'border-box',
                    p: { xs: 0.88, md: 1.02 },
                    aspectRatio: '1 / 1',
                    minHeight: { xs: 90, sm: 96, md: 102 },
                    borderRadius: 1.45,
                    border: '1px solid',
                    borderColor: alpha(theme.palette.divider, 0.14),
                    bgcolor: alpha(theme.palette.background.paper, 0.98),
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    boxShadow: `0 8px 18px ${alpha(theme.palette.common.black, 0.04)}`,
                    transition: 'transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease',
                    '&:hover': {
                      transform: { md: 'translateY(-3px)' },
                      boxShadow: `0 18px 30px ${alpha(theme.palette.common.black, 0.08)}`,
                      borderColor: alpha(theme.palette.primary.main, 0.36),
                    },
                  }}
                >
                  <Stack spacing={0.7} alignItems="center" justifyContent="center">
                    <Box
                      sx={{
                        width: { xs: 34, sm: 36, md: 40 },
                        height: { xs: 34, sm: 36, md: 40 },
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 1.2,
                        bgcolor: alpha(theme.palette.primary.main, 0.12),
                        color: 'primary.main',
                        '& .MuiSvgIcon-root': {
                          fontSize: { xs: 18, md: 20 },
                        },
                      }}
                    >
                      {action.icon}
                    </Box>
                    <Typography
                      sx={{
                        fontWeight: 900,
                        lineHeight: 1.18,
                        minHeight: { xs: 28, sm: 30 },
                        fontSize: { xs: '0.7rem', sm: '0.74rem', md: '0.78rem' },
                        letterSpacing: '-0.01em',
                      }}
                    >
                      {action.label}
                    </Typography>
                  </Stack>
                </Paper>
              ))}
            </Box>

            <Box sx={{ pt: { xs: 0.45, md: 0.6 } }}>
              <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1.1 }}>
                <Typography sx={{ fontWeight: 900, color: 'secondary.main', fontSize: { xs: '1rem', md: '1.12rem' } }}>
                  Specijalizirani izvodjaci
                </Typography>
                <IconButton
                  onClick={() => navigateWithScroll('/izvodjaci')}
                  sx={{
                    width: 28,
                    height: 28,
                    bgcolor: alpha(theme.palette.primary.main, 0.12),
                    color: 'primary.main',
                    '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.18) },
                  }}
                >
                  <ArrowForwardIosRoundedIcon sx={{ fontSize: 11 }} />
                </IconButton>
              </Stack>

              <Box
                sx={{
                  position: 'relative',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    bottom: 0,
                    width: 28,
                    pointerEvents: 'none',
                    background: `linear-gradient(90deg, ${alpha(theme.palette.background.default, 0)} 0%, ${alpha(theme.palette.background.default, 0.96)} 100%)`,
                  },
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    gap: 0.85,
                    overflowX: 'auto',
                    pb: 0.6,
                    pr: { xs: 6, sm: 4 },
                    scrollSnapType: 'x mandatory',
                    scrollbarWidth: 'none',
                    '&::-webkit-scrollbar': {
                      display: 'none',
                    },
                  }}
                >
                  {contractorShortcuts.map((shortcut) => (
                    <Paper
                      key={shortcut.label}
                      elevation={0}
                      onClick={() => navigateWithScroll(`/izvodjaci?category=${encodeURIComponent(shortcut.category)}`)}
                      sx={{
                        flex: { xs: '0 0 calc((100% - 10px) / 3.18)', sm: '0 0 120px' },
                        minWidth: { xs: 'calc((100% - 10px) / 3.18)', sm: 120 },
                        maxWidth: { xs: 'calc((100% - 10px) / 3.18)', sm: 120 },
                        p: { xs: 0.74, sm: 0.86 },
                        minHeight: { xs: 82, sm: 92 },
                        borderRadius: 1.5,
                        border: '1px solid',
                        borderColor: alpha(theme.palette.divider, 0.14),
                        bgcolor: alpha(theme.palette.background.paper, 0.98),
                        backgroundImage: `linear-gradient(180deg, ${alpha(theme.palette.primary.light, 0.14)} 0%, ${theme.palette.background.paper} 100%)`,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center',
                        scrollSnapAlign: 'start',
                        boxShadow: `0 8px 18px ${alpha(theme.palette.common.black, 0.04)}`,
                        transition: 'transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease',
                        '&:hover': {
                          transform: { md: 'translateY(-2px)' },
                          borderColor: alpha(theme.palette.primary.main, 0.36),
                          boxShadow: `0 16px 28px ${alpha(theme.palette.common.black, 0.08)}`,
                        },
                      }}
                    >
                      <Stack spacing={0.82} alignItems="center" justifyContent="center">
                        <Box
                          sx={{
                            width: { xs: 30, sm: 34 },
                            height: { xs: 30, sm: 34 },
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: 1.15,
                            bgcolor: alpha(theme.palette.primary.main, 0.12),
                            color: 'primary.main',
                            '& .MuiSvgIcon-root': {
                              fontSize: { xs: 16, sm: 18 },
                            },
                          }}
                        >
                          {shortcut.icon}
                        </Box>
                        <Typography
                          sx={{
                            fontWeight: 800,
                            fontSize: { xs: '0.66rem', sm: '0.74rem' },
                            lineHeight: 1.15,
                            letterSpacing: '-0.01em',
                          }}
                        >
                          {shortcut.label}
                        </Typography>
                      </Stack>
                    </Paper>
                  ))}
                </Box>

                <Box
                  sx={{
                    position: 'absolute',
                    right: 4,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: 22,
                    height: 22,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: alpha(theme.palette.primary.main, 0.14),
                    color: 'primary.main',
                    pointerEvents: 'none',
                    zIndex: 1,
                  }}
                >
                  <ArrowForwardIosRoundedIcon sx={{ fontSize: 9 }} />
                </Box>
              </Box>
            </Box>
          </Stack>

          {!user && (
            <Box sx={{ mt: 'auto', pt: { xs: 2.3, md: 3 } }}>
              <Paper
                elevation={0}
                sx={{
                  position: 'relative',
                  overflow: 'hidden',
                  p: { xs: 1.35, sm: 1.55 },
                  borderRadius: 2.6,
                  border: '1px solid',
                  borderColor: alpha(theme.palette.primary.main, 0.18),
                  bgcolor: alpha(theme.palette.background.paper, 0.98),
                  backgroundImage: `linear-gradient(165deg, ${alpha(theme.palette.primary.light, 0.42)} 0%, ${alpha(theme.palette.background.paper, 0.98)} 50%, ${theme.palette.background.paper} 100%)`,
                  boxShadow: `0 16px 34px ${alpha(theme.palette.common.black, 0.06)}`,
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: -52,
                    right: -34,
                    width: 132,
                    height: 132,
                    borderRadius: '50%',
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                  },
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: -42,
                    left: -26,
                    width: 104,
                    height: 104,
                    borderRadius: '50%',
                    bgcolor: alpha(theme.palette.secondary.main, 0.05),
                  },
                }}
              >
                <Stack spacing={1.15} sx={{ position: 'relative', zIndex: 1 }}>
                  <Box>
                    <Box
                      sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        px: 1,
                        py: 0.35,
                        borderRadius: 999,
                        bgcolor: alpha(theme.palette.primary.main, 0.14),
                        color: 'primary.main',
                        fontWeight: 800,
                        fontSize: '0.66rem',
                        letterSpacing: '0.02em',
                        textTransform: 'uppercase',
                        mb: 0.8,
                      }}
                    >
                      Novi korisnici
                    </Box>
                    <Typography sx={{ fontWeight: 900, color: 'secondary.main', fontSize: { xs: '1rem', md: '1.08rem' } }}>
                      Otvori profil i kreni raditi u par klikova
                    </Typography>
                    <Typography sx={{ mt: 0.45, color: 'text.secondary', fontSize: { xs: '0.78rem', md: '0.85rem' }, lineHeight: 1.5, maxWidth: 320 }}>
                      Registriraj se kao investitor ili izvodjac i odmah pristupi poslovima, suradnjama i kontaktima.
                    </Typography>
                  </Box>

                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                    <BaseButton
                      variant="contained"
                      color="primary"
                      fullWidth
                      onClick={() => navigateWithScroll('/register?role=INVESTITOR')}
                      sx={{
                        minHeight: 46,
                        borderRadius: 2.1,
                        px: 1.25,
                        fontSize: { xs: '0.76rem', sm: '0.8rem' },
                        fontWeight: 900,
                        lineHeight: 1.2,
                        boxShadow: `0 10px 22px ${alpha(theme.palette.primary.main, 0.22)}`,
                      }}
                    >
                      Registriraj se kao investitor
                    </BaseButton>
                    <BaseButton
                      variant="outlined"
                      color="primary"
                      fullWidth
                      onClick={() => navigateWithScroll('/register?role=IZVODJAC')}
                      sx={{
                        minHeight: 46,
                        borderRadius: 2.1,
                        px: 1.25,
                        fontSize: { xs: '0.76rem', sm: '0.8rem' },
                        fontWeight: 900,
                        lineHeight: 1.2,
                        bgcolor: alpha(theme.palette.background.paper, 0.72),
                        borderWidth: 1.5,
                        '&:hover': {
                          bgcolor: alpha(theme.palette.primary.light, 0.2),
                          borderWidth: 1.5,
                        },
                      }}
                    >
                      Registriraj se kao izvodjac
                    </BaseButton>
                  </Stack>
                </Stack>
              </Paper>
            </Box>
          )}
        </Box>
      </BaseContainer>
    </Box>
  );
});

export default Home;
