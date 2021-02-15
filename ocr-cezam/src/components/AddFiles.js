import React from 'react';
import axios from 'axios';

class AddFiles extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            files: {
                pieceIdentite: {
                    name: "Pièce d'identité",
                    file: null
                },
                releveBanquaire: {
                    name: "Relevé banquaire",
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
                }
            }
        }
    }

    onChangeHandler = (event) => {
        // console.log(event.target.files[0]);
        const newDict = { ...this.state.files[event.target.name], file: event.target.files[0] };
        const newFiles = { ...this.state.files, [event.target.name]: newDict };
        this.setState({
            files: newFiles
        });
    }

    onSubmitHandler = () => {
        const data = new FormData();
        for (let file in this.state.files) {
            data.append(file, this.state.files[file]["file"]);
        }

        // axios
        // .post("http://localhost:8000/upload", data)
        // .then((res) => {
        //     alert("File Upload success");
        // })
        // .catch((err) => {
        //     alert("File Upload Error")
        // });
    }

    render() {
        let inputs = [];
        for (let file in this.state.files) {
            console.log(this.state.files[file]["file"]);
            inputs.push(
                <div key={file} className="cz-file-elem">
                    <label className="cz-label" htmlFor={file}>{this.state.files[file]["name"]}</label>
                    <input className="cz-input" type="file" name={file} onChange={this.onChangeHandler}/>
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