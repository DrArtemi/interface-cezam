import React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { withStyles } from '@material-ui/styles';
import ShowExcelData from './ShowExcelData';
import Box from '@material-ui/core/Box';

function TabPanel(props) {
    const { children, index, ...other } = props;
  
    return (
        <div
        role="tabpanel"
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
        >
            <Box className="cz-tab-content" p={3}>
                {children}
            </Box>
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
        display: 'flex',
        flexDirection: 'column', 
        background: "white",
        color: "#9271F6",
        minHeight: "100vh",
        height: "100%",
        width: "100%"
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
                releveBancaire: {
                    name: "Relevé bancaire",
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

    }

    handleTabChange = (event, newValue) => {
        this.setState({ currTab: newValue });
    }

    render() {
        const { classes, excelData } = this.props;
        let value = this.state.currTab;
        let tabs = [];
        let tab_panels = [];
        let cnt = 0;
        
        for (let file in this.state.files) {
            let dataTable = {}
            for (let sheetName in excelData) {
                if (sheetName.includes(file)) {
                    dataTable[sheetName] = excelData[sheetName];
                }
            }
            if (Object.keys(dataTable).length > 0) {
                tabs.push(<Tab key={cnt} label={this.state.files[file]['name']} />);
                if (cnt === value) {
                    tab_panels.push(
                        <TabPanel key={cnt} className="cz-tabpanel" value={value} index={cnt}>
                            <ShowExcelData documentName={file} dataTable={dataTable}/>
                        </TabPanel>
                    );
                }
                cnt++;
            }
        }
        return (
            <div className={classes.root}>
                <AppBar position="static" className={classes.AppBar} elevation={1}>
                    <Tabs
                        classes={{ indicator: classes.indicator }}
                        value={value}
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
};

export default withStyles(styles)(Results);