import React from 'react';
import { Card, CardContent, Typography, Button, Box, Chip, Divider } from '@mui/material';
import { Job } from '../stores/JobStore';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PaymentsIcon from '@mui/icons-material/Payments';

interface JobCardProps {
  job: Job;
}

const JobCard: React.FC<JobCardProps> = ({ job }) => {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Chip 
            label={job.category} 
            size="small" 
            color="primary" 
            sx={{ fontWeight: 600, borderRadius: 1 }} 
          />
          <Typography variant="caption" color="text.secondary">
            Objavljeno: {new Date(job.createdAt).toLocaleDateString('hr-HR')}
          </Typography>
        </Box>

        <Typography variant="h5" component="div" gutterBottom sx={{ fontWeight: 700 }}>
          {job.title}
        </Typography>

        <Typography 
          variant="body2" 
          color="text.secondary" 
          sx={{ 
            mb: 3, 
            display: '-webkit-box', 
            WebkitLineClamp: 3, 
            WebkitBoxOrient: 'vertical', 
            overflow: 'hidden' 
          }}
        >
          {job.description}
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LocationOnIcon fontSize="small" color="action" />
            <Typography variant="body2">{job.location}</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PaymentsIcon fontSize="small" color="action" />
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {job.budget ? `${job.budget} EUR` : 'Dogovor'}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CalendarMonthIcon fontSize="small" color="action" />
            <Typography variant="body2">Rok: {job.deadline}</Typography>
          </Box>
        </Box>
      </CardContent>
      
      <Box sx={{ p: 2, pt: 0 }}>
        <Button fullWidth variant="contained" color="secondary">
          Pogledaj detalje
        </Button>
      </Box>
    </Card>
  );
};

export default JobCard;