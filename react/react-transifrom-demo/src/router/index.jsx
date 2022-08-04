import { TransitionGroup, CSSTransition } from "react-transition-group";
import { withRouter } from 'react-router-dom'

const MyRouter = props => {
  return (
    <TransitionGroup>
      <CSSTransition
        timeout={2000}
        className="dg"
        unmountOnExit
        key={props.location.pathname}
      >
        <Switch location={props.location}>
          <Route exact path="/animate" component={Animate} />
        </Switch>
      </CSSTransition>
    </TransitionGroup>
  );
};

export default withRouter(MyRouter)