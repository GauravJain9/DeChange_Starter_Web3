pragma solidity ^0.5.1;
pragma experimental ABIEncoderV2;
contract DeChange_Starter
{
    struct item
    {
        uint id;
        string name;
        string category;
        uint price;
        uint qty;
    }
        address payable owner;
        constructor() public {
           owner = msg.sender;
   }
     modifier onlyOwner {
       require(msg.sender==owner);
       _;
   }
    item[] public items;
    function additems(uint id, string memory name, string memory category, uint price, uint qty) public onlyOwner
    {
        items.push(item(id,name,category,price,qty));
    }
    function getitems() public view returns (item[] memory)
    {
        return items;
    }
    function buy(uint id) public payable
     {
        require(owner!=msg.sender);
        uint amount;
        uint p;
        for(uint i=0;i<items.length;i++)
        {
            if((items[i]).id==id)
            {
                require(items[i].qty>0);
                amount = items[i].price;
                p=i;
                break;
            }
        }
        require(items[p].qty>0, 'Item not available');
        require(msg.value>=amount);
        owner.transfer(msg.value);
        items[p].qty=(items[p].qty)-1;

    }
    function clear() public onlyOwner
    {
        items.length=0;
    }
}
