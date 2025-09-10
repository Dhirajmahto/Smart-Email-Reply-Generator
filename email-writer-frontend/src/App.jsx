import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Box, Container, Typography, TextField, InputLabel, MenuItem, FormControl, Select, CircularProgress, Button } from '@mui/material'
import axios from 'axios'

function App() {
  const [emailContent, setEmailContent] = useState('');
  const [tone, setTone] = useState('');
  const [generatedReply, setGeneratedReply] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    // Yaha API call ya logic aayega
   try {
    const response = await axios.post("http://localhost:8080/api/email/generate",{
      emailContent,
      tone
    });
    setGeneratedReply(typeof response.data === 'string' ?
      response.data : JSON.stringify(response.data)
    )
   } catch (error) {
    
   } finally{
     setLoading(false);
   }
  };
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        Email Reply Generator
      </Typography>

      {/* Email Input Box */}
      <Box sx={{ mx: 3, mb: 3 }}>
        <TextField
          fullWidth
          multiline
          rows={6}
          variant="outlined"
          label="Original Email Content"
          value={emailContent}
          onChange={(e) => setEmailContent(e.target.value)}
        />
      </Box>

      {/* Tone Selector */}
      <Box sx={{ mx: 3 }}>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Tone (Optional)</InputLabel>
          <Select
            value={tone}
            label="Tone (Optional)"
            onChange={(e) => setTone(e.target.value)}
            sx={{ mb: 2 }}
          >
            <MenuItem value="">None</MenuItem>
            <MenuItem value="Professional">Professional</MenuItem>
            <MenuItem value="Casual">Casual</MenuItem>
            <MenuItem value="Friendly">Friendly</MenuItem>
          </Select>
        </FormControl>

        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!emailContent || loading}
        >
          {loading ? <CircularProgress size={24} /> : "Generate Reply"}
        </Button>
      </Box>

      {/* Generated Reply Box */}
      <Box sx={{ mx: 3 }}>
        <TextField
          fullWidth
          multiline
          rows={6}
          variant="outlined"
          label="Generated Reply"
          value={generatedReply}
          inputProps={{ readOnly: true }}
          sx={{ mb: 2 }}
        />

        <Button
        variant='outlined'
        onClick={()=> navigator.clipboard.write(generatedReply)}>
          Copy to Clipbord
        </Button>
      </Box>

    </Container>
  )
}

export default App
