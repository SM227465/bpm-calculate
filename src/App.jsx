import { useState } from 'react';
import { analyzeFullBuffer } from 'realtime-bpm-analyzer';
import './App.css';

function App() {
  const [count, setCount] = useState(0);

  const fileChangeHandler = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.addEventListener('load', () => {
      const audioCtx = new AudioContext();

      audioCtx.decodeAudioData(reader.result, async (audioBuffer) => {
        const topCandidates = await analyzeFullBuffer(audioBuffer);
        console.log(topCandidates);
      });
    });

    reader.readAsArrayBuffer(file);
  };

  return (
    <div>
      <h2>BMP</h2>
      <input type='file' id='fileInput' accept='audio/*' onChange={fileChangeHandler} />
    </div>
  );
}

export default App;
