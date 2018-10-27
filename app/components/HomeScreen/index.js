import { connect } from 'react-redux';
import DistanceCalculator from './HomeScreen';
import store from '../../store';

export default connect(
  state => {
    const select = store.selectors.search;
    // Honestly looks like overkill,
    // but completely separate the model from the view
    return {
        source: select.source(state),
        destination: select.destination(state),
        sourceLocations: select.sourceLocations(state),
        destinationLocations: select.destinationLocations(state),
        routes: select.routes(state),
    }
  },
  dispatch => {
    const action = store.actions.search;
    return {
        setSource: text => dispatch(action.inputSource(text)),
        setDestination: text => dispatch(action.inputDestination(text)),
        selectMapPoint: coordinate => dispatch(action.selectMapPoint(coordinate)),
        setRoutes: routes => dispatch(action.setRoutes(routes)),
    }
  }
)(DistanceCalculator);
