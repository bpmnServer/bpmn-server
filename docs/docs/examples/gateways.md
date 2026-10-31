# Gateways

[gateways - camunda7 manual](https://docs.camunda.org/manual/7.5/reference/bpmn20/gateways)

| Type            | Symbol | Incoming (Join/Converge)   | Outgoing (Fork/Diverge)                                     |
| --------------- | ------ | -------------------------- | ----------------------------------------------------------- |
| Exclusive (XOR) | ![](../bpmn/BPMN_exclusive_gateway-59x59.png)  | Only one,cancel the rest   | Only one based on conditions or first of multipe            |
| Inclusive       | ![](../bpmn/BPMN_inclusive_gateway-59x59.png)  | wait for all active tokens | All true conditions                                         |
| Parallel        | ![](../bpmn/BPMN_parallel_gateway-59x59.png)         | Wait for all active tokens | All                                                         |
| Event-based     | ![](../bpmn/BPMN_event_based_gateway-59x59.png)        | Only One                   | all will execute,but first to complete will cancel the rest |
| Complex         |        |                            |                                                             |
