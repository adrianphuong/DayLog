import './styles.css';
import axios from 'axios';
import React, { useState, useEffect } from 'react';

export default function Diary() {
  const [entries, setEntries] = useState([]);
  const [currentEntry, setCurrentEntry] = useState('');
  const [entryCount, setEntryCount] = useState(0);
  const [todaysDate, setTodaysDate] = useState(new Date().toLocaleString());
  const [selectedEntry, setSelectedEntry] = useState(null);
  
  const insertData = (date, text) => {
    axios
      .post('http://localhost:4000/api/insert', { date, text })
      .then((response) => {
        console.log('Data inserted successfully:', response.data);
      })
      .catch((error) => {
        console.error('Error inserting data:', error);
      });
  };

  const addEntry = () => {
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().slice(0, 19).replace('T', ' ');
    insertData(formattedDate, currentEntry);
    console.log('Added item into entries!');
    if (currentEntry.trim() !== '') {
      const newEntry = {
        text: currentEntry,
        date: new Date().toLocaleString(),
        entryNumber: entryCount + 1,
      };
      setEntries([...entries, newEntry]);
      setCurrentEntry('');
      setEntryCount(entryCount + 1);
    }
  }

  const fetchEntries = () => {
    axios
      .get('http://localhost:4000/api/entries')
      .then((response) => {
        const formattedEntries = response.data.map((entry) => {
          const date = new Date(entry.date);
          date.setHours(date.getHours() + 17); // Add 17 hours
  
          const formattedDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}, ${date.toLocaleTimeString('en-US')}`;
          
          // Use entry_id as the entry number
          const entryNumber = entry.entry_id;
          setEntryCount(entryNumber);
  
          return {
            ...entry,
            date: formattedDate,
            entryNumber: entryNumber,
          };
        });
  
        setEntries(formattedEntries);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  };
  
  
  

  useEffect(() => {
    fetchEntries();
    
    const updateTime = () => {
      setTodaysDate(new Date().toLocaleString());
    };

    const intervalId = setInterval(updateTime, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <body className="bg-[conic-gradient(at_top_right,_var(--tw-gradient-stops))] from-gray-700 via-gray-900 to-black">
      <h1>DayLog</h1>
      <h2>{todaysDate}</h2>
      <div className="gradient-shadow-behind"></div>
      <div className="entry-form">
        <div className="entryBox">
          {entries.slice().reverse().map((entry, index) => (
            <div key={index} className="diary-entry" onClick={() => setSelectedEntry(entry)}>
              <h3>{entry.date}</h3>
              <p>Diary Entry #{entry.entryNumber}</p>
            </div>
          ))}
        </div>
        <div className="gradient-shadow"></div>
        <textarea
          rows="17"
          placeholder="What's on your mind...?"
          value={currentEntry}
          onChange={(e) => setCurrentEntry(e.target.value)}
        />
      </div>
      <button className="entryButton" onClick={addEntry}>
        Add Entry
      </button>
      {selectedEntry && (
        <div className="selected-entry">
          <h3>{selectedEntry.date}</h3>
          <p>{selectedEntry.text}</p>
          <button onClick={() => setSelectedEntry(null)}>Close</button>
        </div>
      )}
    </body>
  );
}