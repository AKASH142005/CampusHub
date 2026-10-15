import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  Stack,
  Chip,
  Button,
  Grid,
  Divider,
  Paper,
  useTheme
} from '@mui/material';
import {
  School as SchoolIcon,
  Email as EmailIcon,
  Badge as IdIcon,
  Apartment as DeptIcon,
  CalendarMonth as CalendarIcon,
  ExitToApp as LogoutIcon,
  SwapHoriz as SwitchIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { eventsAPI } from '../services/api';
import { useOutletContext, useNavigate } from 'react-router-dom';

export default function ProfilePage() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user, logout, quickLogin } = useAuth();
  const { onOpenAuthModal } = useOutletContext();

  const [allEvents, setAllEvents] = useState([]);
  const [myRSVPs, setMyRSVPs] = useState([]);

  useEffect(() => {
    if (user) {
      eventsAPI.getAll().then(setAllEvents).catch(console.error);
      eventsAPI.getMyRSVPs().then(setMyRSVPs).catch(console.error);
    }
  }, [user]);

  if (!user) {
    return (
      <Card sx={{ maxWidth: 600, mx: 'auto', p: 4, textAlign: 'center', borderRadius: 4, mt: 4 }}>
        <SchoolIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
        <Typography variant="h5" fontWeight={700} gutterBottom>
          Campus Profile Access
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Please sign in to view your academic profile, enrolled events, and post announcements.
        </Typography>
        <Button variant="contained" onClick={onOpenAuthModal} sx={{ px: 4, py: 1.2 }}>
          Sign In Now
        </Button>
      </Card>
    );
  }

  const registeredEvents = allEvents.filter(e => myRSVPs.includes(e.id));

  return (
    <Box sx={{ maxWidth: 1100, mx: 'auto', width: '100%' }}>
      {/* Profile Header Card */}
      <Card sx={{ mb: 4, borderRadius: 4, overflow: 'hidden' }}>
        <Box
          sx={{
            height: 140,
            background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)'
          }}
        />
        <CardContent sx={{ pt: 0, pb: 4, px: { xs: 3, sm: 4 }, position: 'relative' }}>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={3}
            alignItems={{ xs: 'flex-start', sm: 'flex-end' }}
            sx={{ mt: -7, mb: 3 }}
          >
            <Avatar
              src={user.avatar_url}
              alt={user.name}
              sx={{
                width: 110,
                height: 110,
                border: `4px solid ${theme.palette.background.paper}`,
                boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                bgcolor: 'primary.main',
                fontSize: 36
              }}
            >
              {user.name.charAt(0)}
            </Avatar>

            <Box sx={{ flexGrow: 1 }}>
              <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 0.5, flexWrap: 'wrap' }}>
                <Typography variant="h4" fontWeight={800}>
                  {user.name}
                </Typography>
                <Chip
                  label={user.role}
                  color={user.role === 'ADMIN' ? 'error' : user.role === 'FACULTY' ? 'secondary' : 'primary'}
                  sx={{ fontWeight: 700 }}
                />
              </Stack>
              <Typography variant="body2" color="text.secondary">
                {user.department || 'Computer Science & Engineering'}
              </Typography>
            </Box>

            <Button
              variant="outlined"
              color="error"
              startIcon={<LogoutIcon />}
              onClick={logout}
              sx={{ borderRadius: 2 }}
            >
              Log Out
            </Button>
          </Stack>

          <Divider sx={{ my: 3 }} />

          {/* User Details Grid */}
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <Paper variant="outlined" sx={{ p: 2, borderRadius: 3 }}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <EmailIcon color="primary" />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Campus Email
                    </Typography>
                    <Typography variant="body2" fontWeight={600} noWrap>
                      {user.email}
                    </Typography>
                  </Box>
                </Stack>
              </Paper>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Paper variant="outlined" sx={{ p: 2, borderRadius: 3 }}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <IdIcon color="primary" />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Campus ID
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {user.student_id || 'ID-2026-CAMPUS'}
                    </Typography>
                  </Box>
                </Stack>
              </Paper>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Paper variant="outlined" sx={{ p: 2, borderRadius: 3 }}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <DeptIcon color="primary" />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Department
                    </Typography>
                    <Typography variant="body2" fontWeight={600} noWrap>
                      {user.department || 'Engineering'}
                    </Typography>
                  </Box>
                </Stack>
              </Paper>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Paper variant="outlined" sx={{ p: 2, borderRadius: 3 }}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <CalendarIcon color="primary" />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Registered RSVPs
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {myRSVPs.length} Events
                    </Typography>
                  </Box>
                </Stack>
              </Paper>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Switch Demo Role Bar */}
      <Card sx={{ mb: 4, p: 3, borderRadius: 4, bgcolor: 'background.subtle' }}>
        <Typography variant="subtitle1" fontWeight={700} gutterBottom>
          Role Permissions Testing
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Quickly test the different privileges across the app (Notice posting, admin actions, student RSVPs):
        </Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <Button
            variant={user.role === 'STUDENT' ? 'contained' : 'outlined'}
            onClick={() => quickLogin('STUDENT')}
          >
            Switch to Student
          </Button>
          <Button
            variant={user.role === 'FACULTY' ? 'contained' : 'outlined'}
            color="secondary"
            onClick={() => quickLogin('FACULTY')}
          >
            Switch to Faculty
          </Button>
          <Button
            variant={user.role === 'ADMIN' ? 'contained' : 'outlined'}
            color="error"
            onClick={() => quickLogin('ADMIN')}
          >
            Switch to Admin
          </Button>
        </Stack>
      </Card>

      {/* My Registered Events */}
      <Typography variant="h5" fontWeight={700} gutterBottom>
        My Registered Events
      </Typography>
      {registeredEvents.length === 0 ? (
        <Card sx={{ p: 4, textAlign: 'center', borderRadius: 3 }}>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            You haven't RSVPed to any campus events yet.
          </Typography>
          <Button variant="outlined" onClick={() => navigate('/events')}>
            Discover Events
          </Button>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {registeredEvents.map((ev) => (
            <Grid item xs={12} sm={6} key={ev.id}>
              <Card sx={{ p: 2, borderRadius: 3 }}>
                <Typography variant="subtitle1" fontWeight={700}>
                  {ev.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {new Date(ev.event_date).toLocaleDateString()} • {ev.venue}
                </Typography>
                <Chip label="RSVP Confirmed" size="small" color="success" />
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
