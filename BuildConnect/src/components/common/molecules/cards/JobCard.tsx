import { Job } from '@/modules/marketplace/jobs/stores/JobStore';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { Badge, Box, Card, CardContent, Chip, Divider, Typography, alpha, useTheme } from '@mui/material';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useNavigate } from 'react-router-dom';

// Atomi
import BaseButton from '@/components/common/atoms/buttons/BaseButton';
import { useRootStore } from '@/hooks/useRootStore';

interface JobCardProps {
  job: Job;
}

const JobCard: React.FC<JobCardProps> = observer(({ job }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { bidStore, authenticationStore } = useRootStore();
  
  const bidsCount = bidStore.getBidsByJobId(job.id).length;
  const isOwner = authenticationStore.user?.id === job.investitorId;

  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column', 
        borderRadius: 6, // Još malo zaobljenije za moderniji look
        border: '1px solid',
        borderColor: alpha(theme.palette.divider, 0.08),
        bgcolor: 'background.paper',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
        overflow: 'visible',
        boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
        '&:hover': {
          transform: 'translateY(-10px)',
          borderColor: 'primary.main',
          boxShadow: `0 20px 40px ${alpha(theme.palette.primary.main, 0.08)}`,
          '& .job-card-icon': {
            transform: 'scale(1.2)',
            color: 'primary.main'
          }
        }
      }}
    >
      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
          <Chip 
            label={job.category} 
            size="small" 
            sx={{ 
              fontWeight: 800, 
              borderRadius: 2, 
              bgcolor: alpha(theme.palette.primary.main, 0.08),
              color: 'primary.main',
              fontSize: '0.65rem',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              border: 'none'
            }} 
          />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.disabled' }}>
            <AccessTimeIcon sx={{ fontSize: 14 }} />
            <Typography variant="caption" sx={{ fontWeight: 600 }}>
              {new Date(job.createdAt).toLocaleDateString('hr-HR')}
            </Typography>
          </Box>
        </Box>

        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 900, 
            mb: 1.5, 
            lineHeight: 1.3, 
            minHeight: '3.4rem', 
            color: 'secondary.main',
            display: '-webkit-box', 
            WebkitLineClamp: 2, 
            WebkitBoxOrient: 'vertical', 
            overflow: 'hidden'
          }}
        >
          {job.title}
        </Typography>

        <Typography 
          variant="body2" 
          color="text.secondary" 
          sx={{ 
            mb: 3, 
            display: '-webkit-box', 
            WebkitLineClamp: 2, 
            WebkitBoxOrient: 'vertical', 
            overflow: 'hidden',
            lineHeight: 1.6,
            fontSize: '0.925rem'
          }}
        >
          {job.description}
        </Typography>

        <Divider sx={{ mb: 2.5, opacity: 0.6 }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LocationOnIcon 
              className="job-card-icon" 
              sx={{ 
                fontSize: 18, 
                color: 'text.disabled', 
                transition: '0.3s ease' 
              }} 
            />
            <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary' }}>
              {job.location}
            </Typography>
          </Box>
          
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="caption" sx={{ display: 'block', color: 'text.disabled', fontWeight: 700, lineHeight: 1 }}>
              BUDŽET
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 900, color: 'success.dark' }}>
              {job.budget ? `${job.budget.toLocaleString()}€` : 'Dogovor'}
            </Typography>
          </Box>
        </Box>
      </CardContent>
      
      <Box sx={{ p: 2, pt: 0, display: 'flex', gap: 1.5 }}>
        <BaseButton 
          fullWidth 
          variant="contained" 
          size="medium"
          onClick={() => navigate(`/marketplace/${job.id}`)}
          sx={{ 
            borderRadius: 3,
            py: 1.2,
            boxShadow: 'none',
            '&:hover': { boxShadow: 'none' }
          }}
        >
          Detalji
        </BaseButton>
        
        {isOwner && (
          <Badge 
            badgeContent={bidsCount} 
            color="error" 
            sx={{ 
              '& .MuiBadge-badge': { 
                fontWeight: 900,
                top: 4,
                right: 4,
                border: `2px solid ${theme.palette.background.paper}` 
              } 
            }}
          >
            <BaseButton 
              variant="outlined" 
              color="secondary"
              onClick={() => navigate(`/marketplace/${job.id}`)}
              sx={{ 
                minWidth: 50, 
                p: 0, 
                borderRadius: 3,
                borderColor: alpha(theme.palette.divider, 0.2) 
              }}
            >
              <ChatBubbleOutlineIcon fontSize="small" />
            </BaseButton>
          </Badge>
        )}
      </Box>
    </Card>
  );
});

export default JobCard;