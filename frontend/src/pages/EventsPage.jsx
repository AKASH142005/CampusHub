import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Stack,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  useTheme,
  Alert
} from '@mui/material';
import {
  Add as AddIcon,
  CalendarToday as CalendarIcon,
  Place as VenueIcon,
  People as PeopleIcon,
  Check as CheckIcon,
  Celebration as EventIcon
} from '@mui/icons-material';
import { eventsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useOutletContext } from 'react-router-dom';

const CATEGORIES = ['ALL', 'WORKSHOP', 'HACKATHON', 'SEMINAR', 'CULTURAL', 'SPORTS'];

export default function EventsPage() {
  const theme = useTheme();
  const { user } = useAuth();
  const { onOpenAuthModal } = useOutletContext();

  const [events, setEvents] = useState([]);
  const [myRSVPs, setMyRSVPs] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [loading, setLoading] = useState(true);

  // Modal State
  const [openModal, setOpenModal] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('WORKSHOP');
  const [venue, setVenue] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [maxCapacity, setMaxCapacity] = useState('100');
  const [bannerUrl, setBannerUrl] = useState('');
  const [formError, setFormError] = useState('');

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const data = await eventsAPI.getAll();
      setEvents(data);

      if (user) {
        const rsvps = await eventsAPI.getMyRSVPs();
        setMyRSVPs(rsvps);
      } else {
        setMyRSVPs([]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [user]);

  const handleToggleRSVP = async (eventId) => {
    if (!user) {
      onOpenAuthModal();
      return;
    }

    try {
      const res = await eventsAPI.toggleRSVP(eventId);
      if (res.isRSVPed) {
        setMyRSVPs([...myRSVPs, eventId]);
        setEvents(events.map(e => e.id === eventId ? { ...e, rsvp_count: Number(e.rsvp_count || 0) + 1 } : e));
      } else {
        setMyRSVPs(myRSVPs.filter(id => id !== eventId));
        setEvents(events.map(e => e.id === eventId ? { ...e, rsvp_count: Math.max(0, Number(e.rsvp_count || 0) - 1) } : e));
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update RSVP');
    }
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    setFormError('');
    try {
      await eventsAPI.create({
        title,
        description,
        category,
        venue,
        event_date: eventDate,
        max_capacity: maxCapacity,
        banner_url: bannerUrl
      });
      setOpenModal(false);
      setTitle('');
      setDescription('');
      setVenue('');
      fetchEvents();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to create event');
    }
  };

  const filteredEvents = selectedCategory === 'ALL'
    ? events
    : events.filter(e => e.category === selectedCategory);

  return (
    <Box sx={{ maxWidth: 1300, mx: 'auto', width: '100%' }}>
      {/* Header */}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ sm: 'center' }}
        spacing={2}
        sx={{ mb: 4 }}
      >
        <Box>
          <Typography variant="h4" fontWeight={800} gutterBottom>
            Campus Events & Workshops
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Participate in technical summits, hackathons, and student activities
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            if (!user) onOpenAuthModal();
            else setOpenModal(true);
          }}
          sx={{ py: 1.2, px: 2.5 }}
        >
          Host an Event
        </Button>
      </Stack>

      {/* Categories */}
      <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto', pb: 2, mb: 3 }}>
        {CATEGORIES.map((cat) => (
          <Chip
            key={cat}
            label={cat}
            clickable
            color={selectedCategory === cat ? 'primary' : 'default'}
            variant={selectedCategory === cat ? 'filled' : 'outlined'}
            onClick={() => setSelectedCategory(cat)}
            sx={{ fontWeight: 600, px: 1 }}
          />
        ))}
      </Box>

      {/* Event Cards Grid */}
      <Grid container spacing={3}>
        {filteredEvents.map((ev) => {
          const isRSVPed = myRSVPs.includes(ev.id);

          return (
            <Grid item xs={12} sm={6} lg={4} key={ev.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 4,
                  overflow: 'hidden',
                  position: 'relative'
                }}
              >
                <CardMedia
                  component="img"
                  height="180"
                  image={ev.banner_url || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800'}
                  alt={ev.title}
                />

                <CardContent sx={{ flexGrow: 1, p: 3, display: 'flex', flexDirection: 'column' }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
                    <Chip
                      label={ev.category}
                      size="small"
                      color="secondary"
                      sx={{ fontWeight: 700 }}
                    />
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                      <PeopleIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="caption" fontWeight={600} color="text.secondary">
                        {ev.rsvp_count || 0} / {ev.max_capacity} attending
                      </Typography>
                    </Stack>
                  </Stack>

                  <Typography variant="h5" fontWeight={700} sx={{ mb: 1 }}>
                    {ev.title}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mb: 2,
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      flexGrow: 1
                    }}
                  >
                    {ev.description}
                  </Typography>

                  <Stack spacing={1} sx={{ mb: 2.5, bgcolor: 'background.subtle', p: 1.5, borderRadius: 2 }}>
                    <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center' }}>
                      <CalendarIcon sx={{ fontSize: 16, mr: 1, color: 'primary.main' }} />
                      {new Date(ev.event_date).toLocaleString(undefined, {
                        dateStyle: 'medium',
                        timeStyle: 'short'
                      })}
                    </Typography>
                    <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center' }}>
                      <VenueIcon sx={{ fontSize: 16, mr: 1, color: 'primary.main' }} />
                      {ev.venue}
                    </Typography>
                  </Stack>

                  <Button
                    variant={isRSVPed ? 'contained' : 'outlined'}
                    color={isRSVPed ? 'success' : 'primary'}
                    fullWidth
                    startIcon={isRSVPed ? <CheckIcon /> : <EventIcon />}
                    onClick={() => handleToggleRSVP(ev.id)}
                    sx={{ py: 1, borderRadius: 2.5 }}
                  >
                    {isRSVPed ? 'Attending (Registered)' : 'RSVP to Event'}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Host Event Dialog */}
      <Dialog
        open={openModal}
        onClose={() => setOpenModal(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Host a Campus Event</DialogTitle>
        <form onSubmit={handleCreateEvent}>
          <DialogContent>
            {formError && <Alert severity="error" sx={{ mb: 2 }}>{formError}</Alert>}
            <Stack spacing={2.5}>
              <TextField
                label="Event Title"
                fullWidth
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
              <TextField
                label="Description"
                fullWidth
                multiline
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
              <Stack direction="row" spacing={2}>
                <TextField
                  select
                  label="Category"
                  fullWidth
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <MenuItem value="WORKSHOP">Workshop</MenuItem>
                  <MenuItem value="HACKATHON">Hackathon</MenuItem>
                  <MenuItem value="SEMINAR">Seminar</MenuItem>
                  <MenuItem value="CULTURAL">Cultural</MenuItem>
                  <MenuItem value="SPORTS">Sports</MenuItem>
                </TextField>
                <TextField
                  label="Max Capacity"
                  type="number"
                  fullWidth
                  value={maxCapacity}
                  onChange={(e) => setMaxCapacity(e.target.value)}
                />
              </Stack>
              <TextField
                label="Campus Venue"
                fullWidth
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                placeholder="e.g. Innovation Hall A"
                required
              />
              <TextField
                label="Date & Time"
                type="datetime-local"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                required
              />
              <TextField
                label="Banner Image URL (Optional)"
                fullWidth
                value={bannerUrl}
                onChange={(e) => setBannerUrl(e.target.value)}
                placeholder="https://..."
              />
            </Stack>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={() => setOpenModal(false)}>Cancel</Button>
            <Button type="submit" variant="contained">
              Publish Event
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}
