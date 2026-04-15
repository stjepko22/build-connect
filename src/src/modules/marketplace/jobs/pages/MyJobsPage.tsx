import React, { useEffect } from 'react';
import {
  Box,
  Grid,
  Alert,
  Tabs,
  Tab,
  useTheme,
  Stack,
} from '@mui/material';
import { observer } from 'mobx-react-lite';
import JobCard from '@/core/components/molecules/cards/JobCard';
import BaseContainer from '@/core/components/atoms/containers/BaseContainer';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import { useRootStore } from '@/core/hooks/useRootStore';
import BaseButton from '@/core/components/atoms/buttons/BaseButton';
import { useNavigate } from 'react-router-dom';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 4 }}>{children}</Box>}
    </div>
  );
}

const MyJobsPage: React.FC = observer(() => {
  const { jobStore, bidStore, authenticationStore, reviewStore } = useRootStore();
  const theme = useTheme();
  const navigate = useNavigate();
  const user = authenticationStore.user;

  useEffect(() => {
    void jobStore.loadJobs();
    if (user?.role === 'IZVODJAC') {
      void bidStore.loadBids(undefined, user.id);
      void reviewStore.loadReviews(undefined, user.id);
      return;
    }

    if (user?.role === 'INVESTITOR') {
      void bidStore.loadBids();
      void reviewStore.loadReviews();
    }
  }, [bidStore, jobStore, reviewStore, user]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    jobStore.setMyJobsTabValue(newValue);
  };

  if (!user) {
    return (
      <BaseContainer maxWidth="lg">
        <Box sx={{ pt: 1 }}>
          <Alert severity="warning" variant="filled" sx={{ borderRadius: 3, fontWeight: 700 }}>
            Morate biti prijavljeni da biste vidjeli svoje poslove.
          </Alert>
        </Box>
      </BaseContainer>
    );
  }

  const myPublishedJobs = jobStore.jobs.filter((job) => job.investitorId === user.id);
  const activeJobs = myPublishedJobs.filter((job) => !reviewStore.getReviewByJobId(job.id));
  const completedJobs = myPublishedJobs.filter((job) => reviewStore.getReviewByJobId(job.id));

  const myBids = bidStore.bids.filter((bid) => bid.contractorId === user.id);
  const jobsIAppliedTo = jobStore.jobs.filter((job) => myBids.some((bid) => bid.jobId === job.id && bid.status === 'PENDING'));
  const jobsIWon = jobStore.jobs.filter((job) => myBids.some((bid) => bid.jobId === job.id && bid.status === 'ACCEPTED'));

  return (
    <BaseContainer maxWidth="lg">
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={jobStore.myJobsTabValue}
            onChange={handleTabChange}
            textColor="primary"
            indicatorColor="primary"
            variant="fullWidth"
            sx={{
              '& .MuiTab-root': {
                fontWeight: 800,
                fontSize: { xs: '0.85rem', sm: '1rem' },
                textTransform: 'none',
                minHeight: 64,
                minWidth: 0,
              },
            }}
          >
            {user.role === 'INVESTITOR'
              ? [
                  <Tab key={0} icon={<HourglassEmptyIcon />} iconPosition="start" label={`Aktivni oglasi (${activeJobs.length})`} />,
                  <Tab key={1} icon={<CheckCircleIcon />} iconPosition="start" label={`Zavrseni projekti (${completedJobs.length})`} />,
                ]
              : [
                  <Tab key={0} icon={<AssignmentIcon />} iconPosition="start" label={`Moje ponude (${jobsIAppliedTo.length})`} />,
                  <Tab key={1} icon={<CheckCircleIcon />} iconPosition="start" label={`Prihvaceni poslovi (${jobsIWon.length})`} />,
                ]}
          </Tabs>
        </Box>

        {user.role === 'INVESTITOR' && (
          <>
            <CustomTabPanel value={jobStore.myJobsTabValue} index={0}>
              {activeJobs.length === 0 ? (
                <Alert severity="info" variant="outlined" sx={{ borderRadius: 4, py: 3 }}>
                  Trenutno nemate aktivnih oglasa koji cekaju majstore.
                </Alert>
              ) : (
                  <Grid container spacing={4}>
                    {activeJobs.map((job) => (
                      <Grid key={job.id} size={{ xs: 12, sm: 6, md: 4 }}>
                        <Stack spacing={1.5}>
                          <JobCard job={job} />
                          <BaseButton
                            variant="outlined"
                            color="secondary"
                            onClick={() => navigate(`/posao/${job.id}/uredi`)}
                            sx={{ fontWeight: 800 }}
                          >
                            Uredi oglas
                          </BaseButton>
                        </Stack>
                      </Grid>
                    ))}
                  </Grid>
              )}
            </CustomTabPanel>

            <CustomTabPanel value={jobStore.myJobsTabValue} index={1}>
              {completedJobs.length === 0 ? (
                <Alert severity="info" variant="outlined" sx={{ borderRadius: 4, py: 3 }}>
                  Nema zavrsenih projekata u vasoj arhivi.
                </Alert>
              ) : (
                <Grid container spacing={4}>
                  {completedJobs.map((job) => (
                    <Grid key={job.id} size={{ xs: 12, sm: 6, md: 4 }}>
                      <Box sx={{ opacity: 0.82, filter: 'grayscale(0.5)' }}>
                        <JobCard job={job} />
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              )}
            </CustomTabPanel>
          </>
        )}

        {user.role === 'IZVODJAC' && (
          <>
            <CustomTabPanel value={jobStore.myJobsTabValue} index={0}>
              {jobsIAppliedTo.length === 0 ? (
                <Alert severity="info" variant="outlined" sx={{ borderRadius: 4, py: 3 }}>
                  Niste poslali nijednu ponudu koja je trenutno u statusu cekanja.
                </Alert>
              ) : (
                <Grid container spacing={4}>
                  {jobsIAppliedTo.map((job) => (
                    <Grid key={job.id} size={{ xs: 12, sm: 6, md: 4 }}>
                      <JobCard job={job} />
                    </Grid>
                  ))}
                </Grid>
              )}
            </CustomTabPanel>

            <CustomTabPanel value={jobStore.myJobsTabValue} index={1}>
              {jobsIWon.length === 0 ? (
                <Alert severity="info" variant="outlined" sx={{ borderRadius: 4, py: 3 }}>
                  Jos uvijek nemate prihvacenih ponuda. Nastavite se prijavljivati.
                </Alert>
              ) : (
                <Grid container spacing={4}>
                  {jobsIWon.map((job) => (
                    <Grid key={job.id} size={{ xs: 12, sm: 6, md: 4 }}>
                      <Box sx={{ position: 'relative' }}>
                        <Box
                          sx={{
                            position: 'absolute',
                            top: 10,
                            right: 10,
                            zIndex: 2,
                            bgcolor: 'success.main',
                            color: 'common.white',
                            px: 1.5,
                            py: 0.5,
                            borderRadius: 2,
                            fontSize: '0.75rem',
                            fontWeight: 900,
                            boxShadow: theme.shadows[4],
                          }}
                        >
                          DOBIVEN POSAO
                        </Box>
                        <JobCard job={job} />
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              )}
            </CustomTabPanel>
          </>
        )}
      </Box>
    </BaseContainer>
  );
});

export default MyJobsPage;
