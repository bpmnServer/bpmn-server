# Docker engine performance comparison

This folder contains the recorded comparison for the separated-engine setup:

- native host + native engine
- native host + Docker engine

## Recorded Linux run

The Linux run was performed on the corrected AWS host on 2026-11-23.

| Measurement | All native | Native host + Docker engine | All Docker |
| --- | ---: | ---: | ---: |
| Full host API median | 11.39 ms | 11.37 ms | 12.09 ms |
| Full host API p95 | 12.76 ms | 12.19 ms | 15.02 ms |

The full-stack comparison is:

- **All native:** host, engine, and MongoDB run directly on Linux.
- **Hybrid:** host and MongoDB run directly on Linux; only the engine runs in
  Docker.
- **All Docker:** host, engine, and MongoDB run as Compose services.

The raw full host API timings were:

| Setup | Mean | Median | p95 | Min | Max |
| --- | ---: | ---: | ---: | ---: | ---: |
| All native | 11.58 ms | 11.39 ms | 12.76 ms | 10.95 ms | 18.90 ms |
| Hybrid | 11.56 ms | 11.37 ms | 12.19 ms | 10.87 ms | 20.90 ms |
| All Docker | 12.64 ms | 12.09 ms | 15.02 ms | 11.51 ms | 25.08 ms |

For the internal host-to-engine probe, the native and hybrid runs measured
0.77 ms and 0.84 ms median respectively. The all-Docker diagnostic measured
1.36 ms median from inside the host container using Node `fetch`; because the
client and network path differ, treat that number as directional rather than a
strict apples-to-apples comparison.

Each result used 20 warm-up requests followed by 100 timed requests. The
figures are local loopback measurements on the AWS Linux machine; lower is
faster.

### What the measurements mean

- **Host-to-engine** measures the internal call from the HR host to the
  workflow engine.
- **Full host API** measures a request through the HR host, including its
  engine call.
- The host API endpoint returned HTTP 200. The direct engine probe used the
  existing health-check path and returned HTTP 404 after routing, so that
  measurement represents HTTP/network overhead rather than workflow execution
  time.

## Environment

- OS: Ubuntu 24.04 on AWS
- Node.js: 22.23.5
- MongoDB: 8.0.38, native service on `127.0.0.1:27017`
- Docker Engine: 29.1.3
- Docker Compose: 2.40.3
- Database: native MongoDB in both comparisons

The hybrid Docker-engine run used Linux host networking. This was necessary because
MongoDB was intentionally bound to loopback; a bridged container cannot reach
the host's `127.0.0.1` through the host-gateway address without changing the
MongoDB bind configuration.

The all-Docker run used the normal Compose bridge network: the host connected
to `engine:3001`, and both host and engine connected to `mongo:27017`.

## Four tenants in parallel

Two parallel tenant layouts were tested. Each tenant received 20 warm-up
requests and 100 timed requests while the other three tenants were active.

### Four independent all-Docker stacks

Each tenant had its own host, engine, and MongoDB service: 12 containers total.

| Tenant | Mean | Median | p95 | Min | Max |
| --- | ---: | ---: | ---: | ---: | ---: |
| 1 | 26.53 ms | 21.88 ms | 37.61 ms | 14.04 ms | 270.97 ms |
| 2 | 27.84 ms | 22.29 ms | 55.04 ms | 14.96 ms | 174.81 ms |
| 3 | 30.34 ms | 21.69 ms | 81.46 ms | 12.76 ms | 250.23 ms |
| 4 | 27.61 ms | 23.65 ms | 44.14 ms | 14.88 ms | 131.84 ms |

### Four host/engine pairs sharing native MongoDB

Each tenant had a Docker host and Docker engine using host networking, while
all four used the existing native MongoDB service. This used 8 containers total
and a separate Mongo database name per tenant.

| Tenant | Mean | Median | p95 | Min | Max |
| --- | ---: | ---: | ---: | ---: | ---: |
| 1 | 20.27 ms | 20.02 ms | 25.82 ms | 13.17 ms | 43.38 ms |
| 2 | 19.84 ms | 19.37 ms | 26.43 ms | 12.84 ms | 34.11 ms |
| 3 | 20.09 ms | 19.37 ms | 28.28 ms | 13.00 ms | 33.20 ms |
| 4 | 20.04 ms | 19.61 ms | 25.50 ms | 11.63 ms | 47.50 ms |

The shared-native-Mongo run had an average tenant mean of 20.06 ms and an
average tenant median of 19.59 ms. Its highest p95 was 28.28 ms. Compared with
four independent Mongo containers, sharing native MongoDB reduced the average
tenant mean by about 8.02 ms and removed the large p95 spikes observed under
the 12-container layout.

### One versus four shared-Mongo tenants

A one-tenant control was run with the same Docker host/engine plus native
MongoDB layout. The four-tenant values below are the averages of the four
tenant summaries.

| Load | Mean | Median | p95 |
| --- | ---: | ---: | ---: |
| 1 tenant | 11.89 ms | 11.58 ms | 12.91 ms |
| 4 tenants in parallel | 20.06 ms | 19.59 ms | 26.51 ms |

Going from one to four active tenants increased average median latency by
8.01 ms, or about 69%. Average p95 increased by 13.60 ms, or about 105%.
The four-tenant run remained stable, but the shared MongoDB and the VPS CPU
limit become visible under concurrency.

## Conclusion

On Linux, putting only the workflow engine in Docker adds negligible overhead:

- internal median increased by 0.07 ms
- internal p95 increased by 0.06 ms
- full host-API median was effectively unchanged

Putting all three services in Docker was still fast, but added about 0.72 ms
to the median and 2.83 ms to p95 versus the hybrid setup in this run. The
recommended Linux arrangement remains a native host, a native MongoDB service,
and the engine in a Docker container using host networking. Use all-Docker
Compose when operational simplicity and service isolation matter more than
the small measured tail-latency increase.

For four tenants on this VPS, the recommended layout is Docker host/engine
pairs sharing the native MongoDB service. It used less CPU and memory than
running one MongoDB container per tenant, while keeping the tenant application
and engine processes isolated.

## Artifacts

- [Raw measurements](benchmark-results.json)
- [Latency chart](benchmark-results.svg)
- [All-options chart](benchmark-all-options.svg)
- [Four-tenant parallel chart](benchmark-four-tenants.svg)
- [One-vs-four chart](benchmark-one-vs-four.svg)
- [Linux topology diagram](benchmark-topology.svg)
- [All-Docker topology diagram](benchmark-topology-all-docker.svg)
- [Shared-Mongo tenant topology](benchmark-topology-shared-mongo.svg)

The temporary benchmark processes and container were removed after the run.
The remote checkout and Docker image were retained for a repeatable rerun.
