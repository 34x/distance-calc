import { connect } from 'react-redux';
import DistanceCalculator from './DistanceCalculator';
import { setSource, setDestination, selectMapPoint } from './store/actions';

export default connect(
  state => {
    return state.search;
  },
  dispatch => {
    return {
        setSource: text => dispatch(setSource(text)),
        setDestination: text => dispatch(setDestination(text)),
        selectMapPoint: coordinate => dispatch(selectMapPoint(coordinate)),
    }
  }
)(DistanceCalculator);
