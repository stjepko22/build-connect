import React, { useState, useMemo } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Box,
  Fade,
  Grid, // MUI v7 koristi Grid2
  InputAdornment,
  Paper,
  TextField,
  Typography,
  alpha,
  useTheme,
  useMediaQuery
} from '@mui/material';
import debounce from 'lodash/debounce';
import ConstructionIcon from '@mui/icons-material/Construction';
import FilterListIcon from '@mui/icons-material/FilterList';
import SearchIcon from '@mui/icons-material/Search';

import BaseButton from '@/core/components/atoms/buttons/BaseButton';
import BaseContainer from '@/core/components/atoms/containers/BaseContainer';
import JobCard from '@/core/components/molecules/cards/JobCard';
import { useRootStore } from '@/core/hooks/useRootStore';

const JobListPage: React.FC = observer(() => {
  const { jobStore } = useRootStore();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Lokalni state za trenutni input (brza promjena na ekranu)
  const [inputValue, setInputValue] = useState('');
  // State koji zapravo filtrira listu (debounced)
  const [searchQuery, setSearchQuery] = useState('');

  // Debounce funkcija - čeka 300ms nakon zadnjeg typing-a
  const debouncedSearch = useMemo(
    () => debounce((val: string) => setSearchQuery(val), 300),
    []
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);
    debouncedSearch(val);
  };

  const filteredJobs = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return jobStore.allJobs;
    
    return jobStore.allJobs.filter(
      (job) =>
        job.title.toLowerCase().includes(query) ||
        job.description.toLowerCase().includes(query) ||
        job.location.toLowerCase().includes(query) ||
        job.category.toLowerCase().includes(query)
    );
  }, [searchQuery, jobStore.allJobs]);

  return (
    <Box sx={{ pb: 12 }}>
      {/* Hero Section - Responzivna prilagodba */}
      <Box sx={{ 
        bgcolor: 'primary.main', 
        color: 'primary.contrastText', 
        pt: { xs: 4, md: 8 }, 
        pb: { xs: 6, md: 12 }, 
        mb: { xs: 4, md: 6 },
        borderRadius: { xs: '0 0 30px 30px', md: '0 0 60px 60px' },
        boxShadow: `0 20px 40px ${alpha(theme.palette.primary.main, 0.15)}`,
        position: 'relative',
        zIndex: 1,
        mx: { xs: -2, sm: 0 } // Proteže se do rubova na mobitelu
      }}>
        <BaseContainer maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid size={{ xs: 12, md: 8 }}>
              <Typography 
                variant="h2" 
                sx={{ 
                  fontWeight: 900, 
                  mb: 2, 
                  letterSpacing: '-0.03em',
                  fontSize: { xs: '2rem', sm: '2.5rem', md: '3.75rem' },
                  textAlign: { xs: 'center', md: 'left' }
                }}
              >
                Pronađite sljedeći projekt
              </Typography>
              <Typography 
                variant="h6" 
                sx={{ 
                  opacity: 0.8, 
                  mb: 4, 
                  fontWeight: 400, 
                  maxWidth: { xs: '100%', md: '90%' },
                  textAlign: { xs: 'center', md: 'left' },
                  fontSize: { xs: '1rem', md: '1.25rem' }
                }}
              >
                Povežite se s investitorima direktno i bez posrednika.
              </Typography>
              
              <Paper 
                elevation={0}
                sx={{ 
                  p: 0.5, 
                  borderRadius: 3, 
                  display: 'flex', 
                  alignItems: 'center',
                  gap: 0.5, 
                  maxWidth: 650, 
                  bgcolor: 'background.paper',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                  mx: { xs: 'auto', md: '0' }
                }}
              >
                <TextField 
                  fullWidth 
                  placeholder={isMobile ? "Pretraži..." : "Pretražite po zanimanju, gradu..."} 
                  variant="outlined"
                  value={inputValue}
                  onChange={handleSearchChange}
                  sx={{ 
                    '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                    '& .MuiInputBase-input': { fontWeight: 500, py: 1.5 }
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: 'primary.main', ml: 1 }} />
                      </InputAdornment>
                    ),
                  }}
                />
                {!isMobile && (
                  <BaseButton 
                    variant="contained" 
                    color="secondary" 
                    sx={{ px: 4, borderRadius: 2.5, height: 48 }}
                  >
                    Pretraži
                  </BaseButton>
                )}
              </Paper>
            </Grid>
          </Grid>
        </BaseContainer>
      </Box>

      {/* Main Content */}
      <BaseContainer maxWidth="lg">
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 4 
        }}>
          <Typography variant="h5" sx={{ fontWeight: 900, color: 'primary.main', display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ width: 6, height: 24, bgcolor: 'secondary.main', borderRadius: 1 }} />
            Dostupni poslovi
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FilterListIcon fontSize="small" sx={{ color: 'text.disabled' }} />
            <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.secondary' }}>
              {filteredJobs.length} oglasa
            </Typography>
          </Box>
        </Box>

        {filteredJobs.length === 0 ? (
          <Fade in>
            <Paper sx={{ 
              p: { xs: 6, md: 10 }, 
              textAlign: 'center', 
              borderRadius: 5, 
              border: '2px dashed',
              borderColor: 'divider',
              bgcolor: alpha(theme.palette.background.paper, 0.5)
            }}>
              <ConstructionIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
              <Typography variant="h6" sx={{ fontWeight: 700 }}>Nema rezultata</Typography>
              <BaseButton 
                variant="text" 
                onClick={() => { setInputValue(''); setSearchQuery(''); }}
                sx={{ mt: 1 }}
              >
                Prikaži sve poslove
              </BaseButton>
            </Paper>
          </Fade>
        ) : (
          <Grid container spacing={{ xs: 2, md: 3 }}>
            {filteredJobs.map((job, index) => (
              <Grid key={job.id} size={{ xs: 12, sm: 6, md: 4 }}>
                <Fade in timeout={index * 50}>
                  <Box sx={{ height: '100%' }}>
                    <JobCard job={job} />
                  </Box>
                </Fade>
              </Grid>
            ))}
          </Grid>
        )}
      </BaseContainer>
    </Box>
  );
});

export default JobListPage;
