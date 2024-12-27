import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Paper, 
  IconButton,
  Modal,
  TextField,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  Alert,
  Snackbar,
} from '@mui/material';
import { motion } from 'framer-motion';
import { 
  WhatsApp, 
  DirectionsCar, 
  TwoWheeler, 
  LocalShipping as Truck, 
  Agriculture,
  LocationOn,
  AccessTime,
  Phone,
  Warning,
  CheckCircle
} from '@mui/icons-material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useState } from 'react';
import logo from '/src/assets/logo.png';

const theme = createTheme({
  palette: {
    primary: {
      main: '#D10000',
      dark: '#b00000',
    },
    secondary: {
      main: '#25D366',
      dark: '#1fac54',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h3: { fontWeight: 800 },
    h6: { fontWeight: 500 },
  },
});

interface EmergencyFormData {
  name: string;
  problem: string;
  locationType: 'current' | 'custom';
  location: string;
  currentLocation?: {
    latitude: number;
    longitude: number;
  };
}

function App() {
  const phoneNumbers = ['17999797888', '16996104586'];
  const [openModal, setOpenModal] = useState(false);
  const [selectedNumber, setSelectedNumber] = useState('');
  const [formData, setFormData] = useState<EmergencyFormData>({
    name: '',
    problem: '',
    locationType: 'custom',
    location: '',
  });
  const [showAlert, setShowAlert] = useState(false);
  const [locationError, setLocationError] = useState('');
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  const handleWhatsAppClick = (number: string) => {
    setSelectedNumber(number);
    setOpenModal(true);
    setLocationError('');
    setIsLoadingLocation(false);
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Seu navegador não suporta geolocalização');
      return;
    }

    setIsLoadingLocation(true);
    setLocationError('');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData(prev => ({
          ...prev,
          currentLocation: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          }
        }));
        setIsLoadingLocation(false);
      },
      (error) => {
        let errorMessage = 'Erro ao obter localização';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Permissão de localização negada';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Localização indisponível';
            break;
          case error.TIMEOUT:
            errorMessage = 'Tempo esgotado ao obter localização';
            break;
        }
        setLocationError(errorMessage);
        setIsLoadingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );
  };

  const handlePhoneClick = (number: string) => {
    window.open(`tel:+55${number}`, '_blank');
  };

  const handleLocationTypeChange = (value: 'current' | 'custom') => {
    setFormData(prev => ({ ...prev, locationType: value }));
    if (value === 'current') {
      getCurrentLocation();
    }
  };

  const handleSubmit = () => {
    let locationText = '';
    
    if (formData.locationType === 'current') {
      if (formData.currentLocation) {
        const { latitude, longitude } = formData.currentLocation;
        locationText = `Minha localização atual:\nLatitude: ${latitude}\nLongitude: ${longitude}\nGoogle Maps: https://www.google.com/maps?q=${latitude},${longitude}`;
      } else {
        locationText = 'Não foi possível obter a localização atual';
      }
    } else {
      locationText = `Endereço: ${formData.location}\nCidade: Guaíra - SP`;
    }

    const message = `🚨 *SOCORRO EMERGENCIAL* 🚨\n\n` +
      `Olá! Me chamo *${formData.name}*\n\n` +
      `*Problema:*\n${formData.problem}\n\n` +
      `*Localização:*\n${locationText}\n\n` +
      `Por favor, preciso de assistência urgente!`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/55${selectedNumber}?text=${encodedMessage}`, '_blank');
    setOpenModal(false);
    setShowAlert(true);
    setFormData({
      name: '',
      problem: '',
      locationType: 'custom',
      location: '',
    });
  };

  const services = [
    { icon: <DirectionsCar sx={{ fontSize: 40, color: '#D10000' }} />, text: 'CARROS' },
    { icon: <TwoWheeler sx={{ fontSize: 40, color: '#D10000' }} />, text: 'MOTOS' },
    { icon: <Truck sx={{ fontSize: 40, color: '#D10000' }} />, text: 'CAMINHÕES' },
    { icon: <Agriculture sx={{ fontSize: 40, color: '#D10000' }} />, text: 'TRATORES' },
  ];

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="sm" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', py: 4 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ width: '100%' }}
        >
          <Paper
            elevation={12}
            sx={{
              p: 4,
              borderRadius: 4,
              background: 'linear-gradient(180deg, #ffffff 0%, #f5f5f5 100%)',
              border: '1px solid rgba(0, 0, 0, 0.1)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            }}
          >
            <motion.div whileHover={{ scale: 1.02 }} transition={{ type: 'spring', stiffness: 300 }}>
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                <motion.img
                  src={logo}
                  alt="BF Borracharia Logo"
                  style={{
                    maxWidth: '280px',
                    width: '100%',
                    height: 'auto',
                    filter: 'drop-shadow(0px 4px 8px rgba(0, 0, 0, 0.2))',
                  }}
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5 }}
                />
              </Box>

              <Box sx={{ 
                display: 'flex', 
                gap: 2, 
                justifyContent: 'center', 
                mb: 4,
                flexWrap: 'wrap',
              }}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1,
                  color: '#D10000',
                }}>
                  <AccessTime sx={{ fontSize: 20 }} />
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    TODOS OS DIAS DAS 07:00 ÀS 20:00
                  </Typography>
                </Box>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1,
                  color: '#D10000',
                }}>
                  <LocationOn sx={{ fontSize: 20 }} />
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    ATENDEMOS TODA REGIÃO
                  </Typography>
                </Box>
              </Box>

              <Typography 
                component={motion.h1}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                variant="h5" 
                sx={{ 
                  textAlign: 'center',
                  color: '#000',
                  mb: 3,
                  fontWeight: 700,
                  textShadow: '0px 1px 2px rgba(0,0,0,0.1)',
                }}
              >
                PRECISA DE UM SOCORRO RÁPIDO?
              </Typography>

              <Typography 
                variant="h6" 
                sx={{ 
                  textAlign: 'center',
                  mb: 3,
                  color: '#666',
                  position: 'relative',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: '-8px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '60px',
                    height: '3px',
                    backgroundColor: '#D10000',
                    borderRadius: '2px',
                  }
                }}
              >
                FAZEMOS CONSERTOS EM:
              </Typography>

              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: 2,
                mb: 4,
                mt: 4,
              }}>
                {services.map((service, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Paper
                      elevation={2}
                      sx={{ 
                        display: 'flex', 
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 1,
                        p: 2,
                        borderRadius: 2,
                        bgcolor: 'white',
                        '&:hover': {
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                          transform: 'translateY(-2px)',
                          transition: 'all 0.3s ease',
                        },
                      }}
                    >
                      {service.icon}
                      <Typography sx={{ 
                        fontWeight: 600, 
                        color: '#333',
                        fontSize: '0.9rem',
                        letterSpacing: '0.5px',
                      }}>
                        {service.text}
                      </Typography>
                    </Paper>
                  </motion.div>
                ))}
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {phoneNumbers.map((number, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: 'flex',
                      gap: 1,
                      alignItems: 'stretch',
                    }}
                  >
                    <motion.div
                      style={{ flex: 1 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        variant="contained"
                        size="large"
                        fullWidth
                        startIcon={<WhatsApp sx={{ fontSize: 24 }} />}
                        onClick={() => handleWhatsAppClick(number)}
                        sx={{
                          height: '100%',
                          bgcolor: 'secondary.main',
                          color: 'white',
                          py: 2,
                          fontSize: '1.1rem',
                          fontWeight: 'bold',
                          borderRadius: 2,
                          textTransform: 'none',
                          boxShadow: '0 4px 15px rgba(37, 211, 102, 0.2)',
                          '&:hover': {
                            bgcolor: 'secondary.dark',
                            boxShadow: '0 6px 20px rgba(37, 211, 102, 0.3)',
                          },
                        }}
                      >
                        ({number.slice(0,2)}) {number.slice(2,7)}-{number.slice(7)}
                      </Button>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <IconButton
                        onClick={() => handlePhoneClick(number)}
                        sx={{
                          height: '100%',
                          bgcolor: 'primary.main',
                          color: 'white',
                          p: 2,
                          borderRadius: 2,
                          '&:hover': {
                            bgcolor: 'primary.dark',
                          },
                        }}
                      >
                        <Phone />
                      </IconButton>
                    </motion.div>
                  </Box>
                ))}
              </Box>
            </motion.div>
          </Paper>
        </motion.div>

        <Modal
          open={openModal}
          onClose={() => setOpenModal(false)}
          aria-labelledby="emergency-modal"
        >
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '90%',
            maxWidth: 400,
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
          }}>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 2, 
                mb: 3,
                color: '#D10000'
              }}>
                <Warning sx={{ fontSize: 30 }} />
                <Typography variant="h6" component="h2" sx={{ fontWeight: 600 }}>
                  Precisamos de algumas informações
                </Typography>
              </Box>

              <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  label="Seu Nome"
                  fullWidth
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />

                <TextField
                  label="Qual o problema?"
                  multiline
                  rows={3}
                  fullWidth
                  value={formData.problem}
                  onChange={(e) => setFormData({ ...formData, problem: e.target.value })}
                />

                <FormControl component="fieldset">
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Localização:
                  </Typography>
                  <RadioGroup
                    value={formData.locationType}
                    onChange={(e) => handleLocationTypeChange(e.target.value as 'current' | 'custom')}
                  >
                    <FormControlLabel 
                      value="custom" 
                      control={<Radio />} 
                      label="Digitar endereço"
                    />
                    <FormControlLabel 
                      value="current" 
                      control={<Radio />} 
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <span>Usar minha localização atual</span>
                          {isLoadingLocation && (
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            >
                              <AccessTime sx={{ fontSize: 20, color: '#666' }} />
                            </motion.div>
                          )}
                        </Box>
                      }
                    />
                  </RadioGroup>
                  {locationError && (
                    <Typography 
                      color="error" 
                      variant="caption" 
                      sx={{ 
                        mt: 1,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                      }}
                    >
                      <Warning sx={{ fontSize: 16 }} />
                      {locationError}
                    </Typography>
                  )}
                  {formData.currentLocation && formData.locationType === 'current' && (
                    <Typography 
                      variant="caption" 
                      color="success.main"
                      sx={{ 
                        mt: 1,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                      }}
                    >
                      <CheckCircle sx={{ fontSize: 16 }} />
                      Localização obtida com sucesso!
                    </Typography>
                  )}
                </FormControl>

                {formData.locationType === 'custom' && (
                  <TextField
                    label="Digite o endereço"
                    fullWidth
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    helperText="Digite o endereço completo (Rua, Número, Bairro) - Guaíra/SP"
                    placeholder="Ex: Rua João Silva, 123 - Centro"
                  />
                )}

                <Button
                  variant="contained"
                  size="large"
                  onClick={handleSubmit}
                  startIcon={<WhatsApp />}
                  sx={{
                    mt: 2,
                    bgcolor: 'secondary.main',
                    '&:hover': {
                      bgcolor: 'secondary.dark',
                    },
                  }}
                >
                  Enviar Mensagem
                </Button>
              </Box>
            </motion.div>
          </Box>
        </Modal>

        <Snackbar
          open={showAlert}
          autoHideDuration={6000}
          onClose={() => setShowAlert(false)}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert
            severity="error"
            variant="filled"
            icon={<Warning />}
            sx={{ 
              width: '100%',
              '& .MuiAlert-icon': {
                fontSize: 28,
                animation: 'pulse 2s infinite',
              },
              '@keyframes pulse': {
                '0%': {
                  transform: 'scale(1)',
                },
                '50%': {
                  transform: 'scale(1.2)',
                },
                '100%': {
                  transform: 'scale(1)',
                },
              },
            }}
          >
            🚨 Socorro solicitado! Aguarde nosso contato.
          </Alert>
        </Snackbar>

        {/* Footer */}
        <Box
          component="footer"
          sx={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            textAlign: 'center',
            py: 2,
            px: 2,
            bgcolor: 'rgba(255, 255, 255, 0.9)',
            borderTop: '1px solid rgba(0, 0, 0, 0.1)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Typography
              variant="body2"
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1,
                color: '#666',
                '& a': {
                  color: '#D10000',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  fontWeight: 500,
                  '&:hover': {
                    textDecoration: 'underline',
                  }
                }
              }}
            >
              Desenvolvido por{' '}
              <motion.a
                href={`https://wa.me/5517999754390`}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                DGSolutionWEB <WhatsApp sx={{ fontSize: 16 }} />
              </motion.a>
            </Typography>
          </motion.div>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;
