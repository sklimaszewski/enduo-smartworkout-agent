# syntax=docker/dockerfile:1.7
#
# Enduo SmartWorkout Agent: an unofficial agent for Enduo that sends finished SmartWorkout workouts to Enduo.
# Not affiliated with SmartWorkout. MIT licence (LICENSE).
#
# Every POLL_SECONDS it reads the changes of the SmartWorkout workout history and writes each finished workout
# onto its activity in Enduo with the MCP tool strength_session_log. Both sign-ins and the sync state live on
# the /data volume. It only connects out; no port is opened. How to run it: README.md
#
FROM node:26-bookworm-slim@sha256:5df79989ed685e09f0a98019db4cebfb22fb9df1a53c0161664a011f7ff6b0f1

RUN apt-get update \
 && apt-get install -y --no-install-recommends tini qrencode ca-certificates \
 && rm -rf /var/lib/apt/lists/*

RUN userdel -r node \
 && groupadd -g 1000 enduo \
 && useradd -m -u 1000 -g 1000 -s /bin/sh enduo \
 && mkdir -p /data \
 && chown enduo:enduo /data \
 && chmod 700 /data

COPY --chmod=755 bin/ /usr/local/bin/
COPY src/ /opt/enduo-smartworkout/src/
COPY LICENSE /opt/enduo-smartworkout/LICENSE

ARG VERSION=dev
LABEL org.opencontainers.image.title="Enduo SmartWorkout Agent" \
      org.opencontainers.image.description="Unofficial agent for Enduo: sends finished SmartWorkout workouts to Enduo" \
      org.opencontainers.image.source="https://github.com/sklimaszewski/enduo-smartworkout-agent" \
      org.opencontainers.image.licenses="MIT" \
      org.opencontainers.image.version="${VERSION}"
ENV STATE_DIR=/data \
    ENDUO_URL=https://api.enduo.app \
    POLL_SECONDS=300 \
    BACKFILL_DAYS=90 \
    APP_VERSION=${VERSION} \
    NODE_NO_WARNINGS=1

USER enduo
WORKDIR /data
VOLUME ["/data"]

# Healthy while the service loop runs, signed in or not: a container that waits for its setup is not broken.
HEALTHCHECK --interval=60s --timeout=10s --start-period=30s --retries=3 \
  CMD enduo-smartworkout health || exit 1

ENTRYPOINT ["tini", "--", "enduo-smartworkout"]
CMD ["run"]
