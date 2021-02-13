import React from 'react';

class AddFiles extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            files: [
                "Pièce d'identité",
                "Relevé banquaire",
                "Avis d'imposition",
                "Tableaux d'amortissement",
                "Liasse fiscale"
            ]
        }
    }

    onChangeHandler = (event) => {
        console.log('Changed !');
    }

    render() {
        let inputs = [];
        for (let file of this.state.files) {
            console.log(file)
            inputs.push(
                <div className="cz-file-elem">
                    <label className="cz-label" for={file}>{file}</label>
                    <input className="cz-input" key={file} type="file" name={file} onChange={this.onChangeHandler}/>
                </div>
            );
        }

        return (
            <div className="cz-addfiles-content">
                <form className="cz-form">
                    <h1 className="cz-form-title">Insérez les documents à traiter</h1>
                    {inputs}
                    <div className="cz-form-but">
                    <input type='submit' value="Lancer l'analyse"/>
                    </div>
                </form>
            </div>
        );
    }
}

export default AddFiles;