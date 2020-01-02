const { expect } = require('chai');
const path = require('path');
const fs = require('fs');
const Safeguards = require('../index')

describe('policies', () => {
  describe('terraform', () => {
    before(() => {
      const planFilePath = path.resolve(__dirname, './fixtures/terraform-aws-ec2.json');
      const rawdata = fs.readFileSync(planFilePath);
      this.terraformState = JSON.parse(rawdata);
    });

    describe('version', () => {
      before(() => {
        this.safeguard = new Safeguards.version()
      });

      it('should pass if range requirement is met', () => {
        const settings = '^0.12.0-beta1';
        expect(this.safeguard.check(this.terraformState, settings)).to.be.true;
      });

      it('should fail if range requirement is not met', () => {
        const settings = { range: '>=0.13.0' };
        expect(() => this.safeguard.check(this.terraformState, settings)).to.throw();
      });
    });

    describe('allowed-modules', () => {
      before(() => {
        this.safeguard = new Safeguards.allowed_modules()
      });

      it('should pass if using only allowed modules', () => {
        const settings = { allowed: ['skierkowski/proj/test'] };
        expect(this.safeguard.check(this.terraformState, settings)).to.be.true;
      });

      it('should fail if not an approved module', () => {
        const settings = { allowed: ['foo/baz/bar'] };
        expect(() => this.safeguard.check(this.terraformState, settings)).to.throw('not an approved module');
      });
    });

  });
});
