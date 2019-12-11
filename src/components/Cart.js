import React from "react";
import "../styles/App.css";

import {Link} from "react-router-dom";

import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Card from "react-bootstrap/Card";
import Image from "react-bootstrap/Image";

import { TiHome } from "react-icons/ti";

class Cart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      products: []
    };
  }

  async componentDidMount() {
    await this.fetchProducts();
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
          <div style={{display: 'flex', flexDirection: 'row'}}>{this.getProducts()}</div>
          Total: ${this.getTotalPrice()}
          <Button variant="outline-dark" style={{...styles.buttonStyle, marginTop: 20}} onClick={() => this.clearCart()}>
            Clear cart
          </Button>
          <Link to={'/' + this.props.username + '/cart-review'} className='basic'>
            <Button variant="outline-dark" style={{...styles.buttonStyle, marginTop: 20}}>
              Purchase
            </Button>
          </Link>
        </div>
      </>
    );
  }

  async fetchProducts() {
    while(true) {
      let myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("x-access-token", localStorage.getItem('token'));

      let requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
      };

      let productsResponse = await fetch('https://mysqlcs639.cs.wisc.edu/application/products', requestOptions);
      if(!productsResponse.ok) {
        await this.delay(500);
        continue;
      }
      let productsResult = await productsResponse.json();

      this.setState({products: productsResult.products});

      await this.delay(500);
    }
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
                {this.getQuantityButtons(product.id)}
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

  getQuantityButtons(id) {
    let product = null;

    for(const iProduct of this.state.products) {
      if(iProduct.id === id) {
        product = iProduct;
        break;
      }
    }

    return (
      <ButtonGroup style={{display: 'flex', flexDirection: 'row', marginTop: 30}}>
        <Button variant='outline-dark' onClick={(e) => this.decrease(e, id)} style={{width: 40}}>-</Button>
        <Button variant='outline-dark' disabled>{product.count}</Button>
        <Button variant='outline-dark' onClick={(e) => this.increase(e, id)} style={{width: 40}}>+</Button>
      </ButtonGroup>
    )
  }

  async decrease(e, id) {
    e.preventDefault();

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("x-access-token", localStorage.getItem('token'));

    let requestOptions = {
      method: 'DELETE',
      headers: myHeaders,
      redirect: 'follow'
    };

    await fetch('https://mysqlcs639.cs.wisc.edu/application/products/' + id, requestOptions);

    await this.fetchProducts();
  }

  async increase(e, id) {
    e.preventDefault();

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("x-access-token", localStorage.getItem('token'));

    let requestOptions = {
      method: 'POST',
      headers: myHeaders,
      redirect: 'follow'
    };

    await fetch('https://mysqlcs639.cs.wisc.edu/application/products/' + id, requestOptions);

    await this.fetchProducts();
  }

  async clearCart() {
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("x-access-token", localStorage.getItem('token'));

    let requestOptions = {
      method: 'DELETE',
      headers: myHeaders,
      redirect: 'follow'
    };

    await fetch('https://mysqlcs639.cs.wisc.edu/application/products', requestOptions);

    await this.fetchProducts();
  }

  async delay(delayInms) {
    return new Promise(resolve  => {
      setTimeout(() => {
        resolve(2);
      }, delayInms);
    });
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

export default Cart;
