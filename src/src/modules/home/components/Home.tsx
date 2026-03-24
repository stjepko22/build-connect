import React, { useMemo, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
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
import BaseButton from '@/core/components/atoms/buttons/BaseButton';
import BaseContainer from '@/core/components/atoms/containers/BaseContainer';
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

const HOME_PRIMARY_WIDTH = { xs: 320, sm: 390, md: 450 };

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
        mx: { xs: -2, sm: 0 },
        mt: { xs: -2, sm: 0 },
        pb: { xs: 12, md: 8 },
        background: `linear-gradient(180deg, ${alpha(theme.palette.primary.light, 0.7)} 0%, ${theme.palette.background.default} 28%)`,
      }}
    >
      <BaseContainer maxWidth="md" sx={{ pt: { xs: 0.75, md: 1.5 } }}>
        <Stack spacing={{ xs: 3, md: 4 }} alignItems="center">
          <Box
            sx={{
              pt: 0,
              width: '100%',
              maxWidth: HOME_PRIMARY_WIDTH,
              mx: 'auto',
            }}
          >
            <Stack spacing={2}>
              <Paper
                elevation={0}
                sx={{
                  p: 0.35,
                  borderRadius: 4,
                  bgcolor: 'background.paper',
                  border: '1px solid',
                  borderColor: alpha(theme.palette.divider, 0.14),
                  boxShadow: `0 10px 24px ${alpha(theme.palette.common.black, 0.06)}`,
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
                      borderRadius: 3,
                      bgcolor: 'transparent',
                      minHeight: { xs: 54, md: 58 },
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'transparent',
                      },
                    },
                    '& .MuiInputBase-input': {
                      py: { xs: 1.05, md: 1.2 },
                      fontSize: { xs: '0.95rem', md: '1rem' },
                    },
                  }}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchRoundedIcon sx={{ color: 'text.secondary', ml: 0.5 }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => handleSearch('jobs')}
                            sx={{
                              width: 38,
                              height: 38,
                              bgcolor: 'primary.main',
                              color: 'primary.contrastText',
                              '&:hover': { bgcolor: 'primary.dark' },
                            }}
                          >
                            <ArrowForwardIosRoundedIcon sx={{ fontSize: 14 }} />
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              </Paper>
            </Stack>
          </Box>

          <Box>
            <Grid
              container
              spacing={{ xs: 1.2, md: 1.8 }}
              sx={{
                width: '100%',
                maxWidth: HOME_PRIMARY_WIDTH,
                mx: 'auto',
                justifyContent: 'center',
              }}
            >
              {quickActions.map((action) => (
                <Grid key={action.label} size={{ xs: 4, md: 4 }}>
                  <Paper
                    elevation={0}
                    onClick={action.onClick}
                    sx={{
                      p: { xs: 1, md: 1.3 },
                      aspectRatio: '1 / 1',
                      minHeight: { xs: 92, md: 110 },
                      borderRadius: 2.5,
                      border: '1px solid',
                      borderColor: alpha(theme.palette.divider, 0.12),
                      bgcolor: 'background.paper',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease',
                      '&:hover': {
                        transform: { md: 'translateY(-3px)' },
                        boxShadow: `0 18px 32px ${alpha(theme.palette.common.black, 0.08)}`,
                        borderColor: alpha(theme.palette.primary.main, 0.4),
                      },
                    }}
                  >
                    <Stack spacing={0.9} alignItems="center" justifyContent="center" textAlign="center">
                      <Box
                        sx={{
                          width: { xs: 40, md: 46 },
                          height: { xs: 40, md: 46 },
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: 2,
                          bgcolor: alpha(theme.palette.primary.main, 0.12),
                          color: 'primary.main',
                          '& .MuiSvgIcon-root': {
                            fontSize: { xs: 22, md: 24 },
                          },
                        }}
                      >
                        {action.icon}
                      </Box>
                      <Typography
                        sx={{
                          fontWeight: 900,
                          lineHeight: 1.2,
                          minHeight: { xs: 30, md: 34 },
                          fontSize: { xs: '0.74rem', md: '0.84rem' },
                        }}
                      >
                        {action.label}
                      </Typography>
                    </Stack>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>

          <Paper
            elevation={0}
            sx={{
              width: '100%',
              maxWidth: { xs: 360, sm: 500, md: 640 },
              p: { xs: 2.5, md: 3 },
              borderRadius: 5,
              border: '1px solid',
              borderColor: alpha(theme.palette.divider, 0.12),
              bgcolor: 'background.paper',
            }}
          >
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              sx={{ mb: 2.5 }}
            >
              <Box>
                <Typography sx={{ fontWeight: 900, color: 'secondary.main', fontSize: { xs: '1.35rem', md: '1.6rem' } }}>
                  Specijalizirani izvodjaci
                </Typography>
                <Typography sx={{ color: 'text.secondary', mt: 0.5 }}>
                  Jednim klikom otvori filtrirani direktorij za trazenu uslugu.
                </Typography>
              </Box>
              <IconButton
                onClick={() => navigateWithScroll('/izvodjaci')}
                sx={{
                  width: 42,
                  height: 42,
                  bgcolor: alpha(theme.palette.primary.main, 0.12),
                  color: 'primary.main',
                  '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.18) },
                }}
              >
                <ArrowForwardIosRoundedIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Stack>

            <Grid container spacing={{ xs: 1.5, md: 2 }}>
              {contractorShortcuts.map((shortcut) => (
                <Grid key={shortcut.label} size={{ xs: 6, sm: 4, md: 2 }}>
                  <Paper
                    elevation={0}
                    onClick={() => navigateWithScroll(`/izvodjaci?category=${encodeURIComponent(shortcut.category)}`)}
                    sx={{
                      p: 2,
                      borderRadius: 3.5,
                      border: '1px solid',
                      borderColor: alpha(theme.palette.divider, 0.12),
                      bgcolor: alpha(theme.palette.primary.light, 0.22),
                      cursor: 'pointer',
                      textAlign: 'center',
                      transition: 'all 0.18s ease',
                      '&:hover': {
                        borderColor: alpha(theme.palette.primary.main, 0.38),
                        bgcolor: alpha(theme.palette.primary.light, 0.36),
                      },
                    }}
                  >
                    <Stack spacing={1} alignItems="center">
                      <Box
                        sx={{
                          width: 44,
                          height: 44,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: '50%',
                          bgcolor: 'background.paper',
                          color: 'primary.main',
                        }}
                      >
                        {shortcut.icon}
                      </Box>
                      <Typography sx={{ fontWeight: 800, fontSize: '0.92rem' }}>{shortcut.label}</Typography>
                    </Stack>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Paper>

        </Stack>
      </BaseContainer>
    </Box>
  );
});

export default Home;
