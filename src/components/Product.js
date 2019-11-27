import React from "react";
import "../styles/App.css";
import { Link } from "react-router-dom";

import { Button, Card, Image, ButtonGroup, Toast } from "react-bootstrap";

import Rating from "@material-ui/lab/Rating";
import Box from "@material-ui/core/Box";

import { TiShoppingCart, TiHome } from "react-icons/ti";

class Product extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      reviewsList: [],
      quantity: 1,
      showToast: false
    };
  }

  componentDidMount() {
    this.setState({ reviewList: this.fetchReviews() });
  }

  async fetchReviews() {
    const baseUrl = "https://mysqlcs639.cs.wisc.edu";

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("x-access-token", localStorage.getItem("token"));

    let requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow"
    };

    let response = await fetch(
      baseUrl + "/" + this.props.path + "/reviews",
      requestOptions
    );
    let result = await response.json();

    this.setState({ reviewsList: result.reviews });
  }

  getReviewList = () => {
    let reviews = [];
    for (const review of this.state.reviewsList) {
      reviews.push(
        <Card key={review.id} style={styles.review}>
          <Card.Body>
            <Card.Title>
              <Box component="fieldset" mb={3} borderColor="transparent">
                <Rating
                  name="rating"
                  value={review.stars}
                  precision={0.1}
                  readOnly
                />
              </Box>
            </Card.Title>
            <Card.Subtitle className="mb-2 text-muted">
              {review.title}
            </Card.Subtitle>
            <Card.Text>{review.text}</Card.Text>
          </Card.Body>
        </Card>
      );
    }

    return reviews;
  };

  render() {
    return (
      <>
        <Link to={'/' + this.props.username} className='button' style={{margin: 20}}>
          <TiHome style={styles.homeIcon} />
        </Link>
        <Link to={'/' + this.props.username + '/cart'} className='button' style={{margin: 20}}>
          <TiShoppingCart style={styles.shoppingCartIcon} />
        </Link>
        <div style={styles.pageTitle}>
          <span>
            <h1>{this.props.product.name}</h1>
          </span>
        </div>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <div style={styles.pageBody}>
            <Image src={this.props.product.image} style={{width: 400, marginBottom: 25}}/>
            {this.props.product.description}
            {this.getQuantityButtons()}
            <Button variant='outline-dark' onClick={() => this.addToCart()} style={{marginTop: 20, marginBottom: 20}}>Add to cart</Button>
            <Toast onClose={() => this.setState({showToast: false})} show={this.state.showToast} delay={3000} autohide>
              <Toast.Body>✓ Added to cart</Toast.Body>
            </Toast>
            <div style={{width: '100%'}}>{this.getReviewList()}</div>
          </div>
        </div>
      </>
    );
  }

  async addToCart() {
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("x-access-token", localStorage.getItem('token'));

    let requestOptions = {
      method: 'POST',
      headers: myHeaders,
      redirect: 'follow'
    };

    for(let i = 0; i < this.state.quantity; i++) {
      await fetch('https://mysqlcs639.cs.wisc.edu/application/products/' + this.props.product.id, requestOptions)
    }
    this.setState({showToast: true})
  }

  getQuantityButtons() {
    return (
      <ButtonGroup style={{display: 'flex', flexDirection: 'row', marginTop: 30}}>
        <Button variant='outline-dark' onClick={() => this.decrease()} style={{width: 40}}>-</Button>
        <Button variant='outline-dark' disabled>{this.state.quantity}</Button>
        <Button variant='outline-dark' onClick={() => this.increase()} style={{width: 40}}>+</Button>
      </ButtonGroup>
    )
  }

  decrease() {
    if(this.state.quantity > 1) {
      this.setState({quantity: this.state.quantity - 1})
    }
  }

  increase() {
    this.setState({quantity: this.state.quantity + 1})
  }
}

const styles = {
  pageTitle: {
    height: "20%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    fontWeight: "bold"
  },
  pageBody: {
    height: "40%",
    width: '40%',
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    margin: "2em"
  },
  cardBody: {
    margin: "1em"
  },
  shoppingCartIcon: {
    height: "3em",
    width: "3em",
    position: "absolute",
    right: 0,
    top: 0,
    marginTop: "0.5em",
    marginRight: "0.5em"
  },
  homeIcon: {
    height: "3em",
    width: "3em",
    position: "absolute",
    left: 10,
    top: 0,
    marginTop: "0.5em",
    marginRight: "0.5em"
  },
  review: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    marginLeft: "2em",
    marginRight: "2em",
    marginTop: "2em",
  },
  image: {
    width: 400
  }
};

export default Product;
