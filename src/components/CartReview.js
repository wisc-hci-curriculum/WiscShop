import React from "react";
import "../styles/App.css";

import {Link} from "react-router-dom";

import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Image from "react-bootstrap/Image";

import { TiHome } from "react-icons/ti";

class CartReview extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      products: []
    };
  }

  async componentDidMount() {
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("x-access-token", localStorage.getItem('token'));

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };

    let response = await fetch('https://mysqlcs639.cs.wisc.edu/application/products', requestOptions);
    let result = await response.json();

    this.setState({products: result.products});
  }

  render() {
    if(this.state.products.length === 0) {
      return (
        <>
          <Link to={'/' + this.props.username} className='button' style={{margin: 20}}>
            <TiHome style={styles.homeIcon} />
          </Link>

          <div style={{...styles.container, fontSize: 30}}>
            Looks like you don't have any items in your cart
          </div>
        </>
      )
    }
    return (
      <>
        <Link to={'/' + this.props.username} className='button' style={{margin: 20}}>
          <TiHome style={styles.homeIcon} />
        </Link>

        <div style={{...styles.container, fontSize: 30}}>
          <p style={{fontSize: 40}}>Confirm your order</p>
          <div style={{display: 'flex', flexDirection: 'row'}}>{this.getProducts()}</div>
          Total: ${this.getTotalPrice()}
          <Link to={'/' + this.props.username + '/cart-confirmed'} className='basic'>
            <Button variant="outline-dark" style={{...styles.buttonStyle, marginTop: 20}}>
              Confirm
            </Button>
          </Link>
        </div>
      </>
    );
  }

  getProducts() {
    let products = [];

    for(const product of this.state.products) {
      products.push(
        <Link key={product.id} to={'/' + this.props.username + '/' + product.category + '/products/' + product.id} className='basic' style={{margin: '1em'}}>
          <Card key={product.name} style={styles.cardBody}>
            <Card.Body>
              <Card.Title>
                <h2>{product.name}</h2>
              </Card.Title>
              <Card.Subtitle style={{ marginTop: 5 }}>
                ${product.price}
              </Card.Subtitle>
              <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontSize: 18}}>
                <Image style={{ width: 150, marginBottom: 10 }} src={product.image} rounded/>
                <div>x {product.count}</div>
                <div style={{marginTop: 10, fontSize: 30}}>${product.price * product.count}</div>
              </div>
            </Card.Body>
          </Card>
        </Link>
      );
    }

    return products;
  }


  getTotalPrice() {
    let price = 0;

    for(const product of this.state.products) {
      price += product.count * product.price
    }

    return price
  }
}

const styles = {
  container: {
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column"
  },
  cardBody: {
    width: 300
  },
  homeIcon: {
    height: "3em",
    width: "3em",
    position: "absolute",
    left: 10,
    top: 0,
    marginTop: "0.5em",
    marginRight: "0.5em"
  }
};

export default CartReview;
