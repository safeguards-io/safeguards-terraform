const jsonata = require('jsonata');
const { Safeguard } = require("safeguards-sdk");

class TerraformAllowedModules extends Safeguard {
  check(data, settings) {
    const allowedSources = settings.allowed;

    const matchExp = '**.module_calls.*.source';
    const moduleSources = jsonata(matchExp).evaluate(data);

    const regex = /^([a-zA-Z0-9-]+)\/([a-zA-Z0-9-]+)\/([a-zA-Z0-9-]+)$/;

    if (!moduleSources || !moduleSources.length) {
      this.results.skip("Terraform configuration doesn't contain any modules");
    }

    moduleSources.forEach((moduleSource) => {
      if (moduleSource.match(regex)) {
        if (!allowedSources.includes(moduleSource)) {
          this.results.fail(`Module source "${moduleSource}" is not an approved module`);
        }
      }
    });

    return this.results.pass();
  }
}

module.exports = TerraformAllowedModules;
