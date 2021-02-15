import React from 'react';
import AddFiles from './components/AddFiles';
import Sidebar from './components/Sidebar';
import './css/App.css';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            files_added: false
        };
    }

    render() {
        let czContent = '';
        if (!this.state.files_added) {
            czContent = <AddFiles />;
        }

        return (
            <div className="App">
                <div className="cz-sidebar">
                    <Sidebar />
                </div>
                <div className="cz-content">
                    {czContent}
                </div>
            </div>
        );
    }
  }
  
  export default App;
  