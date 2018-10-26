import { connect } from 'react-redux';
import DistanceCalculator from './DistanceCalculator';
import {
    inputSource,
    inputDestination,
    selectMapPoint,
    setRoutes,
} from './store/search/actions';

export default connect(
  state => {
    return state.search;
  },
  dispatch => {
    return {
        setSource: text => dispatch(inputSource(text)),
        setDestination: text => dispatch(inputDestination(text)),
        selectMapPoint: coordinate => dispatch(selectMapPoint(coordinate)),
        setRoutes: routes => dispatch(setRoutes(routes)),
    }
  }
)(DistanceCalculator);
