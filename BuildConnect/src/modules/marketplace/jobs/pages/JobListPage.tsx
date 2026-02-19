import BaseButton from '@/components/common/atoms/buttons/BaseButton';
import BaseContainer from '@/components/common/atoms/containers/BaseContainer';
import JobCard from '@/components/common/molecules/cards/JobCard';
import { useRootStore } from '@/hooks/useRootStore';
import ConstructionIcon from '@mui/icons-material/Construction';
import FilterListIcon from '@mui/icons-material/FilterList';
import SearchIcon from '@mui/icons-material/Search';
import {
    Box,
    Fade,
    Grid,
    InputAdornment,
    Paper,
    TextField,
    Typography,
    alpha,
    useTheme
} from '@mui/material';
import { observer } from 'mobx-react-lite';
import React, { useMemo, useState } from 'react';

const JobListPage: React.FC = observer(() => {
  const { jobStore } = useRootStore();
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredJobs = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return jobStore.allJobs;

    return jobStore.allJobs.filter(job => 
      job.title.toLowerCase().includes(query) ||
      job.description.toLowerCase().includes(query) ||
      job.location.toLowerCase().includes(query) ||
      job.category.toLowerCase().includes(query)
    );
  }, [searchQuery, jobStore.allJobs]);

  return (
    <Box sx={{ pb: 8, mt: -4 }}> {/* mt: -4 poništava layout padding za hero efekt */}
      {/* Hero Section */}
      <Box sx={{ 
        bgcolor: 'primary.main', 
        color: 'primary.contrastText', 
        pt: 8, 
        pb: 12, 
        mb: 6,
        borderRadius: '0 0 60px 60px',
        boxShadow: `0 20px 40px ${alpha(theme.palette.primary.main, 0.2)}`,
        position: 'relative',
        zIndex: 1
      }}>
        <BaseContainer maxWidth="lg" withPadding={false}>
          <Grid container spacing={4} alignItems="center">
            <Grid size={{ xs: 12, md: 8 }}>
              <Typography 
                variant="h2" 
                sx={{ 
                  fontWeight: 900, 
                  mb: 2, 
                  letterSpacing: '-1.5px',
                  fontSize: { xs: '2.5rem', md: '3.75rem' } 
                }}
              >
                Pronađite sljedeći projekt
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9, mb: 5, fontWeight: 500, maxWidth: '90%' }}>
                Najveća baza građevinskih oglasa. Povežite se s investitorima direktno i bez posrednika.
              </Typography>
              
              <Paper 
                elevation={0}
                sx={{ 
                  p: 1, 
                  borderRadius: 4, 
                  display: 'flex', 
                  alignItems: 'center',
                  gap: 1, 
                  maxWidth: 650, 
                  bgcolor: 'background.paper',
                  boxShadow: '0 15px 35px rgba(0,0,0,0.1)'
                }}
              >
                <TextField 
                  fullWidth 
                  placeholder="Pretražite po zanimanju, gradu ili usluzi..." 
                  variant="outlined"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  sx={{ 
                    '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                    '& .MuiInputBase-input': { fontWeight: 500 }
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: 'primary.main', ml: 1 }} />
                      </InputAdornment>
                    ),
                  }}
                />
                <BaseButton 
                  variant="contained" 
                  color="secondary" 
                  size="large" 
                  sx={{ 
                    px: 4, 
                    borderRadius: 3,
                    height: 54,
                    display: { xs: 'none', sm: 'inline-flex' } 
                  }}
                >
                  Pretraži
                </BaseButton>
              </Paper>
            </Grid>
          </Grid>
        </BaseContainer>
      </Box>

      {/* Main Content */}
      <BaseContainer maxWidth="lg" withPadding={false}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 6 
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box 
              sx={{ 
                bgcolor: 'secondary.main', 
                width: 8, 
                height: 32, 
                borderRadius: 1 
              }} 
            />
            <Typography variant="h4" sx={{ fontWeight: 900, color: 'secondary.main' }}>
              Dostupni poslovi
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FilterListIcon fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 700 }}>
              Rezultati: {filteredJobs.length}
            </Typography>
          </Box>
        </Box>

        {filteredJobs.length === 0 ? (
          <Fade in timeout={500}>
            <Paper sx={{ 
              p: 12, 
              textAlign: 'center', 
              borderRadius: 6, 
              bgcolor: 'background.paper',
              border: '2px dashed',
              borderColor: alpha(theme.palette.divider, 0.5),
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}>
              <Box 
                sx={{ 
                  bgcolor: alpha(theme.palette.primary.main, 0.1), 
                  p: 3, 
                  borderRadius: '50%', 
                  mb: 3 
                }}
              >
                <ConstructionIcon sx={{ fontSize: 60, color: 'primary.main' }} />
              </Box>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 900 }}>
                Nismo pronašli ono što tražite
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 400 }}>
                Pokušajte s drugim ključnim riječima ili očistite filtre.
              </Typography>
              <BaseButton 
                variant="outlined" 
                color="primary"
                onClick={() => setSearchQuery('')}
              >
                Očisti pretragu
              </BaseButton>
            </Paper>
          </Fade>
        ) : (
          <Grid container spacing={4}>
            {filteredJobs.map((job, index) => (
              <Grid key={job.id} size={{ xs: 12, sm: 6, md: 4 }}>
                <Fade in timeout={(index % 6) * 100}>
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