import React from 'react';

class Loading extends React.Component {
    render() {
        return (
            <div className="cz-loading-content">
                <div className="cz-loading">
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
                <h1 className="cz-form-title">Traitement en cours...</h1>
            </div>
        );
    }
}

export default Loading;