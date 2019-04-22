import React, { useEffect, useState } from 'react';

import Modal from '../../components/UI/Modal/Modal';
import Aux from '../Auxiliary';

const withErrorHandler = (WrappedComponent, axios) => {
  // return class extends Component {
  //   state = { error: null }
  //   componentDidMount () {
  //     axios.interceptors.request.use(req => {
  //       this.setState({error: null});
  //       return req;
  //     })
  //     axios.interceptors.response.use(res => res, error => {
  //       this.setState({error: error});
  //     })
  //   }
  //   errorConfirmedHandler = () => {
  //     this.setState({error: null})
  //   }
  //   render () {
  //     return (
  //       <Aux>
  //         <Modal show={this.state.error} modalClosed={this.errorConfirmedHandler}>
  //           {this.state.error ? this.state.error.message : null}
  //       </Modal>

  //         <WrappedComponent {...this.props} />
  //       </Aux>
  //     )
  //   }
  // } 

  return (props) => {

    let [state, setState] = useState({ error: null });

    const reqInterceptors = axios.interceptors.request.use(req => {
      setState({ error: null });
      return req;
    });

    const resInterceptors = axios.interceptors.response.use(res => res,
      error => {
        setState({ error: error });
      }
    );

    useEffect(() => {      
      return () => {
        console.log('will ummount', reqInterceptors, resInterceptors);
        axios.interceptors.request.eject(reqInterceptors);
        axios.interceptors.response.eject(resInterceptors);
      }
    }, []);
    const errorConfirmedHandler = () => {
      setState({ error: null });
    };
    return (
      <Aux>
        <Modal show={state.error} modalClosed={errorConfirmedHandler}>
          {state.error ? state.error.message : null}
        </Modal>
        <WrappedComponent {...props} />
      </Aux>
    );
  }
}

export default withErrorHandler;
