import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Stack,
  Button,
  Chip,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  FormControlLabel,
  Checkbox,
  IconButton,
  Alert,
  useTheme
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  PushPin as PinIcon,
  DeleteOutline as DeleteIcon,
  WarningAmber as AlertIcon
} from '@mui/icons-material';
import { noticesAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useOutletContext } from 'react-router-dom';

const CATEGORIES = ['ALL', 'ACADEMIC', 'EXAM', 'EVENT', 'URGENT', 'GENERAL'];

export default function NoticesPage() {
  const theme = useTheme();
  const { user } = useAuth();
  const { onOpenAuthModal } = useOutletContext();

  const [notices, setNotices] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Dialog state
  const [openModal, setOpenModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState('GENERAL');
  const [newPriority, setNewPriority] = useState('MEDIUM');
  const [newPinned, setNewPinned] = useState(false);
  const [formError, setFormError] = useState('');

  const fetchNotices = async () => {
    setLoading(true);
    try {
      const data = await noticesAPI.getAll(selectedCategory);
      setNotices(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, [selectedCategory]);

  const handleCreateNotice = async (e) => {
    e.preventDefault();
    setFormError('');
    try {
      await noticesAPI.create({
        title: newTitle,
        content: newContent,
        category: newCategory,
        priority: newPriority,
        is_pinned: newPinned
      });
      setOpenModal(false);
      setNewTitle('');
      setNewContent('');
      fetchNotices();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to publish announcement.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this notice?')) return;
    try {
      await noticesAPI.delete(id);
      fetchNotices();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete');
    }
  };

  const filteredNotices = notices.filter((n) =>
    n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    n.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const canPostNotice = user && (user.role === 'ADMIN' || user.role === 'FACULTY');

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', width: '100%' }}>
      {/* Page Header */}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ sm: 'center' }}
        spacing={2}
        sx={{ mb: 4 }}
      >
        <Box>
          <Typography variant="h4" fontWeight={800} gutterBottom>
            Campus Notice Board
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Official announcements, academic updates, and urgent campus communications
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            if (!user) {
              onOpenAuthModal();
            } else if (canPostNotice) {
              setOpenModal(true);
            } else {
              alert('Only Faculty and Administrators can publish official notices. Switch your role using the demo menu in the top bar!');
            }
          }}
          sx={{ py: 1.2, px: 2.5 }}
        >
          Post Notice
        </Button>
      </Stack>

      {/* Filter and Search Bar */}
      <Card sx={{ mb: 4, p: 2, borderRadius: 3 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center">
          <TextField
            size="small"
            placeholder="Search announcements..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              )
            }}
            sx={{ flex: 1, width: '100%' }}
          />

          <Stack direction="row" spacing={1} sx={{ overflowX: 'auto', width: { xs: '100%', md: 'auto' }, pb: { xs: 1, md: 0 } }}>
            {CATEGORIES.map((cat) => (
              <Chip
                key={cat}
                label={cat}
                clickable
                color={selectedCategory === cat ? 'primary' : 'default'}
                variant={selectedCategory === cat ? 'filled' : 'outlined'}
                onClick={() => setSelectedCategory(cat)}
                sx={{ fontWeight: 600 }}
              />
            ))}
          </Stack>
        </Stack>
      </Card>

      {/* Notices List */}
      <Stack spacing={2.5}>
        {filteredNotices.length === 0 ? (
          <Card sx={{ p: 6, textAlign: 'center', borderRadius: 4 }}>
            <Typography variant="h6" color="text.secondary">
              No notices found matching your criteria.
            </Typography>
          </Card>
        ) : (
          filteredNotices.map((n) => {
            const isCritical = n.priority === 'CRITICAL' || n.category === 'URGENT';
            const isPinned = Boolean(n.is_pinned);

            return (
              <Card
                key={n.id}
                sx={{
                  borderRadius: 3,
                  position: 'relative',
                  borderLeft: isCritical ? '6px solid #ef4444' : isPinned ? '6px solid #4f46e5' : undefined,
                  bgcolor: theme.palette.mode === 'dark' ? 'background.paper' : '#ffffff'
                }}
              >
                <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5, flexWrap: 'wrap', gap: 0.8 }}>
                      {isPinned && (
                        <Chip
                          icon={<PinIcon sx={{ fontSize: 16 }} />}
                          label="PINNED"
                          size="small"
                          color="primary"
                          sx={{ fontWeight: 700, height: 22 }}
                        />
                      )}
                      <Chip
                        label={n.category}
                        size="small"
                        color={isCritical ? 'error' : 'secondary'}
                        sx={{ fontWeight: 700, height: 22 }}
                      />
                      <Chip
                        label={`Priority: ${n.priority}`}
                        size="small"
                        variant="outlined"
                        sx={{ height: 22 }}
                      />
                      <Typography variant="caption" color="text.secondary">
                        Posted by <strong>{n.author_name}</strong> • {new Date(n.created_at).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                      </Typography>
                    </Stack>

                    {(user?.role === 'ADMIN' || user?.id === n.author_id) && (
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDelete(n.id)}
                        sx={{ mt: -0.5 }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    )}
                  </Stack>

                  <Typography variant="h5" fontWeight={700} sx={{ mb: 1.5 }}>
                    {n.title}
                  </Typography>

                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ lineHeight: 1.7, whiteSpace: 'pre-line' }}
                  >
                    {n.content}
                  </Typography>
                </CardContent>
              </Card>
            );
          })
        )}
      </Stack>

      {/* New Notice Modal Dialog */}
      <Dialog
        open={openModal}
        onClose={() => setOpenModal(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Publish Official Notice</DialogTitle>
        <form onSubmit={handleCreateNotice}>
          <DialogContent>
            {formError && <Alert severity="error" sx={{ mb: 2 }}>{formError}</Alert>}
            <Stack spacing={2.5}>
              <TextField
                label="Announcement Title"
                fullWidth
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                required
              />
              <TextField
                label="Detailed Content"
                fullWidth
                multiline
                rows={4}
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                required
              />
              <Stack direction="row" spacing={2}>
                <TextField
                  select
                  label="Category"
                  fullWidth
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                >
                  <MenuItem value="GENERAL">General</MenuItem>
                  <MenuItem value="ACADEMIC">Academic</MenuItem>
                  <MenuItem value="EXAM">Examination</MenuItem>
                  <MenuItem value="EVENT">Event</MenuItem>
                  <MenuItem value="URGENT">Urgent Alert</MenuItem>
                </TextField>
                <TextField
                  select
                  label="Priority Level"
                  fullWidth
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value)}
                >
                  <MenuItem value="LOW">Low</MenuItem>
                  <MenuItem value="MEDIUM">Medium</MenuItem>
                  <MenuItem value="HIGH">High</MenuItem>
                  <MenuItem value="CRITICAL">Critical</MenuItem>
                </TextField>
              </Stack>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={newPinned}
                    onChange={(e) => setNewPinned(e.target.checked)}
                    color="primary"
                  />
                }
                label="Pin to top of Notice Board"
              />
            </Stack>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={() => setOpenModal(false)}>Cancel</Button>
            <Button type="submit" variant="contained">
              Publish Notice
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}
