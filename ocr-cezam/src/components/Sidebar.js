import logo from '../assets/logo-cezam.png'
import addFile from '../assets/add-files.png'
import React from 'react';

//TODO Bouton télécharger dans certains cas (par défault il y est pas)

class Sidebar extends React.Component {
    render() {
        return (
            <div className="cz-sidebar-content">
                <img src={logo} className="logo-cezam" alt="logo" />
                <p className="cz-sidebar-subtitle">Vous ouvre les portes du crédit</p>
                <img src={addFile} className="logo-addfile" alt="addfile" />
                <p className="cz-sidebar-text">Veuillez ajouter vos documents !</p>
                <p className="cz-sidebar-text">Notre intelligence artificielle va les analyser</p>
            </div>
        );
    }
}

export default Sidebar;
