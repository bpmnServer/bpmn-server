'use strict';

//const Bpmn = require('../../../bpmn-engine-master/index.js');
const Bpmn = require('bpmn-engine');

const factory = require('./helpers/factory');
const testHelpers = require('./helpers/testHelpers');
const {EventEmitter} = require('events');

const { Engine } = require('bpmn-engine');


Feature('Timer Test', () => {
  Scenario('Execution is stopped and resumed', () => {
    let engine, listener, source;
    Given('a bpmn source with one user task', () => {
      source = `
      <definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
        <process id="theProcess" isExecutable="true">
    <intermediateCatchEvent id="timerEvent">
      <timerEventDefinition id="TimerEventDefinition_07xu06a">
        <timeDuration>PT5S</timeDuration>
      </timerEventDefinition> 		  
    </intermediateCatchEvent>
        </process>
      </definitions>`;
    });

    Given('an engine with source', () => {
      engine = Engine({
        name: 'Engine feature',
        source
      });
    });

    And('a listener', () => {
      listener = new EventEmitter();
    });

    let waiting;
    And('listening once for wait', () => {
      waiting = new Promise((resolve) => {
        listener.once('wait', (api) => {
          resolve(api);
        });
      });
    });

    When('source is executed', () => {
      engine.execute({listener});
    });

    And('user task is in a waiting state', async () => {
      await waiting;
    });

    let state;
    Then('the executing source is stopped', async () => {
      await engine.stop();

      state = await engine.getState();

      expect(state).to.have.property('state', 'stopped');
      expect(state.definitions).to.have.length(1);
      expect(state.definitions[0].source).to.be.ok;
    });

    let recovered;
    When('engine is recovered', () => {
      recovered = Engine({
        name: 'Recovered engine',
      }).recover(state);
    });

    Then('engine state is idle', async () => {
      expect(recovered).to.have.property('state', 'idle');
    });

    let definition;
    But('definitions has a resumed state', async () => {
      const definitions = await recovered.getDefinitions();
      expect(definitions.length).to.equal(1);

      [definition] = definitions;
      expect(definition.getActivityById('task')).to.be.ok;
    });

    And('user task is in executing state', () => {
      expect(definition.getActivityById('task')).to.have.property('status', 'executing');
    });

    And('listening once for wait', () => {
      waiting = new Promise((resolve) => {
        listener.once('wait', (api) => {
          resolve(api);
        });
      });
    });

    When('resumed', () => {
      recovered.resume({listener});
    });

    Then('engine is running', () => {
      expect(recovered.state).to.equal('running');
    });

    When('task is signaled', async () => {
      const api = await waiting;
      api.signal();
    });

    Then('execution completes', () => {
      expect(recovered).to.have.property('state', 'idle');
    });
  });
});