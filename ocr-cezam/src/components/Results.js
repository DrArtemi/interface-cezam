import React from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { withStyles } from '@material-ui/styles';
import Box from '@material-ui/core/Box';
import ShowExcelData from './ShowExcelData';

function TabPanel(props) {
    const { children, value, index, ...other } = props;
  
    return (
        <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
        >
            {value === index && (
                <Box p={3}>
                    {children}
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

const styles = theme => ({
    root: {
      background: "white",
      color: "#9271F6",
      height: "100vh"
    },
    AppBar: {
        background: "white",
        color: "#9271F6"
    },
    indicator: {
        backgroundColor: "#9271F6"
    }
  });  

class Results extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currTab: 0,
            files: {
                documentIdentite: {
                    name: "Document d'identité",
                },
                releveBanquaire: {
                    name: "Relevé banquaire",
                },
                avisImposition: {
                    name: "Avis d'imposition",
                },
                tableauAmortissement: {
                    name: "Tableau d'amortissement",
                },
                liasseFiscale: {
                    name: "Liasse fiscale",
                }
            }
        }

        this.loadExcelFile();
    }

    loadExcelFile = (processedFile) => {
        axios
        .get("http://localhost:8000/get-excel-content")
        .then((res) => {
            console.log('Le excel est get');
            console.log(res.data);
        })
        .catch((err) => {
            console.log(err);
        });
    }

    handleTabChange = (event, newValue) => {
        this.setState({ currTab: newValue });
    }

    render() {
        const { classes, processedFile } = this.props;
        let value = this.state.currTab;
        let tabs = [];
        let tab_panels = [];
        let cnt = 0;
        
        for (let file in this.state.files) {
            tabs.push(<Tab key={cnt} label={this.state.files[file]['name']} />);
            tab_panels.push(
                <TabPanel key={cnt} className="cz-tabpanel" value={value} index={cnt}>
                    <ShowExcelData documentName={file} />
                </TabPanel>
            );
            cnt++;
        }
        return (
            <div className={classes.root}>
                <AppBar position="static" className={classes.AppBar} elevation={1}>
                    <Tabs
                        classes={{ indicator: classes.indicator }}
                        value={this.state.currTab}
                        onChange={this.handleTabChange}
                    >
                        {tabs}
                    </Tabs>
                </AppBar>
                {tab_panels}
            </div>
        );
    }
}

Results.propTypes = {
    classes: PropTypes.object.isRequired,
    processedFile: PropTypes.string.isRequired,
};

export default withStyles(styles)(Results);