const semver = require('semver');
const { Safeguard } = require("safeguards-sdk");

class TerraformVersionSafeguard extends Safeguard {
  check(data, settings) {
    const version = data.terraform_version;
    const passes = semver.satisfies(version, settings);
    if (!passes) {
      this.results.fail(`The Terraform Version, ${version}, does not meet the required version range, ${settings}`);
    }

    return this.results.pass();
  }
}

module.exports = TerraformVersionSafeguard;
