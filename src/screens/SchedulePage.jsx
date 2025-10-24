import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Button,
  Typography,
  Box,
  IconButton,
  Tooltip,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import RestoreIcon from '@mui/icons-material/Restore';

const STORAGE_KEY = 'orarioDoc_schedule';
const DAYS = ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì'];
const HOURS = [
  '08:00-09:00',
  '09:00-10:00',
  '10:00-11:00',
  '11:00-12:00',
  '12:00-13:00',
  '13:00-14:00',
  '14:00-15:00',
  '15:00-16:00',
];

const SchedulePage = () => {
  const [schedule, setSchedule] = useState(() => {
    // Initialize schedule structure
    const initialSchedule = {};
    DAYS.forEach((day) => {
      initialSchedule[day] = {};
      HOURS.forEach((hour) => {
        initialSchedule[day][hour] = { subject: '', teacher: '' };
      });
    });
    return initialSchedule;
  });

  // Load from localStorage on mount
  useEffect(() => {
    const savedSchedule = localStorage.getItem(STORAGE_KEY);
    if (savedSchedule) {
      try {
        setSchedule(JSON.parse(savedSchedule));
      } catch (error) {
        console.error('Error loading schedule from localStorage:', error);
      }
    }
  }, []);

  // Handle cell change
  const handleCellChange = (day, hour, field, value) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [hour]: {
          ...prev[day][hour],
          [field]: value,
        },
      },
    }));
  };

  // Save to localStorage
  const handleSave = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(schedule));
      alert('Orario salvato con successo!');
    } catch (error) {
      console.error('Error saving schedule:', error);
      alert('Errore nel salvataggio dell\'orario');
    }
  };

  // Reset schedule
  const handleReset = () => {
    if (window.confirm('Sei sicuro di voler cancellare tutto l\'orario?')) {
      const emptySchedule = {};
      DAYS.forEach((day) => {
        emptySchedule[day] = {};
        HOURS.forEach((hour) => {
          emptySchedule[day][hour] = { subject: '', teacher: '' };
        });
      });
      setSchedule(emptySchedule);
      localStorage.removeItem(STORAGE_KEY);
      alert('Orario cancellato!');
    }
  };

  // Clear single cell
  const handleClearCell = (day, hour) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [hour]: { subject: '', teacher: '' },
      },
    }));
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Orario Settimanale Docente
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Tooltip title="Salva orario">
            <Button
              variant="contained"
              color="primary"
              startIcon={<SaveIcon />}
              onClick={handleSave}
              aria-label="Salva orario"
            >
              Salva
            </Button>
          </Tooltip>
          <Tooltip title="Cancella tutto">
            <Button
              variant="outlined"
              color="error"
              startIcon={<RestoreIcon />}
              onClick={handleReset}
              aria-label="Cancella orario"
            >
              Cancella
            </Button>
          </Tooltip>
        </Box>
      </Box>

      <TableContainer component={Paper} elevation={3}>
        <Table aria-label="Tabella orario settimanale docente">
          <TableHead>
            <TableRow>
              <TableCell
                sx={{ fontWeight: 'bold', backgroundColor: 'primary.main', color: 'white' }}
              >
                Ora
              </TableCell>
              {DAYS.map((day) => (
                <TableCell
                  key={day}
                  align="center"
                  sx={{ fontWeight: 'bold', backgroundColor: 'primary.main', color: 'white' }}
                >
                  {day}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {HOURS.map((hour) => (
              <TableRow key={hour} hover>
                <TableCell
                  component="th"
                  scope="row"
                  sx={{ fontWeight: 'medium', backgroundColor: 'grey.100' }}
                >
                  {hour}
                </TableCell>
                {DAYS.map((day) => (
                  <TableCell key={`${day}-${hour}`} align="center">
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, p: 1 }}>
                      <TextField
                        size="small"
                        placeholder="Materia"
                        value={schedule[day][hour].subject}
                        onChange={(e) =>
                          handleCellChange(day, hour, 'subject', e.target.value)
                        }
                        variant="outlined"
                        fullWidth
                        inputProps={{
                          'aria-label': `Materia per ${day} alle ${hour}`,
                        }}
                      />
                      <TextField
                        size="small"
                        placeholder="Docente"
                        value={schedule[day][hour].teacher}
                        onChange={(e) =>
                          handleCellChange(day, hour, 'teacher', e.target.value)
                        }
                        variant="outlined"
                        fullWidth
                        inputProps={{
                          'aria-label': `Docente per ${day} alle ${hour}`,
                        }}
                      />
                      {(schedule[day][hour].subject || schedule[day][hour].teacher) && (
                        <IconButton
                          size="small"
                          onClick={() => handleClearCell(day, hour)}
                          aria-label={`Cancella lezione ${day} ${hour}`}
                          sx={{ alignSelf: 'center' }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      )}
                    </Box>
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ mt: 3 }}>
        <Typography variant="body2" color="text.secondary">
          💡 <strong>Suggerimento:</strong> L'orario viene salvato automaticamente nel browser.
          Clicca su "Salva" per confermare le modifiche o su "Cancella" per rimuovere tutto l'orario.
        </Typography>
      </Box>
    </Container>
  );
};

export default SchedulePage;
