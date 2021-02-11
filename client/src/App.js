import React, { Component } from "react";
import DeChange_Starter from "./contracts/DeChange_Starter.json";
import getWeb3 from "./getWeb3";
import * as ReactBootStrap from "react-bootstrap";
import "./App.css";

class App extends Component {
state = {
  web3: null,
  accounts: null,
  contract: null,
  id: null,
  name: null,
  category: null,
  price: null,
  qty: null,
  message: null,
  products: [],
  itemlength: null,
  value1: null,
  value2: null
};

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = DeChange_Starter.networks[networkId];
       const instance = new web3.eth.Contract(
         DeChange_Starter.abi,
         deployedNetwork && deployedNetwork.address
      );



      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3: web3, accounts: accounts, contract: instance });
      //console.log(this.state.accounts);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  onSubmit = async (event) => {
     // const web3 = await getWeb3();
     // const accounts = await web3.eth.getAccounts();
    event.preventDefault();
    this.setState({message: 'Please wait the item is being added'});
    await this.state.contract.methods.additems(this.state.id,this.state.name,this.state.category,this.state.web3.utils.toWei(this.state.price,'ether'),this.state.qty).send({from: this.state.accounts[0]});
     const prod = await this.state.contract.methods.getitems().call();
     // //console.log(prod);
      this.setState({itemlength: prod.length, products: prod});
  }

  show = async(event) => {
    event.preventDefault();
    const prod = await this.state.contract.methods.getitems().call();
    //console.log(prod);
    this.setState({itemlength: prod.length, products: prod});
  }

  renderTableHeader = () => {
        let headerElement = ['Id', 'Name', 'Category', 'Price', 'Quantity', 'BuyProduct']

        return headerElement.map((key, index) => {
            return <th key={index}>{key.toUpperCase()}</th>
        })
    }


    renderTableData = () => {
        return this.state.products && this.state.products.map( products => {
            return (
                <tr key={products.id}>
                    <td>{products.id}</td>
                    <td>{products.name}</td>
                    <td>{products.category}</td>
                    <td>{products.price}</td>
                    <td>{products.qty}</td>
                    <td><button class = "button" onClick={this.buyproduct}> Buy </button></td>
                </tr>
            )
        })
    }


// clear = async (event) => {
//   event.preventDefault();
//   await this.state.contract.methods.clear().call();
// }

   buyproduct = async (event) => {
     //const web3 = await getWeb3();
     //const accounts = await web3.eth.getAccounts();
     event.preventDefault();
     this.setState({message: 'Please wait for the transaction to be processed'});
     const prod = await this.state.contract.methods.getitems().call();
     this.setState({itemlength: prod.length, products: prod});
    await this.state.contract.methods.buy(this.state.value1).send({from: this.state.accounts[0], value: this.state.web3.utils.toWei(prod[this.state.value1-1].price , 'ether')});
    // //console.log(prod);

     console.log(prod[this.state.value1-1].price);
    //console.log(this.state.value1);
  };

  render() {
    const {products}=this.state;
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
<div className="App">
        <h1>DeChange_Starter</h1>
        <hr />
        <form onSubmit={this.onSubmit}>
        <fieldset>
        <legend class="margin"><h3>Please add items here</h3></legend>
        <label><b><i>Enter the product id       </i></b></label>
        <input type="number" step="any" min="1" class="shadow"
        value={this.state.id}
        onChange = {event => this.setState({id: event.target.value})} required
        />
        <br />
        <br />
        <label><b><i>Enter the product name       </i></b></label>
        <input type="text" class="shadow"
        value={this.state.name}
        onChange = {event => this.setState({name: event.target.value})} required
        />
        <br />
        <br />
        <label><b><i>Enter the product category       </i></b></label>
        <input type="text" class="shadow"
        value={this.state.category}
        onChange = {event => this.setState({category: event.target.value})} required
        />
        <br />
        <br />
        <label><b><i>Enter the product price       </i></b></label>
        <input type="number" step="any" min="0" class="shadow"
        value={this.state.price}
        onChange = {event => this.setState({price: event.target.value})} required
        />
        <br />
        <br />
        <label><b><i>Enter the product quantity       </i></b></label>
        <input type="number" class="shadow" min="1"
        value={this.state.qty}
        onChange = {event => this.setState({qty: event.target.value})} required
        />
        <br />
        <br />
        </fieldset>
        <button class = "button"> Enter </button>
        </form>
        <hr />
        <button class = "button" onClick={this.show}> Show </button>
        <hr />
        <ReactBootStrap.Table striped bordered hover>
        <thead>
        <tr>{this.renderTableHeader()}</tr>
        </thead>
        <tbody>
        {this.renderTableData()}
       </tbody>
       </ReactBootStrap.Table>
       <hr />
       <form onSubmit={this.buyproduct}>
       <label><b><i>Enter the product ID you want to purchase        </i></b></label>
       <input type="number" class="shadow" min="1"
       value={this.state.value1}
       onChange = {event => this.setState({value1: event.target.value})} required
       />
       <br />
       <button class = "button"> Buy </button>
       </form>
       </div>
    );
  }
}

export default App;
