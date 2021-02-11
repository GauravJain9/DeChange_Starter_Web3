const DeChange_Starter = artifacts.require("DeChange_Starter");

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("DeChange_Starter", function (accounts) {
  it("should be deployed", async function () {
    await DeChange_Starter.deployed();
    return assert.isTrue(true);
  });

  it("Should successfully add the products", async function () {
    const accounts = web3.eth.getAccounts();
    await DeChange_Starter.additems(1,"hp","laptop",2,31).send({from: accounts[0],value: web3.utils.toWei('1','ether')});
    const items = DeChange_Starter.getitems().call({from: accounts[0]});
    return assert.equal(1,items.length);
  });
   


});
