var FourConnect = artifacts.require("./FourConnect.sol");
var Thrower = artifacts.require("./Thrower.sol");

module.exports = function(deployer) {
  deployer.deploy(FourConnect);
  deployer.deploy(Thrower);
};
