# Gateways

[gateways - camunda7 manual](https://docs.camunda.org/manual/7.5/reference/bpmn20/gateways)

| Type            | Symbol | Incoming (Join/Converge)   | Outgoing (Fork/Diverge)                                     |
| --------------- | ------ | -------------------------- | ----------------------------------------------------------- |
| Exclusive (XOR) |        | Only one                   | Only one based on conditions or first of multipe            |
| Inclusive       |        | wait for all active tokens | All true conditions                                         |
| Parallel        |        | Wait for all active tokens | All                                                         |
| Event-based     |        | Only One                   | all will execute,but first to complete will cancel the rest |
| Complex         |        |                            |                                                             |
