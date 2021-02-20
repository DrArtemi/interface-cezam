import logo from '../assets/logo-cezam.png'
import addFile from '../assets/add-files.png'
import React from 'react';

class Sidebar extends React.Component {

    onDownloadHandler = (e) => {
        window.open("http://localhost:8000/download");
    }

    render() {
        const download = this.props.download;

        return (
            <div className="cz-sidebar-content">
                <a href="/"><img src={logo} className="logo-cezam" alt="logo" /></a>
                <p className="cz-sidebar-subtitle">Vous ouvre les portes du crédit</p>
                <img src={addFile} className="logo-addfile" alt="addfile" />
                <p className="cz-sidebar-text">Veuillez ajouter vos documents !</p>
                <p className="cz-sidebar-text">Notre intelligence artificielle va les analyser</p>
                {download &&
                    <div className="cz-form-but">
                        <button type="button" onClick={(this.onDownloadHandler)}>Télécharger</button>
                    </div>
                }
            </div>
        );
    }
}

export default Sidebar;
