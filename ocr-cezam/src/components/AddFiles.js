import React from 'react';
import axios from 'axios';
import urljoin from 'url-join';

class AddFiles extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            files: {
                documentIdentite: {
                    name: "Document d'identité",
                    file: null
                },
                releveBancaire: {
                    name: "Relevé bancaire",
                    file: null
                },
                avisImposition: {
                    name: "Avis d'imposition",
                    file: null
                },
                tableauAmortissement: {
                    name: "Tableau d'amortissement",
                    file: null
                },
                liasseFiscale: {
                    name: "Liasse fiscale",
                    file: null
                },
                bulletinPaie: {
                    name: "Bulletin de paie",
                    file: null
                }
            }
        }
    }

    onChangeHandler = (event) => {
        const newDict = { ...this.state.files[event.target.name], file: event.target.files };
        const newFiles = { ...this.state.files, [event.target.name]: newDict };
        this.setState({
            files: newFiles
        });
    }

    onSubmitHandler = (e) => {
        const data = new FormData();
        for (let file in this.state.files) {
            if (this.state.files[file]["file"] != null) {
                for (let i = 0; i < this.state.files[file]["file"].length; i++) {
                    data.append(file, this.state.files[file]["file"][i]);
                }
            }
        }
        this.props.onNewFiles(true, null);
        axios
        .post(urljoin(process.env.REACT_APP_SERVER_URL, "upload"), data)
        .then((res) => {
            this.props.onNewFiles(false, res.data.timestamp);
        })
        .catch((err) => {
            console.log(err);
        });
    }

    render() {
        let inputs = [];
        for (let file in this.state.files) {
            inputs.push(
                <div key={file} className="cz-file-elem">
                    <label className="cz-label" htmlFor={file}>{this.state.files[file]["name"]}</label>
                    <input className="cz-input" type="file" name={file} multiple onChange={this.onChangeHandler}/>
                </div>
            );
        }

        return (
            <div className="cz-addfiles-content">
                <form className="cz-form">
                    <h1 className="cz-form-title">Insérez les documents à traiter</h1>
                    {inputs}
                    <div className="cz-form-but">
                        <button type="button" onClick={this.onSubmitHandler}>Lancer l'analyse</button>
                    </div>
                </form>
            </div>
        );
    }
}

export default AddFiles;