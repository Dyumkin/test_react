import React, {Component, PropTypes} from 'react';
import '../../../styles/css/loading.css';

class Loader extends Component {

    static propTypes = {
        visible: PropTypes.bool.isRequired
    };

    static defaultProps = {
        visible: false
    };

    getLoader = () => {
        if (this.props.visible) {
            return (
                <div className="loader"></div>
            );
        }

        return null;
    };

    render() {
        return this.getLoader();
    }
}

export default Loader;
