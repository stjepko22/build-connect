import React from 'react';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { 
  Badge, 
  Box, 
  Card, 
  CardContent, 
  Chip, 
  Divider, 
  Stack,
  Typography, 
  alpha, 
  useTheme 
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import LocationOnIcon from '@mui/icons-material/LocationOn';

import BaseButton from '@/core/components/atoms/buttons/BaseButton';
import { useRootStore } from '@/core/hooks/useRootStore';
import { IJob } from '@/modules/marketplace/jobs/models/IJob';

interface JobCardProps {
  job: IJob;
}

const JobCard: React.FC<JobCardProps> = observer(({ job }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { bidStore, authenticationStore } = useRootStore();
  
  const bidsCount = bidStore.getBidsByJobId(job.id).length;
  const isOwner = authenticationStore.user?.id === job.investitorId;

  return (
    <Card 
      onClick={() => navigate(`/marketplace/${job.id}`)}
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column', 
        borderRadius: 4,
        border: '1px solid',
        borderColor: alpha(theme.palette.divider, 0.1),
        bgcolor: 'background.paper',
        cursor: 'pointer',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        '&:hover': {
          transform: { md: 'translateY(-4px)' }, // Bez transformacije na mobitelu radi boljeg UX-a
          boxShadow: theme.shadows[4],
          borderColor: alpha(theme.palette.primary.main, 0.3),
        }
      }}
    >
      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Chip 
            label={job.category} 
            size="small" 
            sx={{ 
              fontWeight: 800, 
              borderRadius: 1.5, 
              bgcolor: alpha(theme.palette.primary.main, 0.05),
              color: 'primary.main',
              fontSize: '0.7rem'
            }} 
          />
          <Stack direction="row" spacing={0.5} alignItems="center" sx={{ color: 'text.disabled' }}>
            <AccessTimeIcon sx={{ fontSize: 14 }} />
            <Typography variant="caption" sx={{ fontWeight: 600 }}>
              {new Date(job.createdAt).toLocaleDateString('hr-HR')}
            </Typography>
          </Stack>
        </Box>

        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 800, 
            mb: 1, 
            lineHeight: 1.3, 
            color: 'primary.main',
            // Ograničavanje na 2 reda
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            minHeight: '3.1rem'
          }}
        >
          {job.title}
        </Typography>

        <Typography 
          variant="body2" 
          color="text.secondary" 
          sx={{ 
            mb: 2,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            fontSize: '0.875rem'
          }}
        >
          {job.description}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 2 }}>
          <LocationOnIcon sx={{ fontSize: 16, color: 'secondary.main' }} />
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {job.location}
          </Typography>
        </Box>

        <Divider sx={{ mb: 2, opacity: 0.5 }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <Box>
            <Typography variant="caption" sx={{ display: 'block', color: 'text.disabled', fontWeight: 800 }}>
              BUDŽET
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 900, color: 'success.dark', lineHeight: 1 }}>
              {job.budget ? `${job.budget.toLocaleString()}€` : 'Po dogovoru'}
            </Typography>
          </Box>

          {isOwner && (
            <Badge badgeContent={bidsCount} color="error" sx={{ mr: 1 }}>
              <ChatBubbleOutlineIcon color="action" />
            </Badge>
          )}
        </Box>
      </CardContent>
      
      <Box sx={{ p: 2, pt: 0 }}>
        <BaseButton 
          fullWidth 
          color="primary"
          sx={{ borderRadius: 2, fontWeight: 700 }}
        >
          Pogledaj detalje
        </BaseButton>
      </Box>
    </Card>
  );
});

export default JobCard;



