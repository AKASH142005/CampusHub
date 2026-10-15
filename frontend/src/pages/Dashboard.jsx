import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Stack,
  useTheme,
  Skeleton,
  IconButton
} from '@mui/material';
import {
  PeopleAltOutlined as UsersIcon,
  CampaignOutlined as NoticeIcon,
  EventOutlined as EventIcon,
  StorefrontOutlined as MarketIcon,
  ArrowForward as ArrowIcon,
  FiberManualRecord as DotIcon,
  AccessTime as TimeIcon,
  LocationOnOutlined as LocationIcon,
  CheckCircleOutline as CheckIcon
} from '@mui/icons-material';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { statsAPI, noticesAPI, eventsAPI } from '../services/api';

export default function Dashboard() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { onOpenAuthModal } = useOutletContext();

  const [stats, setStats] = useState(null);
  const [notices, setNotices] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsData, noticesData, eventsData] = await Promise.all([
          statsAPI.getOverview().catch(() => ({
            totalUsers: 3,
            totalEvents: 3,
            totalNotices: 4,
            activeListings: 3,
            dbEngine: 'MySQL/Memory'
          })),
          noticesAPI.getAll().catch(() => []),
          eventsAPI.getAll().catch(() => [])
        ]);

        setStats(statsData);
        setNotices(noticesData.slice(0, 3));
        setEvents(eventsData.slice(0, 2));
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const statCards = [
    {
      title: 'Campus Members',
      value: stats?.totalUsers ?? '3+',
      icon: <UsersIcon sx={{ fontSize: 28, color: '#6366f1' }} />,
      color: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(99, 102, 241, 0.05) 100%)',
      link: '/profile'
    },
    {
      title: 'Active Notices',
      value: stats?.totalNotices ?? '4',
      icon: <NoticeIcon sx={{ fontSize: 28, color: '#f59e0b' }} />,
      color: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(245, 158, 11, 0.05) 100%)',
      link: '/notices'
    },
    {
      title: 'Upcoming Events',
      value: stats?.totalEvents ?? '3',
      icon: <EventIcon sx={{ fontSize: 28, color: '#06b6d4' }} />,
      color: 'linear-gradient(135deg, rgba(6, 182, 212, 0.15) 0%, rgba(6, 182, 212, 0.05) 100%)',
      link: '/events'
    },
    {
      title: 'Marketplace Deals',
      value: stats?.activeListings ?? '3',
      icon: <MarketIcon sx={{ fontSize: 28, color: '#10b981' }} />,
      color: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(16, 185, 129, 0.05) 100%)',
      link: '/marketplace'
    }
  ];

  return (
    <Box sx={{ maxWidth: 1400, mx: 'auto', width: '100%' }}>
      {/* Hero Welcome Banner */}
      <Card
        sx={{
          mb: 4,
          borderRadius: 4,
          background: theme.palette.mode === 'dark'
            ? 'linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%)'
            : 'linear-gradient(135deg, #4338ca 0%, #312e81 100%)',
          color: '#ffffff',
          position: 'relative',
          overflow: 'hidden',
          border: 'none',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)'
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            right: -60,
            bottom: -60,
            width: 260,
            height: 260,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(99, 102, 241, 0.3) 0%, transparent 70%)',
            pointerEvents: 'none'
          }}
        />

        <CardContent sx={{ p: { xs: 3, sm: 4, md: 5 } }}>
          <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ md: 'center' }} spacing={3}>
            <Box>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
                <Chip
                  icon={<DotIcon sx={{ fontSize: 10, color: '#34d399 !important' }} />}
                  label={`Database Engine: ${stats?.dbEngine || 'MySQL Active'}`}
                  size="small"
                  sx={{
                    bgcolor: 'rgba(255, 255, 255, 0.15)',
                    color: '#ffffff',
                    fontWeight: 600,
                    backdropFilter: 'blur(8px)'
                  }}
                />
                <Chip
                  label="Fastify High Performance API"
                  size="small"
                  sx={{
                    bgcolor: 'rgba(6, 182, 212, 0.2)',
                    color: '#a5f3fc',
                    fontWeight: 600
                  }}
                />
              </Stack>
              <Typography variant="h3" fontWeight={800} sx={{ letterSpacing: '-0.02em', mb: 1 }}>
                {user ? `Welcome back, ${user.name.split(' ')[0]}!` : 'Welcome to CampusHub!'}
              </Typography>
              <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.85)', maxWidth: 640 }}>
                Your central student and faculty command center. Stay up to date with urgent department announcements, register for campus workshops, and buy or trade campus essentials.
              </Typography>
            </Box>

            <Stack direction="row" spacing={1.5}>
              <Button
                variant="contained"
                onClick={() => navigate('/events')}
                sx={{
                  bgcolor: '#ffffff',
                  color: '#4338ca',
                  fontWeight: 700,
                  '&:hover': { bgcolor: '#f8fafc' },
                  px: 3,
                  py: 1.2
                }}
              >
                Browse Events
              </Button>
              {!user && (
                <Button
                  variant="outlined"
                  onClick={onOpenAuthModal}
                  sx={{
                    borderColor: 'rgba(255, 255, 255, 0.4)',
                    color: '#ffffff',
                    fontWeight: 600,
                    '&:hover': { borderColor: '#ffffff', bgcolor: 'rgba(255, 255, 255, 0.08)' }
                  }}
                >
                  Quick Sign In
                </Button>
              )}
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      {/* Metrics Row */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statCards.map((c, i) => (
          <Grid item xs={12} sm={6} md={3} key={i}>
            <Card
              onClick={() => navigate(c.link)}
              sx={{
                cursor: 'pointer',
                p: 1,
                background: theme.palette.mode === 'dark' ? 'rgba(17, 24, 39, 0.7)' : '#ffffff',
                border: `1px solid ${theme.palette.divider}`
              }}
            >
              <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography variant="body2" color="text.secondary" fontWeight={600} gutterBottom>
                      {c.title}
                    </Typography>
                    <Typography variant="h4" fontWeight={800}>
                      {loading ? <Skeleton width={60} /> : c.value}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      width: 52,
                      height: 52,
                      borderRadius: 3,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: c.color
                    }}
                  >
                    {c.icon}
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Main Content Split: Announcements & Upcoming Events */}
      <Grid container spacing={3}>
        {/* Notices Section */}
        <Grid item xs={12} md={7}>
          <Card sx={{ height: '100%', p: 1 }}>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2.5 }}>
                <Box>
                  <Typography variant="h5" fontWeight={700}>
                    Latest Announcements
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Official updates from faculty and campus administration
                  </Typography>
                </Box>
                <Button
                  endIcon={<ArrowIcon />}
                  onClick={() => navigate('/notices')}
                  size="small"
                  sx={{ fontWeight: 600 }}
                >
                  View All
                </Button>
              </Stack>

              <Stack spacing={2}>
                {notices.map((n) => (
                  <Box
                    key={n.id}
                    onClick={() => navigate('/notices')}
                    sx={{
                      p: 2,
                      borderRadius: 3,
                      cursor: 'pointer',
                      bgcolor: theme.palette.mode === 'dark' ? 'rgba(31, 41, 55, 0.4)' : '#f8fafc',
                      border: `1px solid ${theme.palette.divider}`,
                      transition: 'border-color 0.2s ease',
                      '&:hover': {
                        borderColor: 'primary.main'
                      }
                    }}
                  >
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1}>
                      <Box sx={{ flex: 1 }}>
                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.8 }}>
                          {Boolean(n.is_pinned) && (
                            <Chip label="PINNED" size="small" color="primary" sx={{ height: 18, fontSize: '0.65rem' }} />
                          )}
                          <Chip
                            label={n.category}
                            size="small"
                            variant="outlined"
                            sx={{ height: 18, fontSize: '0.65rem' }}
                          />
                          <Typography variant="caption" color="text.secondary">
                            {new Date(n.created_at).toLocaleDateString()}
                          </Typography>
                        </Stack>
                        <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 0.5 }}>
                          {n.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                          }}
                        >
                          {n.content}
                        </Typography>
                      </Box>
                    </Stack>
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Upcoming Events Column */}
        <Grid item xs={12} md={5}>
          <Card sx={{ height: '100%', p: 1 }}>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2.5 }}>
                <Box>
                  <Typography variant="h5" fontWeight={700}>
                    Upcoming Events
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Workshops, summits & campus hackathons
                  </Typography>
                </Box>
                <Button
                  endIcon={<ArrowIcon />}
                  onClick={() => navigate('/events')}
                  size="small"
                  sx={{ fontWeight: 600 }}
                >
                  Explore
                </Button>
              </Stack>

              <Stack spacing={2.5}>
                {events.map((ev) => (
                  <Card
                    key={ev.id}
                    elevation={0}
                    sx={{
                      borderRadius: 3,
                      border: `1px solid ${theme.palette.divider}`,
                      overflow: 'hidden'
                    }}
                  >
                    <Box
                      component="img"
                      src={ev.banner_url}
                      alt={ev.title}
                      sx={{
                        width: '100%',
                        height: 120,
                        objectFit: 'cover'
                      }}
                    />
                    <Box sx={{ p: 2 }}>
                      <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                        <Chip
                          label={ev.category}
                          size="small"
                          color="secondary"
                          sx={{ height: 20, fontSize: '0.65rem', fontWeight: 700 }}
                        />
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                          <TimeIcon sx={{ fontSize: 14, mr: 0.5 }} />
                          {new Date(ev.event_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </Typography>
                      </Stack>
                      <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 0.5 }}>
                        {ev.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                        <LocationIcon sx={{ fontSize: 14, mr: 0.5 }} />
                        {ev.venue}
                      </Typography>
                      <Button
                        variant="outlined"
                        size="small"
                        fullWidth
                        onClick={() => navigate('/events')}
                        sx={{ borderRadius: 2 }}
                      >
                        View & RSVP
                      </Button>
                    </Box>
                  </Card>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
