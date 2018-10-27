import { connect } from 'react-redux';
import ErrorView from './ErrorView';
import store from '../../store';

export default connect(
    state => {
        return {
            errors: store.selectors.error.errorsList(state),
        }
    },
    dispatch => {
        return {
        	close: () => dispatch(store.actions.error.clearError())
        }
    }
)(ErrorView);
