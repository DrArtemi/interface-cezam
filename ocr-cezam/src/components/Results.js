import React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { withStyles } from '@material-ui/styles';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';


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
                <Typography>{children}</Typography>
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
            currTab: 0
        }
    }

    handleTabChange = (event, newValue) => {
        this.setState({ currTab: newValue });
    }

    render() {
        const { classes, processedFile } = this.props;
        let value = this.state.currTab;
        return (
            <div className={classes.root}>
                <AppBar position="static" className={classes.AppBar} elevation={1}>
                    <Tabs
                        classes={{ indicator: classes.indicator }}
                        value={this.state.currTab}
                        onChange={this.handleTabChange}
                    >
                        <Tab label="Document d'identité" />
                        <Tab label="Relevé banquaire" />
                        <Tab label="Avis d'imposition" />
                        <Tab label="Tableau d'amortissement" />
                        <Tab label="Liasse fiscale" />
                    </Tabs>
                </AppBar>
                <TabPanel className="cz-tabpanel" value={value} index={0}>
                    Coucou 1 <span>{processedFile}</span>
                </TabPanel>
                <TabPanel className="cz-tabpanel" value={value} index={1}>
                    Coucou 2 <span>{processedFile}</span>
                </TabPanel>
                <TabPanel className="cz-tabpanel" value={value} index={2}>
                    Coucou 3 <span>{processedFile}</span>
                </TabPanel>
                <TabPanel className="cz-tabpanel" value={value} index={3}>
                    Coucou 4 <span>{processedFile}</span>
                </TabPanel>
                <TabPanel className="cz-tabpanel" value={value} index={4}>
                    Coucou 5 <span>{processedFile}</span>
                </TabPanel>
            </div>
        );
    }
}

Results.propTypes = {
    classes: PropTypes.object.isRequired,
    processedFile: PropTypes.string.isRequired,
};

export default withStyles(styles)(Results);