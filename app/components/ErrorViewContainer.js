import { connect } from 'react-redux';
import ErrorView from './ErrorView';
import { selectors } from '../store/reducer';

export default connect(
    state => {
        return {
            errors: selectors.error.errorsList(state),
        }
    },
    dispatch => {
        return {

        }
    }
)(ErrorView);
