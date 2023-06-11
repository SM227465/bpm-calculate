import MusicTempo from 'music-tempo';
import { Audio } from 'react-loading-icons';
import { useState } from 'react';
import './App.css';

function App() {
  const [bpm, setBpm] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const resetHandler = () => {
    setBpm(0);
    const file = document.getElementById('fileInput');

    if (file) {
      file.value = '';
    }
  };

  const fileChangeHandler = (event) => {
    setIsLoading(true);

    const file = event.target.files[0];
    const reader = new FileReader();

    reader.addEventListener('load', () => {
      const audioCtx = new AudioContext();

      audioCtx.decodeAudioData(reader.result, async (audioBuffer) => {
        const audioData = [];

        if (audioBuffer.numberOfChannels === 2) {
          const channel1Data = audioBuffer.getChannelData(0);
          const channel2Data = audioBuffer.getChannelData(1);
          const length = channel1Data.length;
          for (let i = 0; i < length; i++) {
            audioData[i] = (channel1Data[i] + channel2Data[i]) / 2;
          }
        } else {
          audioData = audioBuffer.getChannelData(0);
        }

        const mt = new MusicTempo(audioData);
        setBpm(parseInt(mt.tempo));
        setIsLoading(false);
      });
    });

    reader.readAsArrayBuffer(file);
  };

  return (
    <div className='container'>
      <h2>To find BMP of a song please select an audio file below</h2>
      <input type='file' id='fileInput' accept='audio/*' onChange={fileChangeHandler} />
      <div>
        <h5>BPM: {bpm}</h5>
        {isLoading && <Audio fill='#06bcee' stroke='#98ff98' strokeOpacity={0.125} speed={0.75} />}
      </div>
      <button disabled={bpm === 0} onClick={resetHandler}>
        Reset
      </button>
    </div>
  );
}

export default App;
