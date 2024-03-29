import React from 'react';
import axios from 'axios';
import urljoin from 'url-join';
import AddFiles from './components/AddFiles';
import Loading from './components/Loading';
import Results from './components/Results';
import Sidebar from './components/Sidebar';
import './css/App.css';
import './css/Responsive.css';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ocrProcessing: false,
            excelData: null,
            timestamp: null
        };
    }

    handleProcessed = (processing, timestamp) => {
        if (processing !== true) {
            axios
            .get(urljoin(process.env.REACT_APP_SERVER_URL, "get-excel-content"),
                { params: { timestamp: timestamp } }
            )
            .then((res) => {
                this.setState({ 
                    ocrProcessing: processing,
                    excelData: res.data['excelData'],
                    timestamp: timestamp
                });
            })
            .catch((err) => {
                console.log(err);
            });
        } else {
            this.setState({ ocrProcessing: processing });
        }
    }

    render() {
        let czContent = '';
        if (!this.state.ocrProcessing && this.state.excelData === null) {
            czContent = <AddFiles onNewFiles={this.handleProcessed} />;
        } else if (this.state.ocrProcessing) {
            czContent = <Loading />;
        } else {
            czContent = <Results excelData={this.state.excelData}/>;
        }

        return (
            <div className="App">
                <div className="cz-sidebar">
                    <Sidebar download={this.state.timestamp}/>
                </div>
                <div className="cz-content">
                    {czContent}
                </div>
            </div>
        );
    }
  }
  
  export default App;
  