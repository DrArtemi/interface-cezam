import React from 'react';
import AddFiles from './components/AddFiles';
import Loading from './components/Loading';
import Results from './components/Results';
import Sidebar from './components/Sidebar';
import './css/App.css';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ocrProcessing: false,
            ocrProcessedFile: null
        };
    }

    handleProcessed = (processing, processedFile) => {
        this.setState({ 
            ocrProcessing: processing,
            ocrProcessedFile: processedFile
        });
    }

    render() {
        let czContent = '';
        if (!this.state.ocrProcessing && this.state.ocrProcessedFile === null) {
            czContent = <AddFiles onNewFiles={this.handleProcessed} />;
        } else if (this.state.ocrProcessing) {
            czContent = <Loading />;
        } else {
            czContent = <Results processedFile={this.state.ocrProcessedFile}/>;
        }

        return (
            <div className="App">
                <div className="cz-sidebar">
                    <Sidebar download={this.state.ocrProcessedFile !== null}/>
                </div>
                <div className="cz-content">
                    {czContent}
                </div>
            </div>
        );
    }
  }
  
  export default App;
  