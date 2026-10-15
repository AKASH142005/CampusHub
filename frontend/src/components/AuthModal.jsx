import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Tabs,
  Tab,
  Box,
  Typography,
  Alert,
  MenuItem,
  Stack,
  Divider,
  IconButton
} from '@mui/material';
import { Close as CloseIcon, Bolt as QuickIcon } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

export default function AuthModal({ open, onClose }) {
  const { login, register, quickLogin } = useAuth();
  const [tab, setTab] = useState(0); // 0: Login, 1: Register
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('STUDENT');
  const [department, setDepartment] = useState('Computer Science');
  const [studentId, setStudentId] = useState('');

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
    setError('');
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register({
        name,
        email,
        password,
        role,
        department,
        student_id: studentId
      });
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuick = async (selectedRole) => {
    setError('');
    setLoading(true);
    try {
      await quickLogin(selectedRole);
      onClose();
    } catch (err) {
      setError('Quick login failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          p: 1
        }
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 2, pt: 1.5 }}>
        <Typography variant="h6" fontWeight={700}>
          CampusHub Account
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}>
        <Tabs value={tab} onChange={handleTabChange} variant="fullWidth">
          <Tab label="Sign In" />
          <Tab label="Register" />
        </Tabs>
      </Box>

      <DialogContent sx={{ pt: 2.5 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        {/* Quick Demo Login Shortcuts */}
        <Box
          sx={{
            p: 1.5,
            mb: 2.5,
            bgcolor: 'background.subtle',
            borderRadius: 3,
            border: '1px dashed',
            borderColor: 'divider'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <QuickIcon sx={{ color: 'warning.main', fontSize: 18, mr: 0.5 }} />
            <Typography variant="caption" fontWeight={700} color="text.secondary">
              ONE-CLICK DEMO ACCESS
            </Typography>
          </Box>
          <Stack direction="row" spacing={1}>
            <Button
              size="small"
              variant="outlined"
              fullWidth
              onClick={() => handleQuick('STUDENT')}
              disabled={loading}
              sx={{ fontSize: '0.75rem', py: 0.5 }}
            >
              Student
            </Button>
            <Button
              size="small"
              variant="outlined"
              color="secondary"
              fullWidth
              onClick={() => handleQuick('FACULTY')}
              disabled={loading}
              sx={{ fontSize: '0.75rem', py: 0.5 }}
            >
              Faculty
            </Button>
            <Button
              size="small"
              variant="outlined"
              color="error"
              fullWidth
              onClick={() => handleQuick('ADMIN')}
              disabled={loading}
              sx={{ fontSize: '0.75rem', py: 0.5 }}
            >
              Admin
            </Button>
          </Stack>
        </Box>

        <Divider sx={{ mb: 2 }}>
          <Typography variant="caption" color="text.secondary">
            OR WITH CREDENTIALS
          </Typography>
        </Divider>

        {tab === 0 ? (
          // Sign In Form
          <form onSubmit={handleLoginSubmit}>
            <Stack spacing={2}>
              <TextField
                label="Campus Email"
                type="email"
                fullWidth
                size="small"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@campushub.edu"
                required
              />
              <TextField
                label="Password"
                type="password"
                fullWidth
                size="small"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
                sx={{ mt: 1, py: 1 }}
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </Button>
            </Stack>
          </form>
        ) : (
          // Register Form
          <form onSubmit={handleRegisterSubmit}>
            <Stack spacing={2}>
              <TextField
                label="Full Name"
                fullWidth
                size="small"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Jane Doe"
                required
              />
              <TextField
                label="Campus Email"
                type="email"
                fullWidth
                size="small"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jane@campushub.edu"
                required
              />
              <TextField
                label="Password"
                type="password"
                fullWidth
                size="small"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <TextField
                select
                label="Campus Role"
                fullWidth
                size="small"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <MenuItem value="STUDENT">Student</MenuItem>
                <MenuItem value="FACULTY">Faculty Member</MenuItem>
                <MenuItem value="ADMIN">Campus Administrator</MenuItem>
              </TextField>
              <TextField
                label="Department"
                fullWidth
                size="small"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
              />
              <TextField
                label="Student / Staff ID"
                fullWidth
                size="small"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                placeholder="e.g. CS-2026-09"
              />
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
                sx={{ mt: 1, py: 1 }}
              >
                {loading ? 'Creating Account...' : 'Register'}
              </Button>
            </Stack>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
