import React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { withStyles } from '@material-ui/styles';
import Box from '@material-ui/core/Box';

function TabPanel(props) {
    const { children, index, ...other } = props;
  
    return (
        <div
        role="tabpanel"
        id={`vertical-tabpanel-${index}`}
        aria-labelledby={`vertical-tab-${index}`}
        {...other}
        >
            <Box className="cz-table-container" p={3}>
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

class ShowExcelData extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeIndex: 0
        }
    }

    handleTabChange = (event, activeIndex) => {
        this.setState({ activeIndex });
    }

    render() {
        const { dataTable } = this.props;
        const { activeIndex } = this.state;
        let tabs = [];
        let tab_panels = [];
        let cnt = 0;

        for (let table in dataTable) {
            tabs.push(<MyTab key={cnt} label={table} />);
            if (cnt === activeIndex) {
                tab_panels.push(
                    <TabPanel key={cnt} className="cz-restable" value={activeIndex} index={cnt}>
                        <div dangerouslySetInnerHTML={{__html: dataTable[table]}}></div>
                    </TabPanel>
                );
            }
            cnt++;
        }
        return (
            <div className="cz-excel-content" p={3}>
                <VerticalTabs
                    orientation="vertical"
                    variant="scrollable"
                    value={activeIndex}
                    onChange={this.handleTabChange}
                    className="cz-excel-content-tabs"
                >
                    {tabs}
                </VerticalTabs>
                {tab_panels}
            </div>
        );
    }
}

const VerticalTabs = withStyles(theme => ({
    indicator: {
        backgroundColor: "#9271F6"
    }
}))(Tabs)
  
const MyTab = withStyles(theme => ({
}))(Tab);


export default ShowExcelData;