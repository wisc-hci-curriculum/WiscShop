import React from "react";
import "../styles/App.css";
import { Link } from "react-router-dom";

import Card from "react-bootstrap/Card";
import Image from "react-bootstrap/Image";
import Spinner from "react-bootstrap/Spinner";

import Checkbox from '@material-ui/core/Checkbox';

import { TiShoppingCart, TiHome } from "react-icons/ti";

class Category extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      tags: [],
      applicationTags: []
    };
  }

  render() {
    return (
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <Link to={'/' + this.props.username} className='button' style={{margin: 20}}>
          <TiHome style={styles.homeIcon} />
        </Link>
        <Link to={'/' + this.props.username + '/cart'} className='button' style={{margin: 20}}>
          <TiShoppingCart style={styles.shoppingCartIcon} />
        </Link>
        <div style={styles.pageTitle}>
          <span>
            <h1>{this.props.name[0].toUpperCase() + this.props.name.substring(1, this.props.name.length)}</h1>
          </span>
        </div>
        <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
          {this.getTags()}
        </div>
        <div style={styles.pageBody}>
          {this.getProducts()}
        </div>
      </div>
    );
  }

  async componentDidMount() {
    await this.clearTags();
    await this.fetchProducts();
    this.fetchTags();
    this.fetchTagsFromServer();
  }

  async clearTags() {
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("x-access-token", localStorage.getItem('token'));

    let requestOptions = {
      method: 'DELETE',
      headers: myHeaders,
      redirect: 'follow'
    };

    await fetch('https://mysqlcs639.cs.wisc.edu/application/tags', requestOptions);
  }

  async fetchTagsFromServer() {
    while(true) {
      let myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("x-access-token", localStorage.getItem('token'));

      let requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
      };

      let tagsResponse = await fetch('https://mysqlcs639.cs.wisc.edu/application/tags', requestOptions);
      if(!tagsResponse.ok) {
        await this.delay(500);
        continue;
      }
      let tagsResult = await tagsResponse.json();


      if(tagsResult.tags.length !== this.state.applicationTags.length) {
        await this.setState({applicationTags: tagsResult.tags});
        await this.fetchProducts();
        continue;
      }

      for(let i = 0; i < this.state.applicationTags.length; i++) {
        if(tagsResult.tags[i] !== this.state.applicationTags[i]) {
          await this.setState({applicationTags: tagsResult.tags});
          await this.fetchProducts();
          break;
        }
      }
      await this.delay(500);
    }
  }

  async delay(delayInms) {
    return new Promise(resolve  => {
      setTimeout(() => {
        resolve(2);
      }, delayInms);
    });
  }

  getProducts() {
    let products = [];

    for(const product of this.state.products) {
      products.push(
        <Link
          key={product.id}
          to={
            "/" +
            this.props.username +
            "/" +
            product.category +
            "/products/" +
            product.id
          }
          className="basic"
          style={{ margin: "1em" }}
        >
          <Card key={product.name} style={styles.cardBody}>
            <Card.Body>
              <Card.Title>
                <h2>{product.name}</h2>
              </Card.Title>
              <Card.Subtitle style={{ marginTop: 5 }}>
                ${product.price}
              </Card.Subtitle>
              <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <Image style={{ width: 150 }} src={product.image} rounded />
              </div>
            </Card.Body>
          </Card>
        </Link>
      );
    }

    return products;
  }

  async fetchProducts() {
    let tags = this.state.applicationTags;
    if(tags == null || tags.length === 0) {
      let myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("x-access-token", localStorage.getItem("token"));

      let requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow"
      };

      let response = await fetch(
        "https://mysqlcs639.cs.wisc.edu/products?category=" + this.props.name,
        requestOptions
      );
      let result = await response.json();

      await this.setState({ products: result.products });
    }
    else {
      let myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("x-access-token", localStorage.getItem("token"));

      let requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow"
      };

      let tagsString = '';

      for(let i = 0; i < tags.length; i++) {
        if(i === tags.length - 1) {
          tagsString += tags[i];
        }
        else {
          tagsString += tags[i] + ',';
        }
      }

      let response = await fetch('https://mysqlcs639.cs.wisc.edu/products?category=' + this.props.name + '&tags=' + tagsString, requestOptions);
      let result = await response.json();

      await this.setState({ products: result.products });
    }
  }

  async fetchTags() {
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("x-access-token", localStorage.getItem("token"));

    let requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow"
    };

    let response = await fetch('https://mysqlcs639.cs.wisc.edu/categories/' + this.props.name + '/tags', requestOptions);
    let result = await response.json();

    this.setState({tags: result.tags})
  }

  getTags() {
    if(this.state.tags.length === 0) {
      return (
        <Spinner animation="border" />
      )
    }

    let tags = [];
    let checked = this.getChecked();

    for(let i = 0; i < this.state.tags.length; i++) {
      tags.push (
        <div key={'tag_' + i} style={{display: 'flex', flexDirection: 'row', alignItems: 'center', margin: 10}}>
          <Checkbox
            onChange={(e) => this.handleCheck(e, this.state.tags[i])}
            checked={checked[i]}
            color='primary'
            inputProps={{
              'aria-label': 'primary checkbox',
            }}
          />
          <div>{this.state.tags[i]}</div>
        </div>
      )
    }

    return tags;
  }

  getChecked() {
    let checked = [];
    for(let i = 0; i < this.state.tags.length; i++) {
      checked.push(this.state.applicationTags.indexOf(this.state.tags[i]) > -1)
    }

    return checked
  }

  async handleCheck(e, tag) {
    if(e.target.checked) {
      let myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("x-access-token", localStorage.getItem("token"));

      let requestOptions = {
        method: "POST",
        headers: myHeaders,
        redirect: "follow"
      };

      await fetch("https://mysqlcs639.cs.wisc.edu/application/tags/" + tag, requestOptions);
    }
    else {
      let myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("x-access-token", localStorage.getItem("token"));

      let requestOptions = {
        method: "DELETE",
        headers: myHeaders,
        redirect: "follow"
      };

      await fetch("https://mysqlcs639.cs.wisc.edu/application/tags/" + tag, requestOptions);
    }

    await this.fetchProducts();
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
    width: '70%',
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    flexWrap: 'wrap'
  },
  cardBody: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    width: 300
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
  }
};

export default Category;
