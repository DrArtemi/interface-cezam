import React from 'react';

class ShowExcelData extends React.Component {
    render() {
        const { documentName } = this.props;

        return (
            <div className="cz-excel-content">
                Coucou {documentName}
            </div>
        );
    }
}

export default ShowExcelData;