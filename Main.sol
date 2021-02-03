pragma solidity ^0.5.1;
pragma experimental ABIEncoderV2;
contract DeChangeStarter
{
    struct item
    {
        uint id;
        string name;
        string category;
        uint price;
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
    uint itemcount=0;
    function additems(uint id, string memory name, string memory category, uint price) public onlyOwner
    {
        items.push(item(id,name,category,price));
        itemcount++;
    }
    function getitems() public view returns (item[] memory)
    {
        return items;
    }
    function buy(uint id) public payable
     {
        
        uint amount;
        for(uint i=0;i<items.length;i++)
        {
            if((items[i]).id==id)
            {
                amount = items[i].price;
                break;
            }
        }
        require(owner!=msg.sender);
        require(amount==msg.value);
        owner.transfer(msg.value);
    }
}
