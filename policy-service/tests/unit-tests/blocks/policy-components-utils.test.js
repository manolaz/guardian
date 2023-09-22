const moduleAlias = require('module-alias');

moduleAlias.addAliases({
  "@api": process.cwd() + '/dist' + "/api",
  "@entity": process.cwd() + '/dist' + "/entity",
  "@subscribers": process.cwd() + '/dist' + "dist/subscribers",
  "@helpers": process.cwd() + '/dist' + "/helpers",
  "@auth": process.cwd() + '/dist' + "/auth",
  "@policy-engine": process.cwd() + '/dist' + "/policy-engine",
  "@hedera-modules": process.cwd() + '/dist' + "/hedera-modules/index",
  "@document-loader": process.cwd() + '/dist' + "/document-loader",
  "@database-modules": process.cwd() + '/dist' + "/database-modules"
});

const rewire = require("rewire");

const {Inject} = rewire('../../../dist/helpers/decorators/inject');
const {PolicyComponentsUtils} = require("../../../dist/policy-engine/policy-components-utils");
const {GenerateNewUUID} = require('@guardian/common');
const {assert} = require('chai');
const { GenerateUUIDv4 } = require("@guardian/interfaces");

describe('State Container', function () {
    it('GenerateNewUUID', async function () {
        assert.equal(GenerateUUIDv4().length, 36)
    });

    // it('IfUUIDRegistered', async function () {
    //     assert.equal(PolicyComponentsUtils.IfUUIDRegistered(new Array(36).fill('0').join('')), false);
    //     const uuid = GenerateUUIDv4();
    //     PolicyComponentsUtils.PolicyBlockMapObject.set(uuid, {});
    //     assert.equal(PolicyComponentsUtils.IfUUIDRegistered(uuid), true);
    //
    // });
})
