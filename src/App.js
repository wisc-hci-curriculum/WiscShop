import React from 'react';
import './styles/App.css';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { Link } from "react-router-dom";
import Welcome from './components/Welcome';
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import Home from './components/Home';
import Cart from './components/Cart';
import CartReview from './components/CartReview';
import CartConfirmed from './components/CartConfirmed';
import Category from './components/Category';
import Product from './components/Product';
import Error from './components/Error';
import Messages from './components/Messages';

import {BrowserRouter as Router, Switch, Route} from "react-router-dom";
import base64 from 'base-64';
import 'bootstrap/dist/css/bootstrap.min.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      products: [],
      serverRoute: '/',
      shouldUpdate: true
    }
  }

  render() {
    return (
      <>
        <Router>
          <div style={{height: '100vh'}}>
            <Navbar bg="primary" variant="dark" fixed="top">
              <Link to={localStorage.getItem('auth') ? '/'+localStorage.getItem('username') : '/'}>
                <Navbar.Brand>WiscShop</Navbar.Brand>
              </Link>
              <Nav className="ml-auto">
              {localStorage.getItem('auth') ? (
                <Link to={'/'+localStorage.getItem('username') + "/cart"}>
                  <Navbar.Text className="mr-sm-2">
                    Cart
                  </Navbar.Text>
                </Link>

              ) : <></>}

              </Nav>
            </Navbar>
            <Switch>
              <Route exact path="/">
                <Welcome/>
              </Route>
              <Route path="/signUp">
                <SignUp signUp={(username, password, firstName, lastName) => this.signUp(username, password, firstName, lastName)}/>
              </Route>
              <Route path="/signIn">
                <SignIn signIn={(username, password) => this.signIn(username, password)}/>
              </Route>
              {this.getUserRoutes()}
              <Route path='/'>
                <Error/>
              </Route>
            </Switch>
          </div>
        </Router>

        <div style={{display: 'flex', position: 'fixed', right: 0, bottom: 0}}>
        {
          localStorage.getItem('auth') ? <Messages/> : <></>
        }
        </div>
      </>
    )
  }

  componentDidMount() {
    this.fetchCategories();
    this.fetchProducts();
    this.routeFromServer();
  }

  async routeFromServer() {
    while(this.state.shouldUpdate) {
      try {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("x-access-token", localStorage.getItem('token'));

        var requestOptions = {
          method: 'GET',
          headers: myHeaders,
          redirect: 'follow'
        };

        let response = await fetch('https://mysqlcs639.cs.wisc.edu/application', requestOptions);
        if(!response.ok) {
          throw new Error()
        }
        let result = await response.json();

        let base = window.location.protocol+"//"+window.location.host;
        let serverRoute = window.location.href.replace(base,"");

        if(serverRoute !== result.page) {
          if(result.dialogflowUpdated) { // update app route
            window.location.href = base + result.page;
            this.setState({serverRoute:result.page});

            let body = JSON.stringify({dialogflowUpdated: false});

            requestOptions = {
              method: 'PUT',
              headers: myHeaders,
              body: body,
              redirect: 'follow'
            }

            await fetch('https://mysqlcs639.cs.wisc.edu/application', requestOptions);
          }
          else { // update server route
            let body = JSON.stringify({page: serverRoute, dialogflowUpdated: false});
            this.setState({serverRoute:serverRoute});
            requestOptions = {
              method: 'PUT',
              headers: myHeaders,
              body: body,
              redirect: 'follow'
            }

            await fetch('https://mysqlcs639.cs.wisc.edu/application', requestOptions);
          }
        }
        else { // check for back (from server)
          if(result.back) {
            window.history.back();

            let base = window.location.protocol+"//"+window.location.host;
            let serverRoute = window.location.href.replace(base,"");
            this.setState({serverRoute:serverRoute});

            let body = JSON.stringify({page: serverRoute, dialogflowUpdated: false, back: false});

            requestOptions = {
              method: 'PUT',
              headers: myHeaders,
              body: body,
              redirect: 'follow'
            }

            await fetch('https://mysqlcs639.cs.wisc.edu/application', requestOptions);
          }
        }

        await this.delay(500);
      }
      catch(error) {
        await this.getToken(localStorage.getItem('username'), localStorage.getItem('password'));
      }
    }
  }

  async delay(delayInms) {
    return new Promise(resolve  => {
      setTimeout(() => {
        resolve(2);
      }, delayInms);
    });
  }

  componentWillUnmount(){
    this.setState({shouldUpdate:false})
  }

  getUserRoutes() {
    let username = localStorage.getItem('username');

    if(username != null) {
      let routes = [];

      routes.push (
        <Route key={'route_user'} exact path={'/' + username}>
          <Home username={username} categories={this.state.categories}/>
        </Route>
      );
      routes.push (
        <Route key={'route_user_cart'} path={'/' + username + '/cart'}>
          <Cart username={username}/>
        </Route>
      );
      routes.push (
        <Route key={'route_user_cart_review'} path={'/' + username + '/cart-review'}>
          <CartReview username={username}/>
        </Route>
      );
      routes.push (
        <Route key={'route_user_cart_confirmed'} path={'/' + username + '/cart-confirmed'}>
          <CartConfirmed username={username}/>
        </Route>
      );

      for(const category of this.state.categories) {
        routes.push (
          <Route key={'route_user_' + category} exact path={'/' + username + '/' + category}>
            <Category name={category} username={username}/>
          </Route>
        );
      }

      for(const product of this.state.products) {
        routes.push (
          <Route key={'route_user_' + product.id} path={'/' + username + '/' + product.category + '/products/' + product.id}>
            <Product product={product} username={username} path={'/products/' + product.id}/>
          </Route>
        )
      }

      return routes;
    }
  }

  async fetchCategories() {
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("x-access-token", localStorage.getItem('token'));

    let requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };

    let response = await fetch('https://mysqlcs639.cs.wisc.edu/categories/', requestOptions);
    let result = await response.json();

    this.setState({categories: result.categories})
  }

  async fetchProducts() {
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("x-access-token", localStorage.getItem('token'));

    let requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };

    let response = await fetch('https://mysqlcs639.cs.wisc.edu/products/', requestOptions);
    let result = await response.json();

    this.setState({products: result.products})
  }

  async getToken(username, password) {
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Authorization", "Basic " + base64.encode(username + ":" + password));

    let requestOptions = {
      method: 'GET',
      headers: headers,
      redirect: 'follow'
    };

    try {
      let response = await fetch('https://mysqlcs639.cs.wisc.edu/login/', requestOptions);
      let result = await response.json();
      if(!('token' in result)) {
        localStorage.setItem('auth', false);
        return false;
      }
      localStorage.setItem('token', result.token);
      localStorage.setItem('username', username);
      localStorage.setItem('password', password);
      this.forceUpdate();
    }
    catch(error) {
      localStorage.setItem('auth', false);
      return false;
    }
    return true;
  }

  async signIn(username, password) {
    let success = await this.getToken(username, password);
    localStorage.setItem('auth', true);

    return success;
  }

  async signUp(username, password, firstName, lastName) {
    let headers = new Headers();
    headers.append("Content-Type", "application/json");

    let body = JSON.stringify({
      username: username,
      password: password,
      firstName: firstName,
      lastName: lastName
    })

    var requestOptions = {
      method: 'POST',
      headers: headers,
      body: body,
      redirect: 'follow'
    };

    try {
      let response = await fetch('https://mysqlcs639.cs.wisc.edu/users/', requestOptions)
      let result = await response.json();
      if(!('message' in result) || result.message !== 'User created!') {
        return false;
      }

      let success = await this.getToken(username, password);
      localStorage.setItem('auth', false);
      return success;
    }
    catch(error) {
      return false;
    }
  }
}

export default App;
