import React, { useRef, useState, useEffect } from 'react'
import {
  Typography,
  Box,
  Button,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material'
import io from 'socket.io-client'
import './App.css'

const socket = io('http://localhost:4000') // Connect to backend server

const App = () => {
  const canvasRef = useRef(null)
  const contextRef = useRef(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [color, setColor] = useState('#000000')
  const [lineWidth, setLineWidth] = useState(5)
  const [lastPosition, setLastPosition] = useState({ x: null, y: null })

  const setupCanvas = () => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')

    canvas.width = window.innerWidth * 2
    canvas.height = window.innerHeight * 2
    canvas.style.width = `${window.innerWidth}px`
    canvas.style.height = `${window.innerHeight}px`

    context.scale(2, 2)
    context.lineCap = 'round'
    context.strokeStyle = color
    context.lineWidth = lineWidth
    contextRef.current = context
  }

  useEffect(() => {
    setupCanvas()

    const handleResize = () => {
      // Save the current canvas content
      const canvas = canvasRef.current
      const tempCanvas = document.createElement('canvas')
      tempCanvas.width = canvas.width
      tempCanvas.height = canvas.height
      const tempContext = tempCanvas.getContext('2d')
      tempContext.drawImage(canvas, 0, 0)

      // Resize the canvas
      setupCanvas()

      // Restore the saved content
      contextRef.current.drawImage(tempCanvas, 0, 0)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    socket.on('draw', ({ x, y, color, lineWidth }) => {
      const context = contextRef.current
      context.strokeStyle = color
      context.lineWidth = lineWidth
      context.beginPath()
      context.moveTo(x[0], y[0])
      context.lineTo(x[1], y[1])
      context.stroke()
    })

    return () => {
      socket.off('draw') // Limpia el evento al desmontar el componente
    }
  }, [])

  useEffect(() => {
    if (contextRef.current) {
      contextRef.current.lineWidth = lineWidth
    }
  }, [lineWidth])

  useEffect(() => {
    if (contextRef.current) {
      contextRef.current.strokeStyle = color
    }
  }, [color])

  const startDrawing = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent
    setLastPosition({ x: offsetX, y: offsetY })
    setIsDrawing(true)
  }

  const draw = ({ nativeEvent }) => {
    if (!isDrawing) return
    const { offsetX, offsetY } = nativeEvent
    const { x: lastX, y: lastY } = lastPosition

    contextRef.current.beginPath()
    contextRef.current.moveTo(lastX, lastY)
    contextRef.current.lineTo(offsetX, offsetY)
    contextRef.current.stroke()

    // Emit drawing event to server
    socket.emit('draw', {
      x: [lastX, offsetX],
      y: [lastY, offsetY],
      color,
      lineWidth,
    })

    setLastPosition({ x: offsetX, y: offsetY })
  }

  const stopDrawing = () => {
    setIsDrawing(false)
    setLastPosition({ x: null, y: null })
  }

  return (
    <Box style={{ marginTop: '2rem', textAlign: 'center' }}>
      <Box
        sx={{
          bgcolor: '#1976d2',
          color: '#fff',
          padding: '1.5rem',
          borderRadius: '8px',
        }}
      >
        <Typography variant="h3" gutterBottom>
          Collaborative Whiteboard
        </Typography>
        <Typography variant="subtitle1">
          Draw and collaborate in real-time with others!
        </Typography>
      </Box>

      <Box mt={4}>
        <Grid container spacing={2} justifyContent="center">
          <Grid item>
            <FormControl variant="outlined">
              <InputLabel>Color</InputLabel>
              <Select
                value={color}
                onChange={(e) => setColor(e.target.value)}
                style={{ width: 100 }}
              >
                <MenuItem value="#000000">Black</MenuItem>
                <MenuItem value="#FF0000">Red</MenuItem>
                <MenuItem value="#00FF00">Green</MenuItem>
                <MenuItem value="#0000FF">Blue</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              onClick={() => setLineWidth(lineWidth + 5)}
            >
              Thicker
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              onClick={() => setLineWidth(Math.max(lineWidth - 5, 1))}
            >
              Thinner
            </Button>
          </Grid>
        </Grid>
      </Box>

      <Box mt={4} style={{ position: 'relative' }}>
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          style={{
            border: '1px solid #000',
            cursor: 'crosshair',
            display: 'block',
            width: '100%',
            height: '100vh',
          }}
        />
      </Box>

      <Box mt={4}>
        <Typography variant="body2" color="textSecondary">
          &copy; 2025 Collaborative Whiteboard. All rights reserved.
        </Typography>
      </Box>
    </Box>
  )
}

export default App
