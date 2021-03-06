/* jshint expr:true */
import Ember from 'ember';
import { describe, beforeEach, afterEach, it } from 'mocha';
import { expect } from 'chai';
import sinon from 'sinon';
import setupSession from 'ember-simple-auth/initializers/setup-session';
import Ephemeral from 'ember-simple-auth/session-stores/ephemeral';
import InternalSession from 'ember-simple-auth/internal-session';

describe('setupSession', () => {
  let registry;

  beforeEach(() => {
    registry = {
      register() {},
      injection() {}
    };
  });

  it('registers the session', () => {
    sinon.spy(registry, 'register');
    setupSession(registry);

    expect(registry.register).to.have.been.calledWith('session:main', InternalSession);
  });

  describe('when Ember.testing is true', () => {
    it('registers the test session store', () => {
      sinon.spy(registry, 'register');
      setupSession(registry);

      expect(registry.register).to.have.been.calledWith('session-store:test', Ephemeral);
    });

    it('injects the test session store into the session', () => {
      sinon.spy(registry, 'injection');
      setupSession(registry);

      expect(registry.injection).to.have.been.calledWith('session:main', 'store', 'session-store:test');
    });
  });

  describe('when Ember.testing is false', () => {
    beforeEach(() => {
      Ember.testing = false;
    });

    afterEach(() => {
      Ember.testing = true;
    });

    it('injects the application session store into the session', () => {
      sinon.spy(registry, 'injection');
      setupSession(registry);

      expect(registry.injection).to.have.been.calledWith('session:main', 'store', 'session-store:application');
    });
  });
});
