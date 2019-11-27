import React from "react";
// import Lottie from "react-lottie";
import { Link } from "react-router-dom";

// import { TiShoppingCart } from "react-icons/ti";
import { FaRedhat, FaTshirt } from "react-icons/fa";
import { GiPolarBear, GiFemaleLegs, GiPoloShirt, GiArmoredPants } from "react-icons/gi";

import Card from "react-bootstrap/Card";

import "../styles/App.css";

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: false
    };
  }

  render() {
    return (
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>

        <div style={styles.pageTitle}>
          <span style={{marginTop:100}}>
            <h1>Welcome, {this.props.firstName ? this.props.firstName : this.props.username}</h1>
          </span>
        </div>
        <div style={styles.pageBody}>{this.getCategories()}</div>
      </div>
    );
  }

  getCategories() {
    let categories = [];

    for (const category of this.props.categories) {
      categories.push (
        <Link to={'/' + this.props.username + '/' + category} key={category} className='basic' style={styles.link}>
          <Card style={styles.cardBody} className="text-center">
            <Card.Body style={{display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
              <Card.Title>
                <h2>{category[0].toUpperCase() + category.substring(1, category.length)}</h2>
              </Card.Title>
              {this.getCategoryIcon(category)}
            </Card.Body>
          </Card>
        </Link>
      );
    }

    return categories;
  }

  getCategoryIcon(category) {
    switch (category) {
      case "plushes":
        return (
          <Card.Text>
            <GiPolarBear style={styles.iconStyle} size={48} />
          </Card.Text>
        );
      case "hats":
        return (
          <Card.Text>
            <FaRedhat style={styles.iconStyle} size={48} />
          </Card.Text>
        );
      case "leggings":
        return (
          <Card.Text>
            <GiFemaleLegs style={styles.iconStyle} size={48} />
          </Card.Text>
        );
      case "sweatshirts":
        return (
          <Card.Text>
            <GiPoloShirt style={styles.iconStyle} size={48} />
          </Card.Text>
        );
      case "bottoms":
        return (
          <Card.Text>
            <GiArmoredPants style={styles.iconStyle} size={48} />
          </Card.Text>
        );
      case "tees":
        return (
          <Card.Text>
            <FaTshirt style={styles.iconStyle} size={48} />
          </Card.Text>
        );

      default:
        return <Card.Text></Card.Text>;
    }
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
    textDecoration: "none",
    color: "#000",
    width: 250,
    height: 200
  },
  link: {
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
  swithButton: {
    marginTop: "0.5em",
    marginLeft: "0.5em"
  }
};

export default Home;
