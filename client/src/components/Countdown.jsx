import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Typography from '@mui/material/Typography';
import SoundPlayer from './SoundStuff/SoundPlayer.jsx';
import soundFile from './SoundStuff/ah_jesus_trimmed.mp3';
<SoundPlayer soundFile={soundFile} />

const Countdown = () => {
  const [event, setEvent] = useState('');
  const [task, setTask] = useState('');
  const [date, setDate] = useState('');
  const [stressors, setStressors] = useState('');
  const [story, setStory] = useState('');
  const [countdown, setCountdown] = useState('');
  const eventRef = useRef(null);
  const taskRef = useRef(null);
  const stressorsRef = useRef(null);
  const dateRef = useRef(null);

  const getDate = async () => {
    try {
      const response = await axios.get('/api/stories');
      const { date } = response.data;
      if (date) {
        setDate(new Date(date));
      }
    } catch (err) {
      console.error('Failed to GET date from db to client:', err);
    }
  }

  const getStory = async () => {
    try {
      const response = await axios.get('/api/stories');
      const { story } = response.data;
      setStory(story);
    } catch (err) {
      console.error('Failed to GET story from db to client:', err);
    }
  }

  useEffect(() => {
    getDate();
    getStory();
  }, [])

  const handleEventChange = (e) => {
    const { value } = e.target;
    setEvent(value);
  }

  const handleTaskChange = (e) => {
    const { value } = e.target;
    setTask(value);
  }

  const handleStressorsChange = (e) => {
    const { value } = e.target;
    setStressors(value);
  }

  const clearFormInputs = () => {
    eventRef.current.value = '';
    taskRef.current.value = '';
    stressorsRef.current.value = '';
    dateRef.current.value = '';
  }

  const handleSubmit = async () => {
    try {
      clearFormInputs();
      const response = await axios.post('/api/stories', { event, task, date, stressors });
      const { text } = response.data.choices[0];
      setStory(text);
    } catch (err) {
      console.error('Failed to POST text to API at client:', err);
    }
  }

  const handleDelete = async () => {
    try {
      await axios.delete('/api/stories/');
      setStory('');
      setDate('');
      setCountdown('');
    } catch (err) {
      console.error('Failed to DELETE story at client:', err);
    }
  }

  const handleDateChange = (e) => {
    const { value } = e.target;
    const [year, month, day] = value.split('-');
    const newDate = new Date(year, month - 1, day); // month is zero-based
    setDate(newDate);
  };

  useEffect(() => {
    const intervalId = setInterval(() => {

      if (date) {
        const now = new Date();
        const timeDifference = date.getTime() - now.getTime();

        if (!timeDifference) {
          setCountdown('Countdown is over!');
          clearInterval(intervalId);
        } else {
          const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
          const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

          const formatDays = () => (
            days > 1 ? `${days} days\n`
              : (days === 1) ? `${days} day\n`
                : ''
          )

          setCountdown(`${formatDays()} ${hours} hours\n${minutes} minutes\n${seconds} seconds`);
        }
      }
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [date]);

  const countdownStyle = {
    color: 'white',
    fontSize: '24px',
    lineHeight: '1.5',
    whiteSpace: 'pre-line',
    textAlign: 'center',
  };

  const daysStyle = {
    fontSize: '80px',
    fontWeight: 'bold',
    margin: '0 10px',
  };

  const timeUnitStyle = {
    fontSize: '46px',
    fontWeight: 'bold',
    margin: '0 10px',
  };

  const timeUnitContainerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };

  const pageStyle = {
    color: 'white',
    background: '#ef3340',
    padding: '200px 300px 350px 300px',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'justify'
  };

  const storyContainerStyle = {
    marginTop: '50px',
    marginBottom: '50px',
    marginLeft: '100px',
    marginRight: '100px',
    fontFamily: 'Helvetica',
    fontSize: '20px'
  };

  const inputContainerStyle = {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: '20px',
    alignItems: 'flex-end',
  };

  const inputRowStyle = {
    marginRight: '10px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  };

  const labelStyle = {
    color: 'white',
    marginBottom: '5px',
    fontFamily: 'Helvetica',
  };

  const inputFieldStyle = {
    backgroundColor: '#ef3340',
    color: 'white',
    border: '1px solid white',
    borderRadius: '5px',
    padding: '5px',
    fontFamily: 'Helvetica',
    outline: 'none',
    fontSize: '16px',
    padding: '10px',
  }

  const storyDescriptionStyle = {
    fontSize: '32px',
    textAlign: 'center',
    marginBottom: '20px',
  }

  const submitButtonStyle = {
    background: 'linear-gradient(to bottom, #ff5858, #ff2929)',
    color: 'white',
    border: '1px solid white',
    borderRadius: '5px',
    padding: '5px 10px',
    cursor: 'pointer',
    boxShadow: '0px 4px 10px rgba(255, 0, 0, 0.5)',
    fontSize: '18px',
    padding: '12px 20px',
    marginLeft: '10px',
  };
  
  return (
    <div style={pageStyle}>
      <div style={countdownStyle}>
        <Typography component="div">
          {countdown ? (
            countdown.split('\n').map((line, i) => {
              if (i === 0) {
                return (
                  <div key={i} style={timeUnitContainerStyle}>
                    <span style={daysStyle}>{line}</span>
                  </div>
                );
              }
              return (
                <span key={i} style={timeUnitStyle}>
                  {line}
                </span>
              );
            })
          ) : <h1 style={storyDescriptionStyle}>how is this form not self-explanatory? <br/> do you really need me to tell you what to do?</h1>}
        </Typography>
      </div>
      { story &&
            <div style={storyContainerStyle}>
            <div style={storyDescriptionStyle}>what's definitely going to happen is...</div>
            <div>{story ? story : null}</div>
          </div> }
      <div style={inputContainerStyle}>
        <div style={inputRowStyle}>
          <label htmlFor="event" style={labelStyle}>event</label>
          <input
            type="text"
            autoComplete="off"
            ref={eventRef}
            style={inputFieldStyle}
            onChange={handleEventChange}
          />
        </div>
        <div style={inputRowStyle}>
          <label htmlFor="task" style={labelStyle}>task</label>
          <input
            type="text"
            autoComplete="off"
            ref={taskRef}
            style={inputFieldStyle}
            onChange={handleTaskChange}
          />
        </div>
        <div style={inputRowStyle}>
          <label htmlFor="task" style={labelStyle}>stressors</label>
          <input
            type="text"
            autoComplete="off"
            ref={stressorsRef}
            style={inputFieldStyle}
            onChange={handleStressorsChange}
          />
        </div>
        <div style={inputRowStyle}>
          <label htmlFor="date" style={labelStyle}>date</label>
          <input
            type="date"
            ref={dateRef}
            style={inputFieldStyle}
            onChange={handleDateChange}
          />
        </div>
        <div style={inputRowStyle}>
          <button
            type="submit"
            style={submitButtonStyle}
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
        { story ?
        <div style={inputRowStyle}>
        <button
          type="submit"
          style={submitButtonStyle}
          onClick={handleDelete}
        >
          Delete
        </button>
      </div>
      : null
        }
      </div>
    </div>
  )
}

export default Countdown;
